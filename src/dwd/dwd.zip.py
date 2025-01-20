import duckdb
import httpx
import pandas
import util
import sys

base = "https://opendata.dwd.de/climate_environment/CDC/observations_germany/"

station = "02712"  # Konstanz


def find_zip(product, *, station=station):
    all_zips = util.list_zip_files(base + product, prefix="jahreswerte_")
    station_zips = [path for path in all_zips if "_" + station + "_" in path]
    assert len(station_zips) == 1
    return base + product + station_zips[0]


def load(product, *, station=station):
    path = find_zip(product, station=station)
    r = httpx.get(path)
    r.raise_for_status()
    return util.read_tables_from_zip(r)


def load_recent_and_historical(product, *, station=station):
    recent = load(product + "recent/")
    historical = load(product + "historical/")
    recent["data"] = pandas.concat(
        [historical["data"], recent["data"]]
    ).drop_duplicates()
    return recent


klindex_tables = load_recent_and_historical("climate/annual/climate_indices/kl/")
kl_tables = load_recent_and_historical("climate/annual/kl/")

# ---

tables = {}

# ---

kl_data = kl_tables["data"]
kl_variables = kl_tables["meta_parameter"]["Parameter"].drop_duplicates()
klindex_data = klindex_tables["data"]
klindex_variables = klindex_tables["meta_parameter"]["Parameter"].drop_duplicates()

sql_long_ma30y = f"""
with
long as (
  select
    MESS_DATUM_BEGINN as year,
    variable,
    cast(value as double) as value,
  from kl_data
  unpivot (
    value for variable in ({", ".join(kl_variables)})
  )
  where value != -999
  and year >= '1973-01-01'
  union
  select
    MESS_DATUM_BEGINN as year,
    variable,
    cast(value as double) as value,
  from klindex_data
  unpivot (
    value for variable in ({", ".join(klindex_variables)})
  )
  where value != -999
  and year >= '1973-01-01'
),
ma as (
  select
      year,
      variable,
      case
        when year - min(year) over (partition by variable) >= interval 30 year
        then avg(value)
        over (
          partition by variable
          order by year
          range between interval 29 year preceding and current row
        )
        else null
      end as ma30y,
  from long
)
select a.year, a.variable, a.value, b.ma30y
from long as a
left join ma as b
on a.variable = b.variable and a.year = b.year
"""

long_ma30y = duckdb.query(sql_long_ma30y).df()

# ---

kl_meta_geo = kl_tables["meta_geo"]

sql_geo = """
with typed as(
  select
    (Von_Datum::date)::text as Von,
    (Bis_Datum::date)::text as Bis,
    "Geogr.Breite" as Geografische_Breite_WGS84_Dezimal,
    "Geogr.Laenge" as Geografische_Laenge_WGS84_Dezimal,
  from kl_meta_geo)
select
  min(von) as Von,
  max(bis) as Bis,
  Geografische_Breite_WGS84_Dezimal,
  Geografische_Laenge_WGS84_Dezimal,
from typed
where Von >= '1972-01-01'
group by
  Geografische_Breite_WGS84_Dezimal,
  Geografische_Laenge_WGS84_Dezimal,
order by Von asc
"""

tables["Standort"] = duckdb.query(sql_geo).df()

# ---


def pivot(column):
    return f"""
WITH long AS (
    SELECT year, variable, {column} as value
    FROM long_ma30y
    WHERE {column} IS NOT NULL
), wide AS (
    PIVOT long
    ON variable
    USING first(value)
    GROUP BY year
    ORDER BY year ASC
)
SELECT
    extract('year' from year) as Jahr,
    JA_TT as Temperatur_Celsius_Mittel_Tagesdurchschnitt,
    JA_TN as Temperatur_Celsius_Mittel_Tagesminimum,
    JA_TX as Temperatur_Celsius_Mittel_Tagesmaximum,
    JA_MX_TX as Temperatur_Celsius_Maximum,
    JA_MX_TN as Temperatur_Celsius_Minimum,
    JA_SD_S as Sonnenscheindauer_Stunden_Summe,
    JA_RR as Niederschlag_Millimeter_Summe,
    JA_MX_RS as Niederschlag_Millimeter_Maximum_Tagesmaximum,
    JA_EISTAGE as Eistage_Anzahl,
    JA_FROSTTAGE as Frosttage_Anzahl,
    JA_HEISSE_TAGE as Heisse_Tage_Anzahl,
    JA_SOMMERTAGE as Sommertage_Anzahl,
    JA_TROPENNAECHTE as Tropennaechte_Anzahl
FROM wide
    """


tables["Jahreswerte"] = duckdb.query(pivot("value")).df()
tables["Jahreswerte_30Jahre_gleitender_Durchschnitt"] = duckdb.query(
    pivot("ma30y")
).df()

# ---

jahreswerte = tables["Jahreswerte"]
columns = [f"avg({v}::double) as {v}" for v in jahreswerte.columns if v != "Jahr"]
sql_Referenzperiode = f"""
select {", ".join(columns)}
from jahreswerte
where Jahr >= 1973
and Jahr <= 2000
"""

tables["Referenzperiode_1973_2000"] = duckdb.query(sql_Referenzperiode).df()

# ---

zip_file = util.zip_tables_to_buf(tables)

sys.stdout.buffer.write(zip_file)
