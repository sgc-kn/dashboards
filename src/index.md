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

## September 2025

[CorrelAid e.V.](https://correlaid.org/) hat für Smart Green City eine Datenstory zum Thema Stadtklima entwickelt.
Das Team zeigt, wie Daten lebendig werden können:
Die Datengeschichte lädt dazu ein, das Stadtklima in Konstanz interaktiv zu erkunden und neue Perspektiven auf die Zusammenhänge von Daten und Klima zu gewinnen.

[➜ Hier geht's zur Story !](correlaid/index.html)


## Juli 2025

Wir haben ein Dashboard zur Luftqualität in Konstanz veröffentlicht.
Die Daten stammen aus dem Messnetz der Landesanstalt für
Umwelt Baden-Württemberg (LUBW).


[➜ Hier geht's zum Dashboard !](lubw/index.html)

```js
import * as layout from "./lubw/layout.js";

const recent_data = FileAttachment("lubw/lubw/Auszug_Stundenwerte.csv").csv({typed: true})
```

```js
const recent_times = recent_data.map(row => row['startZeit'])
const recent_start =  new Date(Math.min(...recent_times))
const recent_range = `die Woche ab Montag, dem ${recent_start.toLocaleDateString('de-DE', {year: 'numeric', month: 'long', day: 'numeric'})}`

// TODO move to global utils.js
function range(data, column, extraValues = []){
    var min = Math.min(...data.map(row => +row[column]), ...extraValues);
    var max = Math.max(...data.map(row => +row[column]), ...extraValues);
    return [min, max]
};

function recent_card(variable, { thresholds = [], info, align_values = [] } = {}) {
    const var_name = variable.name;
    return layout.card({
        title : "Stündliche Aufzeichnung " + variable.title,
        subtitle: `Datenauszug für ${recent_range}`,
        body : layout.plot({
                x: {
                    label: 'Zeit',
                },
                y: {
                    domain: range(recent_data, var_name, [0, ...(thresholds.map(x => x[0])), ...align_values]),
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(recent_data, {
                        x: "startZeit", // TODO fix time zone offset in GUI
                        y: var_name,
                        stroke: () => "Messwert", // use first color of palette
                        marker: "circle",
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    }),
                    // mouseover
                    Plot.dot(recent_data, Plot.pointerX({
                        x: "startZeit",
                        y: var_name,
                        stroke: "var(--theme-foreground-focus)",
                        fill: "var(--theme-foreground-focus)",
                    })),
                    Plot.tip(recent_data, Plot.pointerX({
                        x: "startZeit",
                        y: var_name,
                        format: {
                            x: x => x.toLocaleString('de-DE'),
                            y: Plot.formatNumber("de-DE"),
                        }
                    })),
                ]
            }),
        info,
    })
}

const o3 = {
        name: "o3",
        title: "Ozon",
        short: html`O<sub>3</sub>`,
        unit: "µg/m³",
    };
```

```js
const o3_recent_card = recent_card(o3, {
    thresholds: [ [180, "Informationsschwelle"], [240, "Alarmschwelle"] ],
    info: html.fragment`
        <p>Beurteilungswerte nach dem Bundes-Immissionsschutzgesetz:</p>
        <p><strong>Informationsschwelle</strong> bei 180 µg/m³: Bei Überschreitung besteht bereits bei kurzfristiger Exposition ein Risiko für die Gesundheit insbesondere empfindlicher Bevölkerungsgruppen. Es müssen unverzüglich Informationen bereitgestellt werden.</p>
        <p><strong>Alarmschwelle</strong> bei 240 µg/m³: Bei Überschreitung besteht selbst bei kurzfristiger Exposition ein Risiko für die Gesundheit der Gesamtbevölkerung. Es müssen unverzüglich Maßnahmen ergriffen werden.</p>
        <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen">Weiterführende Informationen zu den Beurteilungswerten finden Sie auf den Seiten der LUBW.</a></p>
    `
})
```

```js
o3_recent_card
```

## Februar 2025

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
