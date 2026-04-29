// Color scheme matching other pages
const COLOR_MAP = {
  normal: '#00ff88',      // Green
  suspicious: '#ffcc00',  // Yellow
  anomaly: '#ff3b3b'      // Red
};

// Create network nodes
const nodes = new vis.DataSet([
  { id: 1, label: "PMU 1", color: COLOR_MAP.normal, title: "Normal" },
  { id: 2, label: "PMU 2", color: COLOR_MAP.normal, title: "Normal" },
  { id: 3, label: "PMU 3", color: COLOR_MAP.suspicious, title: "Suspicious" },
  { id: 4, label: "PMU 4", color: COLOR_MAP.normal, title: "Normal" },
  { id: 5, label: "PMU 5", color: COLOR_MAP.normal, title: "Normal" },
  { id: 6, label: "PMU 6", color: COLOR_MAP.normal, title: "Normal" },
  { id: 7, label: "PMU 7", color: COLOR_MAP.anomaly, title: "Anomaly", font: { color: "white" } },
  { id: 8, label: "PMU 9", color: COLOR_MAP.normal, title: "Normal" },
  { id: 9, label: "PMU 10", color: COLOR_MAP.suspicious, title: "Suspicious" },
  { id: 10, label: "PMU 11", color: COLOR_MAP.suspicious, title: "Suspicious" },
  { id: 11, label: "PMU 12", color: COLOR_MAP.normal, title: "Normal" },
]);

// Create edges with thicker lines
const edges = new vis.DataSet([
  { from: 1, to: 2, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 1, to: 4, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 1, to: 5, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 2, to: 3, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 2, to: 6, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 3, to: 5, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 3, to: 7, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 4, to: 5, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 5, to: 6, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 6, to: 7, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 6, to: 9, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 7, to: 9, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 7, to: 10, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 9, to: 10, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 9, to: 8, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 10, to: 11, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
  { from: 8, to: 11, color: { color: "#ffffff", highlight: "#00ff88" }, width: 4 },
]);

// Network options - STABLE PHYSICS
const options = {
  physics: {
    enabled: true,
    stabilization: {
      iterations: 300,
      fit: true,
      updateInterval: 25,
      nodeDistance: 200
    },
    barnesHut: {
      gravitationalConstant: -10000,
      centralGravity: 0.5,
      springLength: 200,
      springConstant: 0.04,
      damping: 0.8,
      avoidOverlap: 0.1
    },
    maxVelocity: 40,
    minVelocity: 0.2,
    solver: 'barnesHut',
    timeStep: 0.5,
    adaptiveTimestep: true
  },
  interaction: {
    hover: true,
    navigationButtons: false,
    keyboard: false,
    zoomView: true,
    dragView: true
  },
  nodes: {
    shape: "dot",
    scaling: {
      min: 80,      // ⬅️ INCREASED from 50
      max: 120,     // ⬅️ INCREASED from 70
      label: {
        enabled: true,
        min: 14,
        max: 18,
      },
    },
    font: {
      size: 16,     // ⬅️ INCREASED from 14
      color: "white",
      face: "Segoe UI, sans-serif",
      strokeWidth: 2,
      strokeColor: "rgba(10, 15, 25, 0.8)"
    },
    borderWidth: 3,   // ⬅️ INCREASED from 2
    borderWidthSelected: 4  // ⬅️ INCREASED from 3
  },
  edges: {
    color: {
      color: "#ffffff",
      highlight: "#00ff88",
      inherit: false
    },
    width: 4,         // ⬅️ INCREASED from 2
    smooth: {
      type: "continuous",
      roundness: 0.5
    },
    shadow: {
      enabled: true,
      color: "rgba(255, 255, 255, 0.3)",
      size: 4,        // ⬅️ INCREASED from 3
      x: 2,
      y: 2
    }
  }
};

// Create network with proper container reference
const container = document.getElementById("network");
const data = { nodes: nodes, edges: edges };

// Wait for DOM to be ready
if (container) {
  const network = new vis.Network(container, data, options);

  // Stabilize and fit
  network.once("stabilizationIterationsDone", function() {
    network.setOptions({ physics: false });
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutQuad'
      }
    });
  });

  // Backup: disable physics after 4 seconds
  setTimeout(function() {
    network.setOptions({ physics: false });
    network.fit({ animation: false });
  }, 4000);

  // Node click handler
  network.on("click", function(params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = nodes.get(nodeId);
      showNodeDetails(node);
    }
  });

  // Make functions globally available
  window.resetNetworkView = function() {
    network.fit({ animation: { duration: 1000 } });
  };

  window.fitNetworkView = function() {
    network.fit({ animation: { duration: 1000 } });
  };
} else {
  console.error("Network container not found!");
}

// Node data
const nodeDataMap = {
  1: { status: 'normal', voltage: 113.2, frequency: 50.1, phaseAngle: 2.1 },
  2: { status: 'normal', voltage: 112.8, frequency: 50.05, phaseAngle: 2.3 },
  3: { status: 'suspicious', voltage: 113.5, frequency: 50.15, phaseAngle: 3.2 },
  4: { status: 'normal', voltage: 113.1, frequency: 50.12, phaseAngle: 1.9 },
  5: { status: 'normal', voltage: 112.9, frequency: 50.08, phaseAngle: 2.5 },
  6: { status: 'normal', voltage: 113.3, frequency: 50.02, phaseAngle: 2.0 },
  7: { status: 'anomaly', voltage: 112.5, frequency: 50.25, phaseAngle: 8.4 },
  8: { status: 'normal', voltage: 113.0, frequency: 50.1, phaseAngle: 2.2 },
  9: { status: 'suspicious', voltage: 113.6, frequency: 49.9, phaseAngle: 3.5 },
  10: { status: 'suspicious', voltage: 113.4, frequency: 50.18, phaseAngle: 3.8 },
  11: { status: 'normal', voltage: 112.7, frequency: 50.05, phaseAngle: 2.4 },
};

function showNodeDetails(node) {
  const data = nodeDataMap[node.id] || {};
  const statusClass = `status-${data.status}`;
  
  let html = `
    <div class="info-row">
      <span class="label">Name:</span>
      <span class="value">${node.label}</span>
    </div>
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="value ${statusClass}">${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</span>
    </div>
    <div class="info-row">
      <span class="label">Voltage:</span>
      <span class="value">${data.voltage.toFixed(1)} kV</span>
    </div>
    <div class="info-row">
      <span class="label">Frequency:</span>
      <span class="value">${data.frequency.toFixed(2)} Hz</span>
    </div>
    <div class="info-row">
      <span class="label">Phase Angle:</span>
      <span class="value">${data.phaseAngle.toFixed(1)}°</span>
    </div>
  `;
  
  if (data.status !== 'normal') {
    html += `
      <div class="behavior-warning">
        <p>Inconsistent Behavior Detected</p>
        <p>~ Compared to Neighboring Nodes</p>
      </div>
    `;
  }
  
  document.getElementById('nodePanelContent').innerHTML = html;
}