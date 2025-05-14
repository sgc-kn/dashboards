# CorrelAid Data Story

## Untertitel

Hello World

```js
const data = Array.from({ length: 26 }, (_, i) => ({
  year: new Date(2000 + i, 0, 1),
  value: 50 + Math.round(Math.random() * 50) // Random value between 50 and 100
}));
```

```js
const cutoff = view(Inputs.range([2000, 2025], {step: 1}));
```

Magic happens between these blocks. Above, cutoff is an interactive
element. Below, cutoff will be the selected value. Don't try to do this
in a single block.

```js
const filteredData = data.filter(d => d3.timeYear(d.year).getFullYear() > cutoff);
```

```js
const plt = Plot.plot({
  x: {
    label: "Jahr",
    type: "time"
  },
  y: {
    label: "Wert"
  },
  marks: [
    Plot.line(data, {
      x: "year",
      y: "value",
    }),
    Plot.dot(filteredData, {
      x: "year",
      y: "value",
      stroke: "var(--theme-foreground-focus)",
    })
  ]
});
display(plt);
```

## Karte

```js
const stationen = FileAttachment("stationen.geo.json").json()
```

```js
const names = stationen.features.map(f => f.properties.name);
const select = view(Inputs.radio(names, {value: names[7]}));
```

```js
const map_div = document.createElement("div");
map_div.style = "height:30rem";
display(map_div)
```

```js
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
```

```js
// This block is re-evaluated whenever the input 'stationen' changes.
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
        const highlight = feature.properties.name === select;
        const color = highlight ? 'var(--theme-foreground-focus)' : 'var(--theme-foreground-faint)';
        return L.circleMarker(latlng, {
            radius: 8,
            color: color,
            fillColor: color,
            fillOpacity: 1
        });
    },
    onEachFeature: function (feature, layer) {
        const props = feature.properties;
        let popup = `<strong>${props.name}</strong><br>`;
        popup += `ID: ${props.entity_id}<br>`;
        popup += `Type: ${props.entity_type}`;
        layer.bindPopup(popup);
    }
}).addTo(map);
```
