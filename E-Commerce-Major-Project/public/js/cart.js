
 // LOAD SHOPPING CART
async function loadCart() {
    const token = localStorage.getItem("token");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/cart/view", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            cartItems.textContent =
                data.message || "Unable to load cart";
            return;
        }

        const cart = data.cart || data;
        const items = cart.items || [];

        cartItems.innerHTML = "";

        if (items.length === 0) {
            cartItems.textContent = "Your cart is empty.";
            cartTotal.textContent = "Total: ₹0";
            return;
        }

        let total = 0;

        items.forEach(item => {
            const product = item.product;

            if (!product) return;

            const subtotal = product.price * item.quantity;
            total += subtotal;

            const div = document.createElement("div");
            div.className = "admin-card";

            div.innerHTML = `
                <h3>${product.name}</h3>

                <p>Price: ₹${product.price}</p>

                <p>Quantity: ${item.quantity}</p>

                <button
                    onclick="updateCartQuantity('${product._id}', ${item.quantity - 1})"
                    ${item.quantity <= 1 ? "disabled" : ""}
                >
                    −
                </button>

                <button
                    onclick="updateCartQuantity('${product._id}', ${item.quantity + 1})"
                    ${item.quantity >= product.stock ? "disabled" : ""}
                >
                    +
                </button>

                <p>Available Stock: ${product.stock}</p>

                ${item.quantity >= product.stock
                    ? "<p>Maximum available stock reached!</p>"
                    : ""
                }

                <p>Subtotal: ₹${subtotal}</p>

                <button onclick="removeFromCart('${product._id}')">
                    Remove
                </button>
            `;

            cartItems.appendChild(div);
        });

        cartTotal.textContent = "Total: ₹" + total;

    } catch (error) {
        cartItems.textContent = "Server connection error";
        console.error(error);
    }
}


// UPDATE PRODUCT QUANTITY
async function updateCartQuantity(productId, quantity) {
    const token = localStorage.getItem("token");

    if (quantity < 1) return;

    try {
        const response = await fetch(
            "/api/cart/update/" + productId,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    quantity: quantity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to update quantity");
            return;
        }

        loadCart();

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}


// REMOVE PRODUCT FROM CART
async function removeFromCart(productId) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            "/api/cart/remove/" + productId,
            {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to remove product");
            return;
        }

        alert("Product removed successfully!");
        loadCart();

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}


// GO TO CHECKOUT PAGE
function goToCheckout() {
    window.location.href = "checkout.html";
}


// LOAD CART WHEN PAGE OPENS
loadCart();
