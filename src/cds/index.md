---
theme: dashboard
toc: false
---

```js
const stats = FileAttachment("cds/Zeitscheiben_30Jahre.csv").csv({typed: true});

const lables = {
  'Heisse_Tage_Anzahl': "Heisse Tage (Maximum über 30°C)",
  'Hitzewellentage_Anzahl': "Hitzewellentage",
  'Tropennaechte_Anzahl': "Tropennächte (Minimum über 20°C)",
  'Extremniederschlagstage_Anzahl': "Extremniederschlagstage",
  'Frosttage_Anzahl': "Frosttage (Minimum unter 0°C)",
};
```

<h1>Klimaprojektionen</h1>
<h2>für die Stadt Konstanz</h2>

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
- Problem: einzelne Prognosewerte suggerieren „falsche" Präzision, deshalb:
- Betrachtung von 30-jährigen Zeitscheiben, um das jeweilige Jahr herum (± 15 Jahre)
- Linie: Durchschnitt der Zeitscheibe um das jeweilige Jahr

```js
function plot(width, variable) {
  const marks = [
      Plot.frame(),
      Plot.lineY(stats.filter(d => d['Statistik'] == 'Durchschnitt'), {
        x: "Jahr",
        y: variable,
        stroke: "Modell",
      }),
    ];

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
    },
    marks
  })
};
```

</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Heiße Tage</h2>
<h3>Anzahl pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Heisse_Tage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Hitzewellentage</h2>
<h3>Anzahl pro Jahr</h3>
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
<h2>Tropennächte</h2>
<h3>Anzahl pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Tropennaechte_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Extremniederschlagstage</h2>
<h3>Anzahl pro Jahr</h3>
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
<h2>Frosttage</h2>
<h3>Anzahl pro Jahr</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(width, 'Frosttage_Anzahl'))}
</div> <!-- body -->
<div class='info'>

TODO

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->
</div> <!-- grid -->
