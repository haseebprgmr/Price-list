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
        li.innerHTML = `
            ${item.name}: MVR ${item.price} 
            <button class="edit-btn" onclick="editItem(${index})">Edit</button>
            <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>`;
        itemList.appendChild(li);
    });
}

// Submit new or updated item data
document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const passwordInput = document.getElementById("admin-password").value;
    if (passwordInput !== adminPassword) {
        alert("Incorrect Admin Password!");
        return;
    }

    const name = document.getElementById("item-name").value.trim();
    const price = document.getElementById("item-price").value.trim();

    if (!name || !price) {
        alert("Item name and price are required.");
        return;
    }

    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    let items = data.record.items || [];

    // Check if the item already exists
    const existingIndex = items.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    if (existingIndex !== -1) {
        items[existingIndex].price = price;
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

    const newPrice = prompt(`Edit price for ${items[index].name}:`, items[index].price);

    if (newPrice !== null) {
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

    if (confirm(`Are you sure you want to delete ${items[index].name}?`)) {
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
