const binId = "67bfc726e41b4d34e49d8ae6";
const apiKey = "$2a$10$NclxDQUlXF9OtuxdQxDxVug.8VmB2C0VFq1qRRIHOgR4k.GYxKB/O";
const apiUrl = `https://api.jsonbin.io/v3/b/${binId}`;
const adminPassword = "admin123"; // Change this

const adminPanel = document.getElementById("admin-panel");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");
let isAdmin = false;

// Admin login
adminLoginBtn.addEventListener("click", () => {
    const password = prompt("Enter Admin Password:");
    if (password === adminPassword) {
        isAdmin = true;
        adminPanel.classList.remove("hidden");
        adminLoginBtn.classList.add("hidden");
        showAdminControls();
    } else {
        alert("Incorrect password!");
    }
});

// Admin logout
adminLogoutBtn.addEventListener("click", () => {
    isAdmin = false;
    adminPanel.classList.add("hidden");
    adminLoginBtn.classList.remove("hidden");
    hideAdminControls();
});

// Show/hide admin buttons
function showAdminControls() {
    document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => btn.classList.remove("hidden"));
}

function hideAdminControls() {
    document.querySelectorAll(".edit-btn, .delete-btn").forEach(btn => btn.classList.add("hidden"));
}

// Fetch and display items
async function fetchItems() {
    const response = await fetch(apiUrl, {
        headers: { "X-Master-Key": apiKey }
    });

    const data = await response.json();
    const items = data.record.items || [];

    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${item.name}: MVR ${item.price} per ${item.amount} ${item.unit}
            <button class="edit-btn hidden" onclick="editItem(${index})">Edit</button>
            <button class="delete-btn hidden" onclick="deleteItem(${index})">Delete</button>`;
        itemList.appendChild(li);
    });

    if (isAdmin) {
        showAdminControls();
    }
}

// Submit new or updated item data
document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("item-name").value.trim();
    const price = document.getElementById("item-price").value.trim();
    const amount = document.getElementById("item-amount").value.trim();
    const unit = document.getElementById("item-unit").value;

    if (!name || !price || !amount) {
        alert("Item name, price, and amount are required.");
        return;
    }

    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    let items = data.record.items || [];

    const existingIndex = items.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    if (existingIndex !== -1) {
        items[existingIndex].price = price;
        items[existingIndex].amount = amount;
        items[existingIndex].unit = unit;
    } else {
        items.push({ name, price, amount, unit });
    }

    await fetch(apiUrl, {
        method: "PUT",
        headers: { 
            "X-Master-Key": apiKey,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
    });

    fetchItems();
});

// Edit Item
async function editItem(index) {
    const newPrice = prompt("Enter new price (MVR):");
    const newAmount = prompt("Enter new amount (KG or QTY):");
    const newUnit = prompt("Enter new unit (KG or QTY):").toUpperCase();
    
    if (newPrice !== null && newAmount !== null && (newUnit === "KG" || newUnit === "QTY")) {
        const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
        const data = await response.json();
        let items = data.record.items || [];

        items[index].price = newPrice;
        items[index].amount = newAmount;
        items[index].unit = newUnit;

        await fetch(apiUrl, {
            method: "PUT",
            headers: { 
                "X-Master-Key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items })
        });

        fetchItems();
    } else {
        alert("Invalid input. Please enter a valid price, amount, and unit.");
    }
}

// Delete Item
async function deleteItem(index) {
    if (confirm("Are you sure you want to delete this item?")) {
        const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
        const data = await response.json();
        let items = data.record.items || [];

        items.splice(index, 1);

        await fetch(apiUrl, {
            method: "PUT",
            headers: { 
                "X-Master-Key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items })
        });

        fetchItems();
    }
}

// Load items on page load
fetchItems();
