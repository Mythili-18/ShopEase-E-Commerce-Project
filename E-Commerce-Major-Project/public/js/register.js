
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    const message = document.getElementById("message");

    if (!registerForm) {
        console.error("Register form not found!");
        return;
    }

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value.trim();

        if (message) {
            message.textContent = "";
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            if (message) {
                message.textContent = "Enter a valid 10-digit phone number.";
                message.style.color = "red";
            }
            return;
        }

        try {

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: ""
                })
            });

            const data = await response.json();

            if (response.ok) {

                if (message) {
                    message.textContent = "Registration successful! Please login.";
                    message.style.color = "green";
                }

                registerForm.reset();

            } else {

                if (message) {
                    message.textContent = data.message || "Registration failed";
                    message.style.color = "red";
                }

            }

        } catch (error) {

            console.error("Registration Error:", error);

            if (message) {
                message.textContent = "Server connection error";
                message.style.color = "red";
            }

        }

    });

    console.log("Register JavaScript loaded successfully!");

});
