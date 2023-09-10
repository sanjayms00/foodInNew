//admin form validate
function helpValidate(data){
    const issue = data.issue;
    if (issue.trim() === '') {
        Toastify({
            text: "Describe your issue...",
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
        }).showToast();
        document.getElementById("floatingTextarea2").focus();
        return false
    }
    return true
}

//help form submit
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#helpForm');
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        //get the form field and data
        let data = Object.fromEntries(formData)
        //validate 
        if(helpValidate(data)){
            //pass the data 
            const response  = await fetch('/help/send-issue', {
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
                    form.reset()
                }
                else if(response.status === "login"){
                    Toastify({
                        text: response.msg,
                        className: "info",
                        style: {
                            background: "linear-gradient(to right, #ff0000, #dd2a7f)",
                        }
                    }).showToast();
                    setTimeout(() => {
                        location.href = '/login'
                    }, 800);
                }
                else{
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