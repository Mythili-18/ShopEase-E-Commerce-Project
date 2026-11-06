
const checkoutForm = document.getElementById("checkoutForm");
const message = document.getElementById("message");

checkoutForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const token = localStorage.getItem("token");

    // Check login
    if (!token) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    // Get form values
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Validate address
    if (!address) {
        message.textContent = "Please enter your delivery address.";
        message.style.color = "red";
        return;
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
        message.textContent = "Enter a valid 10-digit phone number.";
        message.style.color = "red";
        return;
    }

    const submitButton = checkoutForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    submitButton.textContent = "Placing Order...";

    message.textContent = "";

    try {

        const response = await fetch("/api/orders/place", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                address: address,
                phone: phone
            })

        });

        const data = await response.json();

        if (response.ok) {

            message.textContent = "Order placed successfully!";
            message.style.color = "green";

            alert("Order placed successfully!");

            window.location.href = "myorders.html";

        } else {

            message.textContent =
                data.message || "Unable to place order.";

            message.style.color = "red";

            submitButton.disabled = false;
            submitButton.textContent = "Place Order →";
        }

    } catch (error) {

        console.error("Checkout Error:", error);

        message.textContent = "Server connection error. Please try again.";

        message.style.color = "red";

        submitButton.disabled = false;
        submitButton.textContent = "Place Order →";

    }

});
