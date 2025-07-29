<!-- Add this special rendering block for LuxuryInventory in Projects.vue -->
<!-- Insert after the SCM Order Tracker rendering block -->

<!-- Special LuxuryInventory Dashboard Rendering -->
<div v-else-if="project.id === 'luxury-inventory'" class="luxury-container">
  <div class="luxury-header">
    <div class="luxury-title">💎 LuxuryInventory</div>
    <div class="luxury-live-indicator">
      <div class="live-dot"></div>
      <span>Enterprise</span>
    </div>
  </div>
  <div class="luxury-kpis">
    <div class="kpi-item">
      <div class="kpi-value">{{ project.mockData?.totalItems || '12,847' }}</div>
      <div class="kpi-label">Total Items</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-value">{{ project.mockData?.categories || '27' }}</div>
      <div class="kpi-label">Categories</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-value">{{ project.mockData?.reports || '156' }}</div>
      <div class="kpi-label">Reports</div>
    </div>
  </div>
  <div class="luxury-chart-container">
    <canvas :ref="'luxuryChart'" class="luxury-chart-canvas"></canvas>
  </div>
  <div class="luxury-features">
    <div class="feature-item">AI Forecasting</div>
    <div class="feature-item">PDF Reports</div>
    <div class="feature-item">Real-time Analytics</div>
    <div class="feature-item">ERP Integration</div>
  </div>
</div>
