document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
});

function copyDiscord() {
  const discordTag = "tu_usuario_discord"; // Sustituye por tu ID o nombre de Discord
  navigator.clipboard.writeText(discordTag).then(() => {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    
    const copyText = document.getElementById("copyText");
    const originalText = copyText.innerText;
    copyText.innerText = "¡Copiado!";

    setTimeout(() => {
      toast.classList.remove("show");
      copyText.innerText = originalText;
    }, 2500);
  });
}
