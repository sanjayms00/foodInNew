//validate the fields
function couponValidate(){
    const couponName = document.getElementsByName("couponName")[0];
    const discount = document.getElementsByName("discount")[0];
    const minPurchase = document.getElementsByName("minPurchase")[0];
    const maxAmount = document.getElementsByName("maxAmount")[0];
    const validity = document.getElementsByName("validity")[0];

    if (couponName.value.trim() === "") {
        const couponLabel = document.getElementById("couponLabel")
        couponLabel.innerHTML = "Coupon Code Required"
        couponLabel.style.color = "red"
        couponName.focus();
        return false;
    }
    if (discount.value.trim() === "") {
        const discountLabel = document.getElementById("discountLabel")
        discountLabel.innerHTML = "Discount Required"
        discountLabel.style.color = "red"
        discount.focus();
        return false;
    }
    if (minPurchase.value.trim() === "") {
        const minPurchaseLabel = document.getElementById("minPurchaseLabel")
        minPurchaseLabel.innerHTML = "Minimum Purchase Required"
        minPurchaseLabel.style.color = "red"
        minPurchase.focus();
        return false;
    }
    if (maxAmount.value.trim() === "") {
        const maxAmountLabel = document.getElementById("maxAmountLabel")
        maxAmountLabel.innerHTML = "Maximum Amount Required"
        maxAmountLabel.style.color = "red"
        maxAmount.focus();
        return false;
    }
    if (validity.value.trim() === "") {
        const validityLabel = document.getElementById("validityLabel")
        validityLabel.innerHTML = "Validity Required"
        validityLabel.style.color = "red"
        validity.focus();
        return false;
    }

    return true
}
  
//generate unique coupons
function generateCoupon(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coupon = '';
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        coupon += characters.charAt(randomIndex);
    }
    document.getElementById('couponName').value = coupon
}