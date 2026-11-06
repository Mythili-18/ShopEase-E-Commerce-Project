
async function loadCustomers() {
    const token = localStorage.getItem("token");

    // Match the ID in customers.html
    const customersList = document.getElementById("customerList");

    if (!customersList) {
        console.error("Customer list element not found!");
        return;
    }

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    customersList.textContent = "Loading customers...";

    try {
        const response = await fetch("/api/admin/customers", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            customersList.textContent =
                data.message || "Unable to load customers";
            return;
        }

        const customers = data.customers || [];

        customersList.innerHTML = "";

        if (customers.length === 0) {
            customersList.textContent =
                "No customers registered yet.";
            return;
        }

        customers.forEach(customer => {
            const card = document.createElement("div");
            card.className = "customer-card";

            const name = document.createElement("h3");
            name.textContent = customer.name || "Unknown Customer";

            const email = document.createElement("p");
            email.textContent = "Email: " + (customer.email || "Not provided");

            const phone = document.createElement("p");
            phone.textContent = "Phone: " + (customer.phone || "Not provided");

            const address = document.createElement("p");
            address.textContent =
                "Address: " + (customer.address || "Not provided");

            card.appendChild(name);
            card.appendChild(email);
            card.appendChild(phone);
            card.appendChild(address);

            customersList.appendChild(card);
        });

    } catch (error) {
        console.error("Customer Loading Error:", error);
        customersList.textContent = "Server connection error";
    }
}

// Load customers when the page opens
document.addEventListener("DOMContentLoaded", loadCustomers);
