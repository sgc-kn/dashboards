import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import * as Inputs from "npm:@observablehq/inputs";
import { familienstand_csv } from "./data.js";
import { sttIdObservable } from './emitter.js';

//group by STT_ID
const familienStand_gb = d3.group(familienstand_csv, d => d.STT_ID);

const familienStand_array = Array.from(familienStand_gb.entries()).map(([key, values]) => ({
    key: key,
    values: values    
}));
/// get 000
const dataObjectForKey000 = familienStand_array.find(item => item.key === '000')?.values || [];
// Object to array
export const dataArrayForKey000 = Object.values(dataObjectForKey000);

//get ID by clicking on Stadtteil map from map.js
sttIdObservable.subscribe(sttId => {
  if (sttId !== null) {
    const transformedData = handleSttId(sttId);
    createPlot(transformedData);
    createTable(transformedData);
    openModal();
  }
});
// get familienStand_array for Chart
function handleSttId(sttId) {
  const foundElement = familienStand_array.find(element => element.key === sttId);  
  if (foundElement) {
    const familienStand_values = foundElement.values;
    console.log('foundElement', familienStand_values)
    const transformedData = familienStand_values.flatMap(item => {
      const year = item.Jahr;
      return [
        { year, status: "Geschieden", value: parseInt(item["Fam_Stand_Geschieden_LP_aufgehoben"], 10) },
        { year, status: "Verheiratet", value: parseInt(item["Fam_Stand_Verheiratet_Lebenspartnerschaft"], 10) },
        { year, status: "Gestorben", value: parseInt(item["Fam_Stand_Verwitwet_LP_gestorben"], 10) },
        { year, status: "Ledig", value: parseInt(item["Fam_Stand_ledig"], 10) },
        { year, status: "Unbekannt", value: parseInt(item["Fam_Stand_unbekannt"], 10) }
      ];
    });
    
    return transformedData;
  }
  return [];
}
//get Chat
function createPlot(data) {
  const plot = Plot.plot({
    y: { grid: true, label: "Einwohner" },
    x: { label: "Jahr" },
    title: "Familienstand (Einwohnerlnnen ab 18 Jahre)",
    color: { legend: true, label: "" },
    marks: [
      Plot.rectY(data, {
        x: "year",
        y: "value",
        fill: "status",
        title: d => `${d.status}: ${d.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
      }),
      Plot.ruleY([0], { stroke: "black" })
    ]
});
  //get DOM-el by ID
  const plotContainer = document.getElementById('familienStand_plot');
  //remote previous Chart
  plotContainer.innerHTML = '';
  //add new Chart by click
  plotContainer.appendChild(plot);
}

function createTable(data){
  const table = Inputs.table(data,{
      columns: [
        "year",
        "status",
        "value"
      ],
      header: {
        year: "Jahr",
        status: "Status",
        value: "Einwohner"
      }
    }
  )
  //get DOM-el by ID
  const tableContainer = document.getElementById('familienStand_table');
  //remote previous Chart
  tableContainer.innerHTML = '';
  //add new Chart by click
  tableContainer.appendChild(table);
}

function openModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = "block";

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

export function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = "none";  
}

export function openAdditinaInfo(){
  const familienStand_TablBlock = document.getElementById('familienStand_table');
  if (familienStand_TablBlock.style.display === 'none' || familienStand_TablBlock.style.display === '') {
    familienStand_TablBlock.style.display = 'block'; // Show the div
  } else {
    familienStand_TablBlock.style.display = 'none'; // Hide the div
  }
}
/*
document.getElementById('toggle_info_link').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the default link behavior
  const tableDiv = document.getElementById('familienStand_table');
  if (tableDiv.style.display === 'none' || tableDiv.style.display === '') {
    tableDiv.style.display = 'block'; // Show the div
  } else {
    tableDiv.style.display = 'none'; // Hide the div
  }
});
//-----------------Modal Window---------------
// Get the modal
var modal = document.getElementById("myModal");

// Get the link that opens the modal
var link = document.getElementById("familienstand_link");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the link, open the modal
link.onclick = function(event) {
  event.preventDefault(); // Verhindert das Standardverhalten des Links
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//-----------------//Modal Window--------------- */