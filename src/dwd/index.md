---
theme: dashboard
toc: false
sql:
  klindex: ./data/klindex_data.parquet
  long_ma30y: ./data/long_ma30y.parquet
  kl_meta_geo: ./data/kl_meta_geo.parquet
---

# Wetterbeobachtungen

## des Deutschen Wetterdienstes in Konstanz

```sql id=kl_geo
with typed as(
  select
    (Von_Datum::date)::text as von,
    (Bis_Datum::date)::text as bis,
    "Geogr.Breite" as lat,
    "Geogr.Laenge" as lon,
    Stationshoehe as altitude,
  from kl_meta_geo)
select
  min(von) as von,
  max(bis) as bis,
  lat,
  lon,
from typed
where von >= '1972-01-01'
group by lat, lon
order by von asc
```

```sql id=meta_tab
select
  count(*) as count,
  extract('year' from min(year))::text as minYear,
  extract('year' from max(year))::text as maxYear,
from long_ma30y
```

```sql id=klindex_ref_tab
select
  count(*),
  avg(JA_TROPENNAECHTE::double) as tropennaechte,
  avg(JA_HEISSE_TAGE::double) as heisse_tage,
  avg(JA_SOMMERTAGE::double) as sommertage,
  avg(JA_EISTAGE::double) as eistage,
  avg(JA_FROSTTAGE::double) as frosttage,
from klindex
where MESS_DATUM_BEGINN::date >= '1972-01-01'::date
and MESS_DATUM_ENDE::date <= '2002-12-31'::date
```

```sql id=klindex_last_tab
select
  MESS_DATUM_BEGINN as year,
  JA_TROPENNAECHTE::double as tropennaechte,
  JA_HEISSE_TAGE::double as heisse_tage,
  JA_SOMMERTAGE::double as sommertage,
  JA_EISTAGE::double as eistage,
  JA_FROSTTAGE::double as frosttage,
from klindex
order by MESS_DATUM_BEGINN::date desc
limit 1
```

```js
const klindex_last = klindex_last_tab.toArray()[0]
const klindex_ref = klindex_ref_tab.toArray()[0]

function klindex_change(v){
  let x = klindex_last[v]/klindex_ref[v] * 100 - 100;
  if (x >= 0) {
    return '+ ' + Plot.formatNumber('de-DE')(x.toFixed(0)) + '%'
  } else {
    return '− ' + Plot.formatNumber('de-DE')((-x).toFixed(0)) + '%'
  }
}

const meta = meta_tab.toArray()[0]
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
historische Messdaten
</a>
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
<div class="card grid-colspan-2">

## Klimakenntage
### Anzahl im Jahr ${meta['maxYear']} und der Referenzperiode 1972–2002 im Vergleich

<table>
<thead>
<tr>
<td><span class=muted>Bezeichnung</td>
<td><span class=muted>Definition</td>
<td>1972–2002 (⌀)</td>
<td>${meta['maxYear']}</td>
<td><span class=muted>Änderung</td>
</tr>
</thead>
<tbody>
<tr>
<td>Eistage</td>
<td>nicht über 0°C</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['eistage'].toFixed(2))}</td>
<td>${klindex_last['eistage']}</td>
<td>${klindex_change('eistage')}</td>
</tr>

<tr> <td>Frosttage</td><td>unter 0°C</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['frosttage'].toFixed(2))}</td>
<td>${klindex_last['frosttage']}</td>
<td>${klindex_change('frosttage')}</td>
</tr>

<tr><td>Sommertage</td><td>über 25°C</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['sommertage'].toFixed(2))}</td>
<td>${klindex_last['sommertage']}</td>
<td>${klindex_change('sommertage')}</td>
</tr>

<tr><td>Heiße Tage</td><td>über 30°C</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['heisse_tage'].toFixed(2))}</td>
<td>${klindex_last['heisse_tage']}</td>
<td>${klindex_change('heisse_tage')}</td>
</tr>

<tr><td>Tropennächte</td><td>nicht unter 20°C</td>
<td>${Plot.formatNumber('de-DE')(klindex_ref['tropennaechte'].toFixed(2))}</td>
<td>${klindex_last['tropennaechte']}</td>
<td>${klindex_change('tropennaechte')}</td>
</tr>
</tbody>
</table>

</div>

<div class="card grid-colspan-1">
</div>
<div class="card grid-colspan-1">
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

kl_geo.toArray().forEach(row => {
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

```sql id=temp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_TT', 'JA_TN', 'JA_TX')
order by year asc, variable asc
```

```sql id=maxtemp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TX')
order by year asc, variable asc
```

```sql id=mintemp
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_TN')
order by year asc, variable asc
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
  <h2>Temperatur der Luft</h2>
  <h3>Jahresmittel mit 30-jährigem gleitendem Durchschnitt</h3>
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

Der 30-jährige gleitende Durchschnitt des Jahresmittels aus den
Maximaltemperaturen jedes Tages ist angestiegen von durchschnittlich x,x
° Celsius zwischen 1973 und 2003 auf x.x °Celsius zwischen 1993 und
2023. Das bedeutet eine Steigerung um xx,x%.

</div>

<div class="card" style="display:flex; flex-direction:column; justify-content: space-between">
  <div>
  <h2>Temperatur der Luft</h2>
  <h3>Absolutes Maximum mit 30-jährigem gleitendem Durchschnitt</h3>
  </div>
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
        domain: [0, 40],
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

Der 30-jährige gleitende Durchschnitt der Jahreshöchsttemperatur ist
angestiegen von durchschnittlich x,x ° Celsius zwischen 1973 und 2003
auf x.x °Celsius zwischen 1993 und 2023. Das bedeutet eine Steigerung um xx,x%.

</div>

</div> <!-- grid -->

```sql id=sun
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_SD_S')
order by year asc, variable asc
```

<div class="grid grid-cols-2">

<div class="card">
  <h2>Temperatur der Luft</h2>
  <h3>Absolutes Minimum mit 30-jährigem gleitendem Durchschnitt</h3>
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
</div>

<div class="card">
  <h2>Sonnenstunden</h2>
  <h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
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
</div>

</div> <!-- grid -->

```sql id=rain
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_RR')
order by year asc, variable asc
```

```sql id=maxrain
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_MX_RS')
order by year asc, variable asc
```

<div class="grid grid-cols-2">

<div class="card">
  <h2>Niederschlag</h2>
  <h3>Jahressumme mit 30-jährigem gleitendem Durchschnitt</h3>
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
</div>

<div class="card">
  <h2>Niederschlag</h2>
  <h3>Jahresmaximum mit 30-jährigem gleitendem Durchschnitt</h3>
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
</div>

</div> <!-- grid -->

```sql id=klindex_kalt
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_EISTAGE', 'JA_FROSTTAGE')
order by year asc, variable asc
```

```sql id=klindex_warm
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_HEISSE_TAGE', 'JA_SOMMERTAGE')
order by year asc, variable asc
```

```sql id=klindex_nacht
select
  year,
  variable,
  coalesce(value::double, 'NaN'::double) as value,
  coalesce(ma30y::double, 'NaN'::double) as ma30y,
from long_ma30y
where variable in ('JA_TROPENNAECHTE')
order by year asc, variable asc
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
</div>

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
</div>

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
</div>

</div> <!-- grid -->
