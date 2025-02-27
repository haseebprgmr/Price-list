const binId = "67bfc726e41b4d34e49d8ae6"; 
const apiKey = "$2a$10$NclxDQUlXF9OtuxdQxDxVug.8VmB2C0VFq1qRRIHOgR4k.GYxKB/O";
const apiUrl = `https://api.jsonbin.io/v3/b/${binId}`;

// Fetch and display items
async function fetchItems() {
    const response = await fetch(apiUrl, {
        headers: { "X-Master-Key": apiKey }
    });

    const data = await response.json();
    const items = data.record.items;

    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name}: $${item.price}`;
        itemList.appendChild(li);
    });
}

// Submit new item data
document.getElementById("admin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("item-name").value;
    const price = document.getElementById("item-price").value;

    // Fetch current data
    const response = await fetch(apiUrl, { headers: { "X-Master-Key": apiKey } });
    const data = await response.json();
    const items = data.record.items || [];

    // Add new item
    items.push({ name, price });

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

// Load items on page load
fetchItems();
