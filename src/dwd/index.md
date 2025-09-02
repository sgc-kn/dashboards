---
theme: [light, alt, wide]
toc: false
---

<h1>Wetterbeobachtungen</h1>
<h2>des Deutschen Wetterdienstes in Konstanz</h2>

```js
const geo = FileAttachment("dwd/Standort.csv").csv({typed: true})
const ref_tab = FileAttachment("dwd/Referenzperiode_1973_2000.csv").csv({typed: true})

const ma30y = FileAttachment("dwd/Jahreswerte_30Jahre_gleitender_Durchschnitt.csv").csv({typed: true})
const points = FileAttachment("dwd/Jahreswerte.csv").csv({typed: true})

import { plot } from "./lib.js";
```

```js
const years = points.map(row => row['Jahr'])
const minYear = Math.min(...years)
const maxYear = Math.max(...years)

const ref = ref_tab[0]

function klindex_change(X, v){
  let x = X/ref[v] * 100 - 100;
  if (x >= 0) {
    return '+ ' + Plot.formatNumber('de-DE')(x.toFixed(0)) + '%'
  } else {
    return '− ' + Plot.formatNumber('de-DE')((-x).toFixed(0)) + '%'
  }
}

const klindex_abs = []
const klindex_rel = []
for (var r of points) {
  if (r['Jahr'] > maxYear - 4) {
    const abs = { Jahr: r['Jahr'] };
    const rel = { Jahr: r['Jahr'] };
    for (var k of ['Tropennaechte_Anzahl', 'Heisse_Tage_Anzahl', 'Sommertage_Anzahl', 'Eistage_Anzahl', 'Frosttage_Anzahl']) {
      abs[k] = r[k];
      rel[k] = klindex_change(r[k], k);
    }
    klindex_abs.push(abs);
    klindex_rel.push(rel);
  }
}
```

```js
const map_div = document.createElement("div");
map_div.style = "flex-grow:1";
```

<div class="grid grid-cols-4">

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Messstation Konstanz</h2>
<h3>Position der Station im Laufe der Zeit</h3>
</div> <!-- title -->
</div> <!-- header -->
${map_div}
</div> <!-- card -->

<div class="card grid-colspan-1">
<div class="header">
<div class="title">
<h2>Datenquelle</h2>
<h3><a href="https://opendata.dwd.de/climate_environment/CDC/observations_germany/">opendata.dwd.de</a></h3>
</div> <!-- title -->
<div class="tools"><a href='dwd.zip' class="download-button" title='Download' aria-label='Download' download></a></div>
</div> <!-- header -->
<div id=map_height>

Der deutsche Wetterdienst stellt
<a href="https://www.dwd.de/DE/leistungen/opendata/opendata.html">
historische Messdaten</a>
zu allen offiziellen Messstationen bereit.

Dieses Dashboard basiert auf Jahreswerten zur Station Nummer 2712 in
Konstanz. Die Daten decken die Zeitspanne <b>${minYear} bis ${maxYear}</b> ab.

Die Messstation Konstanz befindet sich seit Oktober 2020 westlich der
L221 in einem landwirtschaftlich genutzten Gebiet. Nach internationalen
Richtlinien ist der Standort nahezu ideal – die dort gemessenen Werte
sind aber nicht repräsentativ für das Stadtklima, denn die Temperaturen
in der Stadt sind meist höher als im ländlichen Raum.

</div> <!-- #map_height -->
</div> <!-- card -->

<div class="card grid-colspan-2">

<h2>Klimakenntage</h2>
<h3>Definition und Referenzwerte</h3>

<table style='max-width:100%'>
<thead>
<tr style="border-bottom:0px">
<th></th>
<th></th>
<th><span class=muted>Referenzperiode</span></th>
</tr>
<tr>
<th><span class=muted>Bezeichnung</th>
<th><span class=muted>Definition</th>
<th>1973–2000 (⌀)</th>
</tr>
</thead>
<tbody>
<tr>
<th>Eistage</th>
<td>nicht über 0°C</td>
<td>${Plot.formatNumber('de-DE')(ref['Eistage_Anzahl'].toFixed(2))}</td>
</tr>

<tr>
<th>Frosttage</th>
<td>unter 0°C</td>
<td>${Plot.formatNumber('de-DE')(ref['Frosttage_Anzahl'].toFixed(2))}</td>
</tr>

<tr>
<th>Sommertage</th>
<td>über 25°C</td>
<td>${Plot.formatNumber('de-DE')(ref['Sommertage_Anzahl'].toFixed(2))}</td>
</tr>

<tr>
<th>Heiße Tage</th>
<td>über 30°C</td>
<td>${Plot.formatNumber('de-DE')(ref['Heisse_Tage_Anzahl'].toFixed(2))}</td>
</tr>

<tr>
<th>Tropennächte</th>
<td>nicht unter 20°C</td>
<td>${Plot.formatNumber('de-DE')(ref['Tropennaechte_Anzahl'].toFixed(2))}</td>
</tr>

</tbody>
</table>

<span class=muted>Die Referenzwerte ergeben sich aus dem Durchschnitt
der Jahre 1973 bis 2000.</span>

<!-- Üblicherweise werden als Referenzperiode die Jahre
1971 bis 2000 heran gezogen. Die Aufzeichnung für die Station Konstanz
beginnen aber erst 1973. -->

</div> <!-- card -->

</div> <!-- grid -->

<div class="grid grid-cols-4">

<div class="card grid-colspan-2">

<h2>Klimakenntage</h2>
<h3>Anzahl pro Jahr</h3>

<table style='max-width:100%'>
<thead>
<tr style="border-bottom:0px">
<th></th>
<th colspan=4><span class=muted>Anzahl</span></th>
</tr>
<tr>
<th><span class=muted>Bezeichnung</th>
<th>${klindex_abs[0]['Jahr']}</th>
<th>${klindex_abs[1]['Jahr']}</th>
<th>${klindex_abs[2]['Jahr']}</th>
<th>${klindex_abs[3]['Jahr']}</th>
</tr>
</thead>
<tbody>
<tr>
<th>Eistage</th>
<td>${klindex_abs[0]['Eistage_Anzahl']}</td>
<td>${klindex_abs[1]['Eistage_Anzahl']}</td>
<td>${klindex_abs[2]['Eistage_Anzahl']}</td>
<td>${klindex_abs[3]['Eistage_Anzahl']}</td>
</tr>

<tr>
<th>Frosttage</th>
<td>${klindex_abs[0]['Frosttage_Anzahl']}</td>
<td>${klindex_abs[1]['Frosttage_Anzahl']}</td>
<td>${klindex_abs[2]['Frosttage_Anzahl']}</td>
<td>${klindex_abs[3]['Frosttage_Anzahl']}</td>
</tr>

<tr>
<th>Sommertage</th>
<td>${klindex_abs[0]['Sommertage_Anzahl']}</td>
<td>${klindex_abs[1]['Sommertage_Anzahl']}</td>
<td>${klindex_abs[2]['Sommertage_Anzahl']}</td>
<td>${klindex_abs[3]['Sommertage_Anzahl']}</td>
</tr>

<tr>
<th>Heiße Tage</th>
<td>${klindex_abs[0]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_abs[1]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_abs[2]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_abs[3]['Heisse_Tage_Anzahl']}</td>
</tr>

<tr>
<th>Tropennächte</th>
<td>${klindex_abs[0]['Tropennaechte_Anzahl']}</td>
<td>${klindex_abs[1]['Tropennaechte_Anzahl']}</td>
<td>${klindex_abs[2]['Tropennaechte_Anzahl']}</td>
<td>${klindex_abs[3]['Tropennaechte_Anzahl']}</td>
</tr>

</tbody>
</table>


</div> <!-- card -->

<div class="card grid-colspan-2">

<h2>Klimakenntage</h2>
<h3>im Vergleich zur Referenzperiode 1973–2000</h3>

<table style='max-width:100%'>
<thead>
<tr style="border-bottom:0px">
<th></th>
<th colspan=4><span class=muted>Änderung zur Referenzperiode</span></th>
</tr>
<tr>
<th><span class=muted>Bezeichnung</th>
<th>${klindex_rel[0]['Jahr']}</th>
<th>${klindex_rel[1]['Jahr']}</th>
<th>${klindex_rel[2]['Jahr']}</th>
<th>${klindex_rel[3]['Jahr']}</th>
</tr>
</thead>
<tbody>
<tr>
<th>Eistage</th>
<td>${klindex_rel[0]['Eistage_Anzahl']}</td>
<td>${klindex_rel[1]['Eistage_Anzahl']}</td>
<td>${klindex_rel[2]['Eistage_Anzahl']}</td>
<td>${klindex_rel[3]['Eistage_Anzahl']}</td>
</tr>

<tr>
<th>Frosttage</th>
<td>${klindex_rel[0]['Frosttage_Anzahl']}</td>
<td>${klindex_rel[1]['Frosttage_Anzahl']}</td>
<td>${klindex_rel[2]['Frosttage_Anzahl']}</td>
<td>${klindex_rel[3]['Frosttage_Anzahl']}</td>
</tr>

<tr>
<th>Sommertage</th>
<td>${klindex_rel[0]['Sommertage_Anzahl']}</td>
<td>${klindex_rel[1]['Sommertage_Anzahl']}</td>
<td>${klindex_rel[2]['Sommertage_Anzahl']}</td>
<td>${klindex_rel[3]['Sommertage_Anzahl']}</td>
</tr>

<tr>
<th>Heiße Tage</th>
<td>${klindex_rel[0]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_rel[1]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_rel[2]['Heisse_Tage_Anzahl']}</td>
<td>${klindex_rel[3]['Heisse_Tage_Anzahl']}</td>
</tr>

<tr>
<th>Tropennächte</th>
<td>${klindex_rel[0]['Tropennaechte_Anzahl']}</td>
<td>${klindex_rel[1]['Tropennaechte_Anzahl']}</td>
<td>${klindex_rel[2]['Tropennaechte_Anzahl']}</td>
<td>${klindex_rel[3]['Tropennaechte_Anzahl']}</td>
</tr>

</tbody>
</table>

</div> <!-- card -->

</div> <!-- grid -->

```js
const map = L.map(map_div, {
  scrollWheelZoom: false,
  dragging: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  zoomControl: false,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> & OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

function label_geo(row) {
  const opt = {day: 'numeric', month: 'short', year: 'numeric'};
  const von = (new Date(row['Von'])).toLocaleDateString(undefined, opt);
  if (row['Bis']) {
    const bis = (new Date(row['Bis'])).toLocaleDateString(undefined, opt);
    return `${von} – ${bis}`
  } else {
    return `seit ${von}`
  }
}

const points_to_fit = [ [47.66033, 9.17582] ]

geo.forEach(row => {
  const pos = [
    row['Geografische_Breite_WGS84_Dezimal'],
    row['Geografische_Laenge_WGS84_Dezimal'],
  ];
  points_to_fit.push(pos)
  L.circleMarker(pos, {radius: 5, color: 'var(--theme-blue)'})
   .addTo(map)
   .bindTooltip(label_geo(row), {permanent: true})
   .openTooltip()
});

const mapResizeObserver = new ResizeObserver(() => {
  map.invalidateSize();
  map.fitBounds(points_to_fit, {padding: [13, 13]});
});
mapResizeObserver.observe(map_div);
```

```js
const temperature_variables = [
  'Temperatur_Celsius_Mittel_Tagesminimum',
  'Temperatur_Celsius_Mittel_Tagesdurchschnitt',
  'Temperatur_Celsius_Mittel_Tagesmaximum'
];
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, temperature_variables))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt den Temperaturverlauf in Form von Jahresmittelwerten der Lufttemperatur über mehrere Jahrzehnte, basierend auf drei unterschiedlichen Berechnungsarten:

1. **Jahresmittel aus Tagesminimum (blaue Punkte):** Der Durchschnitt der täglichen Minimaltemperaturen im Jahr.
2. **Jahresmittel aus Tagesdurchschnitt (gelbe Punkte):** Der Durchschnitt der täglichen Durchschnittstemperaturen im Jahr.
3. **Jahresmittel aus Tagesmaximum (rote Punkte):** Der Durchschnitt der täglichen Maximaltemperaturen im Jahr.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die Temperaturen in Grad Celsius (°C).
- **Punkte:** Beziehen sich auf ein einzelnes Jahr.
- **Linien:** Stellen den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Jahresmittelwerte verdeutlicht.

#### Beobachtungen:
- Die Minimaltemperaturen (blau) sind die niedrigsten Werte und zeigen einen relativ langsamen Anstieg.
- Die Durchschnittstemperaturen (gelb) liegen zwischen den Minimal- und Maximaltemperaturen und weisen ebenfalls einen deutlichen Aufwärtstrend auf.
- Die Maximaltemperaturen (rot) sind die höchsten Werte und zeigen den steilsten Anstieg, was auf eine Erwärmung der heißeren Tage hinweist.
- Der gleitende 30-jährige Durchschnitt verdeutlicht die langfristigen Trends und minimiert jährliche Schwankungen.

#### Interpretation:
Insgesamt ist eine zunehmende Erwärmung im Lauf der Jahre erkennbar.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Absolutes Maximum mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, "Temperatur_Celsius_Maximum"))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt das **absolute Maximum der Lufttemperatur** im Laufe der Jahre, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, um langfristige Trends darzustellen.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die maximal erreichten Temperaturen in Grad Celsius (°C).
- **Punkte:** Repräsentieren die jährlichen absoluten Maximaltemperaturen.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Maximaltemperaturen verdeutlicht.

#### Beobachtungen:
- Die jährlichen absoluten Maximaltemperaturen zeigen große Schwankungen zwischen den Jahren.
- Seit den 1990er-Jahren ist ein deutlicher Trend zu steigenden Maximaltemperaturen erkennbar.
- Der gleitende 30-jährige Durchschnitt zeigt einen konstanten Anstieg, insbesondere ab den 2000er-Jahren.
- Die höchsten absoluten Maximaltemperaturen liegen über 36 °C.

#### Interpretation:
Das Diagramm verdeutlicht, dass die maximalen Temperaturen in den letzten
Jahrzehnten deutlich gestiegen sind, was auf eine Zunahme von
Extremhitze-Ereignissen hindeutet.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

</div> <!-- grid -->

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Absolutes Minimum mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, "Temperatur_Celsius_Minimum"))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt das **absolute Minimum der Lufttemperatur** im Laufe der Jahre, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, um langfristige Trends darzustellen.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die minimal erreichten Temperaturen in Grad Celsius (°C).
- **Punkte:** Repräsentieren die jährlichen absoluten Minimaltemperaturen.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Minimaltemperaturen verdeutlicht.

#### Beobachtungen:
- Die jährlichen absoluten Minimaltemperaturen schwanken stark, liegen jedoch durchweg unter 0 °C.
- In den 1970er- und 1980er-Jahren traten teilweise extrem niedrige Minimaltemperaturen bis unter -18 °C auf.
- Seit den 2000er-Jahren ist der gleitende 30-jährige Durchschnitt leicht ansteigend, was auf mildere Winter hindeutet.
- Die absoluten Minimaltemperaturen zeigen eine Tendenz zu weniger extrem kalten Werten.

#### Interpretation:
Die Daten deutet darauf hin, dass die tiefsten Temperaturen in den
letzten Jahrzehnten weniger extrem geworden sind, was auf eine
allgemeine Erwärmung, insbesondere in den kältesten Perioden des Jahres,
hindeutet.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Sonnenstunden</h2>
<h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, "Sonnenscheindauer_Stunden_Summe"))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Jahressumme der Sonnenstunden** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends in der Sonnenscheindauer darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die jährliche Gesamtdauer der Sonnenstunden in Stunden (h).
- **Punkte:** Repräsentieren die jährliche Summe der Sonnenstunden.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Sonnenstunden verdeutlicht.

#### Beobachtungen:
- Die jährliche Summe der Sonnenstunden zeigt im Verlauf der Jahrzehnte Schwankungen.
- Bis etwa 1995 sind die Sonnenstunden relativ konstant oder leicht rückläufig.
- Ab den 2000er-Jahren ist ein deutlicher Anstieg in der Anzahl der Sonnenstunden zu erkennen.
- Der 30-jährige gleitende Durchschnitt zeigt einen kontinuierlichen Anstieg ab den 2000er-Jahren.

#### Interpretation:
Der Anstieg der Jahressumme der Sonnenstunden könnte auf veränderte Wetterbedingungen hinweisen, wie beispielsweise eine Abnahme der Bewölkung oder eine längere Dauer von Hochdruckwetterlagen.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

</div> <!-- grid -->

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Niederschlag</h2>
<h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, "Niederschlag_Millimeter_Summe"))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Jahressumme des Niederschlags** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die jährliche Gesamtsumme des Niederschlags in Millimetern (mm).
- **Punkte:** Repräsentieren die jährliche Niederschlagsmenge.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung des Niederschlags verdeutlicht.

#### Beobachtungen:
- Die jährliche Niederschlagsmenge schwankt stark von Jahr zu Jahr, mit Werten zwischen etwa 650 mm und 1.000 mm.
- Bis Mitte der 1990er-Jahre ist keine klare Tendenz erkennbar.
- Ab den 2000er-Jahren zeigt der 30-jährige gleitende Durchschnitt einen leichten Rückgang, der sich auf einem stabilen Niveau einzupendeln scheint.

#### Interpretation:
Das Diagramm deutet auf eine leichte Abnahme der durchschnittlichen jährlichen Niederschlagsmenge hin, wobei die jährlichen Schwankungen weiterhin groß bleiben.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Niederschlag</h2>
<h3>Jahresmaximum mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, "Niederschlag_Millimeter_Maximum_Tagesmaximum"))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt das **Jahresmaximum des täglichen Niederschlags** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die höchste an einem Tag gemessene Niederschlagsmenge in Millimetern (mm).
- **Punkte:** Repräsentieren das jeweilige Jahresmaximum des täglichen Niederschlags.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung des Niederschlags verdeutlicht.

#### Beobachtungen:
- Die Jahresmaxima des täglichen Niederschlags schwanken stark, mit Spitzenwerten von über 80 mm.
- Ein leichter Rückgang des gleitenden Durchschnitts ist von den frühen 2000er-Jahren bis etwa 2010 erkennbar.
- In den letzten Jahren bleibt der gleitende Durchschnitt auf einem relativ konstanten Niveau.

#### Interpretation:
Das Diagramm zeigt, dass die Spitzenwerte des täglichen Niederschlags Schwankungen unterliegen, ohne dass ein klarer langfristiger Auf- oder Abwärtstrend erkennbar ist.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

</div> <!-- grid -->

```js
const klindex_kalt_variables = [
  'Eistage_Anzahl',
  'Frosttage_Anzahl',
];

const klindex_warm_variables = [
  'Sommertage_Anzahl',
  'Heisse_Tage_Anzahl',
];

const klindex_nacht_variables = [
  'Tropennaechte_Anzahl',
];
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Eis- und Frosttage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, klindex_kalt_variables))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Tage pro Jahr mit Frost- und Eistagen** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die Anzahl der Tage.
- **Gelbe Punkte:** Repräsentieren die Anzahl der Frosttage (Tage mit einem Minimum unter 0 °C).
- **Blaue Punkte:** Repräsentieren die Anzahl der Eistage (Tage mit einem Maximum unter 0 °C).
- **Linien:** Stellen den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Klimakenntage verdeutlicht.

#### Beobachtungen:
- Die Anzahl der Frosttage (gelb) ist deutlich höher als die Anzahl der Eistage (blau).
- Beide Zeitreihen zeigen eine abnehmende Tendenz im gleitenden Durchschnitt, wobei der Rückgang bei den Eistagen stärker ausgeprägt ist.
- Besonders ab den 2000er-Jahren ist der Rückgang der Eistage deutlicher sichtbar.

#### Interpretation:
Das Diagramm zeigt, dass die Anzahl der Frost- und Eistage im Laufe der Jahre abnimmt, was auf mildere Winterbedingungen hindeutet.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Sommertage und Heiße Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, klindex_warm_variables))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Sommertage und Heißen Tage pro Jahr** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die Anzahl der Tage.
- **Blaue Punkte:** Repräsentieren die Sommertage (Tage mit einem Maximum über 25 °C).
- **Gelbe Punkte:** Repräsentieren die Heißen Tage (Tage mit einem Maximum über 30 °C).
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Klimakenntage verdeutlicht.

#### Beobachtungen:
- Die Anzahl der Sommertage (blau) ist deutlich höher als die der Heißen Tage (gelb).
- Beide Zeitreihen zeigen einen ansteigenden Trend im gleitenden Durchschnitt, besonders deutlich ab den 1990er-Jahren.
- Der Anstieg der Heißen Tage (gelb) ist steiler als der der Sommertage (blau).

#### Interpretation:
Das Diagramm verdeutlicht, dass Sommertage und besonders Heiße Tage im Verlauf der Jahre häufiger geworden sind.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Tropennächte pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools"><button class="info-button" aria-label='Info' title='Info'></button></div>
</div> <!-- header -->
<div class='with-info'>
<div class='body'>
${resize((width) => plot(points, ma30y, width, klindex_nacht_variables))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Tropennächte pro Jahr** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die Anzahl der Tropennächte an (Nächte mit einem Minimum über 20 °C).
- **Blaue Punkte:** Repräsentieren die jährliche Anzahl der Tropennächte.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung der Tropennächte verdeutlicht.

#### Beobachtungen:
- Tropennächte waren bis in die 1990er-Jahre nahezu nicht vorhanden.
- Ab den 2000er-Jahren treten Tropennächte häufiger auf, mit einem deutlichen Anstieg nach 2010.
- Der 30-jährige gleitende Durchschnitt zeigt seit den 2000er-Jahren eine leicht ansteigende Tendenz.

#### Interpretation:
Das Diagramm zeigt, dass Tropennächte in den letzten Jahrzehnten häufiger geworden sind, obwohl sie insgesamt noch selten auftreten.

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
