
const ordersList = document.getElementById("ordersList");

// CUSTOMER - VIEW MY ORDERS
async function loadMyOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/orders/my-orders", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            ordersList.textContent =
                data.message || "Unable to load orders";
            return;
        }

        displayOrders(data.orders || []);

    } catch (error) {
        ordersList.textContent = "Server connection error";
        console.error(error);
    }
}

// ADMIN - VIEW ALL ORDERS
async function loadAllOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("/api/admin/orders", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            ordersList.textContent =
                data.message || "Unable to load orders";
            return;
        }

        displayOrders(data.orders || [], true);

    } catch (error) {
        ordersList.textContent = "Server connection error";
        console.error(error);
    }
}

// DISPLAY ORDERS
function displayOrders(orders, isAdmin = false) {

    ordersList.innerHTML = "";

    if (orders.length === 0) {
        ordersList.textContent = "No orders found.";
        return;
    }

    orders.forEach(order => {

        const card = document.createElement("div");
        card.className = "order-card";

        // Order heading
        const heading = document.createElement("div");
        heading.className = "order-card-heading";

        const title = document.createElement("h3");
        title.textContent = "Order Details";

        const orderId = document.createElement("span");
        orderId.className = "order-id";
        orderId.textContent = "Order ID: " + order._id;

        heading.appendChild(title);
        heading.appendChild(orderId);
        card.appendChild(heading);

        // Customer details
        if (order.user) {
            addOrderDetail(card, "Customer", order.user.name);
            addOrderDetail(card, "Email", order.user.email);
        }

        // Products
        const productSection = document.createElement("div");
        productSection.className = "order-products";

        const productHeading = document.createElement("h4");
        productHeading.textContent = "Products";
        productSection.appendChild(productHeading);

        (order.items || []).forEach(item => {

            const productName = item.product
                ? item.product.name
                : "Product";

            const product = document.createElement("p");
            product.textContent =
                productName + " - Quantity: " + item.quantity;

            productSection.appendChild(product);
        });

        card.appendChild(productSection);

        // Amount
        addOrderDetail(
            card,
            "Total Amount",
            "₹" + order.totalAmount,
            "order-total"
        );

        // Payment details
        addOrderDetail(card, "Payment Method", order.paymentMethod);
        addOrderDetail(card, "Payment Status", order.paymentStatus);

        // Order status
        addOrderDetail(card, "Order Status", order.orderStatus);

        // Address and phone
        addOrderDetail(card, "Delivery Address", order.address);
        addOrderDetail(card, "Phone Number", order.phone);

        // Admin controls
        if (isAdmin) {
            addAdminControls(card, order);
        }

        ordersList.appendChild(card);
    });
}

// ADD ORDER DETAIL
function addOrderDetail(card, label, value, extraClass = "") {

    const row = document.createElement("div");
    row.className = "order-detail " + extraClass;

    const labelElement = document.createElement("span");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.textContent =
        value !== undefined && value !== null && value !== ""
            ? value
            : "Not provided";

    row.appendChild(labelElement);
    row.appendChild(valueElement);

    card.appendChild(row);
}

// ADMIN CONTROLS
function addAdminControls(card, order) {

    const controls = document.createElement("div");
    controls.className = "order-admin-controls";

    // Order status
    const statusHeading = document.createElement("h4");
    statusHeading.textContent = "Update Order Status";

    const statusSelect = document.createElement("select");

    ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"]
        .forEach(status => {

            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            option.selected = status === order.orderStatus;

            statusSelect.appendChild(option);
        });

    const statusButton = document.createElement("button");
    statusButton.textContent = "Update Order Status";
    statusButton.className = "order-update-btn";

    statusButton.addEventListener("click", () => {
        updateOrderStatus(order._id, statusSelect.value);
    });

    controls.appendChild(statusHeading);
    controls.appendChild(statusSelect);
    controls.appendChild(statusButton);

    // Payment status
    const paymentHeading = document.createElement("h4");
    paymentHeading.textContent = "Update Payment Status";

    const paymentSelect = document.createElement("select");

    ["Pending", "Paid", "Failed"].forEach(status => {

        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = status === order.paymentStatus;

        paymentSelect.appendChild(option);
    });

    const paymentButton = document.createElement("button");
    paymentButton.textContent = "Update Payment Status";
    paymentButton.className = "order-update-btn";

    paymentButton.addEventListener("click", () => {
        updatePaymentStatus(order._id, paymentSelect.value);
    });

    controls.appendChild(paymentHeading);
    controls.appendChild(paymentSelect);
    controls.appendChild(paymentButton);

    card.appendChild(controls);
}

// UPDATE ORDER STATUS
async function updateOrderStatus(orderId, newStatus) {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/admin/orders/" + orderId + "/status",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    orderStatus: newStatus
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Order status updated successfully!");
            loadAllOrders();
        } else {
            alert(data.message || "Unable to update order status");
        }

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}

// UPDATE PAYMENT STATUS
async function updatePaymentStatus(orderId, newStatus) {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            "/api/admin/orders/" + orderId + "/payment-status",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    paymentStatus: newStatus
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Payment status updated successfully!");
            loadAllOrders();
        } else {
            alert(data.message || "Unable to update payment status");
        }

    } catch (error) {
        alert("Server connection error");
        console.error(error);
    }
}

// SELECT PAGE
if (window.location.pathname.endsWith("/orders.html")) {
    loadAllOrders();
} else {
    loadMyOrders();
}
