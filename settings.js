// ========== SMOOTH VOLTAGE WAVE GENERATOR ==========
let voltageIndex = 0;
function generateVoltageValue(i) {
  let value = 113 + Math.sin(i * 0.2) * 1.2;

  // Force spikes for visibility
  if (i % 15 === 0) value += 1.5;   // RED
  else if (i % 10 === 0) value += 0.8; // YELLOW

  return parseFloat(value.toFixed(2));
}

// ========== SMOOTH FREQUENCY WAVE GENERATOR ==========
let freqIndex = 0;
function generateFrequencyValue(i) {
  let value = 50 + Math.sin(i * 0.3) * 0.15;

  if (i % 20 === 0) value += 0.3;   // spike
  if (i % 35 === 0) value -= 0.4;   // spike
  return parseFloat(value.toFixed(3));
}

// ========== VOLTAGE STATUS HELPER ==========
function getVoltageStatus(value) {
  if (value > 114) return '🔴 ANOMALY';
  if (value > 113.5) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

// ========== FREQUENCY STATUS HELPER ==========
function getFrequencyStatus(value) {
  if (value < 49.8 || value > 50.2) return '🟡 SUSPICIOUS';
  return '🟢 NORMAL';
}

// ========== INIT DATA ==========
const points = 50;
let voltageData = [];
let freqData = [];
let labels = [];

for (let i = 0; i < points; i++) {
  voltageData.push(generateVoltageValue(i));
  freqData.push(generateFrequencyValue(i));
  labels.push(i);
}

// ========== VOLTAGE CHART (NO FILL) ==========
const voltageCtx = document.getElementById('voltageChart');
const voltageChart = new Chart(voltageCtx, {
  type: 'line',
  data: {
    labels: [...labels],
    datasets: [{
      label: 'Voltage Signal',
      data: [...voltageData],
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,  // ⬅️ NO FILL
      segment: {
        borderColor: ctx => {
          const y = ctx.p0.parsed.y;
          if (y > 114) return '#ff3b3b';      // RED
          if (y > 113.5) return '#ffcc00';    // YELLOW
          return '#00ff88';                    // GREEN
        }
      }
    }]
  },
  options: {
    responsive: true,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
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
            return getVoltageStatus(value);
          }
        }
      }
    },
    scales: { 
      y: { 
        min: 110, 
        max: 116,
        grid: {
          color: 'rgba(0, 229, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 11 }
        }
      },
      x: { 
        display: false,
        grid: { display: false }
      }
    }
  }
});

// ========== FREQUENCY CHART (NO FILL) ==========
const freqCtx = document.getElementById('frequencyChart');
const frequencyChart = new Chart(freqCtx, {
  type: 'line',
  data: {
    labels: [...labels],
    datasets: [{
      label: 'Frequency Signal',
      data: [...freqData],
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,  // ⬅️ NO FILL
      segment: {
        borderColor: ctx => {
          const y = ctx.p0.parsed.y;
          if (y < 49.8 || y > 50.2) return '#ffcc00'; // yellow
          return '#00ff88'; // green
        }
      }
    }]
  },
  options: {
    responsive: true,
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: { display: false },
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
            const value = context.parsed.y;
            return getFrequencyStatus(value);
          }
        }
      }
    },
    scales: { 
      y: { 
        min: 49.5, 
        max: 50.5,
        grid: {
          color: 'rgba(0, 229, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#808080',
          font: { size: 11 }
        }
      },
      x: { 
        display: false,
        grid: { display: false }
      }
    }
  }
});

// ========== REAL-TIME UPDATE ==========
setInterval(() => {
  voltageIndex++;
  freqIndex++;

  // Update voltage
  voltageChart.data.datasets[0].data.shift();
  voltageChart.data.datasets[0].data.push(generateVoltageValue(voltageIndex));
  voltageChart.data.labels.shift();
  voltageChart.data.labels.push(voltageIndex);
  voltageChart.update('none');

  // Update frequency
  frequencyChart.data.datasets[0].data.shift();
  frequencyChart.data.datasets[0].data.push(generateFrequencyValue(freqIndex));
  frequencyChart.data.labels.shift();
  frequencyChart.data.labels.push(freqIndex);
  frequencyChart.update('none');

}, 500); // 0.5s updates