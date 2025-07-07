---
theme: dashboard
toc: false
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
const hourly_one_week_data = FileAttachment("lubw/Stündlich.csv").csv({typed: true})
```

```js
const variables = [
    {
        name: "o3",
        label: "Ozon (O₃)",
        unit: "µg/m³", // TODO verify
    },
    {
        name: "no2",
        label: "Stickstoffdioxid (NO₂)",
        unit: "µg/m³", // TODO verify
    },
    {
        name: "pm25",
        label: "Feinstaub mit 2,5 µm Durchmesser (PM 2.5)",
        unit: "µg/m³", // TODO verify
    },
    {
        name: "pm10",
        label: "Feinstaub mit 10 µm Durchmesser (PM 10)",
        unit: "µg/m³", // TODO verify
    },
]

const variableInput = Inputs.radio(variables, {label: "Messgröße", format: (x) => x.label, value: variables[0]});
const variable = Generators.input(variableInput)
```

```js
const zip_data = FileAttachment("lubw.zip");

const dataset_card = layout.card({
    title : "Datengrundlage",
    subtitle: "",
    download: zip_data.href,
    body : html`
    ${variableInput}
    `,
})
```

```js
const hourly_one_week_card = layout.card({
    title : "Stündliche Aufzeichnung",
    subtitle: `Auszug, eine Woche, ${variable.label} in ${variable.unit}`, // TODO annote week and year here
    body : layout.plot({
            x: {
                label: 'Zeit',
            },
            y: {
                tickFormat: Plot.formatNumber("de-DE"),
            },
            marks: [
                Plot.line(hourly_one_week_data, {
                    x: "startZeit",
                    y: variable.name,
                    stroke: () => "", // use first color of palette
                }),
            ]
        }),
})
```

${ layout.title('Luftqualitätsmessungen', 'der Landesanstalt für Umwelt Baden-Württemberg') }

<div class="grid grid-cols-2">
    ${ position_card }
    ${ dataset_card }
</div>

<div class="grid grid-cols-2">
    ${ hourly_one_week_card }
</div>

---

${layout.sponsors()}

---

### Entwurf

Kacheln:
- Lokation der Messstelle
- Info Datenquelle LUBW
- Info Dateninhalt / Messwerte / Einheiten
- Auswahl Kenngröße
- Plot aller Messwerte einer Woche (letzte komplette Woche im Datensatz?)
- Aggregationen über (Monat, Wochentag, Stunde), gesamter Datensatz, Median/Percentile oder Mean/SD


---

A test of the `html` literal:

${html`<b>simple literal</b>`}

```js
html`<b>another relatively simple literal</b>`
```

```js
html`
<div class=card>
<b>another relatively simple literal</b>
</div>
`
```

```js
html`
<div class=card>

markdown in html literal?
--
no!

</div>
`
```

```js
import markdownit from 'markdown-it'

// commonmark mode
const md = markdownit('commonmark')
```

```js
html`
<div class=card>

${html.fragment`
${md.render(`
markdown in html literal?
--
no!
`)}
`}  

</div>
`
```