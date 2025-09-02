---
theme: [light]
sidebar: true
toc:
  label: 'Kapitel'
---

```js
import * as layout from "./layout.js";
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
const stationen = FileAttachment("stationen.geo.json").json()
const tagesverlauf = FileAttachment('./tagesverlauf.csv').csv({typed: true})
```

<!-- UI-Inputs chart2 -->
```js
// UI-Elemente vorbereiten
const stationsnamen = stationen.features.map(f => f.properties.name);

// Radiobuttons für Stationen
const station_input = Inputs.radio(stationsnamen, {value: stationsnamen[7]});
station_input.style.display = "none"; // Radio-Buttons ausblenden
// durch Mutable wird station_input.value automatisch reaktiv
//const station_input = Mutable(stationsnamen[7]);

const station = view(station_input);

// Uhrzeit-Slider
const stunde = Inputs.range([0, 23], {step: 1});
const stunde_view = view(stunde)
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

```js
const map_legend = createMapLegend();
```

```js
// ausgelagert in charts/chart2_sensor_map.js
// Liniendiagramm erzeugen - wird im Markdown verwendet
const sensor_plt = createReactiveSensorChart(tagesverlauf, station_input, stunde);
```


<!-- Layout Dia 2 (2 Charts)-->
<div class="grid grid-cols-2 gap-4">

<!-- Zeigen der Karte-->
<div class="card">
  <div class="header">
    <div class="title">
      <h2>Messstationen</h2>
      <h3>Temperatur an Konstanzer Wetterstationen im Vergleich zum Durchschnitt um ${stunde_view}:00 Uhr</h3>
    </div>
  </div>

  <div class="body">
    ${map_div}
    <br>
    ${map_legend}  
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
    ${view(sensor_plt)}
    <br/>
    ${view(stunde)}
    Uhrzeit: ${stunde_view}:00 
  </div>

</div> <!-- card -->

</div> <!-- Grid mit 2 Spalten Ende -->

<!--Layout kommt zuerst (HTML/Markdown darüber), Inhalt kommt danach (befüllen der Karte und Interaktivität hier drunter.-->

```js
// Die Karte wurde oben bereits ins HTML / DOM eingebettet. Hier wird sie befüllt.
// ausgelagert in charts/chart2_sensor_map.js
const map = createSensorMap(map_div, stationen, station_input);
```

```js display=false
// This block is re-evaluated whenever the input 'station' changes.
// ausgelagert in charts/chart2_sensor_map.js
updateSensorMap(map, stationen, station, station_input, tagesverlauf, stunde.value);
```

```js
// Immer wenn der Stunden-Slider bewegt wird, neu zeichnen
stunde.addEventListener("input", () => {
  updateSensorMap(
    map,
    stationen,
    station_input.value,
    station_input,
    tagesverlauf,
    stunde.value
  );
});
```

Die Grafik zeigt eindrücklich, dass tatsächlich nicht alle Orte innerhalb der Stadt gleichermaßen von der Hitze betroffen sind. Gegen 12:00 Uhr sind es beispielsweise mehr als 5°C, die die beiden kühlsten Orte (Herosé Park und Fähre Staad) vom heißesten Ort (Riedstraße) unterscheiden.  

 Hitzespitzen wie die in der Riedstraße – hier wurden 31,3°C gemessen – bleiben nicht ohne Folgen: für das persönliche Wohlbefinden von allen, aber insbesondere für die Gesundheit älterer Menschen, Kinder und Menschen ohne Zugang zu kühlen Rückzugsorten. Tagsüber steigt die Gefahr von Dehydrierung und Hitzestress, während die Nächte kaum Möglichkeit zur Erholung lassen. Auch für viele Pflanzen und Tiere sind die erhöhten Temperaturen ein Stressfaktor.

Mit gezielten Maßnahmen zur Klimawandelanpassung kann der übermäßigen Erhitzung einzelner Gebiete vorgebeugt werden. Dafür ist es wichtig zu verstehen, welche Faktoren sogenannte Hitzeinseln in der Stadt verstärken oder abschwächen. Schauen wir uns dafür die Stationen genauer an!


## Teil 3: Warum ist es an Orten unterschiedlich heiß – obwohl sie nur wenige Straßen voneinander entfernt sind?

Die nächste Grafik zeigt dir neben den Temperaturdaten nun auch die Umgebung der Messstationen im Radius von 50&nbsp;m. Um herauszufinden, was hinter den Temperaturdifferenzen steckt, kannst du sie jetzt selbst vergleichen: Gibt es dort viele Gebäude? Asphaltierte Flächen? Oder überwiegend Bäume und Wiesen? Und was bedeutet das für die Erwärmung der Luft rund um die Station?

```js
// Flächendaten (Koordinaten + %-Anteile)
const stationMeta_dia3 = FileAttachment("./data/konstanz_flaechenanalyse.csv").csv({ typed: true });

// Heatmap-Rohdaten (24h-Abweichungen)
const heatmapRaw_dia3 = FileAttachment("./data/dia3_stationen_heatmap.csv").csv({ typed: true });

// Klima-Daten (Max-Temp, heiße Tage)
const hotData_dia3 = FileAttachment("./data/hot_data.csv").csv({ typed: true });

// Auswertungstext zu den Stationen
// const stationTexts = FileAttachment("./data/station_texts.json").json();

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
```

```js
//Dropdown-Werte extrahieren
const stations_dia3 = stationMeta_dia3.map(d => d.name)
```

```js
// UI: Überschrift + zwei Dropdowns nebeneinander
const leftSelect  = Inputs.select(stations_dia3,  { label: "Station A", value: "Stadtgarten" });
const rightSelect = Inputs.select(stations_dia3,  { label: "Station B", value: "Friedrichstrasse" });
```

<strong>Welche zwei Stationen willst du vergleichen?</strong>
${leftSelect} ${rightSelect}

```js
// Hier hinein rendert das JS-Modul die zwei Karten/Karten + KPIs
const host_dia3 = document.createElement("div");
```


<div class="card"> 
  <h2>Wie beeinflusst der Ort das lokale Klima?</h2> 
  <h3>Vergleich zweier Wetterstationen</h3>

  In der folgenden Grafik kannst du zwei Stationen auswählen – und direkt vergleichen, wie sich ihre Umgebung zusammensetzt und wie stark sie sich erhitzen.

  ${host_dia3}

</div>

```js
// Modul importieren und Diagramm befüllen (nach der Card)
import { createStationComparison } from "./charts/chart3_station_comparison.js";

createStationComparison({
  host: host_dia3,
  stationMeta: stationMeta_dia3,
  heatmapData: heatmapData_dia3,
  hotData: hotData_dia3,
  leftSelect,
  rightSelect 
});

```


Hier zeigt sich, wie stark der Einfluss der Umgebung wirklich ist:
In der Konstanzer Innenstadt sind große Flächen durch Asphalt, Beton oder Bebauung versiegelt. Solche Flächen können kein Regenwasser aufnehmen, welches ansonsten durch Verdunstung die Luft kühlen würde. Außerdem speichern sie lange die Hitze, welche dann nur langsam an die Umgebung wieder abgegeben wird. Das kannst du gut in den Erwärmungsmustern erkennen. Auch die Abwärme von Gebäuden und die erschwerte Luftzirkulation heizen die Luft in den engen Gässchen zusätzlich auf.

Ganz anders sieht es beispielsweise im Stadtgarten aus. Der Boden rund um die Wetterstation ist mit Grünflächen und hellem Kies bedeckt. Dichter Kies ist deutlich durchlässiger als Beton oder Asphalt und speichert insgesamt weniger Wärme. Einige ältere Bäume mit großen Kronen spenden Schatten und verhindern, dass die Sonne direkt auf den Boden scheint. Durch die Lage direkt am Wasser wird die Luft während heißer Nachmittage zusätzlich gekühlt. Zusammen sorgen diese Faktoren dafür, dass es hier merklich kühler ist als an anderen Wetterstationen. Im Sommer 2024 kletterte das Thermometer hier zu keinem Zeitpunkt über 30 °C.

Im Video sehen wir Tim Tewes, Experte für klimaresiliente Stadtplanung. Er fasst zusammen, welche Faktoren die städtische Hitzeentwicklung im Vergleich zum Umland bestimmen und wie es zu Temperaturunterschieden innerhalb von Städten wie Konstanz kommt:

<!-- TODO hier muss noch ein Button rein, sodass Youtube nur nach Consent aufgerufen wird. -->
```js
const video_tim_card = layout.card({
  title: 'Video',
  subtitle: 'Subtitle',
  body: html.fragment`
    <iframe style="width:100%; aspect-ratio: 16/9;" src="https://www.youtube.com/embed/E4WlUXrJgy4"></iframe>
  `,
  info: html.fragment`
    <p><strong>TODO:</strong> hier kommt eure Beschreibung zum Video rein. Diese wird im Screen-Reader oder Lesemodus statt dem Video angezeigt.</p>
  `
});
```

<div class="grid grid-cols-2">
${ video_tim_card }
</div> <!-- grid -->


## Teil 4: Und jetzt?

Was wir aus unserer Reise durch Konstanz mitnehmen können: Der Klimawandel ist nicht nur eine globale, sondern auch eine lokale Herausforderung. Denn die baulichen Bedingungen unserer Stadt prägen entscheidend, in welchem Ausmaß wir den zunehmenden Klimaveränderungen ausgesetzt sind. Gleichzeitig zeigt sich, dass wir unsere Stadt widerstandsfähiger machen können. Mit gezielten Maßnahmen wie mehr Grünflächen, schattenspendenden Bäumen und kluger Stadtplanung tragen wir aktiv dazu bei, das Mikroklima spürbar zu verbessern.

### Ausblick: Was plant die Stadt Konstanz, um die Stadt klimaresilienter zu gestalten?

Im Video sehen wir Jana Schirrmacher, Klimaanpassungsbeauftragte der Stadt Konstanz. Sie geht auf bereits bestehende Ansätze ein und erläutert, welche Pläne es in puncto Klimawandelanpassung in der Stadtverwaltung gibt:

<!-- TODO hier muss noch ein Button rein, sodass Youtube nur nach Consent aufgerufen wird. -->
```js
const video_jana_card = layout.card({
  title: 'Video',
  subtitle: 'Subtitle',
  body: html.fragment`
    <iframe style="width:100%; aspect-ratio: 16/9;" src="https://www.youtube.com/embed/E4WlUXrJgy4"></iframe>
  `,
  info: html.fragment`
    <p><strong>TODO:</strong> hier kommt eure Beschreibung zum Video rein. Diese wird im Screen-Reader oder Lesemodus statt dem Video angezeigt.</p>
  `
});
```

<div class="grid grid-cols-2">
${ video_jana_card }
</div> <!-- grid -->

<div class="card"> 
  <h2> CorrelAid e.V. </h2> 
  <h3>Diese Data Story wurde in einem Data4Good Projekt von CorrelAid erstellt</h3>
  
  CorrelAid ist ein gemeinnütziges Netzwerk von ehrenamtlichen Data Scientists, das Datenkompetenz für das Gemeinwohl einsetzt. Es verbindet NGOs und zivilgesellschaftliche Initiativen mit Datentalenten, realisiert Pro-bono-Projekte und bietet Community-Formate sowie Weiterbildung rund um datengetriebene Arbeit.

  <img src="/assets/correlaid/images/correlaid_logo.png" width=200px></img>
</div>

</div> <!--Ende class="correlaid-page"-->