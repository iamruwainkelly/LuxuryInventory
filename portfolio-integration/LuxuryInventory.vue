<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-dark-bg">
      <div class="luxury-background"></div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-2xl">💎</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold gradient-text">LuxuryInventory</h1>
          </div>
          <p class="text-light-text text-lg max-w-3xl mx-auto">
            Enterprise luxury inventory management system with AI-powered forecasting, 
            automated reporting, and real-time analytics for high-end retail operations.
          </p>
          
          <!-- Status Banner -->
          <div class="mt-6 mx-auto max-w-2xl">
            <div class="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg p-4">
              <div class="flex items-center justify-center gap-3">
                <div class="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span class="text-purple-200 font-medium">
                  Live Demo - Full Enterprise Features Available
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Notice -->
        <div class="glass-card p-8 mb-8 text-center">
          <h2 class="text-2xl font-bold mb-4 gradient-text">Portfolio Integration Demo</h2>
          <p class="text-light-text mb-6">
            This is a demonstration of how LuxuryInventory would be integrated into the portfolio.
            The full application is running locally with comprehensive features including:
          </p>
          
          <!-- Feature Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h3 class="font-semibold mb-2">AI Forecasting</h3>
              <p class="text-sm text-light-text">Machine learning algorithms for demand prediction</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3 class="font-semibold mb-2">Real-time Analytics</h3>
              <p class="text-sm text-light-text">Live dashboards with comprehensive metrics</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📋</div>
              <h3 class="font-semibold mb-2">Automated Reports</h3>
              <p class="text-sm text-light-text">PDF/Excel generation with 9 report types</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔗</div>
              <h3 class="font-semibold mb-2">ERP Integration</h3>
              <p class="text-sm text-light-text">Ready for enterprise system integration</p>
            </div>
          </div>

          <!-- Live Application Link -->
          <div class="text-center">
            <a href="http://localhost:5173" target="_blank" 
               class="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              <span>🚀</span>
              Access Full LuxuryInventory Application
            </a>
            <p class="text-sm text-light-text mt-2">
              Application running locally on port 5173
            </p>
          </div>
        </div>

        <!-- Technical Architecture -->
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Tech Stack -->
          <div class="glass-card p-6">
            <h3 class="text-xl font-bold mb-4 gradient-text">Technology Stack</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="tech-badge">React 18</div>
              <div class="tech-badge">TypeScript</div>
              <div class="tech-badge">Node.js</div>
              <div class="tech-badge">PostgreSQL</div>
              <div class="tech-badge">Drizzle ORM</div>
              <div class="tech-badge">TailwindCSS</div>
              <div class="tech-badge">Recharts</div>
              <div class="tech-badge">AI/ML</div>
            </div>
          </div>

          <!-- Metrics -->
          <div class="glass-card p-6">
            <h3 class="text-xl font-bold mb-4 gradient-text">Project Metrics</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-light-text">Total Items</span>
                <span class="text-white font-semibold">12,847</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light-text">Categories</span>
                <span class="text-white font-semibold">27</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light-text">Reports Generated</span>
                <span class="text-white font-semibold">156</span>
              </div>
              <div class="flex justify-between">
                <span class="text-light-text">Forecast Accuracy</span>
                <span class="text-white font-semibold">97.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Set page title
onMounted(() => {
  document.title = 'LuxuryInventory - Enterprise Inventory Management - RUWΔIN KΞLLY'
})
</script>

<style scoped>
.luxury-background {
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(196, 132, 252, 0.1) 0%, transparent 50%);
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.4);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tech-badge {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a855f7;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.tech-badge:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.5);
  transform: scale(1.05);
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
