import duckdb
import httpx
import sys
import zipfile
import io
import pandas

data_src = "https://github.com/sgc-kn/cds-examples/raw/refs/heads/main/sis-ecde-climate-indicators.zip"

response = httpx.get(data_src, follow_redirects=True)

reanalysis = {
    'Extremniederschlagstage_Anzahl': '15_frequency_of_extreme_precipitation-reanalysis-yearly-grid-1940-2023-v1.0-data.csv',
    'Frosttage_Anzahl': '11_frost_days-reanalysis-yearly-grid-1940-2023-v1.0-t2m.csv',
    'Heisse_Tage_Anzahl': '06_hot_days-reanalysis-yearly-30deg-grid-1940-2023-v1.0-t2m.csv',
    'Tropennaechte_Anzahl': '05_tropical_nights-reanalysis-yearly-grid-1940-2023-v1.0-t2m.csv',
    'Hitzewellentage_Anzahl': '09_heat_waves_climatological-reanalysis-yearly-grid-1940-2023-v1.0-data.csv',
}

columns = dict()
with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
    for key, csv_name in reanalysis.items():
        df = pandas.read_csv(zf.open(csv_name))
        df['Jahr'] = pandas.to_datetime(df.date).dt.year
        df = df.set_index('Jahr')
        columns[key] = df.konstanz

reanalysis_df = pandas.DataFrame(columns)
reanalysis_ma30y = reanalysis_df.rolling(window=30, min_periods=30).mean().dropna()

zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zf:
    with zf.open('Reanalyse.csv', 'w') as f:
        reanalysis_df.to_csv(f)
    with zf.open('Reanalyse_30Jahre_gleitender_Durchschnitt.csv', 'w') as f:
        reanalysis_ma30y.to_csv(f)


sys.stdout.buffer.write(zip_buffer.getvalue())