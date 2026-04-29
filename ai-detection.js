// ========== ATTACK TYPES DATA ==========
const attackTypes = [
  { type: 'Replay Attack', probability: 89, status: 'attack' },
  { type: 'False Data Injection', probability: 75, status: 'attack' },
  { type: 'Frequency Manipulation', probability: 62, status: 'attack' },
  { type: 'Voltage Spoofing', probability: 45, status: 'suspicious' },
  { type: 'Normal Operation', probability: 5, status: 'normal' }
];

let currentAttackIndex = 0;
let updateCounter = 0;

// ========== ANOMALY WAVEFORM DATA GENERATOR ==========
function generateAnomalyWaveform(baseAmplitude = 1, anomalyIntensity = 0.8) {
  const points = [];
  
  for (let i = 0; i < 100; i++) {
    let normal = Math.sin((i / 100) * Math.PI * 4) * baseAmplitude;
    
    // Add suspicious zone (yellow)
    if (i > 25 && i < 50) {
      normal += Math.sin((i / 25) * Math.PI) * (baseAmplitude * 0.5);
    }
    
    // Add anomaly zone (red)
    if (i > 65 && i < 85) {
      normal += Math.sin((i / 20) * Math.PI * 2) * (baseAmplitude * anomalyIntensity);
    }
    
    points.push(normal);
  }
  
  return points;
}

// ========== CHART OPTIONS ==========
const sharedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 0 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00e5ff',
      borderWidth: 1,
      padding: 10,
      titleColor: '#00e5ff',
      bodyColor: '#e0e0e0',
      titleFont: { size: 11 },
      bodyFont: { size: 11 }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(0, 229, 255, 0.05)', drawBorder: false },
      ticks: { color: '#808080', font: { size: 10 } }
    },
    y: {
      grid: { color: 'rgba(0, 229, 255, 0.05)', drawBorder: false },
      ticks: { color: '#808080', font: { size: 10 } }
    }
  }
};

// ========== INITIALIZE ANOMALY CHART ==========
const anomalyCtx = document.getElementById('anomalyChart');
const anomalyData = generateAnomalyWaveform(1, 0.8);

const anomalyChart = new Chart(anomalyCtx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 100 }, (_, i) => i),
    datasets: [
      {
        label: 'Signal',
        data: anomalyData,
        borderColor: '#e0e0e0',
        backgroundColor: 'rgba(224, 224, 224, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        segment: {
          borderColor: ctx => {
            const index = ctx.p0DataIndex;
            if (index > 65 && index < 85) return '#ff3b3b'; // Anomaly
            if (index > 25 && index < 50) return '#ffcc00'; // Suspicious
            return '#00e5ff'; // Normal
          }
        }
      }
    ]
  },
  options: {
    ...sharedChartOptions,
    scales: {
      ...sharedChartOptions.scales,
      y: {
        ...sharedChartOptions.scales.y,
        min: -1.5,
        max: 1.5,
        ticks: {
          ...sharedChartOptions.scales.y.ticks,
          stepSize: 0.5
        }
      }
    }
  }
});

// ========== UPDATE PREDICTION DATA ==========
function updatePredictionData() {
  const attack = attackTypes[currentAttackIndex];
  
  // Update status
  const statusElement = document.getElementById('predictionStatus');
  statusElement.textContent = attack.type;
  statusElement.className = `summary-value status-${attack.status}`;
  
  // Update attack type
  document.getElementById('attackType').textContent = attack.type;
  
  // Update probabilities
  const attackProb = attack.status === 'attack' ? attack.probability : Math.random() * 30;
  const normalProb = 100 - attackProb;
  
  document.getElementById('attackProb').textContent = `${Math.round(attackProb)}%`;
  document.getElementById('normalProb').textContent = `${Math.round(normalProb)}%`;
  
  // Update probability bars
  document.querySelector('.probability-bar.attack').style.width = `${Math.round(attackProb)}%`;
  document.querySelector('.probability-bar.normal').style.width = `${Math.round(normalProb)}%`;
  
  // Update explanation
  const explanations = {
    'Replay Attack': 'Detected Replay Attack based on temporal sequence and signal drift anomalies.',
    'False Data Injection': 'Detected False Data Injection through sudden value deviations and pattern breaks.',
    'Frequency Manipulation': 'Detected Frequency Manipulation via harmonic analysis and frequency deviation.',
    'Voltage Spoofing': 'Detected potential Voltage Spoofing with suspicious voltage patterns.',
    'Normal Operation': 'System operating normally. No anomalies detected in current signals.'
  };
  
  document.getElementById('anomalyExplanation').textContent = explanations[attack.type];
}

// ========== SMOOTH UPDATE LOOP ==========
let updateInterval = 0;
const UPDATE_SPEED = 60; // Update every 60 frames (~1 second at 60 FPS)

function updateAIData() {
  updateInterval++;
  
  if (updateInterval % UPDATE_SPEED === 0) {
    // Rotate through attack types every 5 seconds
    currentAttackIndex = (currentAttackIndex + 1) % attackTypes.length;
    updatePredictionData();
    
    // Regenerate anomaly chart
    const newData = generateAnomalyWaveform(1, 0.5 + Math.random() * 0.5);
    anomalyChart.data.datasets[0].data = newData;
    anomalyChart.update('none');
  }
  
  requestAnimationFrame(updateAIData);
}

// ========== TAB SWITCHING ==========
document.addEventListener('DOMContentLoaded', () => {
  // Initialize prediction
  updatePredictionData();
  
  // Start animation loop
  requestAnimationFrame(updateAIData);
  
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Remove active class from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(`${tabName}-tab`).classList.add('active');
    });
  });

  // Action buttons
  document.querySelectorAll('.btn-action.acknowledge').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Alert acknowledged. Logging incident...');
    });
  });

  document.querySelectorAll('.btn-action.investigate').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Starting investigation mode. Opening detailed analysis...');
    });
  });
});