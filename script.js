const BIN_ID = '67c0ae51ad19ca34f813a934'; // Replace with your JSONBin.io bin ID
const API_KEY = '$2a$10$PBdovtf4GVCRv1mFrs4EReP7QAkgpDl4CE69Cn7I5CdN3Z44ZaXX.'; // Replace with your JSONBin.io API key
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Fetch items from JSONBin
async function fetchItems() {
  try {
    const response = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await response.json();
    displayItems(data.record);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

// Display items on the page
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

// Refresh items every 5 seconds
setInterval(fetchItems, 5000);

// Initial fetch
fetchItems();
