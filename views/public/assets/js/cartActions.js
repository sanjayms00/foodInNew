
const deleteCartItem = document.querySelectorAll(".cart-delete-btn")

deleteCartItem.forEach(element => {
    element.addEventListener('click', async (event) => {
        const foodId = element.dataset.item
        const deleteData = { foodId }
        try {
            const response = await fetch('/delete-cart-item', {
                method: 'POST',
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
                  }, 500);
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


function increment(btn) {
  const foodId = btn.parentElement.querySelector('input[name="foodId"]').getAttribute('value');
  const totalStock = btn.parentElement.querySelector('input[name="totalStock"]').getAttribute('value');
  let input = document.getElementById(foodId).value
  input = parseInt(input)+1
  if(totalStock < input){
    Toastify({
      text: "Out of Stock",
      className: "info",
      style: {
          background: "linear-gradient(to right, #ff0000, #dd2a7f)",
      }
      }).showToast();
    return
  }
  
  

  let foodPrice = btn.parentElement.querySelector('input[name="foodPrice"]').getAttribute('value');
  
  if (foodId && foodPrice) {
    updateQtyInDb(btn, foodPrice, input, foodId, 1, -1)
  }
}

function decrement(btn) {
  const foodId = btn.parentElement.querySelector('input[name="foodId"]').getAttribute('value');
  let input = document.getElementById(foodId).value
  input = parseInt(input)-1
  if(input <= 0){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        let foodPrice = btn.parentElement.querySelector('input[name="foodPrice"]').getAttribute('value');
        foodPrice = -1*foodPrice;
        if (foodId && foodPrice) {
          updateQtyInDb(btn, foodPrice, input, foodId, -1)
        }
      }
    })
  }else{
    let foodPrice = btn.parentElement.querySelector('input[name="foodPrice"]').getAttribute('value');
    foodPrice = -1*foodPrice;
    if (foodId && foodPrice) {
      updateQtyInDb(btn, foodPrice, input, foodId, -1, 1)
    }
  }
  
}
  
async function updateQtyInDb(btn, foodPrice, qty, foodId, stat, stock){
  try {
    const response = await fetch('/update-cart-data', {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({foodId, foodPrice, qty, stat, stock})
    });
      const data = await response.json();
      if(data.status === "success"){
        const input = btn.parentElement.querySelector('input[type="number"]');
        // console.log(input)
        input.value = data.items[0].quantity;
        const itemPrice = btn.parentElement.parentElement.querySelector('.total-price');
        itemPrice.innerText = data.items[0].total;
        document.getElementById('subTotal').innerText = data.subTotal[0].subTotal;
        const totalStock = btn.parentElement.querySelector('input[name="totalStock"]');
        totalStock.value = data.foodStock[0].totalStoke
      }else if(data.removed === true){
        Swal.fire(
          'Removed!',
          'food removed from cart',
          'success'
        )
        setTimeout(()=>{
          location.reload();
        }, 1000)
      }else{
        throw new Error(data.msg)
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
