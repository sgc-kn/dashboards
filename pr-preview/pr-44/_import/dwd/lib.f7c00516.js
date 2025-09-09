import * as Plot from "../../_npm/@observablehq/plot@0.6.17/d761ef9b.js";

const labels = {
  'Temperatur_Celsius_Mittel_Tagesdurchschnitt': "Jahresmittel aus Tagesdurchschnitt",
  'Temperatur_Celsius_Mittel_Tagesminimum': "Jahresmittel aus Tagesminimum",
  'Temperatur_Celsius_Mittel_Tagesmaximum': "Jahresmittel aus Tagesmaximum",
  "Eistage_Anzahl": "Eistage (Maximum unter 0°C)",
  "Frosttage_Anzahl": "Frosttage (Minimum unter 0°C)",
  "Heisse_Tage_Anzahl": "Heiße Tage (Maximum über 30°C)",
  "Sommertage_Anzahl": "Sommertage (Maximum über 25°C)",
  "Tropennaechte_Anzahl": "Tropennächte (Minimum über 20°C)",
};

function label(variable) {
  return labels[variable]
};

function long_table(wide_table, variables) {
  return wide_table.flatMap(row =>
    variables.map(variable => ({
      year: row['Jahr'],
      variable,
      value: row[variable]
  })))
};

function plot_multiple(points, ma30y, width, variables) {
  return Plot.plot({
    width,
    grid: true,
    inset: 10,
    x: {
      label: 'Jahr',
      labelAnchor: 'center',
      labelArrow: 'none',
      tickFormat: JSON.stringify, // suppress delimiting dots, e.g. 2.024
    },
    y: {
      label: '°C',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    color: {
      domain: variables,
      legend: true,
      tickFormat: label,
    },
    marks: [
      Plot.frame(),
      Plot.dot(long_table(points, variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
      Plot.line(long_table(ma30y, variables), {
        x: "year",
        y: "value",
        stroke: "variable",
      }),
    ]
  })
};

function plot_single(points, ma30y, width, variable) {
  return Plot.plot({
    width,
    grid: true,
    inset: 10,
    x: {
      label: 'Jahr',
      labelAnchor: 'center',
      labelArrow: 'none',
      tickFormat: JSON.stringify, // suppress delimiting dots, e.g. 2.024
    },
    y: {
      label: '°C',
      labelArrow: 'none',
      tickFormat: Plot.formatNumber("de-DE"),
    },
    marks: [
      Plot.frame(),
      Plot.dot(points, {
        x: "Jahr",
        y: variable,
        stroke: () => "", // use first color of palette
      }),
      Plot.line(ma30y, {
        x: "Jahr",
        y: variable,
        stroke: () => "", // use first color of palette
      }),
    ]
  })
};

export function plot(points, ma30y, width, variables) {
  if (Array.isArray(variables)) {
    return plot_multiple(points, ma30y, width, variables)
  } else {
    return plot_single(points, ma30y, width, variables)
  }
};
