function foodValidateCreate(){
    const foodImage = document.getElementsByName("file_photo")[0];
    if (foodImage.value.trim() === "") {
        const foodImageLabel = document.getElementById("foodImageLabel")
        foodImageLabel.innerHTML = "Image Required"
        foodImageLabel.style.color = "red"
        foodImage.focus();
        return false;
    }
    return foodValidate()
}

function foodValidate(){
    const foodName = document.getElementsByName("foodName")[0];
    const categories = document.getElementsByName("categories")[0];
    const foodType = document.getElementsByName("foodType")[0];
    const orgPrice = document.getElementsByName("orgPrice")[0];
    const totalStoke = document.getElementsByName("totalStoke")[0];
    const discPrice = document.getElementsByName("discPrice")[0];
    const foodDescription = document.getElementsByName("foodDescription")[0];
    const foodIngredients = document.getElementsByName("foodIngredients")[0];

    
   
    if (categories.value.trim() === "") {
        const categoriesLabel = document.getElementById("categoriesLabel")
        categoriesLabel.innerHTML = "Category Required"
        categoriesLabel.style.color = "red"
        categories.focus();
        return false;
    }
    if (foodType.value.trim() === "") {
        const foodTypeLabel = document.getElementById("foodTypeLabel")
        foodTypeLabel.innerHTML = "Food Type Required"
        foodTypeLabel.style.color = "red"
        foodType.focus();
        return false;
    }
    if (foodName.value.trim() === "") {
        const foodNameLabel = document.getElementById("foodNameLabel")
        foodNameLabel.innerHTML = "Food Name Required"
        foodNameLabel.style.color = "red"
        foodName.focus();
        return false;
    }
    if (totalStoke.value.trim() === "") {
        const totalStokeLabel = document.getElementById("totalStokeLabel")
        totalStokeLabel.innerHTML = "Total Stoke Required"
        totalStokeLabel.style.color = "red"
        totalStoke.focus();
        return false;
    }
    if (orgPrice.value.trim() === "") {
        const orgPriceLabel = document.getElementById("orgPriceLabel")
        orgPriceLabel.innerHTML = "Original Price Required"
        orgPriceLabel.style.color = "red"
        orgPrice.focus();
        return false;
    }
    if (discPrice.value.trim() === "") {
        const discPriceLabel = document.getElementById("discPriceLabel")
        discPriceLabel.innerHTML = "Discount Price Required"
        discPriceLabel.style.color = "red"
        discPrice.focus();
        return false;
    }
    if (foodDescription.value.trim() === "") {
        const foodDescriptionLabel = document.getElementById("foodDescriptionLabel")
        foodDescriptionLabel.innerHTML = "Food Description Required"
        foodDescriptionLabel.style.color = "red"
        foodDescription.focus();
        return false;
    }
    if (foodIngredients.value.trim() === "") {
        const foodIngredientsLabel = document.getElementById("foodIngredientsLabel")
        foodIngredientsLabel.innerHTML = "Food Ingredients Required"
        foodIngredientsLabel.style.color = "red"
        foodIngredients.focus();
        return false;
    }
    return true
}





function foodUpdateValidate(){
    const foodId = document.getElementById("foodId")
    const prevImage = document.getElementById("prevImage")

    if (foodId.value.trim() === "") {
        alert("food Id is Required")
        return false;
    }
    if (prevImage.value.trim() === "") {
        alert("food Id is Required")
        return false;
    }
    return foodValidate()
    
}