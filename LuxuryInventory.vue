<template>
  <div class="luxury-inventory-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-icon">💎</div>
          <h1 class="hero-title">LuxuryInventory</h1>
          <p class="hero-subtitle">Enterprise Luxury Inventory Management System</p>
          <div class="hero-description">
            <p>A comprehensive full-stack inventory management system designed specifically for luxury retail operations. Built with React 18, TypeScript, and PostgreSQL, featuring AI-powered forecasting and enterprise-grade reporting capabilities.</p>
          </div>
          <div class="hero-buttons">
            <a href="https://github.com/iamruwainkelly/LuxuryInventory" target="_blank" class="btn-primary">
              <i class="fab fa-github"></i>
              View Source Code
            </a>
            <button @click="scrollToDemo" class="btn-secondary">
              <i class="fas fa-play"></i>
              View Demo
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="dashboard-preview">
            <div class="preview-header">
              <div class="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="preview-title">LuxuryInventory Dashboard</div>
            </div>
            <div class="preview-content">
              <div class="preview-metrics">
                <div class="metric-card">
                  <div class="metric-value">12,847</div>
                  <div class="metric-label">Total Items</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">27</div>
                  <div class="metric-label">Categories</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">97.3%</div>
                  <div class="metric-label">AI Accuracy</div>
                </div>
              </div>
              <div class="preview-chart">
                <canvas ref="heroChart" class="hero-chart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="demo">
      <div class="section-container">
        <h2 class="section-title">Enterprise Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>AI-Powered Forecasting</h3>
            <p>Advanced machine learning algorithms predict demand patterns and optimize inventory levels for luxury goods.</p>
            <ul>
              <li>Seasonal trend analysis</li>
              <li>Demand pattern recognition</li>
              <li>Automated reorder points</li>
              <li>Price elasticity modeling</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Advanced Analytics</h3>
            <p>Comprehensive reporting and analytics dashboard with real-time insights into inventory performance.</p>
            <ul>
              <li>Real-time dashboard</li>
              <li>9 report types</li>
              <li>PDF/Excel/CSV exports</li>
              <li>Interactive charts</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🏢</div>
            <h3>Enterprise Ready</h3>
            <p>Built for scale with enterprise-grade architecture, security, and integration capabilities.</p>
            <ul>
              <li>PostgreSQL database</li>
              <li>RESTful API design</li>
              <li>ERP integration ready</li>
              <li>Multi-user support</li>
            </ul>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Luxury Focus</h3>
            <p>Specialized features for high-value inventory management with luxury market considerations.</p>
            <ul>
              <li>Authenticity tracking</li>
              <li>Provenance management</li>
              <li>High-value alerts</li>
              <li>VIP client tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Stack Section -->
    <section class="tech-section">
      <div class="section-container">
        <h2 class="section-title">Technology Stack</h2>
        <div class="tech-grid">
          <div class="tech-category">
            <h3>Frontend</h3>
            <div class="tech-items">
              <div class="tech-item">React 18</div>
              <div class="tech-item">TypeScript</div>
              <div class="tech-item">TailwindCSS</div>
              <div class="tech-item">Recharts</div>
              <div class="tech-item">React Router</div>
            </div>
          </div>
          
          <div class="tech-category">
            <h3>Backend</h3>
            <div class="tech-items">
              <div class="tech-item">Node.js</div>
              <div class="tech-item">Express.js</div>
              <div class="tech-item">PostgreSQL</div>
              <div class="tech-item">Drizzle ORM</div>
              <div class="tech-item">RESTful API</div>
            </div>
          </div>
          
          <div class="tech-category">
            <h3>Features</h3>
            <div class="tech-items">
              <div class="tech-item">AI/ML Algorithms</div>
              <div class="tech-item">PDF Generation</div>
              <div class="tech-item">Excel Export</div>
              <div class="tech-item">Real-time Updates</div>
              <div class="tech-item">Data Visualization</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="architecture-section">
      <div class="section-container">
        <h2 class="section-title">System Architecture</h2>
        <div class="architecture-diagram">
          <div class="arch-layer">
            <h3>Presentation Layer</h3>
            <div class="arch-components">
              <div class="arch-component">React Dashboard</div>
              <div class="arch-component">Analytics UI</div>
              <div class="arch-component">Reporting Interface</div>
            </div>
          </div>
          
          <div class="arch-layer">
            <h3>Business Logic</h3>
            <div class="arch-components">
              <div class="arch-component">AI Forecasting Engine</div>
              <div class="arch-component">Inventory Management</div>
              <div class="arch-component">Report Generation</div>
            </div>
          </div>
          
          <div class="arch-layer">
            <h3>Data Layer</h3>
            <div class="arch-components">
              <div class="arch-component">PostgreSQL Database</div>
              <div class="arch-component">File Storage</div>
              <div class="arch-component">Cache Layer</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Metrics Section -->
    <section class="metrics-section">
      <div class="section-container">
        <h2 class="section-title">Project Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-number">3,000+</div>
            <div class="metric-description">Lines of Code</div>
          </div>
          <div class="metric-box">
            <div class="metric-number">25+</div>
            <div class="metric-description">Components</div>
          </div>
          <div class="metric-box">
            <div class="metric-number">9</div>
            <div class="metric-description">Report Types</div>
          </div>
          <div class="metric-box">
            <div class="metric-number">97.3%</div>
            <div class="metric-description">AI Accuracy</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2>Ready to Explore?</h2>
          <p>Dive into the complete source code and documentation on GitHub</p>
          <a href="https://github.com/iamruwainkelly/LuxuryInventory" target="_blank" class="cta-button">
            <i class="fab fa-github"></i>
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Chart } from 'chart.js/auto'

const heroChart = ref(null)
let chart = null

const scrollToDemo = () => {
  const element = document.getElementById('demo')
  element?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Initialize hero chart
  if (heroChart.value) {
    const ctx = heroChart.value.getContext('2d')
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock', 'On Order'],
        datasets: [{
          data: [68, 22, 6, 4],
          backgroundColor: [
            '#8b5cf6',
            '#a855f7', 
            '#c084fc',
            '#e879f9'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: '70%'
      }
    })
  }
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<style scoped>
.luxury-inventory-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Hero Section */
.hero-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f3e8ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #e0e7ff;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #c7d2fe;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Dashboard Preview */
.dashboard-preview {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-dots {
  display: flex;
  gap: 0.5rem;
}

.preview-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.preview-title {
  font-weight: 600;
  color: white;
}

.preview-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #e0e7ff;
}

.preview-chart {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-chart {
  max-width: 120px !important;
  max-height: 120px !important;
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.feature-card p {
  margin-bottom: 1.5rem;
  color: #e0e7ff;
  line-height: 1.6;
}

.feature-card ul {
  list-style: none;
  padding: 0;
}

.feature-card li {
  padding: 0.5rem 0;
  color: #c7d2fe;
  position: relative;
  padding-left: 1.5rem;
}

.feature-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #8b5cf6;
  font-weight: bold;
}

/* Technology Section */
.tech-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tech-category {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tech-category h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-item {
  background: rgba(139, 92, 246, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

/* Architecture Section */
.architecture-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.arch-layer {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.arch-layer h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
}

.arch-components {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.arch-component {
  background: rgba(139, 92, 246, 0.3);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(139, 92, 246, 0.5);
}

/* Metrics Section */
.metrics-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.metric-box {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.metric-number {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
}

.metric-description {
  font-size: 1rem;
  color: #e0e7ff;
}

/* CTA Section */
.cta-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
}

.cta-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #e0e7ff;
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .preview-metrics {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .architecture-diagram {
    gap: 1rem;
  }
  
  .arch-components {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-section,
  .features-section,
  .tech-section,
  .architecture-section,
  .metrics-section,
  .cta-section {
    padding: 3rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
