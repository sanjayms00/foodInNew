async function addToWishlist(foodData, auth){
    if(auth === 'false'){
        Toastify({
            text: "login to acccount",
            className: "info",
            style: {
                background: "linear-gradient(to right, #ff0000, #dd2a7f)",
            }
            }).showToast();
            setTimeout(()=>{
                location.href = "/login"
            },1000)
    }else if(auth === "true"){
        try {
            const response = await fetch('/add-to-wishlist', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: foodData
            });
            
            const data = await response.json();
          
            const alertDiv = document.getElementById('alertResult');
            
            if (data.status === 'success') { 
                if(data.wishlistLength){
                    document.getElementById('wishlistCounter').innerText = data.wishlistLength
                }
                Toastify({
                    text: data.msg,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #0b7303, #24c9a3)",
                    }
                }).showToast();
            }
            else if (data.status === "blocked"){
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
            else if (data.status === "no-user"){
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
        }catch (error) {
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

const deleteWishlistItem = document.querySelectorAll(".wishlist-delete-btn")

deleteWishlistItem.forEach(element => {
    element.addEventListener('click', async (event) => {
        
        const wishlistId = element.dataset.item
        const deleteData = { wishlistId }
        try {
            const response = await fetch('/delete-wishlist', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteData)
                })
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
                    window.location.reload();
                  }, 100);
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
