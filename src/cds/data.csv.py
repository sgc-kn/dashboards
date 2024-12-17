import duckdb
import httpx
import sys
import zipfile
import io
import pandas

data_src = "https://github.com/sgc-kn/cds-examples/raw/refs/heads/main/sis-ecde-climate-indicators.zip"

response = httpx.get(data_src, follow_redirects=True)

csv_name = "06_hot_days-reanalysis-yearly-30deg-grid-1940-2023-v1.0-t2m.csv"

with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
    df = pandas.read_csv(zf.open(csv_name))
    df.date = pandas.to_datetime(df.date).dt.year
    df.to_csv(sys.stdout, index=False)
