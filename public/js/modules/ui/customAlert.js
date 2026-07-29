// js/modules/ui/customAlert.js

// Cria o HTML do modal dinamicamente
const modalHTML = `
  <div id="custom-alert-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(2px);">
    <div style="background: #ffffff; border-radius: 12px; padding: 24px; width: 90%; max-width: 320px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center; font-family: 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="font-size: 24px; margin-bottom: 12px; color: #6d28d9;">⚠️</div>
      <h3 style="margin: 0 0 12px; font-size: 18px; color: #1f2937;">Aviso</h3>
      <p id="custom-alert-message" style="margin: 0 0 20px; font-size: 14px; color: #4b5563; line-height: 1.5;"></p>
      <button id="custom-alert-btn" style="background: #6d28d9; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; transition: background 0.2s;">
        OK
      </button>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

const overlay = document.getElementById('custom-alert-overlay');
const messageEl = document.getElementById('custom-alert-message');
const btn = document.getElementById('custom-alert-btn');

let alertQueue = [];
let isAlertOpen = false;

function processQueue() {
  if (alertQueue.length === 0 || isAlertOpen) return;
  
  isAlertOpen = true;
  const message = alertQueue.shift();
  messageEl.textContent = message;
  overlay.style.display = 'flex';
}

btn.addEventListener('click', () => {
  overlay.style.display = 'none';
  isAlertOpen = false;
  processQueue();
});

// Substitui o window.alert global
window.alert = function(message) {
  alertQueue.push(message);
  processQueue();
};
