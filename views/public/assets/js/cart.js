async function addToCart(e) {

    const item = e.target.getAttribute('data-item');
    const auth = JSON.stringify(e.target.getAttribute('data-auth'))

    if (auth === false) {
        Toastify({
            text: "login to acccount",
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();

        setTimeout(() => {
            location.href = "/login"
        }, 500)
    } else {

        try {

            const response = await fetch('/add-to-cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: item
            });

            const data = await response.json();

            if (data.status === 'success') {
                if (data.length) {
                    document.getElementById('cartCounter').innerText = data.length
                }
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #0b7303, #24c9a3)",
                    }
                }).showToast();
            }
            else if (data.status === "blocked") {
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                }).showToast();
                setTimeout(() => {
                    window.location.href = "/logout"
                }, 800);
            }
            else if (data.status === "no-user") {
                window.location.href = "/login"
            }
            else {
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                }).showToast();
            }
        } catch (error) {
            Toastify({
                text: error.message,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                }
            }).showToast();
        }
    }
}






