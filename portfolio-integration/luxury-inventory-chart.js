// Add this to the initializeCharts function in Projects.vue
// Insert after the SCM Order Tracker chart initialization

// LuxuryInventory Chart
const luxuryProject = projects.value.find(p => p.id === 'luxury-inventory')
if (luxuryProject?.charts) {
  const luxuryChartElement = document.querySelector('[ref="luxuryChart"]')
  if (luxuryChartElement) {
    const ctx5 = luxuryChartElement.getContext('2d')
    charts.luxury = new Chart(ctx5, {
      type: 'doughnut',
      data: {
        labels: luxuryProject.charts.inventoryStatus.labels,
        datasets: [{
          data: luxuryProject.charts.inventoryStatus.data,
          backgroundColor: ['#8b5cf6', '#a855f7', '#c084fc', '#e879f9'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '65%'
      }
    })
  }
}
