// js/main.js
import './modules/ui/customAlert.js';
import { initAuthFlow } from './modules/authFlow.js';

document.addEventListener('DOMContentLoaded', () => {
  initAuthFlow();
});
