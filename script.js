// JSONBin.io Configuration
const binId = '67bfc726e41b4d34e49d8ae6'; // Replace with your actual Bin ID
const apiKey = '$2a$10$PBdovtf4GVCRv1mFrs4EReP7QAkgpDl4CE69Cn7I5CdN3Z44ZaXX.'; // Replace with your actual API Key

// App State
let isAdmin = false;

// Authentication
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    // Basic password check
    if(password === 'admin123') {
        isAdmin = true;
        document.getElementById('adminControls').style.display = 'block';
        document.getElementById('adminLogin').style.display = 'none';
        errorDiv.textContent = '';
        showMessage('Login successful!', 'success');
        loadItems();
    } else {
        errorDiv.textContent = 'Invalid password!';
        showMessage('Authentication failed', 'error');
    }
}

// Database Operations
async function addOrUpdateItem() {
    const name = document.getElementById('itemName').value.trim();
    const price = document.getElementById('itemPrice').value;
    const statusDiv = document.getElementById('saveStatus');

    console.log("Adding item:", { name, price }); // Debug log

    if (!isAdmin) {
        showMessage('Unauthorized access!', 'error');
        return;
    }

    if (!name || !price) {
        showMessage('Please fill all fields!', 'error');
        return;
    }

    try {
        const timestamp = new Date().toISOString();
        
        // Fetch existing items
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            headers: { 'X-Master-Key': apiKey }
        });
        const { record: items } = await response.json();

        // Add or update item
        items[name] = { price: parseFloat(price), timestamp };

        // Save updated items
        await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(items)
        });

        console.log("Item saved successfully!"); // Debug log
        showMessage('Item saved successfully!', 'success');
        clearForm();
        loadItems(); // Refresh the list
    } catch (error) {
        console.error("Database error:", error); // Debug log
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Load Items
async function loadItems() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            headers: { 'X-Master-Key': apiKey }
        });
        const { record: items } = await response.json();

        console.log("Database snapshot:", items); // Debug log
        displayItems(items);
    } catch (error) {
        console.error("Error loading items:", error); // Debug log
    }
}

// Display Items
function displayItems(items) {
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    if (!items || Object.keys(items).length === 0) {
        console.log("No items found in the database."); // Debug log
        itemsList.innerHTML = '<p>No items available.</p>';
        return;
    }

    Object.entries(items).forEach(([name, details]) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item-card';
        itemElement.innerHTML = `
            <h3>${name}</h3>
            <p>Price: $${details.price.toFixed(2)}</p>
            <p class="timestamp">Last updated: ${new Date(details.timestamp).toLocaleString()}</p>
        `;
        itemsList.appendChild(itemElement);
    });
}

// Place Order
function placeOrder() {
    const name = document.getElementById('orderName').value.trim();
    const item = document.getElementById('orderItem').value.trim();
    const quantity = document.getElementById('orderQuantity').value.trim();
    const statusDiv = document.getElementById('orderStatus');

    if (!name || !item || !quantity) {
        showMessage('Please fill all fields!', 'error', statusDiv);
        return;
    }

    const order = {
        name,
        item,
        quantity,
        timestamp: new Date().toISOString()
    };

    // Save order as a text file
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${name}_${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('Order placed successfully!', 'success', statusDiv);
}

// Helpers
function showMessage(message, type, element) {
    const statusDiv = element || document.getElementById('saveStatus');
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    setTimeout(() => statusDiv.textContent = '', 3000);
}

function clearForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});
