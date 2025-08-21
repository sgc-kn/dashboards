import * as Plot from "npm:@observablehq/plot"; // ← WICHTIG: Plot importieren
import * as d3 from "npm:d3";
import { Generators } from "npm:@observablehq/stdlib";

// Diese Datei enthält das Diagramm zur Entwicklung der Jahresdurchschnittstemperatur
// an der DWD Station Konstanz. Es wird verwendet in index.md.

// Das Diagramm zeigt:
// - Temperaturverlauf seit 1973 (oder Startjahr der Daten)
// - Markierung des eigenen Zuzugsjahrs per Regel (ruleX)


export function computeYears(yearly) {
    const years = yearly.map(row => row.Jahr);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const allYears = [];
    for (let y = minYear; y <= maxYear; y++) allYears.push(y.toString());
    return { minYear, maxYear, allYears };
}


// Erstellung des Diagramms
export function drawWeatherTrendD3(yearly, arrival, width = 600) {
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };

    // Container
    const div = document.createElement("div");

    const tooltip = d3.select(div)
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "4px 8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-size", "15px")
        .style("visibility", "hidden");



    const svg = d3.select(div)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Skalen
    const x = d3.scaleLinear()
        .domain(d3.extent(yearly, d => d.Jahr))
        .range([margin.left, width - margin.right]);

    const min = Math.floor(d3.min(yearly, d => d.Temperatur_Celsius_Mittel_Tagesdurchschnitt));
    const max = Math.ceil(d3.max(yearly, d => d.Temperatur_Celsius_Mittel_Tagesdurchschnitt));

    const y = d3.scaleLinear()
        .domain([min - 1, max + 1])
        .range([height - margin.bottom, margin.top]);

    //const y = d3.scaleLinear()
    //    .domain(d3.extent(yearly, d => d.Temperatur_Celsius_Mittel_Tagesdurchschnitt))
    //    .nice()
    //    .range([height - margin.bottom, margin.top]);

    //const y = d3.scaleLinear()
    //    .domain([8, 14]) // → 20 - 6 = 14°C Spannweite
    //    .range([height - margin.bottom, margin.top]);


    // Achsen
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .call(g => g.selectAll("text").style("font-size", "14px"));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks((max - min) + 1).tickFormat(d3.format("d")))
        .call(g => g.selectAll("text").style("font-size", "14px"));

    // Label für X-Achse
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 5) // etwas unterhalb der x-Achse
        .style("font-size", "16px")
        .text("Jahr");

    // Label für Y-Achse
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -height / 2)
        .attr("y", 15) // etwas links von der y-Achse
        .style("font-size", "16px")
        .text("Temperatur [°C]");

    // Linie Temperatur
    const line = d3.line()
        .x(d => x(d.Jahr))
        .y(d => y(d.Temperatur_Celsius_Mittel_Tagesdurchschnitt));

    svg.append("path")
        .datum(yearly)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    const circles = svg.selectAll("circle")
        .data(yearly)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Jahr))
        .attr("cy", d => y(d.Temperatur_Celsius_Mittel_Tagesdurchschnitt))
        .attr("r", 4)
        .attr("fill", "steelblue");

    // Interaktive Fläche über das Diagramm
    svg.append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", function (event) {
            const [mx] = d3.pointer(event);
            const yearHovered = x.invert(mx);

            // Finde den nächstgelegenen Datenpunkt
            const nearest = yearly.reduce((a, b) =>
                Math.abs(b.Jahr - yearHovered) < Math.abs(a.Jahr - yearHovered) ? b : a
            );

            // Abstand in Pixeln zur Mausposition berechnen
            const dist = Math.abs(x(nearest.Jahr) - mx);
            if (dist < 20) {
                // Tooltip anzeigen
                tooltip
                    .style("visibility", "visible")
                    .html(`<strong>Jahr:</strong> ${nearest.Jahr}<br/><strong>⌀ Temp:</strong> ${nearest.Temperatur_Celsius_Mittel_Tagesdurchschnitt.toFixed(1)} °C`)
                    .style("top", `${y(nearest.Temperatur_Celsius_Mittel_Tagesdurchschnitt) - 30}px`)
                    .style("left", `${x(nearest.Jahr) + 10}px`);

                // Punktefarbe zurücksetzen
                circles.attr("fill", "steelblue");

                // Nur den einen Punkt hervorheben
                circles
                    .filter(d => d === nearest)
                    .attr("fill", "red");
            } else {
                // Wenn zu weit entfernt: zurücksetzen
                tooltip.style("visibility", "hidden");
                circles.attr("fill", "steelblue");
            }
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
            circles.attr("fill", "steelblue");
        });


    // Trendlinie berechnen
    const minYear = d3.min(yearly, d => d.Jahr);
    const maxYear = d3.max(yearly, d => d.Jahr);
    const start = yearly.find(d => d.Jahr === minYear);
    const end = yearly.find(d => d.Jahr === maxYear);

    // Regressionsgerade über alle Jahre
    const regression = linearRegression(yearly);

    if (typeof arrival === "number" && !isNaN(arrival)) {
        // Startpunkt (arrival)
        const startX = arrival;
        const startY = regression.predict(startX);

        // Ende
        const endX = maxYear;
        const endY = regression.predict(endX);

        // Vertikale gestrichelte Linie
        svg.append("line")
            .attr("x1", x(startX))
            .attr("y1", y.range()[0]) // von unten
            .attr("x2", x(startX))
            .attr("y2", y.range()[1]) // bis oben
            .attr("stroke", "red")
            .attr("stroke-dasharray", "4,2")
            .attr("stroke-width", 1.5);

        // Linie vorbereiten
        const trendLine = svg.append("line")
            .attr("x1", x(startX))
            .attr("y1", y(startY))
            .attr("x2", x(startX))
            .attr("y2", y(startY))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrow)");

        // Marker (Pfeilspitze)
        svg.append("defs").append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .attr("fill", "red");


        // Animation
        trendLine.transition()
            .duration(2000)
            .attr("x2", x(endX))
            .attr("y2", y(endY));

        // Anmerkung
        // const delta = (endY - startY).toFixed(1);
        // svg.append("text")
        //     .attr("x", x(endX) - 170)
        //     .attr("y", y(endY) - 55)
        //     .attr("fill", "red")
        //     .attr("font-size", "20px")
        //     .text(`Anstieg um: ${delta} °C`);
    }
    return div;



}

// Helfer: einfache lineare Regression
function linearRegression(data) {
    const n = data.length;
    const sumX = d3.sum(data, d => d.Jahr);
    const sumY = d3.sum(data, d => d.Temperatur_Celsius_Mittel_Tagesdurchschnitt);
    const sumXY = d3.sum(data, d => d.Jahr * d.Temperatur_Celsius_Mittel_Tagesdurchschnitt);
    const sumX2 = d3.sum(data, d => d.Jahr * d.Jahr);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope,
        intercept,
        predict(x) {
            return slope * x + intercept;
        }
    };
}

export function createWeatherTrendContainer(yearly, arrivalInput) {
    const container = document.createElement("div");
    container.style.position = "relative";

    let chartDiv = document.createElement("div");
    container.appendChild(chartDiv);

    function renderChart(width) {
        const arrival = parseInt(arrivalInput.value);
        const chart = drawWeatherTrendD3(yearly, arrival, width);
        chartDiv.replaceChildren(chart);
    }

    // ResizeObserver für reaktives Verhalten
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const width = entry.contentRect.width;
            renderChart(width);
        }
    });

    observer.observe(container);

    // Ankunftsjahr beobachten
    arrivalInput.addEventListener("change", () => {
        const width = container.offsetWidth;
        renderChart(width);
    });

    return container;
}




