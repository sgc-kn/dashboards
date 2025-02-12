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

- **Definition**: Heiße Tage sind Tage, an denen die maximale Temperatur über 30 °C liegt.

- **Achsen**:
  - Die x-Achse zeigt die Jahre von **1965 bis 2086**.
  - Die y-Achse zeigt die **Erwartungswerte** der Anzahl heißer Tage pro Jahr. Die Werte basieren auf **30-jährigen Zeitscheiben** und stellen den Mittelwert der projizierten Kenngröße über einen Zeitraum von ±15 Jahren um das jeweilige Jahr dar.

- **Szenarien & Farben**:
  - Das Szenario **RCP 4.5** (mit Klimaschutzmaßnahmen) ist in **blau** dargestellt.
  - Das Szenario **RCP 8.5** (ohne zusätzliche Klimaschutzmaßnahmen) ist in **gelb** dargestellt.

- **Trends & Interpretation**:
  - Im historischen Verlauf lagen die Werte relativ konstant zwischen 2 und 4 heißen Tagen pro Jahr.
  - Unter dem Szenario **RCP 4.5** steigt die Anzahl heißer Tage moderat an und erreicht gegen Ende des Jahrhunderts Werte von etwa 8 bis 10 Tagen pro Jahr.
  - Unter dem Szenario **RCP 8.5** zeigt sich ab etwa 2050 ein deutlicher Anstieg, der bis 2085 auf über 24 heiße Tage pro Jahr ansteigt.
  - Die Unterschiede zwischen den beiden Szenarien werden ab ca. **2050** signifikant.

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

- **Definition**: Hitzewellentage sind Tage, die Teil einer Hitzewelle
  sind. Eine Hitzewelle umfasst mindestens drei aufeinanderfolgende
  Tage, an denen die tägliche Höchsttemperatur über dem 99. Perzentil
  der Temperaturen der Monate Mai bis September während der
  Referenzperiode 1981-2010 liegt.

- **Achsen**:
  - Die x-Achse zeigt die Jahre von **1965 bis 2086**.
  - Die y-Achse zeigt die **Erwartungswerte** der Anzahl von Hitzewellentagen pro Jahr. Die Werte basieren auf **30-jährigen Zeitscheiben** und stellen den Mittelwert der projizierten Kenngröße über einen Zeitraum von ±15 Jahren um das jeweilige Jahr dar.

- **Szenarien & Farben**:
  - Das Szenario **RCP 4.5** (mit Klimaschutzmaßnahmen) ist in **blau** dargestellt.
  - Das Szenario **RCP 8.5** (ohne zusätzliche Klimaschutzmaßnahmen) ist in **gelb** dargestellt.

- **Trends & Interpretation**:
  - Im historischen Verlauf lagen die Werte nahe bei **0 Hitzewellentagen pro Jahr**.
  - Unter dem Szenario **RCP 4.5** steigt die Anzahl der Hitzewellentage nur leicht an und bleibt bis zum Ende des Jahrhunderts unter **3 Tagen pro Jahr**.
  - Unter dem Szenario **RCP 8.5** beginnt ab ca. **2040** ein Anstieg, der sich gegen Ende des Jahrhunderts deutlich verstärkt und auf über **12 Tage pro Jahr** ansteigt.
  - Die Unterschiede zwischen den beiden Szenarien werden ab ca. **2050** signifikant.

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

- **Definition**: Tropennächte sind Nächte, in denen die minimale Temperatur nicht unter 20 °C fällt.

- **Achsen**:
  - Die x-Achse zeigt die Jahre von **1965 bis 2086**.
  - Die y-Achse zeigt die **Erwartungswerte** der Anzahl von Tropennächten pro Jahr. Die Werte basieren auf **30-jährigen Zeitscheiben** und stellen den Mittelwert der projizierten Kenngröße über einen Zeitraum von ±15 Jahren um das jeweilige Jahr dar.

- **Szenarien & Farben**:
  - Das Szenario **RCP 4.5** (mit Klimaschutzmaßnahmen) ist in **blau** dargestellt.
  - Das Szenario **RCP 8.5** (ohne zusätzliche Klimaschutzmaßnahmen) ist in **gelb** dargestellt.

- **Trends & Interpretation**:
  - Im historischen Verlauf schwankten die Werte um etwa **3 bis 5 Tropennächte pro Jahr**.
  - Unter dem Szenario **RCP 4.5** steigt die Anzahl der Tropennächte moderat an und erreicht gegen Ende des Jahrhunderts etwa **12 bis 15 Nächte pro Jahr**.
  - Unter dem Szenario **RCP 8.5** beginnt ab ca. **2040** ein stärkerer Anstieg, der bis **2085** auf über **35 Tropennächte pro Jahr** zunimmt.
  - Die Unterschiede zwischen den beiden Szenarien werden ab ca. **2050** signifikant.

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

- **Definition**: Extremniederschlagstage sind Tage, an denen die
  Niederschlagsmenge über dem 95. Perzentil der Niederschlagsmenge an
  Regentagen während der Referenzperiode 1981–2010 definiert ist.

- **Achsen**:
  - Die x-Achse zeigt die Jahre von **1965 bis 2086**.
  - Die y-Achse zeigt die **Erwartungswerte** der Anzahl von Extremniederschlagstagen pro Jahr. Die Werte basieren auf **30-jährigen Zeitscheiben** und stellen den Mittelwert der projizierten Kenngröße über einen Zeitraum von ±15 Jahren um das jeweilige Jahr dar.

- **Szenarien & Farben**:
  - Das Szenario **RCP 4.5** (mit Klimaschutzmaßnahmen) ist in **blau** dargestellt.
  - Das Szenario **RCP 8.5** (ohne zusätzliche Klimaschutzmaßnahmen) ist in **gelb** dargestellt.

- **Trends & Interpretation**:
  - Im historischen Verlauf bewegte sich die Anzahl der Extremniederschlagstage zwischen **8 und 9 Tagen pro Jahr**.
  - Unter dem Szenario **RCP 4.5** steigt die Anzahl bis etwa **2050** auf Werte um **11 bis 12 Tage pro Jahr**, danach zeigt sich ein Rückgang auf unter **9 Tage pro Jahr** gegen Ende des Jahrhunderts.
  - Unter dem Szenario **RCP 8.5** zeigt sich ein stetiger Anstieg bis ca. **2060**, mit Werten über **12 Tage pro Jahr**, bevor sich die Werte stabilisieren.
  - Die Unterschiede zwischen den beiden Szenarien werden ab ca. **2040** deutlich sichtbar.

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

- **Definition**: Frosttage sind Tage, an denen die minimale Temperatur unter 0 °C liegt.

- **Achsen**:
  - Die x-Achse zeigt die Jahre von **1965 bis 2086**.
  - Die y-Achse zeigt die **Erwartungswerte** der Anzahl von Frosttagen pro Jahr. Die Werte basieren auf **30-jährigen Zeitscheiben** und stellen den Mittelwert der projizierten Kenngröße über einen Zeitraum von ±15 Jahren um das jeweilige Jahr dar.

- **Szenarien & Farben**:
  - Das Szenario **RCP 4.5** (mit Klimaschutzmaßnahmen) ist in **blau** dargestellt.
  - Das Szenario **RCP 8.5** (ohne zusätzliche Klimaschutzmaßnahmen) ist in **gelb** dargestellt.

- **Trends & Interpretation**:
  - Im historischen Verlauf nahm die Anzahl der Frosttage kontinuierlich ab, von über **75 Tagen pro Jahr** in den 1960er Jahren auf etwa **60 Tage pro Jahr** um das Jahr 2000.
  - Unter dem Szenario **RCP 4.5** setzt sich der Rückgang moderat fort und stabilisiert sich gegen Ende des Jahrhunderts bei etwa **40 Tagen pro Jahr**.
  - Unter dem Szenario **RCP 8.5** beschleunigt sich der Rückgang nach **2050**, sodass die Anzahl der Frosttage gegen **2085** unter **20 Tagen pro Jahr** sinkt.
  - Die Unterschiede zwischen den beiden Szenarien werden ab ca. **2040** deutlich sichtbar.

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
