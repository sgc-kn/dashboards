---
theme: dashboard
toc: false
---

```js
const reanalyse = FileAttachment("cds/Reanalyse.csv").csv({typed: true})
const reanalyse_ma30y = FileAttachment("cds/Reanalyse_30Jahre_gleitender_Durchschnitt.csv").csv({typed: true})
const projections = FileAttachment("cds/Vorhersagen.csv").csv({typed:true})
const projections_4_5 = FileAttachment("cds/Vorhersagen_4_5.csv").csv({typed:true})
const projections_8_5 = FileAttachment("cds/Vorhersagen_8_5.csv").csv({typed:true})

function long_table(wide_table, variables) {
  return wide_table.flatMap(row =>
    variables.map(variable => ({
      year: row['Jahr'],
      variable,
      value: row[variable]
  })))
};
```


```js
const hot_days_variables = [
  'Heisse_Tage_Anzahl',
  'Heisse_Tage_Anzahl_Vorhersage_4_5',
  'Heisse_Tage_Anzahl_Vorhersage_8_5',
];

const hot_days_lables = {
  'Heisse_Tage_Anzahl': "Heisse Tage",
  'Heisse_Tage_Anzahl_Vorhersage_4_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 4.5",
  'Heisse_Tage_Anzahl_Vorhersage_8_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 8.5",
};

function label_hot_days(variable) {
  return hot_days_lables[variable]
};

const heat_waves_variables = [
  'Hitzewellentage_Anzahl',
  'Hitzewellentage_Anzahl_Vorhersage_4_5',
  'Hitzewellentage_Anzahl_Vorhersage_8_5',
];

const heat_waves_lables = {
  'Hitzewellentage_Anzahl': "Hitzewellentage",
  'Hitzewellentage_Anzahl_Vorhersage_4_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 4.5",
  'Hitzewellentage_Anzahl_Vorhersage_8_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 8.5",
};

function label_heat_waves(variable) {
  return heat_waves_lables[variable]
};

const tropical_nights_variables = [
  'Tropennaechte_Anzahl',
  'Tropennaechte_Anzahl_Vorhersage_4_5',
  'Tropennaechte_Anzahl_Vorhersage_8_5',
];

const tropical_nights_lables = {
  'Tropennaechte_Anzahl': "Tropennächte",
  'Tropennaechte_Anzahl_Vorhersage_4_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 4.5",
  'Tropennaechte_Anzahl_Vorhersage_8_5': "Vorhersage mit repräsentativer Konzentrationspfad(RCP) 8.5",
};

function label_tropical_nights(variable) {
  return tropical_nights_lables[variable]
};
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
    color: {
      domain: hot_days_variables,
      legend: true,
      tickFormat: label_hot_days,
    },
    marks: [
      Plot.areaY(long_table(projections, hot_days_variables), {
        x: "year",
        y: "value",
        fill: "variable",
        stroke: "variable",
      }),
      Plot.frame(),
      Plot.dot(long_table(reanalyse, hot_days_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(reanalyse_ma30y, hot_days_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
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
<div class="tools">
<button class="info-button" aria-label='Info'></button>
</div>
</div> <!-- header -->
<div class='with-info'>

```js
const confirm4 = view(Inputs.checkbox(["4.5", "8.5"], {label: "Vorhersagen"}));
```

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
    color: {
      domain: heat_waves_variables,
      legend: true,
      tickFormat: label_heat_waves,
    },
    marks: [
      Plot.frame(),
       Plot.dot(long_table(reanalyse, heat_waves_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(reanalyse_ma30y, heat_waves_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      ... (confirm4.includes("4.5") ? [
            Plot.line(long_table(projections_4_5, heat_waves_variables), {
              x: "year",
              y: "value",
              stroke: "variable",
            })
          ] : []),
      ... (confirm4.includes("8.5") ? [
            Plot.line(long_table(projections_8_5, heat_waves_variables), {
              x: "year",
              y: "value",
              stroke: "variable",
            })
          ] : []),
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
    color: {
      domain: tropical_nights_variables,
      legend: true,
      tickFormat: label_tropical_nights,
    },
    marks: [
      Plot.frame(),
      Plot.dot(long_table(reanalyse, tropical_nights_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(reanalyse_ma30y, tropical_nights_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(projections, tropical_nights_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
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