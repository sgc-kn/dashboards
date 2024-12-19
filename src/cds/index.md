---
theme: dashboard
toc: false
---

```js
const reanalyse = FileAttachment("cds/Reanalyse.csv").csv({typed: true})
const reanalyse_ma30y = FileAttachment("cds/Reanalyse_30Jahre_gleitender_Durchschnitt.csv").csv({typed: true})
```

<h1>Klimamodelle</h1>
<h2>aus dem Climate Data Store</h2>

<div class="grid grid-cols-2">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Datenquelle</h2>
<h3>Subtitle</h3>
</div> <!-- title -->
<div class="tools"><a download href='cds.zip' class="download-button"></a></div>
</div> <!-- header -->
<div id=map_height>

TODO

</div> <!-- #map_height -->
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
${resize((width) => Plot.plot({
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
    marks: [
      Plot.frame(),
      Plot.dot(reanalyse, {
        x: "Jahr",
        y: "Heisse_Tage_Anzahl",
        stroke: () => "",
      }),
      Plot.line(reanalyse_ma30y, {
        x: "Jahr",
        y: "Heisse_Tage_Anzahl",
        stroke: () => "",
      }),
    ]
  }))}
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
<div class="tools"><button class="info-button" aria-label='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => Plot.plot({
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
    marks: [
      Plot.frame(),
      Plot.dot(reanalyse, {
        x: "Jahr",
        y: "Hitzewellentage_Anzahl",
        stroke: () => "",
      }),
      Plot.line(reanalyse_ma30y, {
        x: "Jahr",
        y: "Hitzewellentage_Anzahl",
        stroke: () => "",
      }),
    ]
  }))}
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
${resize((width) => Plot.plot({
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
    marks: [
      Plot.frame(),
      Plot.dot(reanalyse, {
        x: "Jahr",
        y: "Tropennaechte_Anzahl",
        stroke: () => "",
      }),
      Plot.line(reanalyse_ma30y, {
        x: "Jahr",
        y: "Tropennaechte_Anzahl",
        stroke: () => "",
      }),
    ]
  }))}
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
${resize((width) => Plot.plot({
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
    marks: [
      Plot.frame(),
      Plot.dot(reanalyse, {
        x: "Jahr",
        y: "Extremniederschlagstage_Anzahl",
        stroke: () => "",
      }),
      Plot.line(reanalyse_ma30y, {
        x: "Jahr",
        y: "Extremniederschlagstage_Anzahl",
        stroke: () => "",
      }),
    ]
  }))}
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
${resize((width) => Plot.plot({
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
    marks: [
      Plot.frame(),
      Plot.dot(reanalyse, {
        x: "Jahr",
        y: "Frosttage_Anzahl",
        stroke: () => "",
      }),
      Plot.line(reanalyse_ma30y, {
        x: "Jahr",
        y: "Frosttage_Anzahl",
        stroke: () => "",
      }),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

*TODO*

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

</div> <!-- grid -->