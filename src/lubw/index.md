---
theme: dashboard
toc: true
---

```js
import * as layout from "./layout.js";
```

```js
const map_div = document.createElement('div');
const position_card = layout.card({
    title : 'Messstation Konstanz',
    subtitle : 'Ecke Zasiusstraße und Wallgutstraße',
    body : map_div,
})
```

```js
map_div.style = "flex-grow:1";

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

const points_to_fit = [ [47.65671712249894, 9.179873031082293], [ 47.6962128027911, 9.139355745114335], [47.66589663744094, 9.221408794229172] ]

const pos = [47.6643739 , 9.1680143]

L.circleMarker(pos, {radius: 5, color: 'var(--theme-blue)'})
.addTo(map)
.openTooltip()

points_to_fit.push(pos)

const mapResizeObserver = new ResizeObserver(() => {
  map.invalidateSize();
  map.fitBounds(points_to_fit, {padding: [11, 11]});
});
mapResizeObserver.observe(map_div);
```

```js
const zip_data = FileAttachment("lubw.zip");

const dataset_card = layout.card({
    title : "Datengrundlage",
    subtitle: html.fragment`<a href='https://www.lubw.baden-wuerttemberg.de/en/luft/messwerte-immissionswerte?id=DEBW052#diagramm>'>lubw.baden-wuerttemberg.de</a>`,
    download: zip_data.href,
    body : html.fragment`
    <p>Die Landesanstalt für Umwelt Baden-Württemberg (LUBW) betreibt ein landesweites Messnetz zur Überwachung der Luftqualität.</p>

    <p>Dieses Dashboard basiert auf historischen Aufzeichnungen der Messtation Konstanz. Die Daten werden seit 2008 aufgezeichnet.</p>

    <p>Die Messstation Konstanz befindet sich im Stadtgebiet: im Paradies an der Ecke Zasiusstraße und Wallgutstraße, direkt beim Ellenrieder Gymnasium.</p>
    `,
})
```

```js
const variables = {
    o3: {
        name: "o3",
        label: "Ozon (O₃)",
        unit: "µg/m³",
    },
    no2: {
        name: "no2",
        label: "Stickstoffdioxid (NO₂)",
        unit: "µg/m³",
    },
    pm25: {
        name: "pm25",
        label: "Feinstaub mit 2,5 µm Durchmesser (PM 2.5)",
        unit: "µg/m³",
    },
    pm10: {
        name: "pm10",
        label: "Feinstaub mit 10 µm Durchmesser (PM 10)",
        unit: "µg/m³",
    },
};
```

```js
const recent_data = FileAttachment("lubw/Auszug_Stundenwerte.csv").csv({typed: true})
const monthly_data = FileAttachment("lubw/Monatliche_Statistik.csv").csv({typed: true})
const yearly_data = FileAttachment("lubw/Jährliche_Statistik.csv").csv({typed: true})
```

```js
const recent_times = recent_data.map(row => row['startZeit'])
const recent_start =  new Date(Math.min(...recent_times))
const recent_range = `die Woche ab Montag, dem ${recent_start.toLocaleDateString('de-DE', {year: 'numeric', month: 'long', day: 'numeric'})}`

function recent_card(variable, { thresholds = [], info } = {}) {
    return layout.card({
        title : "Stündliche Aufzeichnung",
        subtitle: `Datenauszug für ${recent_range}`,
        body : layout.plot({
                x: {
                    label: 'Zeit',
                },
                y: {
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(recent_data, {
                        x: "startZeit", // TODO fix time zone offset in GUI
                        y: variable.name,
                        stroke: () => "Messwert", // use first color of palette
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    })
                ]
            }),
        info,
    })
}

function monthly_card(variable, { thresholds = [], info } = {}){
    return layout.card({
        title : "Langfristige Entwicklung",
        subtitle: `Monatsmittelwerte seit Beginn der Aufzeichnung`,
        body : layout.plot({
                x: {
                    label: 'Zeit',
                },
                y: {
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(monthly_data, {
                        x: "start",
                        y: variable.name + "_mean",
                        stroke: () => "Messwert", // use first color of palette
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    })
                ]
            }),
        info,
    })
}

function yearly_card(variable, { thresholds = [], info } = {}){
    return layout.card({
        title : "Langfristige Entwicklung",
        subtitle: `Jahresmittelwerte seit Beginn der Aufzeichnung`,
        body : layout.plot({
                x: {
                    label: 'Zeit',
                },
                y: {
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(yearly_data, {
                        x: "start",
                        y: variable.name + "_mean",
                        stroke: () => "Messwert", // use first color of palette
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    })
                ]
            }),
        info,
    })
}

function max_card(variable, { thresholds = [], info } = {}){
    return layout.card({
        title : "Extremwerte",
        subtitle: "Maximalwerte je Monat seit Beginn der Aufzeichnung",
        body : layout.plot({
                x: {
                    label: 'Zeit',
                },
                y: {
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(monthly_data, {
                        x: "start",
                        y: variable.name + "_max",
                        stroke: () => "Messwert", // use first color of palette
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    })
                ]
            }),
    })
} 
```

```js
const o3_recent_card = recent_card(variables.o3, {
    thresholds: [ [180, "Informationsschwelle"], [240, "Alarmschwelle"] ],
    info: html`
    <p>TODO</p>
    `
    // TODO document thresholds from https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen
});
```

```js
const o3_monthly_card = monthly_card(variables.o3, {
    info: html`
    <p>TODO</p>
    `
});
```

```js
const o3_yearly_card = yearly_card(variables.o3, {
    info: html`
    <p>TODO</p>
    `
});
```

```js
const no2_recent_card = recent_card(variables.no2, {
    thresholds: [ [200, "Grenzwert"], [400, "Alarmschwelle"] ],
    info: html`
    <p>TODO</p>
    `
    // TODO document thresholds from https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen
});
```

```js
const no2_monthly_card = monthly_card(variables.no2, {
    info: html`
    <p>TODO</p>
    `
});
```

```js
const no2_yearly_card = yearly_card(variables.no2, {
    thresholds: [ [40, "Grenzwert"] ],
    info: html`
    <p>TODO</p>
    `
});
```

```js
const pm10_recent_card = recent_card(variables.pm10, {
    info: html`
    <p>TODO</p>
    `
});
```

```js
const pm10_monthly_card = monthly_card(variables.pm10, {
    info: html`
    <p>TODO</p>
    `
});
```

```js
const pm10_yearly_card = yearly_card(variables.pm10, {
    info: html`
    <p>TODO</p>
    `
});
```

${ layout.title('Luftqualitätsmessungen', 'der Landesanstalt für Umwelt Baden-Württemberg') }

<div class="grid grid-cols-4">
    ${ position_card }
    ${ dataset_card }
</div>

## Ozon

<div class="grid grid-cols-2">
    ${ o3_recent_card }
    ${ o3_monthly_card }
    ${ o3_yearly_card }
</div>

## Stickstoffdioxid

<div class="grid grid-cols-2">
    ${ no2_recent_card }
    ${ no2_monthly_card }
    ${ no2_yearly_card }
</div>

## Feinstaub

<div class="grid grid-cols-2">
    ${ pm10_recent_card }
    ${ pm10_monthly_card }
    ${ pm10_yearly_card }
</div>

---

```js
layout.sponsors()
```
