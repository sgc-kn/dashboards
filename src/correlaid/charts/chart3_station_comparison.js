// charts/chart3_station_comparison.js
import * as d3 from "npm:d3";
import * as L from "npm:leaflet";
import { html } from "htl";

// =====================
// Konfiguration
// =====================
const MAP_RADIUS_M = 50;            // 50 m Kreis
const MAP_DIAMETER = 350;           // Kreisgröße auf der Karte (px)
const MAP_ZOOM = 18;
const HEAT_H = 40;            // Höhe inkl. Zahlen
const HEAT_MIN_W = 320;           // Sicherheitsminimum Heatmap-Breite

const KPI_COLOR = "#8B0000";     // dunkelrot für KPI-Werte
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
 * stationTexts   : optionales Objekt { "Stationsname": "Text ..." }
 */
export function createStationComparison({
    host,
    stationMeta,
    heatmapData,
    hotData,
    leftSelect,
    rightSelect,
    stationTexts = {}
}) {
    // Grid mit kleinem Spaltenabstand
    host.style.display = "grid";
    host.style.gridTemplateColumns = "minmax(0,1fr) minmax(0,1fr)";
    host.style.columnGap = "8px";
    host.style.alignItems = "start";

    const left = buildCard();
    const right = buildCard();

    host.append(left.cardEl, right.cardEl);

    // initial render
    renderSide(left, leftSelect.value, stationMeta, heatmapData, hotData, stationTexts);
    renderSide(right, rightSelect.value, stationMeta, heatmapData, hotData, stationTexts);

    // Interaktion
    leftSelect.addEventListener("input", () => renderSide(left, leftSelect.value, stationMeta, heatmapData, hotData, stationTexts));
    rightSelect.addEventListener("input", () => renderSide(right, rightSelect.value, stationMeta, heatmapData, hotData, stationTexts));

    // Re-Layout bei Resize (volle Breite Heatmap)
    const onResize = () => {
        renderHeatFullWidth(left);
        renderHeatFullWidth(right);
    };
    window.addEventListener("resize", onResize);
}

// =====================
// Card-Baustein
// =====================
function buildCard() {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.setAttribute("style", [
        "padding:16px",
        "display:flex",
        "flex-direction:column",
        "gap:12px",
        "width:100%",
        "box-sizing:border-box"
    ].join(";"));

    // Titel
    const titleEl = document.createElement("h2");
    titleEl.setAttribute("style", "text-align:center;font-size:28px;font-weight:800;color:#111;margin:4px 0 2px 0;");

    // Top-Zeile: Karte (links) + Steckbriefe (rechts)
    const topRow = document.createElement("div");
    topRow.setAttribute("style", `display:grid;grid-template-columns:${MAP_DIAMETER}px 1fr;column-gap:10px;align-items:start;`);

    // Linke Spalte: runde Karte
    const mapWrap = document.createElement("div");
    mapWrap.setAttribute("style", [
        `width:${MAP_DIAMETER}px`,
        `height:${MAP_DIAMETER}px`,
        "border-radius:50%",
        "overflow:hidden",
        "margin:0 auto",
        "box-shadow:0 4px 8px rgba(0,0,0,.2)"
    ].join(";"));

    const map = L.map(mapWrap, {
        zoomControl: false, attributionControl: false, dragging: false,
        doubleClickZoom: false, scrollWheelZoom: false, boxZoom: false, keyboard: false
    });
    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri" }
    ).addTo(map);
    setTimeout(() => map.invalidateSize(), 0);

    // Rechte Spalte: Überschriften ÜBER den Kästen, Kästen weiß + schwarzer Rahmen
    const rightCol = document.createElement("div");
    rightCol.setAttribute("style", "display:flex;flex-direction:column;gap:8px;");

    // Überschrift + Box 1: Oberflächen
    const surfHdr = document.createElement("div");
    surfHdr.textContent = "Oberflächenbeschaffenheit im Umkreis von 50 m";
    surfHdr.setAttribute("style", "font-size:14px;font-weight:800;margin:0 0 2px 0;");

    const surfBox = document.createElement("div");
    surfBox.setAttribute("style", "background:#fff;border:2px solid #000;border-radius:6px;padding:10px;");
    const barsHost = document.createElement("div");
    barsHost.setAttribute("style", "display:grid;grid-auto-rows:min-content;row-gap:8px;");
    surfBox.appendChild(barsHost);

    // Überschrift + Box 2: Baumkronen
    const canopyHdr = document.createElement("div");
    canopyHdr.textContent = "Beschattungsanteil durch Baumkronen im Sommer";
    canopyHdr.setAttribute("style", "font-size:14px;font-weight:800;margin:0 0 2px 0;");

    const canopyBox = document.createElement("div");
    canopyBox.setAttribute("style", "background:#fff;border:2px solid #000;border-radius:6px;padding:10px;");

    const canopyRow = document.createElement("div");
    canopyRow.setAttribute("style", "display:flex;align-items:center;gap:8px;");

    // Farbiges Quadrat
    const canopySwatch = document.createElement("div");
    canopySwatch.setAttribute("style", `width:14px;height:14px;background:${CANOPY_COLOR};
    border:1px solid rgba(0,0,0,.2);border-radius:2px;`);

    const canopyLabel = document.createElement("span");
    canopyLabel.textContent = "Baumkronenfläche";
    canopyLabel.setAttribute("style", "font-size:14px;");
    const canopyBar = document.createElement("div");
    canopyBar.setAttribute("style", "flex:1;height:14px;background:#e5e7eb;border-radius:9999px;position:relative;overflow:hidden;");
    const canopyFill = document.createElement("div");
    canopyFill.style.cssText = "height:14px;border-radius:9999px;position:absolute;left:0;top:0;width:0%;";
    canopyFill.style.background = CANOPY_COLOR;
    canopyBar.appendChild(canopyFill);
    const canopyPct = document.createElement("span");
    canopyPct.setAttribute("style", "font-size:14px;font-weight:700;");
    canopyRow.append(canopyLabel, canopyBar, canopyPct);
    //canopyRow.append(canopySwatch, canopyLabel, canopyBar, canopyPct);

    canopyBox.appendChild(canopyRow);


    rightCol.append(surfHdr, surfBox, canopyHdr, canopyBox);
    topRow.append(mapWrap, rightCol);

    // --- Heatmap-Block: alles dicht beieinander ---
    const heatBlock = document.createElement("div");
    heatBlock.style.cssText = "display:flex;flex-direction:column;gap:2px;";

    const heatTitle = document.createElement("div");
    heatTitle.textContent = "Wie warm war es hier im Vergleich zu den anderen Stationen im Tagesverlauf?";
    heatTitle.style.cssText = "font-size:16px;font-weight:800;color:#111;margin:0;";

    const heatExplain = document.createElement("div");
    heatExplain.textContent = "Tägliches Erwärmungsmuster – blau = kühler, rot = wärmer (Abweichung vom Mittel)";
    heatExplain.style.cssText = "font-size:12px;color:#6b7280;margin:0;";

    const heatSvg = d3.create("svg").attr("height", HEAT_H).node();

    const heatBottom = document.createElement("div");
    heatBottom.textContent = "Uhrzeit [Stunden]";
    heatBottom.style.cssText = "text-align:center;font-size:12px;font-weight:800;margin-top:2px;";

    heatBlock.append(heatTitle, heatExplain, heatSvg, heatBottom);

    // KPI-Boxen
    const kpiWrap = document.createElement("div");
    kpiWrap.setAttribute("style", "display:grid;grid-template-columns:1fr 1fr;column-gap:10px;");

    const kpi1 = mkKpiBox("Maximaltemperatur (2024)");
    const kpi2 = mkKpiBox("Anzahl heißer Tage (2024)");
    kpiWrap.append(kpi1.wrap, kpi2.wrap);

    // Textbox unten (schwarzer Rahmen, weißer Hintergrund)
    const textBox = document.createElement("div");
    textBox.setAttribute("style", "background:#fff;border:2px solid #000;border-radius:6px;padding:10px;");
    const textEl = document.createElement("div");
    textEl.setAttribute("style", "font-size:14px;color:#111;");
    textBox.appendChild(textEl);

    // Zusammenbauen
    cardEl.append(
        titleEl,
        topRow,
        heatBlock,
        kpiWrap,
        textBox
    );

    return {
        cardEl,
        titleEl,
        map,
        barsHost,
        canopyFill,
        canopyPct,
        heatSvg,
        maxTempEl: kpi1.value,
        hotDaysEl: kpi2.value,
        textEl,
        marker: null,
        circle: null,
        currentStation: null
    };
}

// =====================
// Rendering
// =====================
function renderSide(side, stationName, metaRows, heatmapData, hotRows, stationTexts) {
    if (!stationName) return;
    side.currentStation = stationName;

    const meta = metaRows.find(d => d.name === stationName);
    if (!meta) return;

    // Titel
    side.titleEl.textContent = stationName;

    // Karte
    const { lat, lon } = meta;
    side.map.setView([+lat, +lon], MAP_ZOOM);
    if (side.marker) side.map.removeLayer(side.marker);
    if (side.circle) side.map.removeLayer(side.circle);
    side.marker = L.marker([+lat, +lon]).addTo(side.map);
    side.circle = L.circle([+lat, +lon], {
        radius: MAP_RADIUS_M, color: "#3388ff", weight: 4, fill: false
    }).addTo(side.map);

    // Steckbrief: Oberflächen
    renderSurfaceBars(side.barsHost, meta);

    // Steckbrief: Baumkronen
    const canopyKey = firstExistingKey(meta, canopyKeys);
    const canopyVal = percent01(+meta[canopyKey]);
    const pct = Math.round(canopyVal * 100);
    side.canopyFill.style.width = `${pct}%`;
    side.canopyPct.textContent = `${pct} %`;

    // Heatmap volle Breite
    side.heatSvg.dataset.values = JSON.stringify(heatmapData[stationName] || []);
    renderHeatFullWidth(side);

    // KPIs
    const hot = hotRows.find(d => d.name === stationName) || {};
    const maxKey = firstExistingKey(hot, maxTempKeys);
    const hotKey = firstExistingKey(hot, hotDaysKeys);
    const maxVal = hot[maxKey] != null ? +hot[maxKey] : null;
    const daysVal = hot[hotKey] != null ? +hot[hotKey] : null;

    side.maxTempEl.textContent =
        maxVal != null && !Number.isNaN(+maxVal) ? `${(+maxVal).toFixed(1)} °C` : "–";
    side.hotDaysEl.textContent =
        daysVal != null && !Number.isNaN(+daysVal) ? `${Math.round(+daysVal)}` : "–";

    // Text aus Datei (falls vorhanden), sonst Fallback
    const t = stationTexts && (stationTexts[stationName] || stationTexts[slug(stationName)]);
    side.textEl.textContent = t ? String(t) : makeAutoText(meta, daysVal);
}

// Heatmap neu zeichnen (volle Card-Breite)
function renderHeatFullWidth(side) {
    const values = JSON.parse(side.heatSvg.dataset.values || "[]");
    if (!values || values.length !== 24) return;

    // verfügbare Breite ~ Cardbreite minus Padding
    const box = side.cardEl.getBoundingClientRect();
    const width = Math.max(HEAT_MIN_W, Math.floor(box.width - 32)); // padding grob abziehen

    side.heatSvg.setAttribute("width", width.toString());
    renderHeat(side.heatSvg, values);
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

    groups.forEach(g => {
        const box = document.createElement("div");
        box.setAttribute("style", "border:1px solid #e5e7eb;border-radius:6px;padding:8px;margin:0;");
        const gTitle = document.createElement("div");
        gTitle.textContent = g.title;
        gTitle.setAttribute("style", "font-size:13px;font-weight:700;margin-bottom:6px;");
        box.appendChild(gTitle);

        g.items.forEach(item => {
            const row = document.createElement("div");
            row.setAttribute("style", "display:flex;align-items:center;gap:8px;margin-bottom:6px;");

            // KEIN Farbfeld mehr vor dem Label
            const lbl = document.createElement("div");
            lbl.textContent = item.label;
            lbl.setAttribute("style", "font-size:13px;flex:1;");

            const barOuter = document.createElement("div");
            barOuter.setAttribute("style", "height:12px;width:180px;background:#eee;border-radius:9999px;overflow:hidden;");
            const barInner = document.createElement("div");
            const val = clamp0_100(+meta[item.key]);
            barInner.setAttribute("style", `height:12px;width:${val}%;background:${item.color};border-radius:9999px;`);
            barOuter.appendChild(barInner);

            const valTxt = document.createElement("div");
            valTxt.textContent = `${Math.round(val)}%`;
            valTxt.setAttribute("style", "font-size:12px;width:30px;text-align:right;");

            row.append(lbl, barOuter, valTxt);
            box.appendChild(row);
        });

        containerEl.appendChild(box);
    });
}

function renderHeat(svgNode, values) {
    const width = +svgNode.getAttribute("width");
    const height = +svgNode.getAttribute("height") || HEAT_H;
    const plotH = height - 14; // Platz für Zahlen
    const cellW = width / 24;

    const color = d3.scaleLinear()
        .domain([-0.6, 0, 0.9])
        .range(["#2166AC", "#F7F7F7", "#C70039"]);

    const svg = d3.select(svgNode);
    svg.selectAll("*").remove();

    // Zellen
    svg.append("g")
        .selectAll("rect")
        .data(values)
        .join("rect")
        .attr("x", (_, i) => i * cellW)
        .attr("y", 0)
        .attr("width", cellW)
        .attr("height", plotH)
        .attr("fill", d => color(d));

    // Stunden 1..24
    svg.append("g")
        .selectAll("text")
        .data(values)
        .join("text")
        .attr("x", (_, i) => i * cellW + cellW / 2)
        .attr("y", height - 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text((_, i) => i + 1);
}

// =====================
// Utilities
// =====================
function mkKpiBox(title) {
    const wrap = document.createElement("div");
    wrap.setAttribute("style", "border:1px solid #ddd;border-radius:6px;padding:10px;text-align:center;background:#fff;");
    const t = document.createElement("div");
    t.textContent = title;
    // gleich groß & fett wie Heatmap-Frage
    t.setAttribute("style", "font-size:16px;font-weight:800;margin-bottom:6px;");
    const v = document.createElement("div");
    v.setAttribute("style", `font-size:22px;font-weight:800;color:${KPI_COLOR};user-select:none;`);
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
function makeAutoText(meta, hotDays) {
    // versiegelt = Gebäude + Asphalt (Kies unversiegelt)
    const sealed = ["gebaeude_%", "asphalt_%"].map(k => +meta[k] || 0).reduce((a, b) => a + b, 0);
    const canopy = Math.round(clamp0_100(+meta[firstExistingKey(meta, canopyKeys)] || 0));
    const parts = [];
    parts.push(`Im 50-m-Umkreis sind etwa ${Math.round(clamp0_100(sealed))} % der Fläche versiegelt.`);
    parts.push(`Baumkronenanteil ca. ${canopy} %.`);
    if (hotDays != null) parts.push(`2024 wurden hier ungefähr ${Math.round(+hotDays)} heiße Tage gezählt.`);
    return parts.join(" ");
}
