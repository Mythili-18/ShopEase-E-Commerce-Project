
async function loadProductDetails() {

    const productDetails = document.getElementById("productDetails");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        productDetails.textContent = "Product ID not found.";
        return;
    }

    try {
        const response = await fetch("/api/products/" + productId);
        const data = await response.json();

        console.log("Product API Response:", data);

        if (!response.ok) {
            productDetails.textContent =
                data.message || "Unable to load product.";
            return;
        }

        const product = data.product;

        if (!product) {
            productDetails.textContent = "Product not found.";
            return;
        }

        productDetails.innerHTML = `
            <div class="admin-card">

                ${product.image
                    ? `<img src="${product.image}"
                         alt="${product.name}"
                         width="250"
                         style="object-fit: contain;">`
                    : "<p>No image available</p>"
                }

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <h3>Price: ₹${product.price}</h3>

                <p>Category: ${product.category}</p>

                <p>Available Stock: ${product.stock}</p>

                <label for="quantity">Select Quantity:</label>

                <input
                    type="number"
                    id="quantity"
                    value="1"
                    min="1"
                    max="${product.stock}"
                >

                <br><br>

                <button id="addCartButton">
                    Add to Cart
                </button>

            </div>
        `;

        document.getElementById("addCartButton")
            .addEventListener("click", function() {

                const quantity = Number(
                    document.getElementById("quantity").value
                );

                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > product.stock
                ) {
                    alert("Please enter a valid quantity.");
                    return;
                }

                addToCart(product._id, quantity);
            });

    } catch (error) {
        productDetails.textContent = "Server connection error.";
        console.error(error);
    }
}


// ADD TO CART
async function addToCart(productId, quantity) {

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
                quantity: quantity
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


// LOAD PRODUCT DETAILS
loadProductDetails();
