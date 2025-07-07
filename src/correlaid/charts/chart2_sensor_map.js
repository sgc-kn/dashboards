import * as Plot from "npm:@observablehq/plot";
import L from "npm:leaflet";

// Goals 
//      -> Karte und Liniendiagramm nebeneinander darstellen -> dafür muss der Darstellungsbereich am Computer breiter werde
//      -> überlegen, wie man das schön am Handy machen könnte

// line-charts of sensors


export function createSensorLineChart(data, stationsnamen, stunde) {
    return Plot.plot({
        grid: true,
        inset: 10,
        x: {
            label: "Stunde",
            labelAnchor: 'center',
            labelArrow: 'none',
            tickFormat: x => x,
        },
        y: {
            label: "℃"
        },
        color: {
            domain: stationsnamen,
            legend: true,
        },
        marks: [
            Plot.line(data, {
                x: "Stunde",
                y: "Temperatur_Celsius",
                stroke: "Station",
            }),
            Plot.ruleX([stunde], {
                stroke: 'var(--theme-foreground-focus)',
            }),
        ]
    });
}


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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
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



// update Map
export function updateSensorMap(map, stationen, selectedStation, station_input) {
    // vorher Paint Points
    // To avoid adding layer after layer, we first remove all layers and
    // then only re-add what we need.
    // Remove all non-tile layers
    map.eachLayer(function (layer) {
        if (!(layer instanceof L.TileLayer)) {
            map.removeLayer(layer);
        }
    });

    const geojsonLayer = L.geoJSON(stationen, {
        pointToLayer: function (feature, latlng) {
            const highlight = feature.properties.name === selectedStation;
            const color = highlight ? 'var(--theme-foreground-focus)' : 'var(--theme-foreground-faint)';
            const marker = L.circleMarker(latlng, {
                radius: 8,
                color: color,
                fillColor: color,
                fillOpacity: 1
            });
            marker.bindTooltip(feature.properties.name);
            marker.on("click", () => {
                station_input.value = feature.properties.name;
                updateSensorMap(map, stationen, feature.properties.name, station_input);
                return true;
            });
            return marker;
        }
    }).addTo(map);
}
