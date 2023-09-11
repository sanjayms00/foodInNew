function categoryValidate(){
    const updateCategoryName = document.getElementById("updateCategoryName").value;
    const oldCategory = document.getElementById("oldCategory").value;
    let status = true;
    let msg, field;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (updateCategoryName.trim() === '') {
        msg = 'Category Required'
        status = false;
        field = 'updateCategoryName'
    }
    else if (oldCategory.trim() === '') {
        msg = 'Category Required'
        status = false;
        field = 'oldCategory'
    }
    else if(updateCategoryName === oldCategory){
        msg = 'No change in Category'
        status = false;
        field = 'oldCategory'
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

const form = document.getElementById('editCategoryForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (categoryValidate()) {
      const formData = new FormData(event.target);
      const updateCategoryName = formData.get('updateCategoryName');
      const categoryId = formData.get('categoryId');
      try {
        const response = await fetch('/admin/update-category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updateCategoryName, categoryId })
      });
      
      const data = await response.json();
      //const alertDiv = document.getElementById('alertResult');
      
      if (data.status === 'success') { 
        Toastify({
          text: data.msg,
          className: "info",
          style: {
              background: "linear-gradient(to right, #0b7303, #24c9a3)",
          }
      }).showToast();
        setTimeout(() => {
            window.location.href = "/admin/category"
        }, 2000);
        
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