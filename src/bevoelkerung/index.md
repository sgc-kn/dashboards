---
theme: dashboard
toc: false
---

<h1>Bevölkerung</h1>
<h2>Einwohnerbestandsstatistik der Stadt Konstanz</h2>

<div class="grid grid-cols-3">

<div class="card grid-colspan-2">
<div class="header">
<div class="title">
<h2>Kurzbeschreibung</h2>
<h3>Haushaltsstruktur in Konstanz</h3>
</div>
</div>

Diese Übersicht zeigt die Entwicklung und Verteilung der Haushalte in Konstanz nach Stadtteilen und Jahren. Im Fokus stehen die Anzahl der Haushalte sowie deren Struktur (Ein-, Zwei-, und Mehrpersonenhaushalte).

Die Daten stammen aus der amtlichen Einwohnerbestandsstatistik und bieten eine Grundlage für Analysen zur Stadtentwicklung, Wohnraumbedarf und Sozialplanung.

</div>

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Datenquelle</h2>
<h3>Amtliche Statistik Stadt Konstanz</h3>
</div>
</div>

Die dargestellten Zahlen beruhen auf der amtlichen Einwohnerbestandsstatistik der Stadt Konstanz (Fachbereich Bürgeramt und Statistik).
Die Datengrundlage wird jährlich aktualisiert und steht für weitere Auswertungen zur Verfügung.

</div>

</div>

<div class="grid grid-cols-1">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Anzahl Haushalte und Anzahl Personen je Haushalt nach Stadtteil</h2>
<h3>Tabellenansicht</h3>
</div>
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div>
<div class='with-info'>
<div class='body'>


```js
const haushalte = FileAttachment("haushalte.csv").csv({typed: true});
```

```js
function sparkbar(max, formatter = (x) => x.toLocaleString("en-US")) {
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
    justify-content: end;">${formatter(x)}</div>`;}
```

```js
// haushalte: dein Array aus dem CSV

// Schritt 1: Gesamthaushalte pro Jahr berechnen
const haushalteProJahr = d3.rollup(
  haushalte,
  v => d3.sum(v, d => d.hh_insgesamt),
  d => d.jahr
);

// Schritt 2: Prozentanteil je Stadtteil und Jahr berechnen und als neue Eigenschaft speichern
const haushalteMitProzent = haushalte.map(d => ({
  ...d,
  hh_insgesamt_pct: d.hh_insgesamt / haushalteProJahr.get(d.jahr)
}));

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
    "hh_2person_pct",
    "hh_3personen",
    "hh_3person_pct"
     ],
format: {
  jahr: (x) => x.toFixed(0),
  hh_insgesamt: (x) => x.toFixed(0),
  hh_1person: (x) => x.toFixed(0),
  hh_2personen: (x) => x.toFixed(0),
  hh_3personen: (x) => x.toFixed(0),
  hh_insgesamt: sparkbar(d3.max(haushalte, d => d.hh_insgesamt)),
  hh_1person_pct: sparkbar(100, x => x.toFixed(1) + '%'),
  hh_2person_pct: sparkbar(100, x => x.toFixed(1) + '%'),
  hh_3person_pct: sparkbar(100, x => x.toFixed(1) + '%')
}

,
  header: {
    hh_insgesamt: "Anzahl Haushalte",
    hh_1person: "1 Personenhaushalt",
    hh_1person_pct: "% 1 Personenhaushalt",
    hh_2personen: "2 Personenhaushalt",
    hh_2person_pct: "% 2 Personenhaushalt",
    hh_3personen: "3+ Personenhaushalt",
    hh_3person_pct: "% 3+ Personenhaushalt",
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


<div class="grid grid-cols-2">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Haushalte nach Stadtteil und Jahr</h2>
<h3>Visualisierung</h3>
</div>
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div>
<div class='with-info'>
<div class='body'>
${resize(width => html`
  <figure style="width:100%;">
      ${Plot.plot({
      width,
      height: 600,
      y: {grid: true},
      color: {legend: false, domain: haushalte.map(d => d.stadtteil)}, // Legende aus, Farben festlegen
      marks: [
        Plot.rectY(haushalte, {x: "jahr", y: "hh_insgesamt", fill: "stadtteil"}),
        Plot.ruleY([0])
      ]
    })}
    <div style="margin-top: 1em;">
      ${Plot.legend({color: {domain: haushalte.map(d => d.stadtteil)}, columns: 4, label: "Stadtteil"})}
    </div>
  </figure>
`)}
</div>
<div class='info'>
<!-- Info-Text -->
</div>
</div>
</div>


<div class="card grid-colspan-1">
  <div class="header">
    <div class="title">
      <h2>%-Anteil der Stadtteile an Haushalten und Jahr</h2>
      <h3>Visualisierung</h3>
    </div>
    <div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
  </div>
  <div class='with-info'>
    <div class='body'>
     ${resize(width => html`
  <figure style="width:100%;">
    ${Plot.plot({
      width,
      height: 600,
      x: {label: "Jahr"},
      y: {label: "% Anteil an Haushalten", percent: true, grid: true, domain: [0, 100]},
      color: {legend: false, domain: haushalteMitProzent.map(d => d.stadtteil)},
      marks: [
        Plot.rectY(
          haushalteMitProzent, 
          {x: "jahr", y: "hh_insgesamt_pct", fill: "stadtteil", tip: true}
        ),
        Plot.ruleY([0])
      ]
    })}
    <div style="margin-top: 1em;">
      ${Plot.legend({color: {domain: haushalteMitProzent.map(d => d.stadtteil)}, columns: 4, label: "Stadtteil"})}
    </div>
  </figure>
`)}
    </div>
    <div class='info'>
      <ul>
        <li>Die Grafik zeigt den prozentualen Anteil der Haushalte je Stadtteil an der Gesamtzahl der Haushalte pro Jahr.</li>
        <li>Die y-Achse stellt den %-Anteil dar (0–100 %), die x-Achse die Jahre.</li>
        <li>So lassen sich Veränderungen in der Haushaltsstruktur einzelner Stadtteile im Zeitverlauf vergleichen.</li>
      </ul>
    </div>
  </div>
</div>

</div>

</div> <!-- card -->

</div> <!-- grid -->

---

<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 1rem;">
  <img
    style="flex: 0 1 auto; max-width: 20rem; width: 100%;"
    title="Smart City Sponsor"
    alt="Gefördert durch das Bundensministerium für Wohnen, Stadtentwicklung und Bauwesen"
    src="/assets/sponsor-BMWSB.svg"
  />
  <img
    style="flex: 0 1 auto; max-width: 15rem; width: 100%;"
    title="Smart City Sponsor"
    alt="Gefördert durch die Kreditanstalt für Wiederaufbau (KFW)"
    src="/assets/sponsor-KFW.png"
  />
</div>



