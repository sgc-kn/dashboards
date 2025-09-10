---
style: style.css
sidebar: true
toc:
  label: 'Kapitel'
---

```js
import * as layout from "../assets/layout.js";
```

<!--brauche ich damit ich in style.css z.B. die Schriftbreite ändern kann -->
<div class="correlaid-page"> 

# Das Stadtklima unter der Lupe
## Wie ein paar Meter den Unterschied machen – beim Klima vor deiner Tür


Ein heißer Sommertag in Konstanz, du läufst über den Stephansplatz und spürst, wie die Hitze über dem Pflaster flimmert. Dann machst du ein paar Schritte in den Stadtgarten – plötzlich wirkt es kühler, angenehmer. Dabei bist du nur ein paar hundert Meter gelaufen. Wie kann das sein?
In dieser interaktiven Story nehmen wir das Konstanzer Stadtklima unter die Lupe. Wir werfen einen Blick auf die Klimaveränderungen der letzten Jahrzehnte und analysieren überraschende Temperaturunterschiede innerhalb der Stadt. Außerdem findest du selbst heraus, welche Faktoren Orte innerhalb der Stadt besonders heiß oder angenehm kühl machen.
Was deutlich wird: Der Klimawandel ist längst in Konstanz angekommen. Aber seinen Auswirkungen sind wir in unterschiedlichem Maß ausgesetzt – je nachdem, wie die Stadtteile gestaltet sind, in denen wir wohnen, arbeiten oder uns gerne aufhalten.


## Teil 1: Wie hat sich die Temperatur in Konstanz über die Jahrzehnte entwickelt?

Um nachzuvollziehen, wie sich das Klima in Konstanz bis heute entwickelt hat, werfen wir einen Blick auf Daten des Deutschen Wetterdienstes (DWD). Seit 1973 erfasst die Wetterstation des DWD kontinuierlich die wichtigsten Wetterparameter in Konstanz. Hier abgebildet siehst du die seither dokumentierte Entwicklung der jährlichen Durchschnittstemperatur. Um herauszufinden, wie sich die Temperatur während deiner Zeit in Konstanz verändert hat, kannst du im Dropdownmenü dein Zuzugsjahr auswählen.

```js
// Was wollt ihr hier für Daten nutzen? Eine Idee wäre, die Jahreswerte aus dem DWD Dashboard wiederzuverwenden.
// Es gäbe dort auch noch 30-jährige gleitende Durchschnitte
const yearly =  FileAttachment("../dwd/dwd/Jahreswerte.csv").csv({typed: true})
// Diese Datei wird von ../../dwd/dwd.zip.py erstellt. Das Python Skript bündelt meherere Dateien in ein ZIP-Archiv (u.a. Jahreswerte.csv);
// Observable Framework stellt diese dann einzeln oder gebündelt zum Download bereit.
```

```js
import { computeYears, createWeatherTrendContainer } from "./charts/chart1_weather_trends.js";
const { minYear, maxYear, allYears } = computeYears(yearly);

const options = ["Bitte Jahr wählen…", ...allYears];
const arrivalInput = Inputs.select(options, { label: "Jahr" });
```

<strong>Seit wann lebst du in Konstanz?</strong>
${arrivalInput}

<div class="card">
  <h2>Jahresdurchschnittstemperatur</h2>
  <h3>DWD Station Konstanz</h3>

  In der folgenden Grafik kannst du sehen, wie sich die Temperatur seit <strong>1973</strong> verändert hat. Die Regressionsgerade bezieht sich auf den gesamten Zeitraum seit 1973.

```js
view(createWeatherTrendContainer(yearly, arrivalInput));
``` 
</div> <!-- card -->

Wenn wir den kompletten Zeitraum betrachten, wird deutlich: Die durchschnittliche Lufttemperatur in Konstanz ist über die Jahrzehnte trotz einiger Schwankungen kontinuierlich angestiegen. Zum einen wird es generell wärmer – zum anderen nimmt die Zahl der Extremwettertage zu: Das sehen wir beispielsweise an tropischen Nächten und Hitzetagen mit Temperaturen über 30 Grad.


**Tipp:** Wenn du mehr zum Klima in Konstanz wissen willst, dann schau doch mal bei den Dashboards vorbei! Da gibt es viele interessante Diagramme zu sehen:
<a href="https://stadtdaten.konstanz.digital/dwd/">Wetterbeobachtungen</a>, 
<a href="https://stadtdaten.konstanz.digital/cds/">Klimaprojektionen</a>, und
<a href="https://stadtdaten.konstanz.digital/lubw/">Luftqualität</a>.

Ohne effektive globale Klimaschutzmaßnahmen wird dieser Trend weiter zunehmen. Damit rückt immer mehr die Frage in den Fokus, wie widerstandsfähig unsere Wohnorte gegenüber zunehmenden Extremen sind. Wie also fühlen sich solche Hitzetage in Konstanz an?


## Teil 2: Wo spürt man die zunehmende Hitze in Konstanzer Sommern besonders heftig?

An heißen Sommertagen scheint es besonders darauf anzukommen, wo man seine Zeit verbringt: Während es in den engen Gassen der Innenstadt heiß und stickig ist, lässt es sich im Herosé-Park oder am Hörnle deutlich besser aushalten. Auch im Stadtgarten oder im Lorettowald ist die Hitze oft weniger spürbar. Aber ist das tatsächlich messbar – oder nur Gefühlssache?

Die Stadt Konstanz betreibt seit 2024 mehrere Wetterstationen, die quer über das Stadtgebiet verteilt sind. Und diese Stationen liefern spannende ergänzende Daten zur Station des Deutschen Wetterdienstes: Denn während die DWD-Wettersonde einen einzigen Temperaturwert für die gesamte Stadt erhebt, zeigen die Messstationen der Stadt deutlich differenziertere Werte. Sie machen sichtbar, welche Orte sich morgens besonders schnell oder langsam erwärmen, die Hitze am Abend lange speichern – oder aber rasch wieder abkühlen.

In der linken Karte sind diese städtischen Wetterstationen verzeichnet. Die Grafik daneben zeigt die Temperaturentwicklung dieser Stationen am heißesten Tag des vergangenen Jahres – dem 11. August 2024. Mit dem Slider kannst du dich stundenweise durch den Tag bewegen und sehen, wie warm es zu einer bestimmten Uhrzeit an den einzelnen Stationen war. Je größer und intensiver der Blauton des Kreises um eine Station, desto kühler war es dort im Vergleich zum stündlichen Durchschnitt aller Stationen. Je größer und intensiver der Rotton des Kreises, desto wärmer war es. 

Verschaff dir einen Überblick: An welchen Standorten ist es besonders heiß oder kühl über den Tag? Findest du ein Muster?

Klickst du auf einen Standort in der Karte, so wird die individuelle Temperaturkurve der zugehörigen Wetterstation in der Grafik hervorgehoben. 

<center>

### Temperaturverlauf am 11. August 2024 

</center>

<!-- Learning: 
  Erst in separaten JavaScript-Zellen den Inhalt vorbereiten.
  Dann im Markdown die Anzeige steuern.
-->

```js
// Daten der Stationen und Tagesverlauf laden
const station_meta = FileAttachment("stationen.geo.json").json()
const tagesverlauf = FileAttachment('./tagesverlauf.csv').csv({typed: true})
```

```js
// Ermittle, für welche Stationen Daten vorliegen und filtere stationen_meta
const station_set_a = new Set(tagesverlauf.map(x => x.Station))
const station_set_b = new Set(station_meta.features.map(x => x.properties.name))
const station_set = station_set_a.intersection(station_set_b)
station_meta.features = station_meta.features.filter(x => station_set.has(x.properties.name))
const stations = [...station_set]
```

<!-- UI-Inputs chart2 -->
```js
const station = Mutable(stations[0]);
const set_station = x => station.value = x;

// Uhrzeit-Slider
const stunde_input = Inputs.range([0, 23], {step: 1});
const stunde = Generators.input(stunde_input);
```

```js
// Import der ausgelagerten Funktionen
import { createSensorLineChart, createSensorMap, updateSensorMap, createReactiveSensorChart, createMapLegend } from "./charts/chart2_sensor_map.js";
```

```js
// Karten-Div vorbereiten - wird im Markdown verwendet
const map_div = document.createElement("div");
map_div.style.aspectRatio = "1.5";
map_div.style.maxWidth = "640px";
//map_div.style = "max-widths: 640px;";
map_div
```


<!-- Layout Dia 2 (2 Charts)-->
<div class="grid grid-cols-2 gap-4">

<!-- Zeigen der Karte-->
<div class="card">
  <div class="header">
    <div class="title">
      <h2>Messstationen</h2>
      <h3>Temperatur an Konstanzer Wetterstationen im Vergleich zum Durchschnitt um ${stunde}:00 Uhr</h3>
    </div>
  </div>

  <div class="body">
    <p>${map_div}</p>
    <p>${resize(width => createMapLegend(width))}</p>
  </div>
</div> 
<!-- Ende Card - Map -->

<!-- Zeigen der Sensorliniendiagramme-->
<!-- Line Plot der Stationen-->
<div class="card">
  <div class="header">
    <div class="title">
      <h2>Temperatur</h2>
      <h3>Tagesverlauf an der Wetterstationen ${station}</h3>
    </div>
  </div>

  <div class="body">
    <p>${resize(width => createSensorLineChart(tagesverlauf, station, stunde, width))}</p>
    <center>
    <p>${stunde_input}</p>
    <p>Uhrzeit: ${stunde}:00</p>
    </center>
  </div>

</div> <!-- card -->

</div> <!-- Grid mit 2 Spalten Ende -->

<!--Layout kommt zuerst (HTML/Markdown darüber), Inhalt kommt danach (befüllen der Karte und Interaktivität hier drunter.-->

```js
// Die Karte wurde oben bereits ins HTML / DOM eingebettet. Hier wird sie befüllt.
// ausgelagert in charts/chart2_sensor_map.js
const map = createSensorMap(map_div, station_meta);
```

```js display=false
// This block is re-evaluated whenever the input 'station' or 'stunde' changes.
// ausgelagert in charts/chart2_sensor_map.js
updateSensorMap(map, station_meta, station, set_station, tagesverlauf, stunde);
```

Die Grafik zeigt eindrücklich, dass tatsächlich nicht alle Orte innerhalb der Stadt gleichermaßen von der Hitze betroffen sind. Gegen 12:00 Uhr sind es beispielsweise mehr als 5&#8239;°C, die die beiden kühlsten Orte (Herosé Park und Fähre Staad) vom heißesten Ort (Riedstraße) unterscheiden.  

 Hitzespitzen wie die in der Riedstraße – hier wurden 31,3&#8239;°C gemessen – bleiben nicht ohne Folgen: für das persönliche Wohlbefinden von allen, aber insbesondere für die Gesundheit älterer Menschen, Kinder und Menschen ohne Zugang zu kühlen Rückzugsorten. Tagsüber steigt die Gefahr von Dehydrierung und Hitzestress, während die Nächte kaum Möglichkeit zur Erholung lassen. Auch für viele Pflanzen und Tiere sind die erhöhten Temperaturen ein Stressfaktor.

Mit gezielten Maßnahmen zur Klimawandelanpassung kann der übermäßigen Erhitzung einzelner Gebiete vorgebeugt werden. Dafür ist es wichtig zu verstehen, welche Faktoren sogenannte Hitzeinseln in der Stadt verstärken oder abschwächen. Schauen wir uns dafür die Stationen genauer an!


## Teil 3: Warum ist es an Orten unterschiedlich heiß – obwohl sie nur wenige Straßen voneinander entfernt sind?

Die nächste Grafik zeigt dir neben den Temperaturdaten nun auch die Umgebung der Messstationen im Radius von 50&#8239;m. Um herauszufinden, was hinter den Temperaturdifferenzen steckt, kannst du sie jetzt selbst vergleichen: Gibt es dort viele Gebäude? Asphaltierte Flächen? Oder überwiegend Bäume und Wiesen? Und was bedeutet das für die Erwärmung der Luft rund um die Station?

```js
// Flächendaten (Koordinaten + %-Anteile)
const stationMeta_dia3 = FileAttachment("./data/konstanz_flaechenanalyse.csv").csv({ typed: true });

// Heatmap-Rohdaten (24h-Abweichungen)
const heatmapRaw_dia3 = FileAttachment("./data/dia3_stationen_heatmap.csv").csv({ typed: true });

// Klima-Daten (Max-Temp, heiße Tage)
const hotData_dia3 = FileAttachment("./data/hot_data.csv").csv({ typed: true });
```

```js
// Umwandeln in: { "Stationenname": [24 Werte mit Abweichung] }
const heatmapData_dia3 = {
  ...Object.fromEntries(
    d3.groups(heatmapRaw_dia3, d => d.name).map(([name, rows]) => [
      name,
      rows.sort((a, b) => +a.hour - +b.hour).map(d => +d.temperature_deviation)
    ])
  )
}

// UI: Überschrift + zwei Dropdowns nebeneinander
const leftSelect  = Inputs.select(stations,  { label: "Station A", value: "Stadtgarten" });
const rightSelect = Inputs.select(stations,  { label: "Station B", value: "Friedrichstrasse" });
const left = Generators.input(leftSelect);
const right = Generators.input(rightSelect);

const arials = {
    "Döbele": FileAttachment("arials/dobele.png").href,
    "Europapark": FileAttachment("arials/europapark.png").href,
    "Fähre Staad": FileAttachment("arials/fahre_staad.png").href,
    "Friedrichstrasse": FileAttachment("arials/friedrichstrasse.png").href,
    "Fahrradbrucke": FileAttachment("arials/herose_fahrradbrucke.png").href,
    "Herose-Park": FileAttachment("arials/herose_park.png").href,
    "Hörnle": FileAttachment("arials/hornle.png").href,
    "Mainaustrasse": FileAttachment("arials/mainaustrasse.png").href,
    "Marktstätte": FileAttachment("arials/marktstatte.png").href,
    "Riedstrasse": FileAttachment("arials/riedstrasse.png").href,
    "Stadtgarten": FileAttachment("arials/stadtgarten.png").href,
    "Stephansplatz": FileAttachment("arials/stephansplatz.png").href,
    "Uni Eichbergstraße": FileAttachment("arials/uni_eichbergstraße.png").href,
};

function kpi(stationName){
  const row = hotData_dia3.find(d => d.name === stationName);
  return {
    maxTemp: Plot.formatNumber('de-DE')(row['Hottest_Day'].toFixed(1)),
    nHotDays: Plot.formatNumber('de-DE')(row['Hot_Days_Count'])
  };
}

function surface(station, kind, label, color){
  const value = stationMeta_dia3.find(d => d.name == station)[kind + "_%"]; 
  return html.fragment`
    <div class="card-label">${label}</div>
    <div class="bar-outer">
      <div class="bar-inner" style="width:${value}%; background:${color};" title="${value} %">
    </div>
  `
}

function Stripes(values, width, {
    height = 100,
    domain = [-1, 0, 1],
    range = ["#2166AC", "#F7F7F7", "#C70039"]
} = {}) {
    const data = values.map((v, i) => ({ hour: i + 1, value: v, row: "r" }));
    const hours = Array.from({ length: 24 }, (_, i) => i + 1);

    return Plot.plot({
        height,
        width,
        style: "font-size: 14px;",
        marginBottom: 40,           // space for hour numbers
        inset: 10,
        x: {
            domain: hours,
            ticks: [1, 6, 12, 18, 24],              // only multiples of 6
            //tickFormat: d => String(d).padStart(2, "0") + ":00",            // show 1..24
            tickSize: 0,              // no tick lines
            tickPadding: 2, // smaller distance between labels and axis
            label: "Uhrzeit"
        },
        y: {
            domain: ["r"],            // single row
            axis: null,
            padding: 0
        },
        color: {
            type: "linear",
            domain,
            range
        },
        marks: [
            // one cell per hour
            Plot.cell(data, {
                x: "hour",
                y: "row",
                fill: "value",
                inset: 0,
                title: d => {
                    const sign = d.value > 0 ? "+" : "";
                    return `${String(d.hour).padStart(2, "0")}Uhr: ${sign}${Plot.formatNumber("de-DE")(d.value.toFixed(2))} °C`;
                }
            })
        ]
    });
}
```

```js
const leftStripes = width => Stripes(heatmapData_dia3[left], width);
```

```js
const rightStripes = width => Stripes(heatmapData_dia3[right], width);
```

<strong>Welche zwei Stationen willst du vergleichen?</strong>
${leftSelect} ${rightSelect}

<div class="grid">
  <div class="card weatherstation-card">
    <h2 class="weatherstation-title">${left}</h2>
    <div class="map-wrap">
      ${html.fragment`<img style="object-fit: cover;" src=${arials[left]} alt="Luftbild" title="Quelle: Landesamt für Geoinformation und Landesentwicklung Baden-Württemberg (LGL-BW) (2024) (dl-by-de/2.0 Lizenz)">`}
    </div> <!-- .map-wrap -->
    <div class="box">
      <div class="card-title">Oberflächenbeschaffenheit</div>
      <div class="muted">im Umkreis von 50&#x202f;m um die Station</div>
      <p>Versiegelte Flächen</p>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(left, "gebaeude", "Gebäude", "#b3b3b3")}
        ${surface(left, "asphalt", "Asphalt", "#333333")}
      </div>
      <p>Unversiegelte Flächen</p>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(left, "kies", "Kies", "#ffd7aa")}
        ${surface(left, "gruen", "Grünflächen", "#b1d49a")}
        ${surface(left, "wasser", "Wasser", "#5a8ebf")}
      </div>
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Beschattung durch Bäume</div>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(left, "baeume", "Baumkronen", "rgb(0, 128, 0)")}
      </div>
    </div> <!-- .box -->
    <div class="box" style="grid-column: span 2;">
      <div class="card-title">Wie warm war es hier im Vergleich zu den anderen Stationen im Tagesverlauf?</div>
      <div class="muted">Tägliches Erwärmungsmuster – blau = kühler, rot = wärmer (Abweichung vom Mittel)</div>
      ${resize(leftStripes)}
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Maximaltemperatur</div>
      <div class="muted">im Jahresverlauf</div>
      <p><span class="kpi-value">${kpi(left)["maxTemp"]}&#x202f;℃</span></p>
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Anzahl heißer Tage</div>
      <div class="muted">im Jahresverlauf</div>
      <p><span class="kpi-value">${kpi(left)["nHotDays"]}</span></p>
    </div> <!-- .box -->
  </div> <!-- .card -->

  <div class="card weatherstation-card">
    <h2 class="weatherstation-title">${right}</h2>
    <div class="map-wrap">
      ${html.fragment`<img style="object-fit: cover;" src=${arials[right]} alt="Luftbild" title="Quelle: Landesamt für Geoinformation und Landesentwicklung Baden-Württemberg (LGL-BW) (2024) (dl-by-de/2.0 Lizenz)">`}
    </div> <!-- .map-wrap -->
    <div class="box">
      <div class="card-title">Oberflächenbeschaffenheit</div>
      <div class="muted">im Umkreis von 50&#x202f;m um die Station</div>
      <p>Versiegelte Flächen</p>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(right, "gebaeude", "Gebäude", "#b3b3b3")}
        ${surface(right, "asphalt", "Asphalt", "#333333")}
      </div>
      <p>Unversiegelte Flächen</p>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(right, "kies", "Kies", "#ffd7aa")}
        ${surface(right, "gruen", "Grünflächen", "#b1d49a")}
        ${surface(right, "wasser", "Wasser", "#5a8ebf")}
      </div>
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Beschattung durch Bäume</div>
      <div style="display:grid; grid-template-columns:70px 1fr;gap:8px;">
        ${surface(left, "baeume", "Baumkronen", "rgb(0, 128, 0)")}
      </div>
    </div> <!-- .box -->
    <div class="box" style="grid-column: span 2;">
      <div class="card-title">Wie warm war es hier im Vergleich zu den anderen Stationen im Tagesverlauf?</div>
      <div class="muted">Tägliches Erwärmungsmuster – blau = kühler, rot = wärmer (Abweichung vom Mittel)</div>
      ${resize(rightStripes)}
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Maximaltemperatur</div>
      <div class="muted">im Jahresverlauf</div>
      <p><span class="kpi-value">${kpi(right)["maxTemp"]}&#x202f;℃</span></p>
    </div> <!-- .box -->
    <div class="box">
      <div class="card-title">Anzahl heißer Tage</div>
      <div class="muted">im Jahresverlauf</div>
      <p><span class="kpi-value">${kpi(right)["nHotDays"]}</span></p>
    </div> <!-- .box -->
  </div> <!-- .card -->
</div> <!-- .grid -->

Hier zeigt sich, wie stark der Einfluss der Umgebung wirklich ist:
In der Konstanzer Innenstadt sind große Flächen durch Asphalt, Beton oder Bebauung versiegelt. Solche Flächen können kein Regenwasser aufnehmen, welches ansonsten durch Verdunstung die Luft kühlen würde. Außerdem speichern sie lange die Hitze, welche dann nur langsam an die Umgebung wieder abgegeben wird. Das kannst du gut in den Erwärmungsmustern erkennen. Auch die Abwärme von Gebäuden und die erschwerte Luftzirkulation heizen die Luft in den engen Gässchen zusätzlich auf.

Ganz anders sieht es beispielsweise im Stadtgarten aus. Der Boden rund um die Wetterstation ist mit Grünflächen und hellem Kies bedeckt. Dichter Kies ist deutlich durchlässiger als Beton oder Asphalt und speichert insgesamt weniger Wärme. Einige ältere Bäume mit großen Kronen spenden Schatten und verhindern, dass die Sonne direkt auf den Boden scheint. Durch die Lage direkt am Wasser wird die Luft während heißer Nachmittage zusätzlich gekühlt. Zusammen sorgen diese Faktoren dafür, dass es hier merklich kühler ist als an anderen Wetterstationen. Im Sommer 2024 kletterte das Thermometer hier zu keinem Zeitpunkt über 30&#8239;°C.

Im Video sehen wir Tim Tewes, Experte für klimaresiliente Stadtplanung. Er fasst zusammen, welche Faktoren die städtische Hitzeentwicklung im Vergleich zum Umland bestimmen und wie es zu Temperaturunterschieden innerhalb von Städten wie Konstanz kommt:

```js
const yt_consent = Mutable(false);
const yt_accept = () => yt_consent.value = true;
```

```js
layout.card({
  title: 'Never Gonna Give You Up',
  subtitle: 'Rick Astley',
  body: yt_consent ? html.fragment`
    <p><iframe style="width:100%; aspect-ratio: 16/9;" src="https://www.youtube.com/embed/E4WlUXrJgy4"></iframe></p>
    ` : html.fragment`
    <p><strong>Externe Inhalte:</strong> Dieses Video wird über YouTube bereit gestellt. Sie können das Video <a href="https://www.youtube.com/watch?v=E4WlUXrJgy4">dort</a> anschauen oder hier fortfahren. In beiden Fällen wird eine Verbindung zu YouTube aufgebaut und es gelten deren Nutzungsbedingungen und Regelungen zum Datenschutz.</p>
    <center>
    <p><button onclick=${yt_accept}>Ich will externe Inhalte von YouTube laden und das Video hier anschauen !</button></p>
    </center>
  `,
})
```

<!-- Video noch nicht verfügbar ...

## Teil 4: Und jetzt?

Was wir aus unserer Reise durch Konstanz mitnehmen können: Der Klimawandel ist nicht nur eine globale, sondern auch eine lokale Herausforderung. Denn die baulichen Bedingungen unserer Stadt prägen entscheidend, in welchem Ausmaß wir den zunehmenden Klimaveränderungen ausgesetzt sind. Gleichzeitig zeigt sich, dass wir unsere Stadt widerstandsfähiger machen können. Mit gezielten Maßnahmen wie mehr Grünflächen, schattenspendenden Bäumen und kluger Stadtplanung tragen wir aktiv dazu bei, das Mikroklima spürbar zu verbessern.

### Ausblick: Was plant die Stadt Konstanz, um die Stadt klimaresilienter zu gestalten?

Im Video sehen wir Jana Schirrmacher, Klimaanpassungsbeauftragte der Stadt Konstanz. Sie geht auf bereits bestehende Ansätze ein und erläutert, welche Pläne es in puncto Klimawandelanpassung in der Stadtverwaltung gibt:

-->

<div class="card"> 
  <h2> CorrelAid e.V. </h2> 
  <h3>Diese Data Story wurde in einem Data4Good Projekt von CorrelAid erstellt</h3>
  
  CorrelAid ist ein gemeinnütziges Netzwerk von ehrenamtlichen Data Scientists, das Datenkompetenz für das Gemeinwohl einsetzt. Es verbindet NGOs und zivilgesellschaftliche Initiativen mit Datentalenten, realisiert Pro-bono-Projekte und bietet Community-Formate sowie Weiterbildung rund um datengetriebene Arbeit.

  <img src="correlaid_logo.png" width=200px></img>
</div>

</div> <!--Ende class="correlaid-page"-->

---

```js
layout.sponsors()
```