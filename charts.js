function generatePoint() {
  return 60 + Math.random() * 40;
}

// VOLTAGE DATA
let voltageData = Array.from({ length: 30 }, generatePoint);
let networkData = Array.from({ length: 20 }, () => 50 + Math.random() * 50);
let anomalyData = Array.from({ length: 20 }, () => Math.random());

// COLOR LOGIC FOR VOLTAGE
function getPointColors(data) {
  return data.map((v) => {
    if (v > 85) return "#ff3b3b";
    if (v > 70) return "#ffcc00";
    return "#ffffff";
  });
}

// COLOR LOGIC FOR ANOMALY POINTS (0-1 scale)
function getAnomalySegmentColor(value) {
  if (value > 0.80) return "#ff3b3b";    // Anomaly - Red
  if (value > 0.60) return "#ffcc00";    // Suspicious - Yellow
  return "#00ff88";                       // Normal - Green
}

// Get status label
function getAnomalyStatus(value) {
  if (value > 0.80) return '🔴 ANOMALY';
  if (value > 0.60) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

// ========== VOLTAGE CHART (WITH TOOLTIP) ==========
const voltageCtx = document.getElementById("voltageChart").getContext("2d");
const voltageChart = new Chart(voltageCtx, {
  type: "line",
  data: {
    labels: Array(30).fill(""),
    datasets: [
      {
        data: voltageData,
        borderColor: "#ffffff",
        borderWidth: 2.5,
        tension: 0.4,
        pointBackgroundColor: getPointColors(voltageData),
        pointRadius: 4,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#00e5ff",
        borderWidth: 1,
        padding: 10,
        titleColor: "#00e5ff",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            let status = '🟢 NORMAL';
            if (value > 85) status = '🔴 CRITICAL';
            else if (value > 70) status = '🟡 SUSPICIOUS';
            return `Voltage: ${value.toFixed(2)} kV - ${status}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        min: 50,
        max: 120,
        grid: {
          color: "rgba(0, 229, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(224, 224, 224, 0.6)",
          font: {
            size: 11,
          },
        },
      },
    },
  },
});

// VOLTAGE REAL-TIME UPDATE
setInterval(() => {
  voltageData.shift();
  voltageData.push(generatePoint());

  voltageChart.data.datasets[0].data = voltageData;
  voltageChart.data.datasets[0].pointBackgroundColor = getPointColors(voltageData);

  voltageChart.update();
}, 800);

// ========== NETWORK TRAFFIC CHART (WITH TOOLTIP) ==========
const networkCtx = document.getElementById("networkChart").getContext("2d");
const networkChart = new Chart(networkCtx, {
  type: "line",
  data: {
    labels: Array(20).fill(""),
    datasets: [
      {
        label: "Network Traffic (Mbps)",
        data: networkData,
        borderColor: "#00e5ff",
        borderWidth: 2.5,
        backgroundColor: "rgba(0, 229, 255, 0.15)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "#00e5ff",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#00e5ff",
        borderWidth: 1,
        padding: 10,
        titleColor: "#00e5ff",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `Traffic: ${value.toFixed(2)} Mbps`;
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 120,
        grid: {
          color: "rgba(0, 229, 255, 0.08)",
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  },
});

// NETWORK TRAFFIC REAL-TIME UPDATE
setInterval(() => {
  networkData.shift();
  networkData.push(50 + Math.random() * 50);

  networkChart.data.datasets[0].data = networkData;
  networkChart.update();
}, 1000);

// ========== ANOMALY DETECTION CHART (CLEAN - NO GLOW) ==========
const anomalyCtx = document.getElementById("anomalyChart").getContext("2d");
const anomalyChart = new Chart(anomalyCtx, {
  type: "line",
  data: {
    labels: Array(20).fill(""),
    datasets: [
      {
        label: "Anomaly Score",
        data: anomalyData,
        borderColor: "#ff3b3b",
        borderWidth: 2.5,
        backgroundColor: "rgba(255, 59, 59, 0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: anomalyData.map(v => getAnomalySegmentColor(v)),
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1.5,
        fill: true,
        segment: {
          borderColor: ctx => {
            return getAnomalySegmentColor(ctx.p0.parsed.y);
          },
          borderWidth: 2.5
        }
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#ff3b3b",
        borderWidth: 1,
        padding: 10,
        titleColor: "#ff3b3b",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return getAnomalyStatus(value);
          }
        }
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 1,
        grid: {
          color: "rgba(255, 59, 59, 0.08)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(224, 224, 224, 0.6)",
          font: {
            size: 10,
          },
          stepSize: 0.2,
          callback: function(value) {
            return value.toFixed(2);
          }
        },
      },
    },
  },
});

// ========== ANOMALY DETECTION REAL-TIME UPDATE ==========
let anomalyIndex = 0;

setInterval(() => {
  anomalyIndex++;
  anomalyData.shift();
  
  // Generate anomaly score (0-1 scale)
  let newValue = Math.random() * 0.5; // Mostly normal (0-0.5)
  
  // Occasional spikes
  if (Math.random() > 0.85) {
    newValue = 0.6 + Math.random() * 0.4; // Spikes (0.6-1.0)
  }
  
  anomalyData.push(newValue);

  anomalyChart.data.datasets[0].data = anomalyData;
  anomalyChart.data.datasets[0].pointBackgroundColor = anomalyData.map(v => getAnomalySegmentColor(v));
  anomalyChart.update();
}, 1000);

// ========== CREATE ANIMATED MINI BARS ==========
function createBars(id) {
  const container = document.getElementById(id);
  if (!container) return;
  
  for (let i = 0; i < 25; i++) {
    const bar = document.createElement("div");
    bar.style.height = 10 + Math.random() * 30 + "px";
    bar.style.animationDelay = Math.random() * 1 + "s";
    container.appendChild(bar);
  }
}

createBars("cpuBars");
createBars("memBars");