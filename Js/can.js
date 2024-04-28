const cartDiv = document.getElementById('cart-list');
var shoppingCart;
console.log('shoping cart', shoppingCart)

function getArrayFromLocalStorage(key) {
    const arrayString = localStorage.getItem(key);
    if (arrayString) {
        return JSON.parse(arrayString);
    } else {
        return [];
    }
}

function displayCart(shoppingCart) {
    cartDiv.innerHTML = ''; 

    shoppingCart.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product', 'light-grey-background');
        productDiv.innerHTML = `
            <h2 class="popular__item-title">${product.name}</h2>
            <img src="/images/${product.image}" alt="${product.name}" class="popular__img">
            <p class="content__text">Ціна: $${product.price}</p>
            <p class="content__text">${product.description}</p>
            <button class="btn btn-delete" onclick="removeProduct('${product.id}')">
                <span class="mdi mdi-delete mdi-24px"></span>
                <span class="mdi mdi-delete-empty mdi-24px"></span>
                <span>Delete</span>
            </button>        `;
        cartDiv.appendChild(productDiv);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    shoppingCart = getArrayFromLocalStorage('shoppingCart');
    console.log(`Cart: ${shoppingCart}`)
    displayCart(shoppingCart);
})
function removeProduct(id){
    console.log(`cart:${shoppingCart}`)
    shoppingCart = shoppingCart.filter(p => p.id!=id);
    displayCart(shoppingCart);
}