---
theme: dashboard
toc: false
---

<style>

.card {
  display: flex;
  flex-direction: column;
}

.card .with-info {
  /* enable absolute positioning of .info over .body */
  position: relative;

  /* grow .body to size of grid neighbors */
  flex-grow: 1;

  /* bottom-align plot in card */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card .with-info .info {
  /* position over .body inheriting its size */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.card .with-info .info {
  visibility: hidden;
}

.card.flip .with-info .info {
  visibility: visible;
}

.card.flip .with-info .body {
  visibility: hidden;
}

.card .header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card .header .tools {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
}

.card .header .tools button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.card .header .tools button:hover ion-icon {
  --ionicon-stroke-width: 48px;
}

.card .header .tools ion-icon {
  font-size: 1.5rem;
}

.card .header .tools .close-button,
.card.flip .header .tools .info-button {
  display: none;
}

.card.flip .header .tools .close-button {
  display: inline;
}

</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const infoButton = card.querySelector('.info-button');
    const closeButton = card.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        card.classList.toggle('flip');
      });
    }
    if (infoButton) {
      infoButton.addEventListener('click', () => {
        card.classList.toggle('flip');
      });
    }
  });
});
</script>

# Wetterbeobachtungen

## des Deutschen Wetterdienstes in Konstanz

```js
const kl_geo = FileAttachment("data/kl_geo.csv").csv({typed: true})
const meta_tab = FileAttachment("data/meta.csv").csv({typed: true})
const klindex_ref_tab = FileAttachment("data/klindex_ref.csv").csv({typed: true})
const klindex_last_tab = FileAttachment("data/klindex_last.csv").csv({typed: true})
```

```js
const meta = meta_tab[0]

const klindex_ref = klindex_ref_tab[0]

function klindex_change(X, v){
  let x = X/klindex_ref[v] * 100 - 100;
  if (x >= 0) {
    return '+ ' + Plot.formatNumber('de-DE')(x.toFixed(0)) + '%'
  } else {
    return '− ' + Plot.formatNumber('de-DE')((-x).toFixed(0)) + '%'
  }
}

const klindex_tab = []
for (var r of klindex_last_tab) {
  const obj = { year: r['year'] };
  for (var k of ['tropennaechte', 'heisse_tage', 'sommertage', 'eistage', 'frosttage']) {
    obj[k + '_abs'] = r[k];
    obj[k + '_rel'] = klindex_change(r[k], k);
  }
  klindex_tab.unshift(obj); // add to front
}
```

```js
const map_div = document.createElement("div");
map_div.style = "flex-grow:1";
```

<div class="grid grid-cols-4">

<div class="card grid-colspan-2 grid-rowspan-1" style="display:flex; flex-flow:column">
  <div>
    <h2>Messstation Konstanz</h2>
    <h3>Position der Station im Laufe der Zeit</h3>
  </div>
  ${map_div}
</div>

<div class="card grid-colspan-1">

## Datenquelle

<a href="https://opendata.dwd.de/climate_environment/CDC/observations_germany/">
<h3>opendata.dwd.de</h3>
</a>

<div id=map_height>

Der deutsche Wetterdienst stellt
<a href="https://www.dwd.de/DE/leistungen/opendata/opendata.html">
historische Messdaten</a>
zu allen offiziellen Messstationen bereit.

Dieses Dashboard basiert auf Jahreswerten zur Station Nummer 2712 in Konstanz. Die Daten decken die Zeitspanne <span class=blue><b>${meta['minYear']} bis ${meta['maxYear']}</b></span> ab.

Die Messstation Konstanz befindet sich seit Oktober 2020 westlich der
L221 in einem landwirtschaftlich genutzten Gebiet. Nach internationalen
Richtlinien ist der Standort nahezu ideal – die dort gemessenen Werte
sind aber nicht repräsentativ für das Stadtklima, denn die Temperaturen
in der Stadt sind meist höher als im ländlichen Raum.

</div>

</a>

</div>

<div class="card grid-colspan-1">

## Urheber
<a href="https://smart-green-city-konstanz.de/">
<h3>Smart Green City Konstanz</h3>
</a>

<img title="Smart City Sponsoren" alt="Gefördert durch das Bundensministerium für Wohnen, Stadtentwicklung und Bauwesen sowie der KFW" src="../assets/sponsors-wide.png" />

</div>

</div><!-- grid -->

<div class="grid grid-cols-4">
<div class="card grid-colspan-4">

## Klimakenntage
### Anzahl in den letzten Jahren und der Referenzperiode 1972–2002 im Vergleich

<table style='max-width:100%'>
<thead>
<tr style="border-bottom:0px">
<th></th>
<th></th>
<th colspan=4></th>
<th><span class=muted>Referenzperiode</span></th>
<th colspan=4><span class=muted>Änderung zur Referenzperiode</span></th>
</tr>
<tr>
<th><span class=muted>Bezeichnung</th>
<th><span class=muted>Definition</th>
<th>${klindex_tab[0]['year']}</th>
<th>${klindex_tab[1]['year']}</th>
<th>${klindex_tab[2]['year']}</th>
<th>${klindex_tab[3]['year']}</th>
<th>1972–2002 (⌀)</th>
<th>${klindex_tab[0]['year']}</th>
<th>${klindex_tab[1]['year']}</th>
<th>${klindex_tab[2]['year']}</th>
<th>${klindex_tab[3]['year']}</th>
</tr>
</thead>
<tbody>
<tr>
<th>Eistage</th>
<td>nicht über 0°C</td>
<td>${klindex_tab[0]['eistage_abs']}</td>
<td>${klindex_tab[1]['eistage_abs']}</td>
<td>${klindex_tab[2]['eistage_abs']}</td>
<td>${klindex_tab[3]['eistage_abs']}</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['eistage'].toFixed(2))}</td>
<td>${klindex_tab[0]['eistage_rel']}</td>
<td>${klindex_tab[1]['eistage_rel']}</td>
<td>${klindex_tab[2]['eistage_rel']}</td>
<td>${klindex_tab[3]['eistage_rel']}</td>
</tr>

<tr>
<th>Frosttage</th>
<td>unter 0°C</td>
<td>${klindex_tab[0]['frosttage_abs']}</td>
<td>${klindex_tab[1]['frosttage_abs']}</td>
<td>${klindex_tab[2]['frosttage_abs']}</td>
<td>${klindex_tab[3]['frosttage_abs']}</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['frosttage'].toFixed(2))}</td>
<td>${klindex_tab[0]['frosttage_rel']}</td>
<td>${klindex_tab[1]['frosttage_rel']}</td>
<td>${klindex_tab[2]['frosttage_rel']}</td>
<td>${klindex_tab[3]['frosttage_rel']}</td>
</tr>

<tr>
<th>Sommertage</th>
<td>über 25°C</td>
<td>${klindex_tab[0]['sommertage_abs']}</td>
<td>${klindex_tab[1]['sommertage_abs']}</td>
<td>${klindex_tab[2]['sommertage_abs']}</td>
<td>${klindex_tab[3]['sommertage_abs']}</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['sommertage'].toFixed(2))}</td>
<td>${klindex_tab[0]['sommertage_rel']}</td>
<td>${klindex_tab[1]['sommertage_rel']}</td>
<td>${klindex_tab[2]['sommertage_rel']}</td>
<td>${klindex_tab[3]['sommertage_rel']}</td>
</tr>

<tr>
<th>Heiße Tage</th>
<td>über 30°C</td>
<td>${klindex_tab[0]['heisse_tage_abs']}</td>
<td>${klindex_tab[1]['heisse_tage_abs']}</td>
<td>${klindex_tab[2]['heisse_tage_abs']}</td>
<td>${klindex_tab[3]['heisse_tage_abs']}</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['heisse_tage'].toFixed(2))}</td>
<td>${klindex_tab[0]['heisse_tage_rel']}</td>
<td>${klindex_tab[1]['heisse_tage_rel']}</td>
<td>${klindex_tab[2]['heisse_tage_rel']}</td>
<td>${klindex_tab[3]['heisse_tage_rel']}</td>
</tr>

<tr>
<th>Tropennächte</th>
<td>nicht unter 20°C</td>
<td>${klindex_tab[0]['tropennaechte_abs']}</td>
<td>${klindex_tab[1]['tropennaechte_abs']}</td>
<td>${klindex_tab[2]['tropennaechte_abs']}</td>
<td>${klindex_tab[3]['tropennaechte_abs']}</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['tropennaechte'].toFixed(2))}</td>
<td>${klindex_tab[0]['tropennaechte_rel']}</td>
<td>${klindex_tab[1]['tropennaechte_rel']}</td>
<td>${klindex_tab[2]['tropennaechte_rel']}</td>
<td>${klindex_tab[3]['tropennaechte_rel']}</td>
</tr>

</tbody>
</table>

</div>

</div><!-- grid -->

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

function label(row) {
  const opt = {day: 'numeric', month: 'short', year: 'numeric'};
  const von = (new Date(row['von'])).toLocaleDateString(undefined, opt);
  if (row['bis']) {
    const bis = (new Date(row['bis'])).toLocaleDateString(undefined, opt);
    return `${von} – ${bis}`
  } else {
    return `seit ${von}`
  }
}

const points_to_fit = [ [47.66033, 9.17582] ]

kl_geo.forEach(row => {
  const pos = [row['lat'], row['lon']];
  points_to_fit.push(pos)
  L.circleMarker(pos, {radius: 5, color: 'var(--theme-foreground-focus)'})
   .addTo(map)
   .bindTooltip(label(row), {permanent: true})
   .openTooltip()
});

const mapResizeObserver = new ResizeObserver(() => {
  map.invalidateSize();
  map.fitBounds(points_to_fit, {padding: [13, 13]});
});
mapResizeObserver.observe(map_div);
```

```js
const temp = FileAttachment("data/temp.csv").csv({typed: true})
const maxtemp = FileAttachment("data/maxtemp.csv").csv({typed: true})
const mintemp = FileAttachment("data/mintemp.csv").csv({typed: true})
```

```js
const temp_variables = {
  "JA_MX_TN": "Absolutes Minimum",
  "JA_MX_TX": "Absolutes Maximum",
  "JA_TN": "Jahresmittel aus Tagesminimum",
  "JA_TT": "Jahresmittel aus Tagesdurchschnitt",
  "JA_TX": "Jahresmittel aus Tagesmaximum",
};

function label_temp(variable) {
  return temp_variables[variable]
};
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: '°C',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      domain: ["JA_TN", "JA_TT", "JA_TX"],
      legend: true,
      tickFormat: label_temp,
    },
    marks: [
      Plot.frame(),
      Plot.dot(temp, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(temp, {
        x: "year",
        y: "ma30y",
        stroke: "variable",
      }),
    ]
}))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt den Temperaturverlauf in Form von Jahresmittelwerten der Lufttemperatur über mehrere Jahrzehnte, basierend auf drei unterschiedlichen Berechnungsarten:

1. **Jahresmittel aus Tagesminimum (blaue Punkte):** Der Durchschnitt der täglichen Minimaltemperaturen im Jahr.
2. **Jahresmittel aus Tagesdurchschnitt (gelbe Punkte):** Der Durchschnitt der täglichen Durchschnittstemperaturen im Jahr.
3. **Jahresmittel aus Tagesmaximum (rote Punkte):** Der Durchschnitt der täglichen Maximaltemperaturen im Jahr.

#### Eigenschaften:
- **X-Achse:** Stellt die Zeit (Jahre) dar, beginnend in den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Zeigt die Temperaturen in Grad Celsius (°C).
- **Punkte und Linien:** Die drei Kurven zeigen sowohl die einzelnen Datenpunkte (Punkte) als auch den gleitenden 30-jährigen Durchschnitt (Linien) für die jeweiligen Werte.

#### Beobachtungen:
- Die **Minimaltemperaturen (blau)** sind die niedrigsten Werte und zeigen einen relativ langsamen Anstieg.
- Die **Durchschnittstemperaturen (gelb)** liegen zwischen den Minimal- und Maximaltemperaturen und weisen ebenfalls einen deutlichen Aufwärtstrend auf.
- Die **Maximaltemperaturen (rot)** sind die höchsten Werte und zeigen den steilsten Anstieg, was auf eine Erwärmung der heißeren Tage hinweist.
- Der **gleitende 30-jährige Durchschnitt** verdeutlicht die langfristigen Trends und minimiert jährliche Schwankungen.

#### Interpretation:
Insgesamt ist eine eine zunehmende Erwärmung im Lauf der Jahre erkennbar.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->
<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Absolutes Maximum mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: '°C',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(maxtemp, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(maxtemp, {
        x: "year",
        y: "ma30y",
        stroke: "variable",
      }),
    ]
}))}
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

```js
const sun = FileAttachment("data/sun.csv").csv({typed: true})
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Temperatur der Luft</h2>
<h3>Absolutes Minimum mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: '°C',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(mintemp, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(mintemp, {
        x: "year",
        y: "ma30y",
        stroke: "variable",
      }),
    ]
  }))}
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
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(sun, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(sun, {
        x: "year",
        y: "ma30y",
        stroke: "variable",
      }),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Jahressumme der Sonnenstunden** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends in der Sonnenscheindauer darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die jährliche Gesamtdauer der Sonnenstunden in Stunden (h) an.
- **Punkte:** Repräsentieren die jährliche Summe der Sonnenstunden.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der den langfristigen Trend glättet.

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

```js
const rain = FileAttachment("data/rain.csv").csv({typed: true})
const maxrain = FileAttachment("data/maxrain.csv").csv({typed: true})
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Niederschlag</h2>
<h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: 'Millimeter',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(rain, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(rain, {
        x: "year",
        y: "ma30y",
        stroke: "variable"},
      ),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Jahressumme des Niederschlags** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die jährliche Gesamtsumme des Niederschlags in Millimetern (mm) an.
- **Punkte:** Repräsentieren die jährliche Niederschlagsmenge.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der den langfristigen Trend glättet.

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
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: 'Millimeter',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(maxrain, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(maxrain, {
        x: "year",
        y: "ma30y",
        stroke: "variable"},
      ),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt das **Jahresmaximum des täglichen Niederschlags** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die höchste an einem Tag gemessene Niederschlagsmenge in Millimetern (mm) an.
- **Punkte:** Repräsentieren das jeweilige Jahresmaximum des täglichen Niederschlags.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der den langfristigen Trend glättet.

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
const klindex_kalt = FileAttachment("data/klindex_kalt.csv").csv({typed: true})
const klindex_warm = FileAttachment("data/klindex_warm.csv").csv({typed: true})
const klindex_nacht = FileAttachment("data/klindex_nacht.csv").csv({typed: true})
```

```js
const klindex_variables = {
  "JA_EISTAGE": "Eistage (Maximum unter 0°C)",
  "JA_FROSTTAGE": "Frosttage (Minimum unter 0°C)",
  "JA_HEISSE_TAGE": "Heiße Tage (Maximum über 30°C)",
  "JA_SOMMERTAGE": "Sommertage (Maximum über 25°C)",
  "JA_TROPENNAECHTE": "Tropennächte (Minimum über 20°C)",
};

function label_klindex(variable) {
  if (variable in klindex_variables) {
    return klindex_variables[variable]
  } else {
    return variable
  }
};
```

<div class="grid grid-cols-2">

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      domain: ["JA_EISTAGE", "JA_FROSTTAGE"],
      legend: true,
      tickFormat: label_klindex,
    },
    marks: [
      Plot.frame(),
      Plot.dot(klindex_kalt, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(klindex_kalt, {
        x: "year",
        y: "ma30y",
        stroke: "variable"},
      ),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Tage pro Jahr mit Frost- und Eistagen** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die Anzahl der Tage an.
- **Gelbe Punkte:** Repräsentieren die Anzahl der Frosttage (Tage mit einem Minimum unter 0 °C).
- **Blaue Punkte:** Repräsentieren die Anzahl der Eistage (Tage mit einem Maximum unter 0 °C).
- **Linien:** Stellen den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung glättet.

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
<h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      domain: ["JA_SOMMERTAGE", "JA_HEISSE_TAGE"],
      legend: true,
      tickFormat: label_klindex,
    },
    marks: [
      Plot.frame(),
      Plot.dot(klindex_warm, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(klindex_warm, {
        x: "year",
        y: "ma30y",
        stroke: "variable"},
      ),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Sommertage und heißen Tage pro Jahr** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die Anzahl der Tage an.
- **Blaue Punkte:** Repräsentieren die Sommertage (Tage mit einem Maximum über 25 °C).
- **Gelbe Punkte:** Repräsentieren die heißen Tage (Tage mit einem Maximum über 30 °C).
- **Linien:** Stellen den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung glättet.

#### Beobachtungen:
- Die Anzahl der Sommertage (blau) ist deutlich höher als die der heißen Tage (gelb).
- Beide Zeitreihen zeigen einen ansteigenden Trend im gleitenden Durchschnitt, besonders deutlich ab den 1990er-Jahren.
- Der Anstieg der heißen Tage (gelb) ist steiler als der der Sommertage (blau).

#### Interpretation:
Das Diagramm verdeutlicht, dass Sommertage und besonders heiße Tage im Verlauf der Jahre häufiger geworden sind.

</div> <!-- info -->
</div> <!-- with-info -->
</div> <!-- card -->

<div class="card">
<div class="header">
<div class="title">
<h2>Klimakenntage</h2>
<h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
</div> <!-- title -->
<div class="tools">
<button class="info-button"><ion-icon name="information-circle-outline"></ion-icon></button>
<button class="close-button"><ion-icon name="close-circle-outline"></ion-icon></button>
<button class="download-button"><ion-icon name="cloud-download-outline"></ion-icon></button>
</div> <!-- tools -->
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
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      domain: ["JA_TROPENNAECHTE"],
      legend: true,
      tickFormat: label_klindex,
    },
    marks: [
      Plot.frame(),
      Plot.dot(klindex_nacht, {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(klindex_nacht, {
        x: "year",
        y: "ma30y",
        stroke: "variable"},
      ),
    ]
  }))}
</div> <!-- body -->
<div class='info'>

Dieses Diagramm zeigt die **Anzahl der Tropennächte pro Jahr** über mehrere Jahrzehnte, ergänzt durch einen **30-jährigen gleitenden Durchschnitt**, der langfristige Trends darstellt.

#### Eigenschaften:
- **X-Achse:** Zeigt die Zeit (Jahre) von den 1970er-Jahren bis in die 2020er-Jahre.
- **Y-Achse:** Gibt die Anzahl der Tropennächte an (Nächte mit einem Minimum über 20 °C).
- **Blaue Punkte:** Repräsentieren die jährliche Anzahl der Tropennächte.
- **Linie:** Stellt den 30-jährigen gleitenden Durchschnitt dar, der die langfristige Entwicklung glättet.

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

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
