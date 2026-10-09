document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  loadReviews(); // Mantiene las reseñas locales por si tienes de prueba
});

function switchTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => tab.classList.remove("active"));

  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach(btn => btn.classList.remove("active"));

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add("active");
  }

  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Control del Modal
function openReviewModal() {
  const modal = document.getElementById("reviewModal");
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
  }
}

function closeReviewModal() {
  const modal = document.getElementById("reviewModal");
  if (modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
  }
}

// Cargar reseñas guardadas desde el navegador (opcional)
function loadReviews() {
  const savedReviews = JSON.parse(localStorage.getItem("portfolio_reviews")) || [];
  const container = document.getElementById("reviewsContainer");
  if (!container) return;

  savedReviews.forEach(rev => {
    const reviewCard = document.createElement("div");
    reviewCard.className = "review-card";
    reviewCard.innerHTML = `
      <div class="review-stars">${rev.rating}</div>
      <p class="review-text">"${rev.comment}"</p>
      <div class="review-author">
        <strong>${rev.author}</strong>
        <span>Servicio: ${rev.service}</span>
      </div>
    `;
    container.prepend(reviewCard);
  });
}

// Enviar nueva reseña a Discord mediante Webhook
function submitReview(event) {
  event.preventDefault();
  
  const author = document.getElementById("authorInput").value;
  const service = document.getElementById("serviceInput").value;
  const rating = document.getElementById("ratingInput").value;
  const comment = document.getElementById("commentInput").value;

  // ⚠️ PEGA TU URL DE WEBHOOK DE DISCORD AQUÍ ENTRE LAS COMILLAS ⚠️
  const webhookURL = "https://discord.com/api/webhooks/1558184431859007598/y3QvEqZq-ndQNQunwwWF0TAMSSI7M1eRtSnJddg5v6F1KiGpr1eFU23pZixhDyqyKDGA";

  const payload = {
    embeds: [{
      title: "⭐ ¡Nueva Reseña en el Portafolio!",
      color: 8388736, // Color morado
      fields: [
        { name: "👤 Autor / Discord", value: author, inline: true },
        { name: "🛠️ Servicio", value: service, inline: true },
        { name: "⭐ Calificación", value: rating, inline: false },
        { name: "💬 Comentario", value: comment, inline: false }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  // Enviar los datos al Webhook de Discord
  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      showToast("¡Reseña enviada con éxito a Discord!");
      document.getElementById("reviewForm").reset();
      closeReviewModal();
    } else {
      showToast("Hubo un error al enviar la reseña.");
    }
  })
  .catch(error => {
    console.error("Error:", error);
    showToast("Error de conexión con Discord.");
  });
}

function copyDiscord() {
  const user = document.getElementById("discordUser").innerText;
  navigator.clipboard.writeText(user).then(() => {
    showToast("¡Usuario de Discord copiado!");
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
