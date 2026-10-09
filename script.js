document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  loadReviews(); // Carga las reseñas guardadas al abrir la página
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

// Control del Modal (Forzando display para asegurar que se vea)
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

// Cargar reseñas guardadas desde el navegador
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

// Guardar nueva reseña
function submitReview(event) {
  event.preventDefault();
  
  const author = document.getElementById("authorInput").value;
  const service = document.getElementById("serviceInput").value;
  const rating = document.getElementById("ratingInput").value;
  const comment = document.getElementById("commentInput").value;

  const newReview = { author, service, rating, comment };

  // Guardar en el almacenamiento local (localStorage)
  const savedReviews = JSON.parse(localStorage.getItem("portfolio_reviews")) || [];
  savedReviews.unshift(newReview);
  localStorage.setItem("portfolio_reviews", JSON.stringify(savedReviews));

  // Mostrar la tarjeta en pantalla al instante
  const reviewCard = document.createElement("div");
  reviewCard.className = "review-card";
  reviewCard.innerHTML = `
    <div class="review-stars">${rating}</div>
    <p class="review-text">"${comment}"</p>
    <div class="review-author">
      <strong>${author}</strong>
      <span>Servicio: ${service}</span>
    </div>
  `;

  const container = document.getElementById("reviewsContainer");
  if (container) {
    container.prepend(reviewCard);
  }

  document.getElementById("reviewForm").reset();
  closeReviewModal();

  showToast("¡Reseña publicada con éxito!");
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
