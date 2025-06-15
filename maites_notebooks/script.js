d3.csv("daten_combined.csv").then(function(data) {
  data.forEach(d => {
    d.year = +d.Jahr;
    d.y = +d.TMK;
  });

  const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
  const yearSelector = document.getElementById("yearSelector");

  years.forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  });

  const svg = d3.select("#lineplot");
  const margin = { top: 60, right: 200, bottom: 30, left: 20 };
  const width = +svg.attr("width") - margin.left - margin.right;
  const height = +svg.attr("height") - margin.top - margin.bottom;
  const g = svg.append("g").attr("transform", `translate(${margin.left - 160},${margin.top})`);

  const x = d3.scaleLinear().domain([1973, 2019]).range([0, width]);
  const y = d3.scaleLinear().domain([7, 13]).range([height, 0]);

  const xAxis = g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .style("opacity", 0)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));

  const yAxis = g.append("g")
    .attr("class", "y-axis")
    .style("opacity", 0)
    .call(d3.axisLeft(y));

  g.append("g")
    .call(d3.axisLeft(y))
    .selectAll("path, line, text")
    .style("display", "none");

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.y));

  const blueLinePath = g.append("path")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 2);

  const orangeLinePath = g.append("path")
    .attr("fill", "none")
    .attr("stroke", "#ff7f0e")
    .attr("stroke-width", 2);

  const moveLine = g.append("line").attr("class", "marker-line").style("opacity", 0);
  const moveLabel = g.append("text").attr("class", "marker-label").style("opacity", 0);

  const endLine = g.append("line").attr("class", "marker-line").style("opacity", 0);
  const endLabel = g.append("text").attr("class", "marker-label").style("opacity", 0);

  yearSelector.addEventListener("change", function () {
    const selectedYear = parseInt(this.value);

    if (selectedYear) {
      const filteredData = data.filter(d => d.year <= selectedYear);
      const afterYearData = data.filter(d => d.year >= selectedYear);

      blueLinePath
        .datum(filteredData)
        .attr("d", line)
        .attr("stroke-dasharray", null)
        .attr("stroke-dashoffset", null)
        .transition().duration(2000)
        .attrTween("stroke-dasharray", function () {
          const length = this.getTotalLength();
          return d3.interpolateString(`0,${length}`, `${length},${length}`);
        });

      const pointData = filteredData.find(d => d.year === selectedYear);
      const lastPoint = afterYearData[afterYearData.length - 1];

      orangeLinePath
        .datum(afterYearData)
        .attr("d", line)
        .attr("stroke-dasharray", null)
        .attr("stroke-dashoffset", null)
        .style("opacity", 0)
        .transition().delay(2500).duration(0).style("opacity", 1)
        .transition().duration(2000)
        .attrTween("stroke-dasharray", function () {
          const length = this.getTotalLength();
          return d3.interpolateString(`0,${length}`, `${length},${length}`);
        });

      moveLine
        .attr("x1", x(selectedYear))
        .attr("x2", x(selectedYear))
        .attr("y1", 0)
        .attr("y2", height)
        .transition().delay(2500).duration(500)
        .style("opacity", 1);

      moveLabel
        .attr("x", x(selectedYear) + 5)
        .attr("y", 20)
        .text("Hier bist du hergezogen: "+selectedYear)
        .transition().delay(2500).duration(500)
        .style("opacity", 1);

      endLine
        .attr("x1", x(lastPoint.year))
        .attr("x2", x(lastPoint.year))
        .attr("y1", 0)
        .attr("y2", height)
        .transition().delay(4600).duration(500)
        .style("opacity", 1);

      endLabel
        .attr("x", x(lastPoint.year) + 5)
        .attr("y", 20)
        .text("2019")
        .transition().delay(4600).duration(500)
        .style("opacity", 1);

      xAxis.transition().delay(4600).duration(500).style("opacity", 1);
      yAxis.transition().delay(4600).duration(500).style("opacity", 1);

    } else {
      blueLinePath.attr("d", null);
      orangeLinePath.attr("d", null);

      moveLine.style("opacity", 0);
      moveLabel.style("opacity", 0);
      endLine.style("opacity", 0);
      endLabel.style("opacity", 0);
    }
  });
}).catch(function(error) {
  console.error("Fehler beim Laden der CSV-Datei:", error);
});