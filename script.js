const API_URL = "http://localhost:5000/api/products"; // Change to deployed URL when hosting

const form = document.getElementById("priceForm");
const productList = document.getElementById("productList");

// Show Loading State
function setLoading(isLoading) {
    const loadingText = document.getElementById("loadingText");
    loadingText.style.display = isLoading ? "block" : "none";
}

// Fetch and display products
async function fetchProducts() {
    setLoading(true);
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        productList.innerHTML = "";
        
        if (data.length === 0) {
            productList.innerHTML = "<p>No products found.</p>";
        } else {
            data.forEach((item) => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${item.name}</strong> - $${item.price} 
                    (Kg: $${item.price_per_kg}, Unit: $${item.price_per_unit}) 
                    <button class="delete-btn" data-id="${item._id}">❌</button>
                `;
                productList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        productList.innerHTML = "<p style='color: red;'>Failed to load products.</p>";
    } finally {
        setLoading(false);
    }
}

// Add a product
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("price").value);
    const pricePerKg = parseFloat(document.getElementById("pricePerKg").value);
    const pricePerUnit = parseFloat(document.getElementById("pricePerUnit").value);

    if (!name || !price || !pricePerKg || !pricePerUnit) {
        alert("Please fill in all fields!");
        return;
    }

    const newProduct = { name, price, price_per_kg: pricePerKg, price_per_unit: pricePerUnit };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        fetchProducts(); // Refresh list
        form.reset();
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product.");
    }
});

// Delete a product
productList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const productId = event.target.getAttribute("data-id");

        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });

                if (!response.ok) {
                    throw new Error("Failed to delete product");
                }

                fetchProducts(); // Refresh list
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    }
});

// Initial fetch
fetchProducts();
