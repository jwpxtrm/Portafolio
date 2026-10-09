import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// Configuración de Firebase integrada
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

// ¡No olvides poner aquí la URL de tu Webhook de Discord!
const webhookURL = "https://discord.com/api/webhooks/1558184431859007598/y3QvEqZq-ndQNQunwwWF0TAMSSI7M1eRtSnJddg5v6F1KiGpr1eFU23pZixhDyqyKDGA";

// Función para enviar reseña
window.submitReview = async function(event) {
  event.preventDefault();
  
  const name = document.getElementById("review-name").value;
  const comment = document.getElementById("review-comment").value;
  const rating = document.getElementById("review-rating").value;

  try {
    // Guardar en Firebase Firestore
    await addDoc(collection(db, "reviews"), {
      name: name,
      comment: comment,
      rating: Number(rating),
      date: new Date().toISOString()
    });

    // Enviar notificación al Webhook de Discord
    if (webhookURL !== "TU_WEBHOOK_URL_DE_DISCORD") {
      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `⭐ **Nueva Reseña Recibida**\n👤 **Nombre:** ${name}\n💬 **Comentario:** ${comment}\n🌟 **Calificación:** ${rating}/5`
        })
      });
    }

    alert("¡Reseña enviada con éxito!");
    document.getElementById("review-form").reset();
    loadReviews();
  } catch (error) {
    console.error("Error al enviar la reseña:", error);
    alert("Hubo un error al enviar la reseña. Revisa la consola.");
  }
};

// Función para cargar las reseñas dinámicamente desde Firestore
async function loadReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  container.innerHTML = "Cargando reseñas...";

  try {
    const q = query(collection(db, "reviews"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    
    container.innerHTML = "";
    if (querySnapshot.empty) {
      container.innerHTML = "<p>No hay reseñas todavía. ¡Sé el primero en dejar una!</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const reviewCard = document.createElement("div");
      reviewCard.className = "review-card";
      reviewCard.innerHTML = `
        <h4>${escapeHtml(data.name)}</h4>
        <p>⭐ ${data.rating}/5</p>
        <p>${escapeHtml(data.comment)}</p>
        <small>${new Date(data.date).toLocaleDateString()}</small>
      `;
      container.appendChild(reviewCard);
    });
  } catch (error) {
    console.error("Error al cargar reseñas:", error);
    container.innerHTML = "<p>Error al cargar las reseñas.</p>";
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener("DOMContentLoaded", loadReviews);
