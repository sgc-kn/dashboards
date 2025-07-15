---
theme: dashboard
toc: true
---

```js
import * as layout from "./layout.js";
```

```js
const map_div = document.createElement('div');
const position_card = layout.card({
    title : 'Messstation Konstanz',
    subtitle : 'Ecke Zasiusstraße und Wallgutstraße',
    body : map_div,
})
```

```js
map_div.style = "flex-grow:1";

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

const points_to_fit = [ [47.65671712249894, 9.179873031082293], [ 47.6962128027911, 9.139355745114335], [47.66589663744094, 9.221408794229172] ]

const pos = [47.6643739 , 9.1680143]

L.circleMarker(pos, {radius: 5, color: 'var(--theme-blue)'})
.addTo(map)
.openTooltip()

points_to_fit.push(pos)

const mapResizeObserver = new ResizeObserver(() => {
  map.invalidateSize();
  map.fitBounds(points_to_fit, {padding: [11, 11]});
});
mapResizeObserver.observe(map_div);
```

```js
const zip_data = FileAttachment("lubw.zip");

const dataset_card = layout.card({
    title : "Datengrundlage",
    subtitle: html.fragment`<a href='https://www.lubw.baden-wuerttemberg.de/en/luft/messwerte-immissionswerte?id=DEBW052#diagramm>'>lubw.baden-wuerttemberg.de</a>`,
    download: zip_data.href,
    body : html.fragment`
    <p>Die Landesanstalt für Umwelt Baden-Württemberg (LUBW) betreibt ein landesweites Messnetz zur Überwachung der Luftqualität.</p>

    <p>Dieses Dashboard basiert auf historischen Aufzeichnungen der Messtation Konstanz. Die Daten werden seit 2008 aufgezeichnet.</p>

    <p>Die Messstation Konstanz befindet sich im Stadtgebiet: im Paradies an der Ecke Zasiusstraße und Wallgutstraße, direkt beim Ellenrieder Gymnasium.</p>
    `,
})
```

```js
const o3 = {
        name: "o3",
        label: "Ozon (O₃)",
        unit: "µg/m³",
    };

const no2 = {
        name: "no2",
        label: "Stickstoffdioxid (NO₂)",
        unit: "µg/m³",
    };

const pm25 = {
        name: "pm25",
        label: "Feinstaub mit 2,5 µm Durchmesser (PM 2.5)",
        unit: "µg/m³",
    };

const pm10 = {
        name: "pm10",
        label: "Feinstaub mit 10 µm Durchmesser (PM 10)",
        unit: "µg/m³",
    };
```

```js
const recent_data = FileAttachment("lubw/Auszug_Stundenwerte.csv").csv({typed: true})
const monthly_data = FileAttachment("lubw/Monatliche_Statistik.csv").csv({typed: true})
const yearly_data = FileAttachment("lubw/Jährliche_Statistik.csv").csv({typed: true})
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
        title : "Stündliche Aufzeichnung",
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

function monthly_card(variable, { thresholds = [], info, align_values = [] } = {}){
    const var_name = variable.name + "_mean"
    return layout.card({
        title : "Langfristige Entwicklung",
        subtitle: `Monatsmittelwerte seit Beginn der Aufzeichnung`,
        body : layout.plot({
                x: {
                    label: 'Monat',
                },
                y: {
                    domain: range(monthly_data, var_name, [0, ...(thresholds.map(x => x[0])), ...align_values]),
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(monthly_data, {
                        x: "start",
                        y: var_name,
                        stroke: () => "Messwert", // use first color of palette
                        marker: "circle",
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    }),
                    // mouseover
                    Plot.dot(monthly_data, Plot.pointerX({
                        x: "start",
                        y: var_name,
                        stroke: "var(--theme-foreground-focus)",
                        fill: "var(--theme-foreground-focus)",
                    })),
                    Plot.tip(monthly_data, Plot.pointerX({
                        x: "start",
                        y: var_name,
                        format: {
                            x: x => x.toLocaleString('de-DE', {year: 'numeric', month: 'long'}),
                            y: Plot.formatNumber("de-DE"),
                        }
                    })),
                ]
            }),
        info,
    })
}

function yearly_card(variable, { thresholds = [], info, align_values = [] } = {}){
    const var_name = variable.name + "_mean";
    return layout.card({
        title : "Langfristige Entwicklung",
        subtitle: `Jahresmittelwerte seit Beginn der Aufzeichnung`,
        body : layout.plot({
                x: {
                    label: 'Jahr',
                },
                y: {
                    domain: range(yearly_data, var_name, [0, ...(thresholds.map(x => x[0])), ...align_values]),
                    label: variable.unit,
                    tickFormat: Plot.formatNumber("de-DE"),
                },
                color: {
                    label: "",
                    domain: ["Messwert"].concat(thresholds.map((x) => x[1])),
                    legend: true,
                },
                marks: [
                    Plot.line(yearly_data, {
                        x: "start",
                        y: var_name,
                        stroke: () => "Messwert", // use first color of palette
                        marker: "circle",
                    }),
                    Plot.ruleY(thresholds, {
                        y : x => x[0],
                        stroke: x => x[1],
                    }),
                    // mouseover
                    Plot.dot(yearly_data, Plot.pointerX({
                        x: "start",
                        y: var_name,
                        stroke: "var(--theme-foreground-focus)",
                        fill: "var(--theme-foreground-focus)",
                    })),
                    Plot.tip(yearly_data, Plot.pointerX({
                        x: "start",
                        y: var_name,
                        format: {
                            x: x => x.toLocaleString('de-DE', {year: 'numeric'}),
                            y: Plot.formatNumber("de-DE"),
                        }
                    })),
                ]
            }),
        info,
    })
}
```

```js
const o3_info_card = layout.card({
    title: 'Informationen',
    subtitle: 'zur Ozon-Messung der LUBW',
    body: html.fragment`
    <p><strong>Ozon (O<sub>3</sub>)</strong> ist ein chemisch reaktives Gas. In der Stratosphäre schützt die Ozonschicht oberhalb von 20 km Höhe vor schädlicher Ultraviolettstrahlung der Sonne. Bodennah kommt Ozon ebenfalls natürlich vor, mit einer durchschnittlichen Hintergrundkonzentration von etwa 50 µg/m³.</p>

    <p><strong>Quellen:</strong> Bodennahes Ozon entsteht größtenteils durch photochemische Reaktionen von Vorläufersubstanzen wie Stickstoffdioxid und flüchtigen organischen Verbindungen (VOC) bei intensiver Sonneneinstrahlung. Ein kleiner Teil stammt aus dem vertikalen Transport aus der Stratosphäre. Ozon wird nicht direkt emittiert, sondern bildet sich in der Atmosphäre.</p>

    <p><strong>Wirkungen auf Mensch und Umwelt:</strong> Erhöhte Ozonkonzentrationen wirken reizend auf die Atemwege und können entzündliche Prozesse im Lungengewebe fördern, insbesondere bei tiefer Inhalation (z.B. beim Sport). Die Empfindlichkeit gegenüber Ozon ist individuell unterschiedlich. Zudem kann Ozon in Bodennähe das Pflanzenwachstum beeinträchtigen.</p>

    <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/relevante-luftschadstoffe">Weiterführende Informationen finden Sie auf den Seiten der LUBW.</a></p>
`
});

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
const o3_monthly_card = monthly_card(o3, {});
```

```js
const o3_yearly_card = yearly_card(o3, {
    align_values: range(monthly_data, 'o3_mean'),
});
```

```js
const no2_info_card = layout.card({
    title: 'Informationen',
    subtitle: 'zur Stickstoffdioxid-Messung der LUBW',
    body: html.fragment`
    <p><strong>Stickstoffdioxid (NO<sub>2</sub>)</strong> entsteht bei Verbrennungsprozessen unter hohen Temperaturen. Bedeutende Emissionsquellen sind der Kraftfahrzeugverkehr und die Verbrennung fossiler Brennstoffe. Zu den natürlichen Quellen zählen Blitze in Gewitterwolken. In der Atmosphäre wird das überwiegend freigesetzte Stickstoffmonoxid vergleichsweise schnell in Stickstoffdioxid umgewandelt. Die Umwandlungszeit hängt von der Tages- und Jahreszeit sowie von der Ozonkonzentration ab. Tagsüber und im Sommer erfolgt die Umwandlung rasch, nachts und im Winter wesentlich langsamer.</p>

    <p><strong>Wirkungen auf Mensch und Umwelt:</strong> Stickstoffoxide wirken reizend auf die Schleimhäute sowie die Atemwege des Menschen und können Pflanzen schädigen. Auch eine Zunahme von Herz-Kreislauferkrankungen kann beobachtet werden. Stickstoffdioxid ist zusammen mit den flüchtigen organischen Verbindungen (VOC) eine der Vorläufersubstanzen für die Bildung von bodennahem Ozon.</p>

    <p>Stickstoffoxide tragen durch die langfristige Umwandlung in Nitrat und nachfolgende Deposition zur Überdüngung der Böden in empfindlichen Ökosystemen und Gewässern bei. Über die Umwandlung zu Salpetersäure leisten sie einen Beitrag zur Versauerung.</p>

    <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/relevante-luftschadstoffe">Weiterführende Informationen finden Sie auf den Seiten der LUBW.</a></p>
`
});
```

```js
const no2_recent_card = recent_card(no2, {
    thresholds: [ [200, "Grenzwert"], [400, "Alarmschwelle"] ],
    info: html.fragment`
        <p>Beurteilungswerte nach dem Bundes-Immissionsschutzgesetz:</p>
        <p><strong>Grenzwert</strong> bei 200 µg/m³: Ein Wert, der aufgrund wissenschaftlicher Erkenntnisse mit dem Ziel festgelegt wurde, schädliche Auswirkungen auf die menschliche Gesundheit zu vermeiden, zu verhüten oder zu verringern.</p>
        <p><strong>Alarmschwelle</strong> bei 400 µg/m³: Bei Überschreitung besteht selbst bei kurzfristiger Exposition ein Risiko für die Gesundheit der Gesamtbevölkerung. Es müssen unverzüglich Maßnahmen ergriffen werden.</p>
        <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen">Weiterführende Informationen zu den Beurteilungswerten finden Sie auf den Seiten der LUBW.</a></p>
    `
});
```

```js
const no2_monthly_card = monthly_card(no2, {
    align_values: [...range(yearly_data, 'no2_mean'), 40],
});
```

```js
const no2_yearly_card = yearly_card(no2, {
    thresholds: [ [40, "Grenzwert"] ],
    info: html.fragment`
        <p>Beurteilungswerte nach dem Bundes-Immissionsschutzgesetz:</p>
        <p><strong>Grenzwert</strong> bei 40 µg/m³: Ein Wert, der aufgrund wissenschaftlicher Erkenntnisse mit dem Ziel festgelegt wurde, schädliche Auswirkungen auf die menschliche Gesundheit zu vermeiden, zu verhüten oder zu verringern.</p>
        <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen">Weiterführende Informationen zu den Beurteilungswerten finden Sie auf den Seiten der LUBW.</a></p>
    `,
    align_values: range(monthly_data, 'no2_mean'),
});
```

```js
const pm10_info_card = layout.card({
    title: 'Informationen',
    subtitle: 'zur Feinstaub-Messung der LUBW',
    body: html.fragment`
    <p><strong>Feinstaub (Particulate Matter, PM)</strong> bezeichnet luftgetragene feste oder flüssige Teilchen, die nicht unmittelbar zu Boden sinken, sondern mehrere Tage in der Atmosphäre verweilen und über große Distanzen transportiert werden können. Die Größe und Zusammensetzung der Partikel bestimmen ihre chemischen, physikalischen Eigenschaften und ihre Wirkung auf Mensch und Umwelt.</p>

    <p>Auf diesem Dashboard werden speziell die Werte für <strong>PM10</strong> angezeigt. PM10 bezeichnet inhalierbare Partikel mit einem Durchmesser von ≤ 10 µm, die gesundheitlich relevant sind.</p>

    <p><strong>Quellen:</strong> Es gibt primäre und sekundäre Partikel. Primäre Partikel werden direkt in die Umwelt emittiert und können natürlichen Ursprungs (z. B. durch Bodenerosion) oder durch menschliches Handeln (z. B. Verkehr und Feuerungsanlagen) freigesetzt werden. Sekundäre Partikel entstehen erst in der Atmosphäre durch chemische Reaktionen aus gasförmigen Vorläufersubstanzen wie Schwefeldioxid, Stickstoffoxiden oder Ammoniak.</p>

    <p><strong>Wirkungen auf Mensch und Umwelt:</strong> Feinstaub Partikel sind gesundheitsgefährdend. Sie können tief in den Organismus eindringen und Beschwerden des Atemtraktes sowie des Herz-Kreislaufsystems verursachen.</p>

    <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/relevante-luftschadstoffe">Weiterführende Informationen finden Sie auf den Seiten der LUBW.</a></p>
`
});
```

```js
const pm10_recent_card = recent_card(pm10, {});
```

```js
const pm10_monthly_card = monthly_card(pm10, {});
```

```js
const pm10_yearly_card = yearly_card(pm10, {
    thresholds : [ [40, "Grenzwert"]],
    info: html.fragment`
        <p>Beurteilungswerte nach dem Bundes-Immissionsschutzgesetz:</p>
        <p><strong>Grenzwert</strong> bei 40 µg/m³: Ein Wert, der aufgrund wissenschaftlicher Erkenntnisse mit dem Ziel festgelegt wurde, schädliche Auswirkungen auf die menschliche Gesundheit zu vermeiden, zu verhüten oder zu verringern.</p>
        <p><a href="https://www.lubw.baden-wuerttemberg.de/en/luft/grenzwerte/rechtlichegrundlagen">Weiterführende Informationen zu den Beurteilungswerten finden Sie auf den Seiten der LUBW.</a></p>
    `,
    align_values: range(monthly_data, 'pm10_mean')
});
```

${ layout.title('Luftqualitätsmessungen', 'der Landesanstalt für Umwelt Baden-Württemberg') }

<div class="grid grid-cols-4">
    ${ position_card }
    ${ dataset_card }
</div>

## Ozon

<div class="grid grid-cols-2">
    ${ o3_info_card }
    ${ o3_recent_card }
    ${ o3_monthly_card }
    ${ o3_yearly_card }
</div>

## Stickstoffdioxid

<div class="grid grid-cols-2">
    ${ no2_info_card }
    ${ no2_recent_card }
    ${ no2_monthly_card }
    ${ no2_yearly_card }
</div>

## Feinstaub

<div class="grid grid-cols-2">
    ${ pm10_info_card }
    ${ pm10_recent_card }
    ${ pm10_monthly_card }
    ${ pm10_yearly_card }
</div>

---

```js
layout.sponsors()
```
