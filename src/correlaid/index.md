# CorrelAid Data Story

## Untertitel

Hello World

```js
const data = Array.from({ length: 26 }, (_, i) => ({
  year: new Date(2000 + i, 0, 1),
  value: 50 + Math.round(Math.random() * 50) // Random value between 50 and 100
}));
```

```js
const cutoff = view(Inputs.range([2000, 2025], {step: 1}));
```

Magic happens between these blocks. Above, cutoff is an interactive
element. Below, cutoff will be the selected value. Don't try to do this
in a single block.

```js
const filteredData = data.filter(d => d3.timeYear(d.year).getFullYear() > cutoff);
```

```js
const plt = Plot.plot({
  x: {
    label: "Jahr",
    type: "time"
  },
  y: {
    label: "Wert"
  },
  marks: [
    Plot.line(data, {
      x: "year",
      y: "value",
    }),
    Plot.dot(filteredData, {
      x: "year",
      y: "value",
      stroke: "var(--theme-foreground-focus)",
    })
  ]
});
display(plt);
```
