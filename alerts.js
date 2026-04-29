// Create network nodes for alerts page
const nodes = new vis.DataSet([
  { id: 1, label: "PMU 1", color: "#00ff88", title: "Normal", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 2, label: "PMU 3", color: "#ffcc00", title: "Suspicious", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 3, label: "PMU 4", color: "#00ff88", title: "Normal", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 4, label: "PMU 5", color: "#ffcc00", title: "Suspicious", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 5, label: "PMU 7", color: "#ff3b3b", title: "Anomaly", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 6, label: "PMU 9", color: "#ffcc00", title: "Suspicious", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 7, label: "PMU 10", color: "#00ff88", title: "Normal", font: { color: "white", size: 14, bold: { color: "white" } } },
  { id: 8, label: "PMU 11", color: "#00ff88", title: "Normal", font: { color: "white", size: 14, bold: { color: "white" } } },
]);

// Create edges
const edges = new vis.DataSet([
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
  { from: 2, to: 5 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 7 },
  { from: 7, to: 8 },
]);

// Network options with enhanced font styling
const options = {
  physics: {
    enabled: true,
    stabilization: {
      iterations: 200,
    },
  },
  interaction: {
    hover: true,
    navigationButtons: true,
    keyboard: true,
  },
  nodes: {
    shape: "dot",
    scaling: {
      label: {
        enabled: true,
        min: 12,
        max: 16,
      },
    },
    font: {
      size: 14,
      color: "white",
      face: "Arial, sans-serif",
      strokeWidth: 2,
      strokeColor: "rgba(0, 0, 0, 0.5)",
    },
    shadow: {
      enabled: true,
      color: "rgba(0, 0, 0, 0.5)",
      size: 10,
      x: 3,
      y: 3,
    },
  },
  edges: {
    color: { 
      color: "#00e5ff", 
      highlight: "#00ff88",
      hover: "#ffcc00"
    },
    width: 2.5,
    smooth: {
      type: "continuous",
    },
    shadow: {
      enabled: true,
      color: "rgba(0, 229, 255, 0.5)",
      size: 8,
      x: 2,
      y: 2,
    },
  },
};

// Create network
const container = document.getElementById("network");
const data = { nodes: nodes, edges: edges };
const network = new vis.Network(container, data, options);