
async function loadAdminProducts() {
    const productList = document.getElementById("adminProductList");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/products/all", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            productList.textContent =
                data.message || "Unable to load products.";
            return;
        }

        const products = Array.isArray(data) ? data : data.products;

        if (!products || products.length === 0) {
            productList.textContent = "No products available.";
            return;
        }

        productList.innerHTML = "";

        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "admin-card";

            card.innerHTML = `
                ${product.image
                    ? `<img src="${product.image}"
                        alt="${product.name}"
                        width="180"
                        height="150"
                        style="object-fit: contain;">`
                    : "<p>No image available</p>"
                }

                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>

                <button onclick="editProduct('${product._id}')">
                    Edit
                </button>

                <button onclick="deleteProduct('${product._id}')">
                    Delete
                </button>
            `;

            productList.appendChild(card);
        });

    } catch (error) {
        productList.textContent = "Server connection error.";
        console.error(error);
    }
}

// EDIT PRODUCT
async function editProduct(productId) {
    const token = localStorage.getItem("token");

    const name = prompt("Enter new product name:");
    if (name === null || name.trim() === "") return;

    const price = prompt("Enter new product price:");
    if (price === null || price.trim() === "") return;

    const category = prompt("Enter new category:");
    if (category === null || category.trim() === "") return;

    const stock = prompt("Enter new stock:");
    if (stock === null || stock.trim() === "") return;

    if (
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0 ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
    ) {
        alert("Enter a valid price and stock.");
        return;
    }

    try {
        const response = await fetch(
            "/api/products/update/" + productId,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    name: name.trim(),
                    price: Number(price),
                    category: category.trim(),
                    stock: Number(stock)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Product updated successfully!");
            loadAdminProducts();
        } else {
            alert(data.message || "Unable to update product");
        }

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}

// DELETE PRODUCT
async function deleteProduct(productId) {
    const token = localStorage.getItem("token");

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
        const response = await fetch(
            "/api/products/delete/" + productId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Product deleted successfully!");
            loadAdminProducts();
        } else {
            alert(data.message || "Unable to delete product");
        }

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// LOAD PRODUCTS
loadAdminProducts();
