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

projections = {
    'Extremniederschlagstage_Anzahl_Vorhersage_4_5': '15_frequency_of_extreme_precipitation-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv',
    'Extremniederschlagstage_Anzahl_Vorhersage_8_5': '15_frequency_of_extreme_precipitation-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv',
    'Frosttage_Anzahl_Vorhersage_4_5': '11_frost_days-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Frosttage_Anzahl_Vorhersage_8_5': '11_frost_days-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Heisse_Tage_Anzahl_Vorhersage_4_5': '06_hot_days-projections-yearly-30deg-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Heisse_Tage_Anzahl_Vorhersage_8_5': '06_hot_days-projections-yearly-30deg-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Tropennaechte_Anzahl_Vorhersage_4_5': '05_tropical_nights-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Tropennaechte_Anzahl_Vorhersage_8_5': '05_tropical_nights-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-tasAdjust_NON_CDM.csv',
    'Hitzewellentage_Anzahl_Vorhersage_4_5': '09_heat_waves_climatological-projections-yearly-rcp_4_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv',
    'Hitzewellentage_Anzahl_Vorhersage_8_5': '09_heat_waves_climatological-projections-yearly-rcp_8_5-cclm4_8_17-mpi_esm_lr-r1i1p1-grid-v1.0-data.csv',
}

def filter_projection_year(df, last_year):
    return df[df.index >= last_year]

columns = dict()
columns_projections = dict()
columns_projections_ma30y = dict()

with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
    for key, csv_name in reanalysis.items():
        df = pandas.read_csv(zf.open(csv_name))
        df['Jahr'] = pandas.to_datetime(df.date).dt.year
        df = df.set_index('Jahr')
        columns[key] = df.konstanz

    for key, csv_name in projections.items():
        proj_df = pandas.read_csv(zf.open(csv_name))
        proj_df['Jahr'] = pandas.to_datetime(proj_df.date).dt.year
        proj_df = proj_df.set_index('Jahr')
        proj_df = filter_projection_year(proj_df, df.index[-30])
        columns_projections_ma30y[key] = proj_df.konstanz
        proj_df = filter_projection_year(proj_df, df.index[-30])
        columns_projections[key] = proj_df.konstanz

reanalysis_df = pandas.DataFrame(columns)
reanalysis_ma30y = reanalysis_df.rolling(window=30, min_periods=30).mean().dropna()
projections_df = pandas.DataFrame(columns_projections)
projections_ma30y = pandas.DataFrame(columns_projections_ma30y).rolling(window=30, min_periods=30).mean().dropna()

zip_buffer = io.BytesIO()
with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zf:
    with zf.open('Reanalyse.csv', 'w') as f:
        reanalysis_df.to_csv(f)
    with zf.open('Reanalyse_30Jahre_gleitender_Durchschnitt.csv', 'w') as f:
        reanalysis_ma30y.to_csv(f)
    with zf.open('Vorhersagen.csv', 'w') as f:
        projections_df.to_csv(f)
    with zf.open('Vorhersagen_30Jahre_gleitender_Durchschnitt.csv', 'w') as f:
        projections_ma30y.to_csv(f)
        
sys.stdout.buffer.write(zip_buffer.getvalue())