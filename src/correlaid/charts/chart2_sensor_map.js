import * as Plot from "npm:@observablehq/plot";
import L from "npm:leaflet";
import { Generators } from "npm:@observablehq/stdlib";
import * as d3 from "npm:d3";


// Goals 
//      -> Karte und Liniendiagramm nebeneinander darstellen -> dafür muss der Darstellungsbereich am Computer breiter werde
//      -> überlegen, wie man das schön am Handy machen könnte

// line-charts of sensors

export function createSensorLineChart(data, selectedStation, stunde) {
    const gefiltert = data.filter(d => d.Station === selectedStation);

    // Gruppiere nach Stunde, berechne Min und Max
    const minMaxByHour = Array.from(
        d3.rollup(
            data,
            v => ({
                min: d3.min(v, d => d.Temperatur_Celsius),
                max: d3.max(v, d => d.Temperatur_Celsius)
            }),
            d => d.stunde
        ),
        // herausfiltern, wenn null Werte drin sind
        ([stunde, { min, max }]) =>
            min != null && max != null
                ? { stunde, min, max }
                : null
    ).filter(d => d !== null);

    console.log(minMaxByHour);


    return Plot.plot({
        grid: true,
        inset: 10,
        x: {
            label: "stunde",
            labelAnchor: "center",
            labelArrow: "none",
            tickFormat: x => x,
        },
        y: {
            label: "℃",
            domain: [16, 34]  // Hier Minimum und Maximum definieren -> evtl. anpassen an Min/Max aller Stationen zu dem Zeitpunkt
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
                stroke: "#999",
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
            }),
            // vertikale rote Linie für ausgewählte Stunde
            Plot.ruleX([stunde], {
                stroke: 'var(--theme-foreground-focus)',
            }),
        ]
    });
}


//-------------------------------------- Reaktiver Liniendiagrammteil --------------------------------------------------------------

// dadurch reagiert das Liniendiagramm, wenn eine andere Station ausgewählt wird
export function createReactiveSensorChart(data, stationInput, stundeInput) {
    return Generators.observe(notify => {
        function render() {
            notify(
                createSensorLineChart(
                    data,
                    stationInput.value,
                    stundeInput.value
                )
            );
        }
        render();
        stationInput.addEventListener("input", render);
        stundeInput.addEventListener("input", render);
    });
}


//-------------------------------------- Ab hier Karte --------------------------------------------------------------

// create map - Die Karte wurde in index.md bereits ins HTML / DOM eingebettet. Hier wird sie befüllt.
export function createSensorMap(container, stationen, station_input) {
    const map = L.map(container, {
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        zoomControl: false,
    });

    //Patricks Version:
    //L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        //Patricks Version: 
        //attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> & OpenStreetMap contributors',
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
        radius: Math.max(5, Math.abs(deviation) * 5),
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
 * @param {string} selectedStation - Aktuell ausgewählte Station.
 * @param {Object} station_input - Das Input-Element für die Station (Radio oder Mutable).
 * @param {L.Map} map - Die Leaflet-Karte.
 * @param {Object} stationen - GeoJSON aller Stationen (wird beim Klick erneut übergeben).
 * @returns {L.CircleMarker} - Der fertige Marker.
 */
function createStationMarker(feature, latlng, selectedStation, station_input, map, stationen, deviation) {
    const isSelected = feature.properties.name === selectedStation;

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
    marker.bindTooltip(feature.properties.name);

    // Klick-Event
    marker.on("click", () => {
        // Update Radiobutton / Mutable
        station_input.value = feature.properties.name;

        // Reaktives Event auslösen (damit z.B. Diagramm neu gerendert wird)
        station_input.dispatchEvent(new CustomEvent("input"));

        // Karte aktualisieren, damit Marker neu eingefärbt werden
        updateSensorMap(map, stationen, feature.properties.name, station_input);
    });

    return marker;
}

/**
 * Berechnet die Abweichung der Temperatur einer Station
 * vom Mittelwert aller Stationen zu einer gegebenen Stunde.
 *
 * @param {string} stationName - Name der Station
 * @param {number} hour - Stunde (0–23)
 * @param {Array} allData - Alle Messdaten (tagesverlauf)
 * @returns {number} - Abweichung in °C (kann negativ sein)
 */
function getDeviationForStation(stationName, hour, allData) {
    // Filter: Alle Messungen in der gewählten Stunde
    const hourData = allData.filter(d => d.stunde === hour);

    if (hourData.length === 0) return 0; // Falls keine Daten vorliegen

    // Mittelwert der Temperatur aller Stationen in dieser Stunde
    const avg = d3.mean(hourData, d => d.Temperatur_Celsius);

    // Temperatur der gesuchten Station in dieser Stunde
    const stationDatum = hourData.find(d => d.Station === stationName);

    if (!stationDatum) return 0; // Station hat keine Messung

    // Differenz: Stationstemperatur minus Mittelwert
    return stationDatum.Temperatur_Celsius - avg;
}




/**
 * Aktualisiert die Karte: entfernt alte Marker und zeichnet neue mit dem richtigen Stil.
 *
 * @param {L.Map} map - Die Leaflet-Karte.
 * @param {Object} stationen - GeoJSON aller Stationen.
 * @param {string} selectedStation - Der aktuell ausgewählte Stationsname.
 * @param {Object} station_input - Das Input-Element für die Station (Radio oder Mutable).
 * @param {Array} tagesverlauf - Alle Temperaturdaten
 * @param {number} currentHour - Aktuell ausgewählte Stunde (0–23)
 */
export function updateSensorMap(map, stationen, selectedStation, station_input, tagesverlauf, currentHour) {
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

            // Erzeuge den Marker mit Abweichungs- und Auswahl-Styles
            return createStationMarker(
                feature,
                latlng,
                selectedStation,
                station_input,
                map,
                stationen,
                deviation
            );
        }
    }).addTo(map);
}
