import * as Plot from "npm:@observablehq/plot"; // ← WICHTIG: Plot importieren

// Diese Datei enthält das Diagramm zur Entwicklung der Jahresdurchschnittstemperatur
// an der DWD Station Konstanz. Es wird verwendet in index.md.

// Das Diagramm zeigt:
// - Temperaturverlauf seit 1973 (oder Startjahr der Daten)
// - Markierung des eigenen Zuzugsjahrs per Regel (ruleX)


export default function drawWeatherTrend(yearly, arrival) {
    return Plot.plot({
        grid: true, // Konsistent mit Dashboards
        inset: 10, // Konsistent mit Dashboards
        x: {
            label: "Jahr",
            labelAnchor: 'center',
            labelArrow: 'none',
            tickFormat: JSON.stringify, // suppress delimiting dots, e.g. 2.024
        },
        y: {
            label: "℃"
        },
        marks: [
            Plot.line(yearly, {
                x: "Jahr",
                y: "Temperatur_Celsius_Mittel_Tagesdurchschnitt",
                stroke: () => 'constant', // trick to use the first color of the theme
            }),
            Plot.ruleX([arrival], {
                stroke: 'var(--theme-foreground-focus)', // use focus color defined by theme
            }),
        ]
    });
}
