const BIN_ID = '67c0ae51ad19ca34f813a934'; // Replace with your Bin ID
const API_KEY = '$2a$10$PBdovtf4GVCRv1mFrs4EReP7QAkgpDl4CE69Cn7I5CdN3Z44ZaXX.'; // Replace with your API Key
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
    <div class="item-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h2 class="text-2xl font-bold text-purple-800 mb-2">${item.name}</h2>
      <p class="text-gray-600 mb-1"><span class="font-semibold">Price per Kg:</span> MVR ${item.priceKg}</p>
      <p class="text-gray-600"><span class="font-semibold">Price per Qty:</span> MVR ${item.priceQty}</p>
    </div>
  `).join('');
}

// Refresh items every 5 seconds
setInterval(fetchItems, 5000);

// Initial fetch
fetchItems();
