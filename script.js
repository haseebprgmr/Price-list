const BIN_ID = '67c116dbad19ca34f813d134';
const API_KEY = '$2a$10$PBdovtf4GVCRv1mFrs4EReP7QAkgpDl4CE69Cn7I5CdN3Z44ZaXX.';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function fetchItems() {
  const response = await fetch(API_URL, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const data = await response.json();
  displayItems(data.record);
}

function displayItems(items) {
  const itemList = document.getElementById('item-list');
  itemList.innerHTML = items.map(item => `
    <div class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-bold">${item.name}</h2>
      <p>Price per Kg: $${item.priceKg}</p>
      <p>Price per Qty: $${item.priceQty}</p>
    </div>
  `).join('');
}

fetchItems();
