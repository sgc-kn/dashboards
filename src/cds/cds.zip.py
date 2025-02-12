import httpx
import sys
import zipfile
import io
import pandas

data_src = "https://github.com/sgc-kn/cds-examples/raw/refs/heads/main/sis-ecde-climate-indicators.zip"

response = httpx.get(data_src, follow_redirects=True)

rcp_4_5 = {
    "Extremniederschlagstage_Anzahl": "15_frequency_of_extreme_precipitation-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv",
    "Frosttage_Anzahl": "11_frost_days-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Heisse_Tage_Anzahl": "06_hot_days-projections-yearly-30deg-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Tropennaechte_Anzahl": "05_tropical_nights-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Hitzewellentage_Anzahl": "09_heat_waves_climatological-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv",
}

rcp_8_5 = {
    "Extremniederschlagstage_Anzahl": "15_frequency_of_extreme_precipitation-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv",
    "Frosttage_Anzahl": "11_frost_days-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Heisse_Tage_Anzahl": "06_hot_days-projections-yearly-30deg-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Tropennaechte_Anzahl": "05_tropical_nights-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv",
    "Hitzewellentage_Anzahl": "09_heat_waves_climatological-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv",
}


def read_columns(zf, columns):
    acc = dict()
    for key, csv_name in columns.items():
        df = pandas.read_csv(zf.open(csv_name))
        df["Jahr"] = pandas.to_datetime(df.date).dt.year
        df = df.set_index("Jahr")
        acc[key] = df.konstanz
    return acc


with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
    rcp_4_5 = pandas.DataFrame(read_columns(zf, rcp_4_5))
    rcp_8_5 = pandas.DataFrame(read_columns(zf, rcp_8_5))

combined = pandas.concat(
    [
        rcp_4_5.assign(Modell="Szenario RCP 4.5"),
        rcp_8_5.assign(Modell="Szenario RCP 8.5"),
    ]
)


### Statistics of combined dataset

numeric_columns = combined.columns.difference(["Modell"])

statistics = {
    "Durchschnitt": lambda d: d.mean().dropna(),
}

# Compute statistics for each model separately
result = []
for model, group in combined.sort_index().groupby("Modell"):
    for key, fn in statistics.items():
        rolling_quantiles = fn(group[numeric_columns].rolling(window=30, center=True))
        rolling_quantiles["Modell"] = model
        rolling_quantiles["Statistik"] = key
        result.append(rolling_quantiles)

# Combine results into a single DataFrame
statistics = pandas.concat(result)

### Write ZIP file

zip_buffer = io.BytesIO()

with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zf:
    with zf.open("RCP_4_5.csv", "w") as f:
        rcp_4_5.to_csv(f)
    with zf.open("RCP_8_5.csv", "w") as f:
        rcp_8_5.to_csv(f)
    with zf.open("kombiniert.csv", "w") as f:
        combined.to_csv(f)
    with zf.open("Zeitscheiben_30Jahre.csv", "w") as f:
        statistics.to_csv(f)

sys.stdout.buffer.write(zip_buffer.getvalue())
