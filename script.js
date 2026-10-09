document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
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

function openReviewModal() {
  document.getElementById("reviewModal").classList.add("active");
}

function closeReviewModal() {
  document.getElementById("reviewModal").classList.remove("active");
}

function submitReview(event) {
  event.preventDefault();
  
  const author = document.getElementById("authorInput").value;
  const service = document.getElementById("serviceInput").value;
  const rating = document.getElementById("ratingInput").value;
  const comment = document.getElementById("commentInput").value;

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
  container.prepend(reviewCard);

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
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
