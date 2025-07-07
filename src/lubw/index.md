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
console.log(hourly_one_week_data)

const hourly_one_week_card = layout.card({
    title : "Stündliche Aufzeichnung",
    subtitle: "Auszug, eine Woche",
    body : layout.plot({
            x: {
                label: 'Zeit',
                labelAnchor: 'center', // TODO move to layout.plot
                labelArrow: 'none', // TODO move to layout.plot
            },
            y: {
                label: 'O3',
                labelArrow: 'none', // TODO move to layout.plot
                tickFormat: Plot.formatNumber("de-DE"),
            },
            marks: [
                Plot.line(hourly_one_week_data, {
                    x: "startZeit",
                    y: "o3",
                }),
                Plot.line(hourly_one_week_data, {
                    x: "startZeit",
                    y: "o3",
                }),
            ]
        }),
})
```

${ layout.title('Luftqualitätsmessungen', 'der Landesanstalt für Umwelt Baden-Württemberg') }

<div class="grid grid-cols-2">
    ${ position_card }
    ${ hourly_one_week_card }
</div>

---

Hallo Konstanz!

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