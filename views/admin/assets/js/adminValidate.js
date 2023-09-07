function admnloginValidate(){
    const adminEmail = document.getElementsByName("adminEmail")[0];
    const adminPassword = document.getElementsByName("adminPassword")[0];
    if (adminEmail.value.trim() === "") {
        const adminEmailLabel = document.getElementById("adminEmailLabel")
        adminEmailLabel.innerHTML = "Email Id Required"
        adminEmailLabel.style.color = "red"
        adminEmail.focus();
        return false;
    }
    if (adminPassword.value.trim() === "") {
        const adminPasswordLabel = document.getElementById("adminPasswordLabel")
        adminPasswordLabel.innerHTML = "Password Required"
        adminPasswordLabel.style.color = "red"
        adminPassword.focus();
        return false;
    }
    return true
}