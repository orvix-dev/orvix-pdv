// js/modules/ui/notifications.js
export function showNotification(message, type = 'success') {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = message;
  el.className = `notification show ${type}`;
  setTimeout(() => el.classList.remove('show'), 3000);
}
