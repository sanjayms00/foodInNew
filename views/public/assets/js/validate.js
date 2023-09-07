//validate the sign up credentials
function validateSignup() {
    const firstName = document.getElementsByName("firstName")[0];
    const lastName = document.getElementsByName("lastName")[0];
    const emailId = document.getElementsByName("emailId")[0];
    const mobile = document.getElementsByName("mobileNumber")[0];
    const signupPassword = document.getElementsByName("signupPassword")[0];
    const confirmPassword = document.getElementsByName("confirmPassword")[0];
    let msg = ""
    let status = true
    let field = null
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (firstName.value.trim() === "") {
        status = false
        msg = "first name Required"
        field = firstName
    }
    else if (lastName.value.trim() === "") {
        status = false
        msg = "first name Required"
        field = lastName
    }
    else if (emailId.value.trim() === "") {
        status = false
        msg = "Email Id Required"
        field = emailId
    }
    else if (!emailPattern.test(emailId.value)) {
        status = false
        msg = "Please enter a valid email address"
        field = emailId
    }
    else if (!mobilePattern.test(mobile.value)) {
        status = false
        msg = "Please enter a valid 10-digit mobile number."
        field = mobile
    }
    else if (!passwordPattern.test(signupPassword.value)) {
        status = false
        msg = "Please use a Strong Password."
        field = signupPassword
    }
    else if (signupPassword.value.length < 6) {
        status = false
        msg = "Password should be at least 6 characters long."
        field = signupPassword
    }
    else if(signupPassword.value !== confirmPassword.value){
        status = false
        msg = "Password not match"
        field = confirmPassword
    }
    
    if(status)
    {
        return true;
    }
    else{
        Toastify({
            text: msg,
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();
        // field.style.borderColor  = "red"
        field.focus();
        return false
    }
}

//validate the login credentials
function validateLogin() {
    const emailId = document.getElementById("emailId");
    const loginPassword = document.getElementById("loginPassword");
    let msg = ""
    let status = true
    let field = null
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailId.value.trim() === "") {
        status = false
        msg = "Email Id Required"
        field = emailId
    }
    else if (!emailPattern.test(emailId.value)) {
        status = false
        msg = "Please enter a valid email address"
        field = emailId
    }
    else if (loginPassword.value.trim() === "") {
        status = false
        msg = "Password Required"
        field = loginPassword
    }
    if(status)
    {
        return true;
    }
    else{
        Toastify({
            text: msg,
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();
        // field.style.borderColor  = "red"
        field.focus();
        return false
    }
}

//validate mobile Number
function validateMobileNumber() {
    const mobileNumber = document.getElementById("mobileNumber");
    let msg = ""
    let status = true
    let field = null
    if (mobileNumber.value.trim() === "") {
        status = false
        msg = "Mobile Number Required"
        field = mobileNumber
    }
    if(status)
    {
        return true;
    }
    else{
        Toastify({
            text: msg,
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();
        // field.style.borderColor  = "red"
        field.focus();
        return false
    }
}

//otp login
document.getElementById('mobileNumberValidateForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if(validateMobileNumber()){
        const formData = new FormData(event.target);
        const mobileNumber = formData.get('mobileNumber');
        
        try {
            const response = await fetch('/validateNumber', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mobileNumber })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') { 
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #0b7303, #24c9a3)",
                    }
                    }).showToast();
                setTimeout(() => {
                    window.location.href = `/verifyOtp?userMobileNumber=${mobileNumber}`
                }, 800);
            } else {
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                    }
                    }).showToast();
            }
        }catch (error) {
            Toastify({
                text: data.msg,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                }
                }).showToast();
        }
    }

    
});


// js validator for all fields , bootrsap validator
function checkForm() {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }
        form.classList.add('was-validated')
        }, false)
    })
}




//only accept numbers
function validateNumber(input) {
    const inputValue = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const maxLength = 10; // Define the maximum length

    if (inputValue.length > maxLength) {
        input.value = inputValue.slice(0, maxLength); // Truncate to 10 digits
    } else {
        input.value = inputValue; // Keep the input as is
    }

    const mobileNumberError = document.getElementById('mobileNumberLabel');
    if (input.value.length !== maxLength) {
        mobileNumberError.textContent = 'Mobile number must be 10 digits long';
    } else {
        mobileNumberError.textContent = '';
    }
}

