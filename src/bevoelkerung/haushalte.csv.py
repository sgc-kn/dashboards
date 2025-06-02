import pandas as pd
import requests
import sys

# Constants
BASE_URL = "https://offenedaten-konstanz.de/api/action/datastore/search.json"
RESOURCE_ID = "d70ecf92-0807-4146-854b-f61f7308d7b4"
LIMIT = 100

# Initialize variables
offset = 0
all_records = []

while True:
    params = {"resource_id": RESOURCE_ID, "limit": LIMIT, "offset": offset}
    response = requests.get(BASE_URL, params=params)
    data = response.json()

    records = data["result"]["records"]
    if not records:
        break  # Exit when no more records

    all_records.extend(records)
    offset += LIMIT

# Convert to DataFrame
df = pd.DataFrame(all_records)


df = df.rename(columns={"stadtteil_nr": "stadtteilnummer"})
df = df.rename(columns={"stadtteil": "stadtteilname"})

df = df.drop(columns=["ags", "entry_id"])


df["stadtteilnummer"] = df["stadtteilnummer"].apply(
    lambda x: f"{int(x):03}" if pd.notnull(x) else ""
)
df["stadtteil"] = (
    df["stadtteilnummer"]
    .astype(str)
    .str.cat(df["stadtteilname"].astype(str), sep=" | ", na_rep="")
)
df["timestamp"] = pd.to_datetime(df["stichtag"].astype(str)).dt.tz_localize("CET")
df["jahr"] = df["stichtag"].astype(str).str[-4:]
df = df.drop(columns=["stadtteilnummer", "stadtteilname", "quelle", "stichtag"])

df["hh_insgesamt"] = df["hh_insgesamt"].str.replace(".", "", regex=False)
df["hh_1person"] = df["hh_1person"].str.replace(".", "", regex=False)
df["hh_2personen"] = df["hh_2personen"].str.replace(".", "", regex=False)
df["hh_3personen"] = df["hh_3personen"].str.replace(".", "", regex=False)

df["hh_insgesamt"] = pd.to_numeric(df["hh_insgesamt"], errors="coerce")
df["hh_1person"] = pd.to_numeric(df["hh_1person"], errors="coerce")

df["hh_1person_pct"] = (df["hh_1person"] / df["hh_insgesamt"]) * 100


df.to_csv(sys.stdout, index=False)
