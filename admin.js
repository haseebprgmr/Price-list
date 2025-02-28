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

// Display items in the admin panel
function displayItems(items) {
  const itemList = document.getElementById('admin-item-list');
  itemList.innerHTML = items.map((item, index) => `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-xl font-bold">${item.name}</h2>
      <p>Price per Kg: $${item.priceKg}</p>
      <p>Price per Qty: $${item.priceQty}</p>
      <button onclick="deleteItem(${index})" class="bg-red-500 text-white p-2 mt-2">Delete</button>
    </div>
  `).join('');
}

// Add a new item
document.getElementById('item-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const item = {
    name: document.getElementById('item-name').value,
    priceKg: document.getElementById('item-price-kg').value,
    priceQty: document.getElementById('item-price-qty').value
  };
  await addItem(item);
});

async function addItem(item) {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify([...await getItems(), item])
    });
    const data = await response.json();
    console.log('Item added:', data);
    fetchItems();
  } catch (error) {
    console.error('Error adding item:', error);
  }
}

// Delete an item
async function deleteItem(index) {
  try {
    const items = await getItems();
    items.splice(index, 1);
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'X-Master-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    const data = await response.json();
    console.log('Item deleted:', data);
    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Fetch current items
async function getItems() {
  const response = await fetch(API_URL, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const data = await response.json();
  return data.record;
}

// Initial fetch
fetchItems();
