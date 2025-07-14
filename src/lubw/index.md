---
theme: dashboard
toc: true
---

```js
import * as layout from "./layout.js";
```

```js
const position_card = layout.card({
    title : 'Messstation Konstanz',
    subtitle : 'Position der Station im Laufe der Zeit',
    body : '',
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
const zip_data = FileAttachment("lubw.zip");

const dataset_card = layout.card({
    title : "Datengrundlage",
    subtitle: "",
    download: zip_data.href,
    body : html`
    TODO
    `,
})
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
                marks: [
                    Plot.line(recent_data, {
                        x: "startZeit", // TODO fix time zone offset in GUI
                        y: variable.name,
                        stroke: () => "", // use first color of palette
                    }),
                    Plot.ruleY(thresholds.map((x) => x[0]), {
                        stroke: x => `ordinal_${x}`,
                    })
                ]
            }),
        info,
    })
}
```

```js
const o3 = variables.o3
const o3_recent_card = recent_card(variables.o3, {
    thresholds: [ [180, "Informationsschwelle"], [240, "Alarmschwelle"] ],
    info: html`
    <p>TODO</p>
    `
    // TODO document thresholds from https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen
});
```


```js
function monthly_card(variable){
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
                marks: [
                    Plot.line(monthly_data, {
                        x: "start",
                        y: variable.name + "_mean",
                        stroke: () => "", // use first color of palette
                    }),
                ]
            }),
    })
}

function yearly_card(variable){
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
                marks: [
                    Plot.line(yearly_data, {
                        x: "start",
                        y: variable.name + "_mean",
                        stroke: () => "", // use first color of palette
                    }),
                ]
            }),
    })
}

function max_card(variable){
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
                marks: [
                    Plot.line(monthly_data, {
                        x: "start",
                        y: variable.name + "_max",
                        stroke: () => "", // use first color of palette
                    }),
                ]
            }),
    })
} 
```

${ layout.title('Luftqualitätsmessungen', 'der Landesanstalt für Umwelt Baden-Württemberg') }

<div class="grid grid-cols-2">
    ${ position_card }
    ${ dataset_card }
</div>

## Ozon

<div class="grid grid-cols-2">
    ${ o3_recent_card }
    ${ monthly_card(variables.o3) }
    ${ yearly_card(variables.o3) }
    ${ max_card(variables.o3) }
</div>

## Stickstoffdioxid

<div class="grid grid-cols-2">
    ${ recent_card(variables.no2) }
    ${ monthly_card(variables.no2) }
    ${ yearly_card(variables.no2) }
    ${ max_card(variables.no2) }
</div>

## Feinstaub

<div class="grid grid-cols-2">
    ${ recent_card(variables.pm10) }
    ${ monthly_card(variables.pm10) }
    ${ yearly_card(variables.pm10) }
    ${ max_card(variables.pm10) }
</div>

---

```js
layout.sponsors()
```
