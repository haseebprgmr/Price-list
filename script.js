const BIN_ID = "67c116dbad19ca34f813d134";  // Replace with your JSONBin ID
const API_KEY = "$2a$10$dQjqnLB2i7wOWKDOwzJ0UuOqSwzQWUJSBBRrbHgz4aVkml7rG89wK";  // Replace with your API Key
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const form = document.getElementById("priceForm");
const productList = document.getElementById("productList");

// Fetch and display products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();
        productList.innerHTML = "";
        data.record.items.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${item.name} - $${item.price} (Kg: $${item.price_per_kg}, Unit: $${item.price_per_unit})`;
            productList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Add a product
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("price").value);
    const pricePerKg = parseFloat(document.getElementById("pricePerKg").value);
    const pricePerUnit = parseFloat(document.getElementById("pricePerUnit").value);

    try {
        const response = await fetch(`${API_URL}/latest`, {
            headers: { "X-Master-Key": API_KEY }
        });
        const data = await response.json();

        // Update the JSONBin data
        data.record.items.push({ name, price, price_per_kg: pricePerKg, price_per_unit: pricePerUnit });

        await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify({ items: data.record.items })
        });

        fetchProducts(); // Refresh list
        form.reset();
    } catch (error) {
        console.error("Error adding product:", error);
    }
});

// Initial fetch
fetchProducts();
