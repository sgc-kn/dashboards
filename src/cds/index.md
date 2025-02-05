---
theme: dashboard
toc: false
---

```js
const stats = FileAttachment("cds/Statistik_30Jahre.csv").csv({typed: true})
const observations = FileAttachment("../dwd/dwd/Jahreswerte.csv").csv({typed: true})

const lables = {
  'Heisse_Tage_Anzahl': "Heisse Tage (Maximum über 30°C)",
  'Hitzewellentage_Anzahl': "Hitzewellentage",
  'Tropennaechte_Anzahl': "Tropennächte (Minimum über 20°C)",
  'Extremniederschlagstage_Anzahl': "Extremniederschlagstage",
  'Frosttage_Anzahl': "Frosttage (Minimum unter 0°C)",
};

const models = ['Reanalyse', 'Projektion RCP 4.5', 'Projektion RCP 8.5'];
```

<h1>Klimamodelle</h1>
<h2>aus dem Climate Data Store</h2>

<div class="grid grid-cols-2">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Datengrundlage</h2>
<h3>Vorgehen</h3>
</div> <!-- title -->
<div class="tools"><a download href='cds.zip' class="download-button"></a></div>
</div> <!-- header -->

- Quelle: [Datensatz zu Klimakenntagen im Climate Data Store](
https://cds.climate.copernicus.eu/datasets/sis-ecde-climate-indicators
)
- [Aufbereitet für Konstanz und andere Städte](
https://github.com/sgc-kn/cds-examples/
)
- Auswahl eines Modells:

```js
const model = view (
  Inputs.select(models,
    {value: 'Projektion RCP 4.5', label: "Modell"}
  )
)
```

- Problem: einzelne Prognosewerte suggerieren „falsche" Präzision, deshalb:
- Betrachtung von 30-jährigen Zeitscheiben, um das jeweilige Jahr herum (± 15 Jahre)
- Erwartungswert: Durchschnitt der Zeitscheibe
- Extremwerte: 80%, 90% und 95% Quantile der Zeitscheibe
- Auswahl des Quantils über Jährlichkeit:

```js
const extreme = view (
  Inputs.select(
    new Map([
      ['5-jährig', 'Q80'],
      ['10-jährig', 'Q90'],
      ['20-jährig', 'Q95'],
    ]),
    {value: 'Q90', label: "Extremwerte"}
  )
)
```

- Frage: Lässt das Modell solche Extremwertanalysen zu?
- Frage: Können wir die Methode der Zielgruppe erklären?
- Frage: Alternativen?

Zusätzliche Punkte (schwarz) für Beobachtungen aus [DWD Dashboard](../dwd)

- Frage: Wie erklären wir die Diskrepanz bei den Heißen Tagen und Tropennächten?

```js
const model_stats = stats.filter(row => (model == row['Modell']));

const stat_labels = {
  'Durchschnitt': 'Erwartungswert',
  'Q80': '5-jähriges Extremereignis',
  'Q90': '10-jähriges Extremereignis',
  'Q95': '20-jähriges Extremereignis',
};

function label_stat(x) {
  return stat_labels[x]
};
```

```js
function plot(width, variable, obs) {
  const marks = [
      Plot.frame(),
      Plot.lineY(model_stats.filter(d => d['Statistik'] == 'Durchschnitt'), {
        x: "Jahr",
        y: variable,
        stroke: "Statistik",
      }),
      Plot.lineY(model_stats.filter(d => d['Statistik'] == extreme), {
        x: "Jahr",
        y: variable,
        stroke: "Statistik",
      }),
    ];

  if ( obs ) {
    marks.push(
      Plot.dotY(observations, {
        x: "Jahr",
        y: obs,
      })
    );
  }

  return Plot.plot({
    width,
    grid: true,
    inset: 10,
    x: {
      label: 'Jahr',
      labelAnchor: 'center',
      labelArrow: 'none',
      tickFormat: JSON.stringify, // surpress delimiting dots, e.g. 2.024
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      legend: true,
      tickFormat: label_stat,
    },
    marks
  })
};
```

</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Heiße Tage pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Heisse_Tage_Anzahl', 'Heisse_Tage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Hitzewellentage pro Jahr</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button" aria-label='Info'></button>
</div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Hitzewellentage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Tropennächte pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Tropennaechte_Anzahl', 'Tropennaechte_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Extremniederschlagstage pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Extremniederschlagstage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Frosttage pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Frosttage_Anzahl', 'Frosttage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->
</div> <!-- grid -->
