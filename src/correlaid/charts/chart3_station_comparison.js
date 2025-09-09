// charts/chart3_station_comparison.js
import * as Plot from "npm:@observablehq/plot";

// =====================
// Konfiguration
// =====================

const CANOPY_COLOR = "#008000ff";   // Baumkronen-Fortschrittsleiste

// Kategorien (Kies = unversiegelt) – mit deinen Farben
const flaechenKategorien = [
    { key: "gebaeude_%", label: "Gebäude", color: "#b3b3b3ff", group: "versiegelt" },
    { key: "asphalt_%", label: "Asphalt", color: "#333333ff", group: "versiegelt" },
    { key: "kies_%", label: "Kies", color: "#ffd7aaff", group: "unversiegelt" },
    { key: "gruen_%", label: "Grünflächen", color: "#b1d49aff", group: "unversiegelt" },
    { key: "wasser_%", label: "Wasser", color: "#5a8ebfff", group: "unversiegelt" }
];

const canopyKeys = ["baeume_%", "baumkronen_%", "baumkronenflaeche_%"];
const maxTempKeys = ["Hottest_Day"];     // deine Spaltennamen
const hotDaysKeys = ["Hot_Days_Count"];

// =====================
// Öffentliche API
// =====================
/**
 * host           : <div> aus index.md
 * stationMeta    : CSV mit Flächenanteilen & Koordinaten
 * heatmapData    : { name -> [24 Abweichungen] }
 * hotData        : CSV mit KPIs
 * leftSelect     : Inputs.select
 * rightSelect    : Inputs.select
 */
export function createStationComparison({
    host,
    stationMeta,
    heatmapData,
    hotData,
    leftSelect,
    rightSelect,
}) {
    host.style.cssText = "display:grid;grid-template-columns: repeat(auto-fit, minmax(min(425px, 100%), 1fr));grid-column-gap: 10px;";

    const left = buildCard();
    const right = buildCard();

    host.append(left.cardEl, right.cardEl);

    // initial render
    renderSide(left, leftSelect.value, stationMeta, heatmapData, hotData);
    renderSide(right, rightSelect.value, stationMeta, heatmapData, hotData);

    // Interaktion
    leftSelect.addEventListener("input", () => renderSide(left, leftSelect.value, stationMeta, heatmapData, hotData));
    rightSelect.addEventListener("input", () => renderSide(right, rightSelect.value, stationMeta, heatmapData, hotData));
}

// =====================
// Card-Baustein
// =====================
function buildCard() {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.classList.add("weatherstation-card");

    // Titel
    const titleEl = document.createElement("h2");
    titleEl.classList.add("weatherstation-title");

    // Linke Spalte: runde Karte
    const mapWrap = document.createElement("div");
    mapWrap.classList.add("map-wrap");

    // add map image into the mapWrap
    const map = document.createElement("img");
    map.style.objectFit = "cover"; // Ensure the image covers the circle
    mapWrap.appendChild(map);

    // Rechte Spalte: Überschriften ÜBER den Kästen, Kästen weiß + schwarzer Rahmen

    const surfBox = document.createElement("div");
    surfBox.classList.add("box");

    // Überschrift + Box 2: Baumkronen
    const canopyBox = document.createElement("div");
    canopyBox.classList.add("box");

    const canopyHdr = document.createElement("div");
    canopyHdr.textContent = "Beschattung durch Bäume";
    canopyHdr.classList.add("card-title");
    canopyBox.appendChild(canopyHdr);

    const canopyRow = document.createElement("div");
    canopyRow.setAttribute("style", "display:flex;align-items:center;gap:8px;");

    // Farbiges Quadrat
    const canopySwatch = document.createElement("div");
    canopySwatch.setAttribute("style", `width:14px;height:14px;background:${CANOPY_COLOR};
    border:1px solid rgba(0,0,0,.2);border-radius:2px;`);

    const canopyLabel = document.createElement("span");
    canopyLabel.textContent = "Baumkronen";
    canopyLabel.classList.add("card-label");

    const canopyBar = document.createElement("div");
    canopyBar.classList.add("bar-outer");
    //canopyBar.setAttribute("style", "flex:1;height:14px;background:#e5e7eb;border-radius:9999px;position:relative;overflow:hidden;");
    const canopyFill = document.createElement("div");
    //canopyFill.style.cssText = "height:14px;border-radius:9999px;position:absolute;left:0;top:0;width:0%;";
    canopyFill.classList.add("bar-inner");
    canopyFill.style.background = CANOPY_COLOR;
    canopyBar.appendChild(canopyFill);
    // const canopyPct = document.createElement("span");
    // canopyPct.setAttribute("style", "font-size:14px;");
    canopyRow.append(canopyLabel, canopyBar);

    canopyBox.appendChild(canopyRow);

    // --- Heatmap-Block: alles dicht beieinander ---
    const heatBlock = document.createElement("div");
    heatBlock.classList.add("box")
    heatBlock.setAttribute("style", "grid-column: span 2;");

    const heatTitle = document.createElement("div");
    heatTitle.textContent = "Wie warm war es hier im Vergleich zu den anderen Stationen im Tagesverlauf?";
    heatTitle.classList.add("card-title")

    const heatExplain = document.createElement("div");
    heatExplain.textContent = "Tägliches Erwärmungsmuster – blau = kühler, rot = wärmer (Abweichung vom Mittel)";
    heatExplain.classList.add("card-description");

    const heatPlot = document.createElement("div");

    heatBlock.append(heatTitle, heatExplain, heatPlot);

    // KPI-Boxen

    const kpi1 = mkKpiBox("Maximaltemperatur");
    const kpi2 = mkKpiBox("Anzahl heißer Tage");

    // Zusammenbauen
    cardEl.append(
        titleEl,
        mapWrap,
        surfBox,
        canopyBox,
        heatBlock,
        kpi1.wrap,
        kpi2.wrap,
    );

    return {
        cardEl,
        titleEl,
        map,
        surfBox,
        canopyFill,
        heatPlot,
        maxTempEl: kpi1.value,
        hotDaysEl: kpi2.value,
        marker: null,
        circle: null,
        currentStation: null
    };
}

// =====================
// Rendering
// =====================
function renderSide(side, stationName, metaRows, heatmapData, hotRows) {
    if (!stationName) return;
    side.currentStation = stationName;

    const meta = metaRows.find(d => d.name === stationName);
    if (!meta) return;

    // Titel
    side.titleEl.textContent = stationName;


    // TODO pkel: Lizenz für die Luftbilder ist:
    // LGL-BW (2024) Datenlizenz Deutschland - Namensnennung - Version 2.0, www.lgl-bw.de
    side.map.src = "/_file/assets/correlaid/images/" + slug(stationName) + ".png";

    // Steckbrief: Oberflächen
    renderSurfaceBars(side.surfBox, meta);

    // Steckbrief: Baumkronen
    const canopyKey = firstExistingKey(meta, canopyKeys);
    const canopyVal = percent01(+meta[canopyKey]);
    const pct = Math.round(canopyVal * 100);
    side.canopyFill.style.width = `${pct}%`;
    side.canopyFill.setAttribute("title", `${pct}%`);

    side.heatPlot.innerHTML = ""; // Clear previous heatmap
    side.heatPlot.appendChild(Heat(heatmapData[stationName]));

    // KPIs
    const hot = hotRows.find(d => d.name === stationName) || {};
    const maxKey = firstExistingKey(hot, maxTempKeys);
    const hotKey = firstExistingKey(hot, hotDaysKeys);
    const maxVal = hot[maxKey] != null ? +hot[maxKey] : null;
    const daysVal = hot[hotKey] != null ? +hot[hotKey] : null;

    side.maxTempEl.textContent =
        maxVal != null && !Number.isNaN(+maxVal) ? `${Plot.formatNumber('de-DE')((+maxVal).toFixed(1))} °C` : "–";
    side.hotDaysEl.textContent =
        daysVal != null && !Number.isNaN(+daysVal) ? `${Math.round(+daysVal)}` : "–";
}

// =====================
// Zeichner
// =====================
function renderSurfaceBars(containerEl, meta) {
    containerEl.innerHTML = "";

    const groups = [
        { title: "Versiegelte Flächen", items: flaechenKategorien.filter(k => k.group === "versiegelt") },
        { title: "Unversiegelte Flächen", items: flaechenKategorien.filter(k => k.group === "unversiegelt") }
    ];

    // Überschrift + Box 1: Oberflächen
    const surfHdr = document.createElement("div");
    surfHdr.textContent = "Oberflächenbeschaffenheit";
    surfHdr.classList.add("card-title");

    containerEl.appendChild(surfHdr);

    const surfDesc = document.createElement("div");
    surfDesc.textContent = "im Umkreis von 50 m um die Station";
    surfDesc.classList.add("card-description");

    containerEl.appendChild(surfDesc);

    groups.forEach(g => {
        const box = document.createElement("div");
        box.classList.add("box");
        box.setAttribute("style", "margin-bottom:10px;");

        const gTitle = document.createElement("div");
        gTitle.textContent = g.title;
        gTitle.setAttribute("style", "margin:0 0 10px 0;");
        box.appendChild(gTitle);

        const surfaceBox = document.createElement("div")
        surfaceBox.setAttribute("style", "display:grid; grid-template-columns:70px 1fr;gap:8px;");

        g.items.forEach(item => {
            // KEIN Farbfeld mehr vor dem Label
            const lbl = document.createElement("div");
            lbl.textContent = item.label;
            lbl.classList.add("card-label");

            const barOuter = document.createElement("div");
            barOuter.classList.add("bar-outer");
            const barInner = document.createElement("div");
            const val = clamp0_100(+meta[item.key]);

            barInner.classList.add("bar-inner");
            barInner.setAttribute("style", `width:${val}%;background:${item.color};`);
            barInner.setAttribute("title", `${val}%`);
            barOuter.appendChild(barInner);

            // const valTxt = document.createElement("div");
            // valTxt.textContent = `${Math.round(val)}%`;
            // valTxt.setAttribute("style", "text-align:right;");

            surfaceBox.append(lbl, barOuter);
        });
        box.appendChild(surfaceBox);

        containerEl.appendChild(box);
    });
}

/** Heatmap row (24 cells) with hour ticks below */
function Heat(values, {
    height = 100,
    domain = [-1, 0, 1],
    range = ["#2166AC", "#F7F7F7", "#C70039"]
} = {}) {
    const data = values.map((v, i) => ({ hour: i + 1, value: v, row: "r" }));
    const hours = Array.from({ length: 24 }, (_, i) => i + 1);

    return Plot.plot({
        height,
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
// =====================
// Utilities
// =====================
function mkKpiBox(title) {
    const wrap = document.createElement("div");
    wrap.classList.add("box");
    const t = document.createElement("div");
    t.textContent = title;
    // gleich groß & fett wie Heatmap-Frage
    t.classList.add("card-title");
    const v = document.createElement("div");
    v.classList.add("kpi-value");
    wrap.append(t, v);
    return { wrap, value: v };
}

function firstExistingKey(obj, candidates) {
    for (const k of candidates) if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return k;
    return candidates[0];
}
function clamp0_100(v) {
    if (Number.isNaN(v) || v == null) return 0;
    return Math.max(0, Math.min(100, v));
}
function percent01(v) {
    if (Number.isNaN(v) || v == null) return 0;
    return v > 1 ? clamp0_100(v) / 100 : Math.max(0, Math.min(1, v));
}
function slug(s) { return String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"); }
