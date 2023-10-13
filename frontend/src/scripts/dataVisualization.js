const ctx = document.getElementById('graph');

Chart.defaults.plugins.legend.display = false;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      datasets: [{
        data: [0.2, 1.3, 0.34, 0.13, 0.7, 2.6],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });