import pandas
import sys

# ---

correlaid_csv = "drafts/maites_notebooks/karte_vgl_stationen/finalerdf_ws"

day = "2024-08-11"

# ---

full = pandas.read_csv(correlaid_csv, index_col=0).reset_index(drop=True)
del full["datetime"]
full.rename(
    columns={
        "name": "Station",
        "date": "Datum",
        "hour": "stunde",  # bitte klein schreiben - damit in chart2_sensor_map.js alles kleingeschrieben werden kann!
        "temperature": "Temperatur_Celsius",
        "winddirection": "Windrichtung_Grad",
        "windspeedavg": "Windgeschwindigkeit_Durchschnitt_kmh",  # TODO: Stimmt die Einheit?
    },
    inplace=True,
)

subset = full[full.Datum == day].reset_index(drop=True)

subset.to_csv(sys.stdout, index=False)
