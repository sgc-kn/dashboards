from util import read_tables_from_zip, zip_tables_to_buf
import duckdb
import httpx
import sys

path = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/'
path += 'climate/annual/climate_indices/kl/historical/'
path += 'jahreswerte_KLINDEX_02712_19721101_20231231_hist.zip'

r = httpx.get(path)
r.raise_for_status()

klindex_tables = read_tables_from_zip(r)

# ---

path = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/'
path += 'climate/annual/kl/historical/'
path += 'jahreswerte_KL_02712_19470101_20231231_hist.zip'

r = httpx.get(path)
r.raise_for_status()

kl_tables = read_tables_from_zip(r)

# ---

tables = { 'kl_' + k: v for k, v in kl_tables.items() }
tables |= { 'klindex_' + k: v for k, v in klindex_tables.items() }

# ---

kl_data = tables['kl_data']
kl_variables = tables['kl_meta_parameter']['Parameter'].drop_duplicates()
klindex_data = tables['klindex_data']
klindex_variables = tables['klindex_meta_parameter']['Parameter'].drop_duplicates()

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
  and year >= '1972-01-01'
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
  and year >= '1972-01-01'
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

tables['long_ma30y'] = duckdb.query(sql_long_ma30y).df()

# ---

kl_meta_geo = tables['kl_meta_geo']

sql_kl_geo = """
with typed as(
  select
    (Von_Datum::date)::text as von,
    (Bis_Datum::date)::text as bis,
    "Geogr.Breite" as lat,
    "Geogr.Laenge" as lon,
    Stationshoehe as altitude,
  from kl_meta_geo)
select
  min(von) as von,
  max(bis) as bis,
  lat,
  lon,
from typed
where von >= '1972-01-01'
group by lat, lon
order by von asc
"""

tables['kl_geo'] = duckdb.query(sql_kl_geo).df()

# ---

long_ma30y = tables['long_ma30y']

sql_meta = """
select
  count(*) as count,
  extract('year' from min(year))::text as minYear,
  extract('year' from max(year))::text as maxYear,
from long_ma30y
"""

tables['meta'] = duckdb.query(sql_meta).df()

# ---

sql_klindex_ref = """
select
  count(*),
  avg(JA_TROPENNAECHTE::double) as tropennaechte,
  avg(JA_HEISSE_TAGE::double) as heisse_tage,
  avg(JA_SOMMERTAGE::double) as sommertage,
  avg(JA_EISTAGE::double) as eistage,
  avg(JA_FROSTTAGE::double) as frosttage,
from klindex_data
where MESS_DATUM_BEGINN::date >= '1972-01-01'::date
and MESS_DATUM_ENDE::date <= '2002-12-31'::date
"""

tables['klindex_ref'] = duckdb.query(sql_klindex_ref).df()

# ---

sql_klindex_last = """
select
  extract('year' from MESS_DATUM_BEGINN)::text as year,
  JA_TROPENNAECHTE::double as tropennaechte,
  JA_HEISSE_TAGE::double as heisse_tage,
  JA_SOMMERTAGE::double as sommertage,
  JA_EISTAGE::double as eistage,
  JA_FROSTTAGE::double as frosttage,
from klindex_data
order by MESS_DATUM_BEGINN::date desc
limit 4
"""

tables['klindex_last'] = duckdb.query(sql_klindex_last).df()

# ---

sql_temp = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_TT', 'JA_TN', 'JA_TX')
order by year asc, variable asc
"""

sql_maxtemp = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TX')
order by year asc, variable asc
"""

sql_mintemp = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TN')
order by year asc, variable asc
"""

tables['temp'] = duckdb.query(sql_temp).df()
tables['maxtemp'] = duckdb.query(sql_maxtemp).df()
tables['mintemp'] = duckdb.query(sql_mintemp).df()

# ---

sql_sun = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_SD_S')
order by year asc, variable asc
"""

tables['sun'] = duckdb.query(sql_sun).df()

# ---

sql_rain = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_RR')
order by year asc, variable asc
"""

sql_maxrain = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_RS')
order by year asc, variable asc
"""

tables['rain'] = duckdb.query(sql_rain).df()
tables['maxrain'] = duckdb.query(sql_maxrain).df()

# ---

sql_klindex_kalt = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_EISTAGE', 'JA_FROSTTAGE')
order by year asc, variable asc
"""

sql_klindex_warm = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_HEISSE_TAGE', 'JA_SOMMERTAGE')
order by year asc, variable asc
"""

sql_klindex_nacht = """
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_TROPENNAECHTE')
order by year asc, variable asc
"""

tables['klindex_kalt'] = duckdb.query(sql_klindex_kalt).df()
tables['klindex_warm'] = duckdb.query(sql_klindex_warm).df()
tables['klindex_nacht'] = duckdb.query(sql_klindex_nacht).df()

# ---

zip_file = zip_tables_to_buf(tables)

sys.stdout.buffer.write(zip_file)
