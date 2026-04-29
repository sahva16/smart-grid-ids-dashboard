// ========== DATA GENERATORS WITH STATUS ==========
function generateVoltageData() {
  const baseVoltage = 113;
  const variance = Math.random() * 1.5;
  const status = variance > 1.2 ? 'anomaly' : variance > 0.8 ? 'suspicious' : 'normal';
  return {
    value: parseFloat((baseVoltage + variance).toFixed(2)),
    status: status
  };
}

function generateFrequencyData() {
  const baseFreq = 50;
  const variance = (Math.random() - 0.5) * 0.3;
  const status = Math.abs(variance) > 0.2 ? 'suspicious' : 'normal';
  return {
    value: parseFloat((baseFreq + variance).toFixed(2)),
    status: status
  };
}

function generatePhaseData() {
  const basePhase = 2;
  const variance = (Math.random() - 0.5) * 2;
  const status = Math.abs(variance) > 1.5 ? 'anomaly' : Math.abs(variance) > 1 ? 'suspicious' : 'normal';
  return {
    value: parseFloat((basePhase + variance).toFixed(2)),
    status: status
  };
}

// ========== STATUS HELPERS ==========
function getVoltageStatus(value) {
  if (value > 114) return '🔴 ANOMALY';
  if (value > 113.5) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

function getFrequencyStatus(value) {
  if (value < 49.8 || value > 50.2) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

function getPhaseStatus(value) {
  if (Math.abs(value) > 3) return '🔴 ANOMALY';
  if (Math.abs(value) > 2) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

// ========== COLOR MAP BASED ON STATUS ==========
const statusColorMap = {
  normal: '#00ff88',      // Green
  suspicious: '#ffcc00',  // Yellow
  anomaly: '#ff3b3b'      // Red
};

// ========== LABEL GENERATOR ==========
function generateTimeLabels(count = 20) {
  const labels = [];
  for (let i = 0; i < count; i++) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - (count - i));
    labels.push(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  }
  return labels;
}

// ========== SHARED CHART OPTIONS ==========
const sharedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: '#a0a0a0',
        font: { size: 11 },
        padding: 15,
        usePointStyle: true
      }
    }
  }
};

// ========== VOLTAGE CHART WITH STATUS COLORS ==========
let voltageDataset = [];
for (let i = 0; i < 20; i++) {
  voltageDataset.push(generateVoltageData().value);
}

const voltageCtx = document.getElementById('voltageChart');
const voltageChart = new Chart(voltageCtx, {
  type: 'line',
  data: {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: 'Voltage (kV)',
        data: voltageDataset,
        borderColor: '#ff3b3b',
        backgroundColor: 'rgba(255, 59, 59, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        segment: {
          borderColor: ctx => {
            const value = ctx.p0.parsed.y;
            if (value > 114) return '#ff3b3b';      // Red - Anomaly
            if (value > 113.5) return '#ffcc00';    // Yellow - Suspicious
            return '#00ff88';                        // Green - Normal
          },
          borderWidth: 2.5
        }
      }
    ]
  },
  options: {
    ...sharedChartOptions,
    plugins: {
      ...sharedChartOptions.plugins,
      legend: {
        display: false
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
            return getVoltageStatus(value);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 229, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 }
        }
      },
      y: {
        min: 110,
        max: 116,
        grid: {
          color: 'rgba(255, 59, 59, 0.08)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 },
          stepSize: 1
        }
      }
    }
  }
});

// ========== FREQUENCY CHART WITH STATUS COLORS ==========
let frequencyDataset = [];
for (let i = 0; i < 20; i++) {
  frequencyDataset.push(generateFrequencyData().value);
}

const frequencyCtx = document.getElementById('frequencyChart');
const frequencyChart = new Chart(frequencyCtx, {
  type: 'line',
  data: {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: 'Frequency (Hz)',
        data: frequencyDataset,
        borderColor: '#ffcc00',
        backgroundColor: 'rgba(255, 204, 0, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        segment: {
          borderColor: ctx => {
            const value = ctx.p0.parsed.y;
            if (value < 49.8 || value > 50.2) return '#ffcc00';  // Yellow - Suspicious
            return '#00ff88';                                      // Green - Normal
          },
          borderWidth: 2.5
        }
      },
      {
        label: 'Lower Limit (49.8 Hz)',
        data: Array(20).fill(49.8),
        borderColor: 'rgba(255, 59, 59, 0.4)',
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0
      },
      {
        label: 'Upper Limit (50.2 Hz)',
        data: Array(20).fill(50.2),
        borderColor: 'rgba(255, 59, 59, 0.4)',
        borderDash: [5, 5],
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0
      }
    ]
  },
  options: {
    ...sharedChartOptions,
    plugins: {
      ...sharedChartOptions.plugins,
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#ffcc00",
        borderWidth: 1,
        padding: 10,
        titleColor: "#ffcc00",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              const value = context.parsed.y;
              return getFrequencyStatus(value);
            }
            return context.dataset.label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 229, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 }
        }
      },
      y: {
        min: 49.5,
        max: 50.5,
        grid: {
          color: 'rgba(255, 204, 0, 0.08)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 },
          stepSize: 0.2
        }
      }
    }
  }
});

// ========== PHASE ANGLE CHART WITH STATUS COLORS ==========
let phaseDataset = [];
for (let i = 0; i < 20; i++) {
  phaseDataset.push(generatePhaseData().value);
}

const phaseCtx = document.getElementById('phaseChart');
const phaseChart = new Chart(phaseCtx, {
  type: 'line',
  data: {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: 'Phase Angle (°)',
        data: phaseDataset,
        borderColor: '#00a8ff',
        backgroundColor: 'rgba(0, 168, 255, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
        segment: {
          borderColor: ctx => {
            const value = ctx.p0.parsed.y;
            if (Math.abs(value) > 3) return '#ff3b3b';       // Red - Anomaly
            if (Math.abs(value) > 2) return '#ffcc00';       // Yellow - Suspicious
            return '#00ff88';                                  // Green - Normal
          },
          borderWidth: 2.5
        }
      }
    ]
  },
  options: {
    ...sharedChartOptions,
    plugins: {
      ...sharedChartOptions.plugins,
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#00a8ff",
        borderWidth: 1,
        padding: 10,
        titleColor: "#00a8ff",
        bodyColor: "#fff",
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return getPhaseStatus(value);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 229, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 }
        }
      },
      y: {
        min: -2,
        max: 6,
        grid: {
          color: 'rgba(0, 168, 255, 0.08)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 10 },
          stepSize: 1
        }
      }
    }
  }
});

// ========== REAL-TIME DATA UPDATES ==========
function updateMetrics() {
  const voltageData = generateVoltageData();
  const frequencyData = generateFrequencyData();
  const phaseData = generatePhaseData();
  
  document.getElementById('voltageValue').textContent = voltageData.value.toFixed(2);
  document.getElementById('frequencyValue').textContent = frequencyData.value.toFixed(2);
  document.getElementById('phaseValue').textContent = phaseData.value.toFixed(2);
  
  // Update metric card colors based on status
  updateMetricCardColor('voltageValue', voltageData.status);
  updateMetricCardColor('frequencyValue', frequencyData.status);
  updateMetricCardColor('phaseValue', phaseData.status);
}

function updateMetricCardColor(elementId, status) {
  const element = document.getElementById(elementId);
  element.style.color = statusColorMap[status];
}

function updateCharts() {
  // Voltage
  const newVoltage = generateVoltageData();
  voltageChart.data.datasets[0].data.shift();
  voltageChart.data.datasets[0].data.push(newVoltage.value);
  voltageChart.data.labels.shift();
  voltageChart.data.labels.push(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  voltageChart.update('none');

  // Frequency
  const newFrequency = generateFrequencyData();
  frequencyChart.data.datasets[0].data.shift();
  frequencyChart.data.datasets[0].data.push(newFrequency.value);
  frequencyChart.data.labels.shift();
  frequencyChart.data.labels.push(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  frequencyChart.update('none');

  // Phase
  const newPhase = generatePhaseData();
  phaseChart.data.datasets[0].data.shift();
  phaseChart.data.datasets[0].data.push(newPhase.value);
  phaseChart.data.labels.shift();
  phaseChart.data.labels.push(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
  phaseChart.update('none');
}

// Update metrics every 1 second
setInterval(updateMetrics, 1000);

// Update charts every 1.5 seconds
setInterval(updateCharts, 1500);