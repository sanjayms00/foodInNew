//admin form validate
function adminloginValidate(data){
    const email = data.adminEmail;
    const password = data.adminPassword;
    let status = true;
    let msg, field;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === '') {
        msg = 'Email Required'
        status = false;
        field = 'adminEmail'
    }
    else if (!emailPattern.test(email)) {
        msg = "Please enter a valid email address"
        status = false
        field = 'adminEmail'
    }
    else if (password.trim() === '') {
        msg = 'Password Required'
        status = false;
        field = 'adminPassword'
    }
    if(status === false){
        Toastify({
            text: msg,
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();
        document.getElementById(field).focus();
        return status
    }
    return status
}

// admin form submit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#adminLogin');
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        //get the form field and data
        let data = Object.fromEntries(formData)
        if(adminloginValidate(data)){
            //pass the data 
            const response  = await fetch('/admin/auth', {
                method : "POST",
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(data)
            })

            //get the reaspose
            await response.json()
            .then((response) => {
                if(response.status === "success"){
                    Toastify({
                        text: response.msg,
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #0b7303, #24c9a3)",
                        }
                    }).showToast();
                    setTimeout(() => {
                        location.href = '/admin/dashboard'
                    }, 800);
                }else{
                    Toastify({
                        text: response.msg,
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                        }
                    }).showToast();
                }
            })
            .catch((err) =>{
                Toastify({
                    text: error.message,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                }).showToast();
            })
        }
    })
})