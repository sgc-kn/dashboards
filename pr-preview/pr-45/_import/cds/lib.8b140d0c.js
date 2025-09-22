import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";

export function plot(data, width, variable) {
  const marks = [
      Plot.frame(),
      Plot.lineY(data.filter(d => d['Statistik'] == 'Durchschnitt'), {
        x: "Jahr",
        y: variable,
        stroke: "Modell",
      }),
    ];

  return Plot.plot({
    width,
    grid: true,
    inset: 10,
    x: {
      label: 'Jahr',
      labelAnchor: 'center',
      labelArrow: 'none',
      tickFormat: JSON.stringify, // surpress delimiting dots, e.g. 2.024
    },
    y: {
      label: null,
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      legend: true,
    },
    marks
  })
};
