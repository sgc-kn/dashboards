import * as d3 from "npm:d3";
import * as L from "npm:leaflet";
import { html } from "htl";



// Icons, Farben, Reihenfolge
const kategorien = [
    { key: "gebaeude_%", label: "Gebäude", color: "#a0a0a0", section: "versiegelt" },
    { key: "kies_%", label: "Kies", color: "#c0c0c0", section: "versiegelt" },
    { key: "asphalt_%", label: "Asphalt", color: "#888888", section: "versiegelt" },
    { key: null, label: "", color: "transparent", section: "spacer" },
    { key: "baeume_%", label: "Bäume", color: "#4caf50", section: "gruen" },
    { key: "gruen_%", label: "Grünflächen", color: "#81c784", section: "gruen" },
    { key: "wasser_%", label: "Wasser", color: "#42a5f5", section: "gruen" },
];

// Hauptfunktion zum Exportieren
export function createStationComparisonUI({ stationMeta, heatmapData, stations, defaults = {} }) {
    const container = html`<div class="grid grid-cols-3 gap-6 items-start w-full"></div>`;

    const left = createStationCard("Station A", stations, stationMeta, heatmapData, defaults.left);
    const right = createStationCard("Station B", stations, stationMeta, heatmapData, defaults.right);
    const middle = createBarchart(stationMeta);

    // Auswahl-Logik
    left.select.addEventListener("input", () => {
        if (left.select.value === right.select.value) return;
        updateStationUI(left, left.select.value, middle, 0, heatmapData);
    });
    right.select.addEventListener("input", () => {
        if (left.select.value === right.select.value) return;
        updateStationUI(right, right.select.value, middle, 1, heatmapData);
    });

    // Initialauswahl setzen
    if (defaults.left) {
        left.select.value = defaults.left;
        updateStationUI(left, defaults.left, middle, 0, heatmapData);
    }
    if (defaults.right) {
        right.select.value = defaults.right;
        updateStationUI(right, defaults.right, middle, 1, heatmapData);
    }

    container.appendChild(left.card);
    container.appendChild(middle.container);
    container.appendChild(right.card);

    return container;
}


// ==============================

function createStationCard(title, stations, meta, heatmapData) {
    const card = html`<div class="card flex flex-col" style="gap: 1.5rem; text-align: center;"></div>`;
    const label = html`<strong>${title}</strong>`;
    const select = html`<select class="text-lg p-2 rounded border">
    <option hidden selected>Bitte auswählen</option>
    ${stations.map(s => html`<option>${s}</option>`)}
  </select>`;
    const mapDiv = html`<div style="
                                width: 200px; 
                                height: 200px; 
                                border-radius: 50%; 
                                overflow: hidden; 
                                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                                margin-left: auto;
                                margin-right: auto;
                        "></div>`;
    const heat = d3.create("svg")
        .attr("width", 200)
        .attr("height", 30)
        .attr("style", "display: block; margin: 0 auto;")
        .node();

    const info = html`<div class="text-sm" style="text-align: left;">Bitte Station wählen</div>`;

    // Karte
    const map = L.map(mapDiv, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Fix für falsche Darstellung
    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    let marker = null;

    card.append(label, mapDiv, heat, select, info);

    return { card, select, map, marker, heatSVG: heat, infoBox: info };
}

function updateStationUI(side, stationName, barChart, chartIndex, heatmapData) {
    const station = stationName;
    const meta = barChart.meta.find(d => d.name === station);
    if (!meta) return;

    // Text
    side.infoBox.textContent = `Text zu ${station}`;

    // Karte
    const { lat, lon } = meta;
    side.map.setView([lat, lon], 17);
    if (side.marker) side.map.removeLayer(side.marker);
    side.marker = L.marker([lat, lon]).addTo(side.map);

    // Heatmap
    renderHeatmap(side.heatSVG, heatmapData[station]);

    // Balkenwerte aktualisieren
    const { xScale } = barChart;

    barChart.bars.each(function (d, i) {
        const value = meta[d.key] || 0;
        barChart.data[i][chartIndex] = value;
        d3.select(this)
            .selectAll("rect")
            .data(barChart.data[i])
            .join("rect")
            .attr("x", (d, j) => j * 210)
            .attr("y", 0)
            .attr("height", 20)
            .attr("width", d => xScale(d))
            .attr("fill", (d, j) => j === 0 ? "#3b82f6" : "#fb923c");
    });

    barChart.values
        .text((_, i) => {
            const [valA, valB] = barChart.data[i];
            return `${valA.toFixed(0)}% / ${valB.toFixed(0)}%`;
        })
        .attr("x", (_, i) => {
            const [valA, valB] = barChart.data[i];
            const bar1End = barChart.xScale(valA);
            const bar2End = barChart.xScale(valB);
            const offset = 20;
            return 100 + Math.max(bar1End, bar2End) + offset; // rechts von beiden Balken
        });
}

function createBarchart(meta) {
    const svg = d3.create("svg")
        .attr("width", 420)
        .attr("height", 260);

    const container = html`<div class="card p-4">${svg.node()}</div>`;

    const data = kategorien.map(k => [0, 0]);

    const maxWidth = 160;
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, maxWidth]);

    const group = svg.selectAll("g")
        .data(kategorien)
        .join("g")
        .attr("transform", (d, i) => `translate(0, ${i * 30 + 10})`);

    // Kategorie-Labels
    group.append("text")
        .text(d => d.label)
        .attr("x", 0)
        .attr("y", 14)
        .attr("font-size", "13px");

    // Balken
    const bars = group.append("g")
        .attr("transform", "translate(100,0)")
        .selectAll("rect")
        .data(d => [0, 0])
        .join("rect")
        .attr("height", 20)
        .attr("width", 0)
        .attr("fill", (d, i) => i === 0 ? "#3b82f6" : "#fb923c")
        .attr("x", (d, i) => i * (maxWidth + 20)); // Abstand zw. Balken

    // Werte-Anzeige (ein Text pro Kategorie)
    const values = group.append("text")
        .attr("x", 0) // wird dynamisch gesetzt
        .attr("y", 14)
        .attr("font-size", "12px")
        .text("");

    return { container, bars: group, values, data, meta, xScale };
}




function renderHeatmap(svgNode, values) {
    if (!values || values.length !== 24) return;

    const svg = d3.select(svgNode);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const cellWidth = width / 24;

    const color = d3.scaleLinear()
        .domain([-0.6, 0, 0.9])
        .range(["#2166AC", "#F7F7F7", "#C70039"]);

    svg.selectAll("rect")
        .data(values)
        .join("rect")
        .attr("x", (_, i) => i * cellWidth)
        .attr("y", 0)
        .attr("width", cellWidth)
        .attr("height", height)
        .attr("fill", d => color(d));
}
