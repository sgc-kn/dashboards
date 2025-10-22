import * as Plot from "../../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";
import L from "../../../_npm/leaflet@1.9.4/721623d8.js";
import { Generators } from "../../../_observablehq/stdlib.c41ec614.js";
import * as d3 from "../../../_npm/d3@7.9.0/e780feca.js";
import { html } from "../../../_node/htl@0.3.1/index.0caf36e7.js";


// Goals 
//      -> Karte und Liniendiagramm nebeneinander darstellen -> dafür muss der Darstellungsbereich am Computer breiter werde
//      -> überlegen, wie man das schön am Handy machen könnte

// line-charts of sensors

export function createSensorLineChart(data, selectedStation, stunde, width) {
    const gefiltert = data.filter(d => d.Station === selectedStation);

    // Gruppiere nach Stunde, berechne Min und Max
    const minMaxByHour = Array.from(
        d3.rollup(
            data,
            v => ({
                min: d3.min(v, d => d.Temperatur_Celsius),
                max: d3.max(v, d => d.Temperatur_Celsius),
                mean: d3.mean(v, d => d.Temperatur_Celsius)
            }),
            d => d.stunde
        ),
        // herausfiltern, wenn null Werte drin sind
        ([stunde, { min, max, mean }]) =>
            min != null && max != null
                ? { stunde, min, max, mean }
                : null
    ).filter(d => d !== null);

    return Plot.plot({
        grid: true,
        inset: 10,
        style: { fontSize: 12, fontFamily: "sans-serif" }, // Stil für das Diagramm
        height: 270,
        width,
        color: {
            legend: true,
            domain: [selectedStation, "Mininum und Maximum aller Stationen im Vergleich"],
            range: ["#FFA200", "#999"]
        },
        x: {
            label: "Uhrzeit",
            labelAnchor: "center",
            labelArrow: "none",
            domain: [0, 23],
            ticks: d3.range(0, 24, 3),
            tickFormat: d => d % 6 === 0 ? d : "",
        },
        y: {
            label: "℃",
            domain: [18, 34]  // Hier Minimum und Maximum definieren -> evtl. anpassen an Min/Max aller Stationen zu dem Zeitpunkt
        },
        marks: [
            // Gefüllter Bereich
            Plot.area(minMaxByHour, {
                x1: "stunde",
                y1: "min",
                y2: "max",
                fill: "#ccc",
                fillOpacity: 0.5
            }),
            // Linie Minimum
            Plot.line(minMaxByHour, {
                x: "stunde",
                y: "min",
                stroke: d => "Mininum und Maximum aller Stationen im Vergleich",
                strokeOpacity: 0.8
            }),
            // Linie Maximum
            Plot.line(minMaxByHour, {
                x: "stunde",
                y: "max",
                stroke: "#999",
                strokeOpacity: 0.8
            }),

            // Linie des gewählten Sensors
            Plot.line(gefiltert, {
                x: "stunde",
                y: "Temperatur_Celsius",
                stroke: d => selectedStation,
                strokeWidth: 2
            }),
            // vertikale rote Linie für ausgewählte Stunde
            Plot.ruleX([stunde], {
                stroke: 'black',
                strokeDasharray: "4.2"
            }),
        ]
    });
}


//-------------------------------------- Ab hier Karte --------------------------------------------------------------

// create map - Die Karte wurde in index.md bereits ins HTML / DOM eingebettet. Hier wird sie befüllt.
export function createSensorMap(container, stationen) {
    const map = L.map(container, {
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> & OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const bounds = L.geoJSON(stationen).getBounds();
    const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [13, 13] });
    });
    resizeObserver.observe(container);
    return map;
}


export function createMapLegend(width) {
    const colorScale = d3.scaleLinear()
        .domain([-4, 0, 4])
        .range(["blue", "white", "red"]);

    const values = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

    const mapLegend = Plot.plot({
        subtitle: "Abweichung von der Durchschnittstemperatur aller Wetterstationen",
        style: { fontSize: 12, fontFamily: "sans-serif" },
        r: { type: "identity" }, // radius is in pixels, not scaled
        width,
        x: {
            tickFormat: d => `${d} °C`, // add degree symbol + C
            tickSize: 0,                // removes tick lines
        },
        marks: [
            Plot.dot(values, {
                x: d => d,
                r: d => Math.sqrt(Math.max(1, Math.abs(d)) * 16),
                fill: d => colorScale(d),
                stroke: "#555",       // outline color
                strokeWidth: 1      // outline thickness
            })
        ]
    });

    return mapLegend;
}


//-------------------------------------- Reaktiver Kartenteil --------------------------------------------------------------


// Entfernt alle Layer von der Karte außer den Hintergrund-Tiles.
// So werden Marker etc. vor dem Neuzeichnen bereinigt.
function clearMapMarkers(map) {
    map.eachLayer(layer => {
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    });
}



/**
 * Gibt Stiloptionen für Marker ohne Temperaturskala zurück.
 * Nur ausgewählt (dicker schwarzer Rand)/nicht ausgewählt (kein Rand).
 *
 * @param {boolean} isSelected - Ob der Marker ausgewählt ist.
 * @returns {Object} - Leaflet Style.
 */
export function getMarkerStyle(isSelected) {
    return {
        color: isSelected ? "black" : "#555",   // dicker schwarzer Rand oder grau
        weight: isSelected ? 3 : 1,             // Linienstärke
    };
}


/**
 * Gibt Stiloptionen abhängig von Temperaturabweichung zurück.
 * Dieser Style ist nur für Farbe und Radius zuständig, nicht für den Rand.
 * Stunden-Slider (Inputs.range) steuert die Marker auf der Karte:
 *      Farbe der Marker zeigt Abweichung vom Mittel
*       Größe zeigt Stärke der Abweichung
 * Ignoriert Auswahlstatus (der wird durch schwarzen Rand dargestellt).
 *
 * @param {number} deviation - Abweichung von der Mitteltemperatur.
 * @returns {Object} - Leaflet Style.
 */
export function getMarkerStyleWithDeviation(deviation) {
    const colorScale = d3.scaleLinear()
        .domain([-4, 0, 4])
        .range(["blue", "white", "red"]);

    return {
        radius: Math.sqrt(Math.max(1, Math.abs(deviation)) * 16),
        color: "#555",
        weight: 1,
        fillColor: colorScale(deviation),
        fillOpacity: 0.9
    };
}




/**
 * Erstellt einen Leaflet-Marker für eine Station.
 *
 * @param {Object} feature - GeoJSON Feature der Station.
 * @param {L.LatLng} latlng - Position des Markers.
 * @param {string} station - Der aktuell ausgewählte Stationsname.
 * @param {function} set_station - Funktion, um die ausgewählte Station zu setzen (Typ: string -> unit).
 * @param {L.Map} map - Die Leaflet-Karte.
 * @param {Object} stationen - GeoJSON aller Stationen (wird beim Klick erneut übergeben).
 * @returns {L.CircleMarker} - Der fertige Marker.
 */
function createStationMarker(feature, latlng, station, set_station, map, deviation) {
    const isSelected = feature.properties.name === station;

    // Hole beide Styles
    const deviationStyle = getMarkerStyleWithDeviation(deviation);
    const selectionStyle = getMarkerStyle(isSelected);

    // Mische sie
    const style = {
        ...deviationStyle,
        ...selectionStyle
    };

    const marker = L.circleMarker(latlng, style);

    // Tooltip mit dem Namen
    if (isSelected) {
        marker.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: 'auto',
            className: "station-label-active"
        });
    }

    const tip = L.tooltip({ direction: 'auto', opacity: 0.9 })
        .setLatLng(latlng)
        .setContent("<b>" + feature.properties.name + "</b><br> Abweichung vom Durchschnitt: " + Plot.formatNumber('de-DE')(deviation.toFixed(1)) + " ℃");

    // show both when hovering the marker
    marker.on('mouseover', () => {
        tip.addTo(map);
    });

    // hide them when leaving
    marker.on('mouseout', () => {
        map.removeLayer(tip);
    });

    // Klick-Event
    marker.on("click", () => set_station(feature.properties.name));

    return marker;
}

/**
 * Berechnet die Abweichung der Temperatur einer Station
 * vom Mittelwert aller Stationen zu einer gegebenen Stunde.
 *
 * @param {string} stationName - Name der Station
 * @param {number} hour - Stunde (0–23)
 * @param {Array} tagesverlauf - Alle Messdaten (tagesverlauf)
 * @returns {number} - Abweichung in °C (kann negativ sein)
 */
function getDeviationForStation(stationName, hour, tagesverlauf) {
    // Filter: Alle Messungen in der gewählten Stunde
    const hourData = tagesverlauf.filter(d => d.stunde === hour);

    if (hourData.length === 0) return 0; // Falls keine Daten vorliegen

    // Mittelwert der Temperatur aller Stationen in dieser Stunde
    const avg = d3.mean(hourData, d => d.Temperatur_Celsius);

    // Temperatur der gesuchten Station in dieser Stunde
    const stationDatum = hourData.find(d => d.Station === stationName);

    if (!stationDatum) return null; // Station hat keine Messung

    // Differenz: Stationstemperatur minus Mittelwert
    return stationDatum.Temperatur_Celsius - avg;
}




/**
 * Aktualisiert die Karte: entfernt alte Marker und zeichnet neue mit dem richtigen Stil.
 *
 * @param {L.Map} map - Die Leaflet-Karte.
 * @param {Object} stationen - GeoJSON aller Stationen.
 * @param {string} station - Der aktuell ausgewählte Stationsname.
 * @param {function} set_station - Funktion, um die ausgewählte Station zu setzen (Typ: string -> unit).
 * @param {Object} station_input - Das Input-Element für die Station (Radio oder Mutable).
 * @param {Array} tagesverlauf - Alle Temperaturdaten
 * @param {number} currentHour - Aktuell ausgewählte Stunde (0–23)
 */
export function updateSensorMap(map, stationen, station, set_station, tagesverlauf, currentHour) {
    // Entferne alle bestehenden Marker (Layer), behalte nur den TileLayer
    clearMapMarkers(map);

    // GeoJSON neu hinzufügen – hier wird für jede Station ein Marker erzeugt
    L.geoJSON(stationen, {
        pointToLayer: (feature, latlng) => {
            // Berechne die Abweichung vom Mittel für diese Station
            const deviation = getDeviationForStation(
                feature.properties.name,
                currentHour,
                tagesverlauf
            );

            // Füge keinen Marker hinzu, wenn deviation null ist
            if (deviation === null) return null;

            // Erzeuge den Marker mit Abweichungs- und Auswahl-Styles
            return createStationMarker(
                feature,
                latlng,
                station,
                set_station,
                map,
                deviation
            );
        }
    }).addTo(map);
}
