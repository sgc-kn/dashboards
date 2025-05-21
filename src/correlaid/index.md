# CorrelAid Data Story

## Merkst du schon den Unterschied?

Einleitungstext: lockere Sprache, was passiert hier in der Story und hinleiten 
zum Bezug zum Leser; vllt schon Infos aus der DWD Analyse von Marko hier 
schrieben.... 

### Seit wann lebst du schon in Konstanz?

```js
// Was wollt ihr hier für Daten nutzen? Eine Idee wäre, die Jahreswerte aus dem DWD Dashboard wiederzuverwenden.
// Es gäbe dort auch noch 30-jährige gleitende Durchschnitte
const yearly =  FileAttachment("../dwd/dwd/Jahreswerte.csv").csv({typed: true})
// Diese Datei wird von ../../dwd/dwd.zip.py erstellt. Das Python Skript bündelt meherere Dateien in ein ZIP-Archiv (u.a. Jahreswerte.csv);
// Observable Framework stellt diese dann einzeln oder gebündelt zum Download bereit.
```

```js
const years = yearly.map(row => row['Jahr'])
const minYear = Math.min(...years)
const maxYear = Math.max(...years)
// Das wächst automatisch mit, wenn sich die Daten im DWD Dashboard aktualisieren

const arrival = view(Inputs.range([minYear, maxYear], {step: 1}));
```

Magic happens between these blocks. Above, `arrival` is an interactive
element. Below, `arrival` will be the selected value. Don't try to do this
in a single block.

<div class="card">
  <h2>Temperatur</h2>
  <h3>Jahresdurchschnitt in Konstanz, DWD Station Konstanz</h3>

```js
const plt = Plot.plot({
  grid: true, // Konsistent mit Dashboards
  inset: 10, // Konsistent mit Dashboards
  x: {
    label: "Jahr",
    labelAnchor: 'center',
    labelArrow: 'none',
    tickFormat: JSON.stringify, // suppress delimiting dots, e.g. 2.024
  },
  y: {
    label: "℃"
  },
  marks: [
    Plot.line(yearly, {
      x: "Jahr",
      y: "Temperatur_Celsius_Mittel_Tagesdurchschnitt",
      stroke: () => 'constant', // trick to use the first color of the theme
    }),
    Plot.ruleX([arrival], {
      stroke: 'var(--theme-foreground-focus)', // use focus color defined by theme
    }),
  ]
});
view(plt);
```

</div> <!-- card -->


### Temperaturverlauf am 31. Juli 2024

```js
const stationen = FileAttachment("stationen.geo.json").json()
const tagesverlauf = FileAttachment('./tagesverlauf.csv').csv({typed: true})
```

```js
const stationsnamen = stationen.features.map(f => f.properties.name);
const station_input = Inputs.radio(stationsnamen, {value: stationsnamen[7]});
// const station_input = Mutable(stationsnamen[7]); // ohne Radio Buttons

const station = view(station_input);
```

```js
const map_div = document.createElement("div");
map_div.style = "height:25rem";
display(map_div)
```

```js
const stunde = view(Inputs.range([0, 23], {step: 1, label: "Stunde"}));
```

<div class="card">
  <h2>Temperatur</h2>
  <h3>Tagesverlauf an verschiedenen SGC Wetterstationen in Konstanz</h3>

```js
const plt = Plot.plot({
  grid: true, // Konsistent mit Dashboards
  inset: 10, // Konsistent mit Dashboards
  x: {
    label: "Stunde",
    labelAnchor: 'center',
    labelArrow: 'none',
    tickFormat: x => x, // do nothing
  },
  y: {
    label: "℃"
  },
  color: {
    domain: stationsnamen,
    legend: true,
  },
  marks: [
    Plot.line(tagesverlauf, {
      x: "Stunde",
      y: "Temperatur_Celsius",
      stroke: "Station",
    }),
    Plot.ruleX([stunde], {
      stroke: 'var(--theme-foreground-focus)', // use focus color defined by theme
    }),
  ]
});
view(plt);
```

</div> <!-- card -->

```js
// Die Karte wurde oben bereits ins HTML / DOM eingebettet. Hier wird sie befüllt.

const map = L.map(map_div, {
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

// This is for handling page resizes:
const bounds = L.geoJSON(stationen).getBounds();
const mapResizeObserver = new ResizeObserver(() => {
  map.invalidateSize();
  map.fitBounds(bounds, {padding: [13, 13]});
});
mapResizeObserver.observe(map_div); // do this once in the beginning

function paintPoints(selectedStation) {
  // To avoid adding layer after layer, we first remove all layers and
  // then only re-add what we need.
  map.eachLayer(function(layer) {
      // Keep the tile layer, remove everything else
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
            paintPoints(feature.properties.name); // I'd expect this to happen automatically but it doesn't
            return true;
          });
          return marker
      }
  }).addTo(map);
};
```

```js display=false
// This block is re-evaluated whenever the input 'station' changes.
paintPoints(station);
```

### Wetterstationen im Vergleich

```js
const left_input = Inputs.select(stationsnamen, {value: stationsnamen[0]});
const right_input = Inputs.select(stationsnamen, {value: stationsnamen[1]});
```

<div class="grid grid-cols-2">
<div class="card grid-colspan-1">

Station A

```js
const left = view(left_input)
```

</div> <!-- card -->

<div class="card grid-colspan-1">

Station B

```js
const right = view(right_input)
```

</div> <!-- card -->

</div> <!-- grid -->


<div class="card">

```js
const plt = Plot.plot({
  grid: true, // Konsistent mit Dashboards
  inset: 10, // Konsistent mit Dashboards
  x: {
    label: "℃",
    labelAnchor: 'center',
    labelArrow: 'none',
    tickFormat: x => x, // do nothing
  },
  y: {
    label: "",
    tickFormat: x => "", // drop label
  },
  color: {
    domain: [left, right],
    legend: true,
  },
  marks: [
    Plot.barX(tagesverlauf.filter(x => x.Station === left || x.Station === right), {y: "Station", fy: "Stunde", x:"Temperatur_Celsius", fill: "Station"}),
  ]
});
view(plt);
```

</div> <!-- card -->

### Expertenwissen

Klimaexperte Tim Tewes: Was er macht & wieso.

<!-- patrik: Ich werde hier noch etwas einbauen, dass Youtube nur nach Consent geladen wird. Oder das Video selber hosten. -->
 <iframe style="width:100%; aspect-ratio: 16/9;"
src="https://www.youtube.com/embed/E4WlUXrJgy4">
</iframe> 