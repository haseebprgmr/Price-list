const binId = "67bfc726e41b4d34e49d8ae6";
const apiKey = "$2a$10$NclxDQUlXF9OtuxdQxDxVug.8VmB2C0VFq1qRRIHOgR4k.GYxKB/O";
const apiUrl = `https://api.jsonbin.io/v3/b/${binId}`;
const adminPassword = "admin123"; // Change this to your own password

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
        li.innerHTML = `${item.name}: MVR ${item.price} 
            <button class="edit-btn" onclick="editItem(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>`;
        itemList.appendChild(li);
    });
}

// Submit new item data (Admin Only)
document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const passwordInput = document.getElementById("admin-password").value;
    if (passwordInput !== adminPassword) {
        alert("Incorrect Admin Password!");
        return;
    }

    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;

    // Fetch current data
    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    let items = data.record.items || [];

    // Check if item exists and update, otherwise add new
    const existingItem = items.find(item => item.name === name);
    if (existingItem) {
        existingItem.price = price;
    } else {
        items.push({ name, price });
    }

    // Update JSONBin
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
    const password = prompt("Enter Admin Password:");
    if (password !== adminPassword) {
        alert("Incorrect password!");
        return;
    }

    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    let items = data.record.items || [];

    const newName = prompt("Edit Item Name:", items[index].name);
    const newPrice = prompt("Edit Price (MVR):", items[index].price);

    if (newName && newPrice) {
        items[index].name = newName;
        items[index].price = newPrice;

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

// Delete Item
async function deleteItem(index) {
    const password = prompt("Enter Admin Password:");
    if (password !== adminPassword) {
        alert("Incorrect password!");
        return;
    }

    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    let items = data.record.items || [];

    items.splice(index, 1); // Remove item

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

// Load items on page load
fetchItems();
