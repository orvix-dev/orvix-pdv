// js/modules/ui/receipt.js
export function showReceipt(sale) {
  const modal = document.getElementById('receipt-modal');
  const content = document.getElementById('receipt-content');
  if (!modal || !content) return;

  const itemsHtml = sale.items.map(i => `
    <div class="receipt-line">
      <span>${i.name}${i.weightGrams ? ` (${i.weightGrams}g)` : ''}</span>
      <span>R$ ${Number(i.totalPrice).toFixed(2)}</span>
    </div>
  `).join('');

  content.innerHTML = `
    ${itemsHtml}
    <hr />
    <div class="receipt-line total"><span>Total</span><span>R$ ${Number(sale.total).toFixed(2)}</span></div>
  `;
  modal.style.display = 'flex';
}
