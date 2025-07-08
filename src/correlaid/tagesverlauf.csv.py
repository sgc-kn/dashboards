# patrik: Ich hole mir die Daten aus eurem GitHub Repository und filtere den gewünschten Tag.
# Im Frontend (index.md) kann ich dann gezielt die Daten laden, die ich anzeigen will -- mit kurzen Ladezeiten.
#
# https://github.com/CorrelAid/smart-green-city-konstanz/blob/main/maites_notebooks/karte_vgl_stationen/finalerdf_ws
#
# Cool wäre, wenn wir die Abhängigkeit auf das CorrelAid Repo vermeiden.
# Also diesen Datensatz hier aufbereiten. Und die Daten idealerweise direkt aus Open Data ziehen,
# damit sich die Website automatisch aktualisiert, wenn es die Daten tun.

import pandas
import sys

# ---

correlaid_csv = "https://github.com/CorrelAid/smart-green-city-konstanz/raw/refs/heads/main/maites_notebooks/karte_vgl_stationen/finalerdf_ws"

day = "2024-07-31"

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
