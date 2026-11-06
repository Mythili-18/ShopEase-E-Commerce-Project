
async function loadProducts() {
    const productList = document.getElementById("productList");

    try {
        const response = await fetch("/api/products/all");
        const data = await response.json();

        if (!response.ok) {
            productList.textContent = "Unable to load products.";
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
                         height="180"
                         style="object-fit: contain;">`
                    : "<p>No image available</p>"
                }

                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: ₹${product.price}</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>

                <button class="view-details-btn">
                    View Details
                </button>

                <button class="add-cart-btn">
                    Add to Cart
                </button>
            `;

            // VIEW PRODUCT DETAILS
            const detailsButton = card.querySelector(".view-details-btn");

            detailsButton.addEventListener("click", function() {
                window.location.href =
                    "product.html?id=" + encodeURIComponent(product._id);
            });

            // ADD TO CART
            const addButton = card.querySelector(".add-cart-btn");

            addButton.addEventListener("click", function() {
                addToCart(product._id);
            });

            productList.appendChild(card);
        });

    } catch (error) {
        productList.textContent = "Server connection error.";
        console.error(error);
    }
}


// ADD PRODUCT TO CART
async function addToCart(productId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Product added to cart successfully!");
        } else {
            alert(data.message || "Unable to add product");
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
loadProducts();
