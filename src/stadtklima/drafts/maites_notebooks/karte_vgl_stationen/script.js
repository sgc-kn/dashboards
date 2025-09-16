const map = L.map('map').setView([47.66, 9.18], 13);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, etc.',
  maxZoom: 20
}).addTo(map);

const locations = [
  { name: "Döbele", lat: 47.65823856, lon: 9.16889836 },
  { name: "Europapark", lat: 47.66721463, lon: 9.16282324 },
  { name: "Fähre Staad", lat: 47.68211852, lon: 9.20933772 },
  { name: "Friedrichstrasse", lat: 47.67557538, lon: 9.18375494 },
  { name: "Herose-Park", lat: 47.66905485, lon: 9.17457428 },
  { name: "Hörnle", lat: 47.66702444, lon: 9.21448949 },
  { name: "Mainaustrasse", lat: 47.67050958, lon: 9.1877523 },
  { name: "Marktstätte", lat: 47.6604731, lon: 9.17723865 },
  { name: "Riedstrasse", lat: 47.6819759, lon: 9.14705786 },
  { name: "Stadtgarten", lat: 47.66241869, lon: 9.17889136 },
  { name: "Stephansplatz", lat: 47.66186644, lon: 9.17386062 },
  { name: "Bodanplatz", lat: 47.666969, lon: 9.173416 },
  { name: "DWD", lat: 47.6952, lon: 9.1307 }
];

let allData = [];
let avgByHour = [];
let maxByHour = [];
let minByHour = [];
let currentHour = 0;
let selectedStation = null;
let circles = [];

d3.csv("finalerdf_ws").then(data => {
  allData = data.filter(d => d.date === "2024-07-31").map(d => {
    return {
      ...d,
      temperature: +d.temperature,
      hour: +d.hour,
      datetime: new Date(d.datetime)
    };
  });

  avgByHour = d3.groups(allData, d => d.hour).map(([hour, values]) => ({
    hour: +hour,
    avg: d3.mean(values, d => d.temperature),
    datetime: values[0].datetime
  }));

  maxByHour = d3.groups(allData, d => d.hour).map(([hour, values]) => ({
    hour: +hour,
    max: d3.max(values, d => d.temperature),
    datetime: values[0].datetime
  }));

  minByHour = d3.groups(allData, d => d.hour).map(([hour, values]) => ({
    hour: +hour,
    min: d3.min(values, d => d.temperature),
    datetime: values[0].datetime
  }));

  drawInitialChart();
  updateMap(currentHour);

  document.getElementById("time-slider").addEventListener("input", e => {
    currentHour = +e.target.value;
    document.getElementById("slider-value").textContent = currentHour;
    updateVerticalLine(currentHour);
    updateMap(currentHour);
  });
});

function drawInitialChart() {
  const traceAvg = {
    x: avgByHour.map(d => d.datetime),
    y: avgByHour.map(d => d.avg),
    mode: "lines",
    line: { color: "black" },
    name: "Durchschnitt",
    showlegend: false
  };

  const traceMax = {
    x: maxByHour.map(d => d.datetime),
    y: maxByHour.map(d => d.max),
    mode: "lines",
    line: { color: "lightgrey" },
    opacity: 0.4,
    name: "Maximal",
    showlegend: false
  };

  const traceMin = {
    x: minByHour.map(d => d.datetime),
    y: minByHour.map(d => d.min),
    mode: "lines",
    line: { color: "lightgrey" },
    opacity: 0.4,
    name: "Minimal",
    showlegend: false
  };

  const fillArea = {
    x: [...maxByHour.map(d => d.datetime), ...minByHour.map(d => d.datetime).reverse()],
    y: [...maxByHour.map(d => d.max), ...minByHour.map(d => d.min).reverse()],
    fill: 'toself',
    type: 'scatter',
    mode: 'none',
    fillcolor: 'rgba(211, 211, 211, 0.4)',
    line: { color: 'transparent' },
    showlegend: false
  };

  const layout = {
    margin: { t: 40, b: 40, l: 40, r: 20 },
    yaxis: {
      title: "Temperatur (°C)",
      titlefont: { size: 8 },
      tickfont: { size: 8 }
    },
    xaxis: {
      title: "Stunde",
      tickvals: avgByHour.map(d => d.datetime),
      ticktext: avgByHour.map(d => d.hour.toFixed(0)),
      titlefont: { size: 8 },
      tickfont: { size: 8 }
    },
    title: {
      text: "Temperaturverlauf am 31. Juli 2024",
      font: { size: 14 }
    },
    shapes: [{
      type: 'line',
      x0: avgByHour[currentHour].datetime,
      x1: avgByHour[currentHour].datetime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: 'black', width: 0.5, dash: 'dot' }
    }]
  };

  const config = {
    staticPlot: true
  };

  Plotly.newPlot("plotly-chart", [traceAvg, traceMax, traceMin, fillArea], layout, config);
}

function updateVerticalLine(hour) {
  const update = {
    shapes: [{
      type: 'line',
      x0: avgByHour[hour].datetime,
      x1: avgByHour[hour].datetime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: 'black', width: 0.5, dash: 'dot' }
    }]
  };
  Plotly.relayout("plotly-chart", update);
}

function updateMap(hour) {
  circles.forEach(c => map.removeLayer(c));
  circles = [];

  const avgTemp = avgByHour.find(d => d.hour === hour)?.avg;
  const hourData = allData.filter(d => d.hour === hour);

  hourData.forEach(d => {
    const loc = locations.find(l => l.name === d.name);
    if (!loc) return;

    const deviation = d.temperature - avgTemp;
    const colorScale = d3.scaleLinear()
      .domain([-4, 0, 4])
      .range(["blue", "white", "red"]);

    const radius = Math.max(100, Math.abs(deviation) * 100);

    const circle = L.circle([loc.lat, loc.lon], {
      radius: radius,
      fillColor: colorScale(deviation),
      fillOpacity: 0.8,
      stroke: false
    }).addTo(map).bindPopup(`${d.name}<br>${d.temperature.toFixed(1)}°C`);

    circle.on("click", () => {
      selectedStation = d.name;
      updateChart();
    });

    circles.push(circle);
  });
}

function updateChart() {
  const traceAvg = {
    x: avgByHour.map(d => d.datetime),
    y: avgByHour.map(d => d.avg),
    mode: "lines",
    line: { color: "black" },
    name: "Durchschnitt",
    showlegend: false
  };

  const traceMax = {
    x: maxByHour.map(d => d.datetime),
    y: maxByHour.map(d => d.max),
    mode: "lines",
    line: { color: "lightgrey" },
    opacity: 0.4,
    name: "Maximal",
    showlegend: false
  };

  const traceMin = {
    x: minByHour.map(d => d.datetime),
    y: minByHour.map(d => d.min),
    mode: "lines",
    line: { color: "lightgrey" },
    opacity: 0.4,
    name: "Minimal",
    showlegend: false
  };

  const fillArea = {
    x: [...maxByHour.map(d => d.datetime), ...minByHour.map(d => d.datetime).reverse()],
    y: [...maxByHour.map(d => d.max), ...minByHour.map(d => d.min).reverse()],
    fill: 'toself',
    type: 'scatter',
    mode: 'none',
    fillcolor: 'rgba(211, 211, 211, 0.4)',
    line: { color: 'transparent' },
    showlegend: false
  };

  const layout = {
    margin: { t: 40, b: 40, l: 40, r: 20 },
    yaxis: {
      title: "Temperatur (°C)",
      titlefont: { size: 8 },
      tickfont: { size: 8 }
    },
    xaxis: {
      title: "Stunde",
      tickvals: avgByHour.map(d => d.datetime),
      ticktext: avgByHour.map(d => d.hour.toFixed(0)),
      titlefont: { size: 8 },
      tickfont: { size: 8 }
    },
    title: {
      text: selectedStation
        ? `Station: ${selectedStation} – Temperaturverlauf am 31. Juli 2024`
        : "Temperaturverlauf am 31. Juli 2024",
      font: { size: 14 }
    },
    shapes: [{
      type: 'line',
      x0: avgByHour[currentHour].datetime,
      x1: avgByHour[currentHour].datetime,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: 'black', width: 0.5, dash: 'dot' }
    }]
  };

  const traces = [traceAvg, traceMax, traceMin, fillArea];

  if (selectedStation) {
    const stationData = allData
      .filter(d => d.name === selectedStation)
      .sort((a, b) => a.hour - b.hour);

    traces.push({
      x: stationData.map(d => d.datetime),
      y: stationData.map(d => d.temperature),
      mode: "lines",
      line: { color: "orange" },
      name: selectedStation,
      showlegend: false
    });
  }

  Plotly.react("plotly-chart", traces, layout);
}
