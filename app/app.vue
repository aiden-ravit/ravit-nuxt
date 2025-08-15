<template>
  <div class="container">
    <h1>안녕하세요! 👋</h1>
    <p>이것은 Nuxt + Cloudflare Workers로 만든 헬로월드 앱입니다!</p>
    <div class="features">
      <div class="feature">
        <h3>🚀 Nuxt 4</h3>
        <p>최신 Nuxt 프레임워크로 구축</p>
      </div>
      <div class="feature">
        <h3>☁️ Cloudflare Workers</h3>
        <p>전 세계 엣지에서 실행</p>
      </div>
      <div class="feature">
        <h3>⚡ 빠른 성능</h3>
        <p>즉시 로딩과 빠른 응답</p>
      </div>
    </div>
    <button @click="count++" class="counter-btn">
      클릭 횟수: {{ count }}
    </button>
  </div>
</template>

<script setup>
const count = ref(0)
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #2563eb;
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.feature h3 {
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.counter-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.counter-btn:hover {
  background: #1d4ed8;
}

.counter-btn:active {
  transform: scale(0.98);
}
</style>
