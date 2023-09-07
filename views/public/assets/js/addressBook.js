document.getElementById('addressBook').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const addressData = {
            fullName: formData.get('fullName'),
            mobileNumber: formData.get('mobileNumber'),
            pinCode: formData.get('pinCode'),
            addressLine: formData.get('addressLine'),
            city: formData.get('city'),
            state: formData.get('state'),
            addressType: formData.get('addressType')
        };
    try {
        const response = await fetch('/save-address', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
        });
        
        const data = await response.json();
        //alert(JSON.stringify(data))
        if (data.status === 'success') { 
            Toastify({
                text: data.msg,
                className: "info",
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
            const addressModal = document.getElementById("addressModal");
            const modal = bootstrap.Modal.getInstance(addressModal);
            modal.hide()
            setTimeout(()=>{
                        location.reload()
                    },1000)
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
            text: error.message,
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
            }).showToast();
    }
});

const deleteCartItem = document.querySelectorAll(".delete-address")

deleteCartItem.forEach(element => {
    element.addEventListener('click', async (event) => {
        const address = element.dataset.address
        try {
            const response = await fetch('/delete-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: address
                })
                const data = await response.json();
                // alert(JSON.stringify(data)); 
                if (data.status === 'success') {
                    Toastify({
                        text: data.msg,
                        className: "info",
                        style: {
                          background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                    setTimeout(()=>{
                        location.reload()
                    },1000)
                }else{
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
    })
})

async function setDefault(addressId){
    try {
        const response = await fetch('/set-default', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({addressId})
            })
            const data = await response.json();
            //alert(JSON.stringify(data)); 
            if (data.status === 'success') {
                const addressModal = document.getElementById("exampleModal");
                if(addressModal){
                    const modal = bootstrap.Modal.getInstance(addressModal); 
                    modal.hide();
                }
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                      background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
                setTimeout(()=>{
                    location.reload()
                },300)
            }else{
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