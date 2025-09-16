from io import StringIO, BytesIO
import numpy as np
import pandas as pd
import re
import requests
import zipfile




# url_stationen = 'https://opendata.dwd.de/climate_environment/CDC/observations_germany/climate/hourly/air_temperature/historical/TU_Stundenwerte_Beschreibung_Stationen.txt'

def get_meta_dwd_stationen(url: str) -> pd.DataFrame:
    # Datei laden
    response = requests.get(url)
    text = response.content.decode('latin1')  # Wichtig wegen Sonderzeichen!

    # In StringIO-Objekt (pseudo-Datei) packen
    file_like = StringIO(text)

    # Spaltenbreiten definieren (manuell basierend auf Dateistruktur)
    colspecs = [
        (0, 5),        # Stations_id
        (6, 14),       # von_datum
        (15, 24),      # bis_datum
        (25, 38),      # Stationshoehe
        (39, 51),      # geoBreite
        (52, 60),      # geoLaenge
        (61, 101),     # Stationsname
        (102, 123),    # Bundesland
        (124, 150)     # Abgabe
    ]

    stationen_df = pd.read_fwf(file_like, colspecs=colspecs, skiprows=2, header=None)
    # DataFrame laden mit festen Spaltenbreiten

    # Spaltennamen setzen
    stationen_df.columns = ['Stations_id', 'von_datum', 'bis_datum', 'Stationshoehe',
                'geoBreite', 'geoLaenge', 'Stationsname', 'Bundesland', 'Abgabe']

    # Datentypen anpassen (optional)
    stationen_df['von_datum'] = pd.to_datetime(stationen_df['von_datum'], format='%Y%m%d', errors='coerce')
    stationen_df['bis_datum'] = pd.to_datetime(stationen_df['bis_datum'], format='%Y%m%d', errors='coerce')
    stationen_df['Stationshoehe'] = pd.to_numeric(stationen_df['Stationshoehe'], errors='coerce')
    stationen_df['geoBreite'] = pd.to_numeric(stationen_df['geoBreite'], errors='coerce')
    stationen_df['geoLaenge'] = pd.to_numeric(stationen_df['geoLaenge'], errors='coerce')
    stationen_df.drop('Abgabe', axis=1, inplace=True)
    
    return stationen_df


def get_historical_url(station_id, base_url_hist):
    response = requests.get(base_url_hist)
    response_text = response.text
    pattern = f'tageswerte_KL_{station_id}_\\d{{8}}_\\d{{8}}_hist\\.zip'
    match = re.search(pattern, response_text)
    if match:
        file_name = match.group(0)
        return base_url_hist + file_name
    else:
        raise FileNotFoundError(f'Keine historische Datei für Station {station_id} gefunden.')


def get_meteo_data(url):
    # lädt ZIP-Datei von der URL
    dwd_zip = requests.get(url)
    # öffnet Zip-Datei im Speicher
    # BytesIO -> die im Speicher gespeicherten Bytes werden behandelt, als wären sie eine Datei
    archiv= zipfile.ZipFile(BytesIO(dwd_zip.content))
    # Liste aller Dateinamen in der ZIP-Datei
    filelist = archiv.namelist()
    filterlist= [x for x in filelist if 'produkt_klima_tag' in x]
    print(f"Gefundene Datei: {filterlist[0]}")
    # type: bytes -> sieht aus wie ein langer String, wo alles hintereinander geschrieben wurde mit ; und eor\r\n für neue Zeile
    csvdata = archiv.read(filterlist[0]) 
    data = pd.read_csv(BytesIO(csvdata), sep=';', encoding='utf-8').set_index('MESS_DATUM')
    data.columns = [name.strip() for name in data.columns] # Leerzeichen aus Spaltennamen entfernen
    return data

# Haversine-Formel definieren -> Abstandsberechnung
def haversine(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    r = 6371  # Erdradius in km
    return c * r


def combine_historical_recent_dwd(url_akt: str, url_hist: str):
    dwd_akt = get_meteo_data(url_akt)
    dwd_hist = get_meteo_data(url_hist)

    # DataFrames werden untereinander zusammengefügt; Index von beiden wird behalten
    # durch keys wird ein Multiindex erzeugt, damit man sieht aus welcher Quelle die Daten komme
    dwd_df = pd.concat([dwd_hist, dwd_akt], ignore_index=False, keys=['dwd_hist', 'dwd_akt'])
    # Multiindices werden zu Spalten: level_0 und MESS_DATUM -> die Duplikate aus MESS_DATUM werden entfernt
    # die Spalte mit den keys von davor, wird SOURCE genannt
    dwd_df = dwd_df.reset_index().rename(columns={'level_0': 'SOURCE'}).drop_duplicates(subset='MESS_DATUM', keep='first')

    # Datumsformat setzten
    dwd_df['MESS_DATUM'] = pd.to_datetime(dwd_df['MESS_DATUM'], format='%Y%m%d')

    dwd_df.replace(to_replace=-999, value = np.nan, inplace=True)

    dwd_df = dwd_df.set_index(["MESS_DATUM"])
    return dwd_df