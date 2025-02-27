const apiUrl = "/api/items";

// Fetch and display items
async function fetchItems() {
    const response = await fetch(apiUrl);
    const items = await response.json();

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

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ name, price }])
    });

    fetchItems();
});

fetchItems();
