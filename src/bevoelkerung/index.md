---
theme: dashboard
toc: false
---

<h1>Bevölkerung</h1>
<h2>Einwohnerbestandsstatistik der Stadt Konstanz</h2>

```js
const haushalte = FileAttachment("haushalte.csv").csv({typed: true});
```

```js
//const selected = view(Inputs.table(haushalte));
```

```js
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: var(--theme-green);
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")}`
}
```

```js
Inputs.table(haushalte.slice(0,14), {
  columns: [
    "jahr",
    "stadtteil",
    "hh_insgesamt",
    "hh_1person",
    "hh_1person_pct",
    "hh_2personen",
    "hh_3personen"
     ],
    format: {
    jahr: (x) => x.toFixed(0),
    hh_insgesamt: (x) => x.toFixed(0),
    hh_1person: (x) => x.toFixed(0),
    hh_1person_pct: (x) => x.toFixed(1),
    hh_2personen: (x) => x.toFixed(0),
    hh_3personen: (x) => x.toFixed(0),
    hh_insgesamt: sparkbar(d3.max(haushalte, d => d.hh_insgesamt))
      },
  header: {
    hh_insgesamt: "Anzahl Haushalte",
    hh_1person: "1 Personenhaushalt",
    hh_1person_pct: "% 1 Personenhaushalt",
    hh_2personen: "2 Personenhaushalt",
    hh_3personen: "3+ Personenhaushalt",
    stadtteil: "Stadtteil",
    jahr: "Jahr",
  },
  align: {
    jahr: "center"    
  },
width: {
    jahr: 80,
    stadtteil: 180,
    flipper_length_mm: 140
  },
  rows: 16,
  maxWidth: 1600,
  multiple: false,
  layout: "fixed"
})

```

``js
Plot.plot({
  y: {grid: true},
  marks: [
    Plot.rectY(haushalte, {x: "jahr", y: "hh_insgesamt",  fill: "stadtteil"}),
    Plot.ruleY([0])
  ]
})
```
