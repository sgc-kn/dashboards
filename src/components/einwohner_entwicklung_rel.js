import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";

export function relativ_plot(einwohner_csv, stt_id, compare_id, width) {

  // filter two selected stadtteile
  const ts_data = d3.filter(
    einwohner_csv,
    (r) => [stt_id, compare_id].includes(r.STT_ID)
  );  
  
  return Plot.plot({
    width: width,
    marginLeft: 70,
    x: {
      label: "Jahr",      
      tickFormat: ""      
    },
    y: {
      label: "Wachstum (% im Vergleich zum Vorjahr)",      
      grid: true,
      tickFormat: d => d.toLocaleString(),      
      labelAnchor: "center"      
    },
    
    marks: [
      Plot.lineY(ts_data,{
        x: "Jahr",
        y: "Wachstum",
        stroke: "STT",        
      }),
      Plot.ruleX(ts_data, 
        Plot.pointerX({x: "Jahr", py: "Wachstum", stroke: "var(--theme-foreground-muted)"})
      ),
      Plot.dot(ts_data, 
        Plot.pointerX({x: "Jahr", y: "Wachstum", stroke: "var(--theme-foreground-muted)"})
      ),
      Plot.text(ts_data, 
        Plot.pointerX(
          {
            px: "Jahr", 
            py: "Wachstum", 
            dy: -27,
            frameAnchor: "top-left",
            fontVariant: "tabular-nums", 
            text: (d) => [
              `\n${d.STT}`, 
              `${d.Jahr}`, 
              `Einwohner: ${d.Einwohner.toLocaleString()}`,
              `Wachstum: ${d.Wachstum.toFixed(2)} %`
            ].join(", ")            
          }
        )
      ),
      Plot.axisX({interval: 1, tickFormat: ''}),
    ],
    color: {legend: true},
  },
)}