import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCYmEGKfyMCfINPS0S9kuSjYZozxGHcWgE",
  authDomain: "portafolio-jwpxtrm.firebaseapp.com",
  projectId: "portafolio-jwpxtrm",
  storageBucket: "portafolio-jwpxtrm.firebasestorage.app",
  messagingSenderId: "578916510239",
  appId: "1:578916510239:web:667290cafde6882d8e432a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ¡Reemplaza esto con tu Webhook real de Discord cuando lo tengas!
const webhookURL = "https://discord.com/api/webhooks/1558184431859007598/y3QvEqZq-ndQNQunwwWF0TAMSSI7M1eRtSnJddg5v6F1KiGpr1eFU23pZixhDyqyKDGA";

// ==========================================
// 1. NAVEGACIÓN Y PESTAÑAS (TABS)
// ==========================================
window.switchTab = function(tabId) {
  // Ocultar todas las secciones
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });

  // Quitar la clase active de los botones del menú
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Activar el botón correspondiente en el menú superior
  const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  // Subir la página al inicio suavemente al cambiar de pestaña
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ==========================================
// 2. MODAL DE RESEÑAS
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
// 3. COPIAR DISCORD CON TOAST
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

// ==========================================
// 4. FIREBASE: ENVIAR Y CARGAR RESEÑAS
// ==========================================
window.submitReview = async function(event) {
  event.preventDefault();
  
  const author = document.getElementById("authorInput").value;
  const service = document.getElementById("serviceInput").value;
  const rating = document.getElementById("ratingInput").value;
  const comment = document.getElementById("commentInput").value;

  try {
    // Guardar en Firestore
    await addDoc(collection(db, "reviews"), {
      name: author,
      service: service,
      rating: rating,
      comment: comment,
      date: new Date().toISOString()
    });

    // Enviar notificación a Discord (si el webhook está configurado)
    if (webhookURL && webhookURL !== "TU_WEBHOOK_URL_DE_DISCORD") {
      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `⭐ **Nueva Reseña Recibida**\n👤 **Autor:** ${author}\n🛠️ **Servicio:** ${service}\n🌟 **Calificación:** ${rating}\n💬 **Comentario:** ${comment}`
        })
      });
    }

    alert("¡Reseña publicada con éxito!");
    document.getElementById("reviewForm").reset();
    closeReviewModal();
    loadReviews();
  } catch (error) {
    console.error("Error al enviar reseña:", error);
    alert("Hubo un error al enviar la reseña.");
  }
};

async function loadReviews() {
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  container.innerHTML = "<p>Cargando reseñas...</p>";

  try {
    const q = query(collection(db, "reviews"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    
    container.innerHTML = "";
    if (querySnapshot.empty) {
      container.innerHTML = "<p class='no-reviews'>No hay reseñas todavía. ¡Sé el primero en dejar una!</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "review-card";
      card.innerHTML = `
        <div class="review-header-card">
          <h4>${escapeHtml(data.name)}</h4>
          <span class="review-stars">${data.rating}</span>
        </div>
        <p class="review-service">Servicio: <strong>${escapeHtml(data.service)}</strong></p>
        <p class="review-text">"${escapeHtml(data.comment)}"</p>
        <small class="review-date">${new Date(data.date).toLocaleDateString()}</small>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar reseñas:", error);
    container.innerHTML = "<p>Error al cargar las reseñas.</p>";
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Cargar reseñas y activar iconos al iniciar la página
document.addEventListener("DOMContentLoaded", () => {
  loadReviews();
  if (window.lucide) {
    lucide.createIcons();
  }
});
