---
toc:
  label: 'Neuigkeiten'
---

<h1>Willkommen</h1>
<h2>bei den Stadtdaten Konstanz</h2>

Hier entstehen öffentlich zugängliche Auswertungen zu interessanten
Daten mit Bezug zur Stadt Konstanz. Unser Fokus liegt auf Klima- und
Umweltdaten. Diese Aufbereitungen sind Teil des Projektes
[Klimadatenplattform][project] im Rahmen des Programms [Smart Green
City][sgc] der Stadt Konstanz.

Weitere Daten zur Stadt Konstanz finden Sie auf dem Portal [Offene Daten
Konstanz][od].

[project]: https://smart-green-city-konstanz.de/klimadatenplattform
[sgc]: https://smart-green-city-konstanz.de/
[od]: https://offenedaten-konstanz.de/

---

<h1>Neuigkeiten</h1><h2></h2>

## Oktober 2024

Wir arbeiten an einem Dashboard zu den langjährigen Beobachtungsdaten
des deutschen Wetterdienstes (DWD) in Konstanz.

Wusstest du, dass es zunehmend mehr heiße Tage in Konstanz gibt?
Der 30-jährige gleitende Durchschnitt von heißen Tagen über 30° Celsius
ist angestiegen von durchschnittlich 9 heißen Tagen zwischen 1973 und
2003 auf 16 Tagen zwischen 1993 und 2023. Das ist eine Steigerung
um 83%.

[➜ Hier geht's zum Dashboard !](dwd/index.html)

```js
const dwd_points = FileAttachment("dwd/dwd/Jahreswerte.csv").csv({typed: true})
const dwd_ma30y = FileAttachment("dwd/dwd/Jahreswerte_30Jahre_gleitender_Durchschnitt.csv").csv({typed: true})

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
const klindex_warm_variables = [
  'Sommertage_Anzahl',
  'Heisse_Tage_Anzahl',
];

const klindex_labels = {
  "Eistage_Anzahl": "Eistage (Maximum unter 0°C)",
  "Frosttage_Anzahl": "Frosttage (Minimum unter 0°C)",
  "Heisse_Tage_Anzahl": "Heiße Tage (Maximum über 30°C)",
  "Sommertage_Anzahl": "Sommertage (Maximum über 25°C)",
  "Tropennaechte_Anzahl": "Tropennächte (Minimum über 20°C)",
};

function label_klindex(variable) {
  if (variable in klindex_labels) {
    return klindex_labels[variable]
  } else {
    return variable
  }
};
```

<div class="card">
  <h2>Klimakenntage</h2>
  <h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
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
      domain: klindex_warm_variables,
      legend: true,
      tickFormat: label_klindex,
    },
    marks: [
      Plot.frame(),
      Plot.dot(long_table(dwd_points, klindex_warm_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(dwd_ma30y, klindex_warm_variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
    ]
  }))}
</div> <!-- card -->

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