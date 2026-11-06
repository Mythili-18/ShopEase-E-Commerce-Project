
// ======================================
// LOAD ADMIN DASHBOARD STATISTICS
// ======================================

async function loadDashboard() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch("/api/admin/dashboard", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Unable to load dashboard");

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                window.location.href = "login.html";
            }

            return;
        }

        // UPDATE DASHBOARD STATISTICS

        document.getElementById("totalUsers").textContent =
            data.totalUsers ?? 0;

        document.getElementById("totalProducts").textContent =
            data.totalProducts ?? 0;

        document.getElementById("totalOrders").textContent =
            data.totalOrders ?? 0;

    } catch (error) {

        console.error("Dashboard Error:", error);

        alert("Server connection error. Please try again.");

    }
}


// ======================================
// ADMIN LOGOUT
// ======================================

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}


// ======================================
// LOAD DASHBOARD ONLY ON ADMIN PAGE
// ======================================

if (document.getElementById("totalUsers")) {

    loadDashboard();

}


// ======================================
// ADD PRODUCT
// ======================================

const productForm = document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        const product = {

            name: document.getElementById("name").value.trim(),

            description: document.getElementById("description").value.trim(),

            price: Number(document.getElementById("price").value),

            category: document.getElementById("category").value,

            image: document.getElementById("image").value.trim(),

            stock: Number(document.getElementById("stock").value)

        };

        const message = document.getElementById("message");

        try {

            const response = await fetch("/api/products/add", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify(product)

            });

            const data = await response.json();

            if (message) {

                message.textContent =
                    data.message || "Request completed";

                message.style.color = response.ok ? "green" : "red";

            }

            if (response.ok) {

                productForm.reset();

            }

        } catch (error) {

            console.error("Add Product Error:", error);

            if (message) {
                message.textContent = "Server connection error";
                message.style.color = "red";
            }

        }

    });

}
