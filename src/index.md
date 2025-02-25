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

## Februar 2024

Wir haben ein Dashboard mit Klimaprojektionen für Konstanz
veröffentlicht. Die Daten stammen vom europäischen Klimawandeldienst
Copernicus und basieren auf zwei Szenarien für den künftigen
Treibhausgasausstoß:

  - **RCP 4.5**: Die Emissionen werden deutlich reduziert.
  - **RCP 8.5**: Die Emissionen steigen ungebremst weiter.

[➜ Hier geht's zum Dashboard !](cds/index.html)

```js
import { plot as cds_plot } from "./cds/lib.js";

const cds_data = FileAttachment("cds/cds/Zeitscheiben_30Jahre.csv").csv({typed: true});
```

<div class="card">
  <h2>Heiße Tage</h2>
  <h3>über 30℃, Anzahl pro Jahr</h3>
${resize((width) => cds_plot(cds_data, width, "Heisse_Tage_Anzahl"))}
</div> <!-- card -->


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
import { plot as dwd_plot } from "./dwd/lib.js";

const dwd_points = FileAttachment("dwd/dwd/Jahreswerte.csv").csv({typed: true})
const dwd_ma30y = FileAttachment("dwd/dwd/Jahreswerte_30Jahre_gleitender_Durchschnitt.csv").csv({typed: true})

const klindex_warm_variables = [
  'Sommertage_Anzahl',
  'Heisse_Tage_Anzahl',
];
```

<div class="card">
  <h2>Klimakenntage</h2>
  <h3>Anzahl Tage pro Jahr mit 30-jährigem gleitendem Durchschnitt</h3>
${resize((width) => dwd_plot(dwd_points, dwd_ma30y, width, klindex_warm_variables))}
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
