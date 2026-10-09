// ==========================================
// NAVEGACIÓN Y PESTAÑAS (TABS)
// ==========================================
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================
// MODAL DE RESEÑAS
// ==========================================
window.openReviewModal = function() {
  const modal = document.getElementById("reviewModal");
  if (modal) modal.classList.add("show");
};

window.closeReviewModal = function() {
  const modal = document.getElementById("reviewModal");
  if (modal) modal.classList.remove("show");
};

// ==========================================
// COPIAR DISCORD CON TOAST
// ==========================================
window.copyDiscord = function() {
  navigator.clipboard.writeText("Jwpxtrm");
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
};

// Inicializar iconos de Lucide al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});
