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

<h1>Klimaprojektionen</h1>
<h2>für Konstanz und die Umgebung</h2>

<div class="grid grid-cols-2">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Kurzbeschreibung</h2>
<h3>Klimaprojektionen</h3>
</div> <!-- title -->
</div> <!-- header -->

Dieses Dashboard zeigt Klimaprojektionen für Konstanz und die nähere Umgebung.
Es veranschaulicht, wie sich das Klima in Konstanz unter verschiedenen Annahmen entwickeln könnte.

Klimaprojektionen sind keine exakten Vorhersagen, sondern [Modellrechnungen][model], die auf Annahmen und Näherungen beruhen.
Wir stellen hier ein Modell mit zwei möglichen [Entwicklungspfaden][rcp] dar:

- **RCP 4.5**: Ein Szenario mit Klimaschutzmaßnahmen, in dem die Emissionen künftig reduziert werden.
- **RCP 8.5**: Ein Szenario ohne zusätzliche Klimaschutzmaßnahmen, in dem die Emissionen ungebremst weiter steigen.

[model]: https://de.wikipedia.org/wiki/Klimamodell
[rcp]: https://de.wikipedia.org/wiki/Repr%C3%A4sentativer_Konzentrationspfad

</div> <!-- card -->

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Datengrundlage</h2>
<h3>Copernicus Climate Data Store</h3>
</div> <!-- title -->
<div class="tools"><a download href='cds.zip' class="download-button"></a></div>
</div> <!-- header -->

Unsere Darstellungen basieren auf Modellrechnungen des [Copernicus-Klimawandeldienstes][c3s].
Die Quelldaten können aus dem [Climate Data Store][cds] heruntergeladen werden.
Eine Aufbereitung für Konstanz und andere Städte [stellen wir auf GitHub zur Verfügung][gh].

Einzelne Jahreswerte der Projektion vermitteln eine irreführende Genauigkeit.
Da nur langfristige Trends aussagekräftig sind, betrachten wir 30-jährige Zeitscheiben.
Die Linien in den Diagrammen zeigen den Mittelwert der projizierten Kenngrößen über einen Zeitraum von ±15 Jahren um das auf der x-Achse angegebene Jahr.

[c3s]: https://www.copernicus.eu/de/dienste/klimawandel
[cds]: https://cds.climate.copernicus.eu/datasets/sis-ecde-climate-indicators
[gh]: https://github.com/sgc-kn/cds-examples/

</div> <!-- card -->

</div> <!-- grid -->

<div class="grid grid-cols-2">

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
