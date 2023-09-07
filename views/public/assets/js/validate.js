function validateSignup() {
    const firstName = document.getElementsByName("firstName")[0];
    const lastName = document.getElementsByName("lastName")[0];
    const emailId = document.getElementsByName("emailId")[0];
    const mobile = document.getElementsByName("mobileNumber")[0];
    const signupPassword = document.getElementsByName("signupPassword")[0];
    const confirmPassword = document.getElementsByName("confirmPassword")[0];

    if (firstName.value.trim() === "") {
        const firstNameLabel = document.getElementById("firstNameLabel")
        firstNameLabel.innerHTML = "first name Required"
        firstNameLabel.style.color = "red"
        firstName.focus();
        return false;
    }
    if (lastName.value.trim() === "") {
        const lastNameLabel = document.getElementById("lastNameLabel")
        lastNameLabel.innerHTML = "Last name Required"
        lastNameLabel.style.color = "red"
        lastName.focus();
        return false;
    }
    if (emailId.value.trim() === "") {
        const emailLabel = document.getElementById("emailLabel")
        emailLabel.innerHTML = "Email Id Required"
        emailLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailId.value)) {
        const emailIdLabel = document.getElementById("emailLabel")
        emailIdLabel.innerHTML = "Please enter a valid email address"
        emailIdLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile.value)) {
        const mobileLabel = document.getElementById("mobileLabel")
        mobileLabel.innerHTML = "Please enter a valid 10-digit mobile number."
        mobileLabel.style.color = "red"
        mobile.focus();
        return false;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(signupPassword.value)) {
        const passowrdLabel = document.getElementById("passwordLabel")
        passowrdLabel.innerHTML = "Please use a Strong Password."
        passowrdLabel.style.color = "red"
        signupPassword.focus();
        return false;
    }
    if (signupPassword.value.length < 6) {
        const passowrdLabel = document.getElementById("passwordLabel")
        passowrdLabel.innerHTML = "Password should be at least 6 characters long."
        passowrdLabel.style.color = "red"
        signupPassword.focus();
        return false;
    }
    if(signupPassword.value !== confirmPassword.value){
        const confirmPasswordLabel = document.getElementById("confirmPasswordLabel")
        confirmPasswordLabel.innerHTML = "Password not match"
        confirmPasswordLabel.style.color = "red"
        confirmPassword.focus();
        return false;
    }
    return true;
}

function validateLogin() {
    const emailId = document.getElementsByName("emailId")[0];
    const loginPassword = document.getElementsByName("loginPassword")[0];
    
    if (emailId.value.trim() === "") {
        const emailLabel = document.getElementById("emailLabel")
        emailLabel.innerHTML = "Email Id Required"
        emailLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailId.value)) {
        const emailIdLabel = document.getElementById("emailLabel")
        emailIdLabel.innerHTML = "Please enter a valid email address"
        emailIdLabel.style.color = "red"
        emailId.focus();
        return false;
    }
    if (loginPassword.value.trim() === "") {
        const passowrdLabel = document.getElementById("passwordLabel")
        passowrdLabel.innerHTML = "Password Required"
        passowrdLabel.style.color = "red"
        loginPassword.focus();
        return false;
    }
    return true;
}

function validateMobileNumber() {
    const mobileNumber = document.getElementsByName("mobileNumber")[0];
    
    if (mobileNumber.value.trim() === "") {
        const mobileNumberLabel = document.getElementById("mobileNumberLabel")
        mobileNumberLabel.innerHTML = "Mobile Number Required"
        mobileNumberLabel.style.color = "red"
        mobileNumber.focus();
        return false;
    }
    
    
    return true;
}

//normal login
document.getElementById('loginForm').addEventListener('submit', async (event)=>{
    event.preventDefault();

    if(validateLogin()){
        
        const form = document.getElementById('loginForm');
        const formData = new FormData(form);

        const emailId = formData.get('emailId');
        const loginPassword = formData.get('loginPassword');

        const data ={
            emailId,
            loginPassword
        }
        try {
            
        } catch (error) {
            
        }
        const response = await fetch("/loginAuthenticate", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        const result = await response.json();
        if(result.status === "success"){
            Toastify({
                text: result.msg,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #0b7303, #24c9a3)",
                }
                }).showToast();
            setTimeout(() => {
                window.location.href = "/"
            }, 800);
        }else{
            Toastify({
                text: result.msg,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                }
                }).showToast();
        }
    }

})

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


