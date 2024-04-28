var allProducts = [];
var productCart = [];
var prodConst = []
var search = '';
var shoppingCart = []; 

const productList = document.getElementById('product-list');
const dropdown = document.getElementById('drop');
const dropdownSort = document.getElementById('dropSort');
const dropSortContent = document.getElementById('sort-content');
const dropdownContent = dropdown.querySelector('.dropdown-content');
const xhr = new XMLHttpRequest();
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('srchBtn');
const cartLink = document.getElementById('CartId');

xhr.open('GET', 'products.json', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        prodConst = JSON.parse(xhr.responseText);
        allProducts = prodConst
        allProducts.forEach(element => {
            addProduct(element);
        });
        EventRegister();
        saveArrayToLocalStorage('chart', prodConst);
    }
};
xhr.send();

function EventRegister(){
    searchInput.addEventListener('input', function(){
        search = this.value;
    });
    searchButton.addEventListener('click', function(){
        SearchF(allProducts);
    });
    addCategoriesToDropdown();
    dropSortContent.addEventListener('click', function(event) {
        handleSortButton(event);
    });
    cartLink.addEventListener('click', function(){console.log('shopping cart', shoppingCart);saveArrayToLocalStorage('shoppingCart', shoppingCart)});
}

function addProduct(product){
    const productDiv = document.createElement('div');
    productDiv.classList.add('product', 'light-grey-background');
    productDiv.innerHTML = `
        <h2 class="popular__item-title">${product.name}</h2>
        <img src="/images/${product.image}" alt="${product.name}" class="popular__img">
        <p class="content__text">Ціна: $${product.price}</p>
        <p class="content__text">${product.description}</p>
        <button class="add_button" data-product-id="${product.id}">До кошика</button>
    `;
    console.log(product);
    productList.appendChild(productDiv);
    const addButton = productDiv.querySelector('.add_button');
    addButton.addEventListener('click', function() {
        addToCart(product);
    });

}

function addToCart(product) {
    console.log(JSON.stringify(product));
    if(shoppingCart.indexOf(product) === -1){
        shoppingCart.push(product);     
    }
    console.log(`Товари ${shoppingCart}`);
}

function filterProductsByCategory(category) {
    productList.innerHTML = '';

    allProducts = prodConst.filter(product => product.category === category);

    allProducts.forEach(product => {
        addProduct(product);
    });
}

function addAll(dropdownContent){
    const allLink = document.createElement('a');
    allLink.href = '#';
    allLink.textContent = 'Всі';
    dropdownContent.appendChild(allLink);

    allLink.addEventListener('click', function(event) {
        productList.innerHTML = '';
        event.preventDefault();
        prodConst.forEach(product => {
            addProduct(product);
        });
    });
}

function SearchF(){
    productList.innerHTML = '';
    if(search){
        allProducts = allProducts
            .filter(prod => prod.name.toLowerCase()
            .includes(search) || prod.description.toLowerCase()
            .includes(search))
        allProducts.forEach(prod=>{
            addProduct(prod);
        })
    }
    else{
        allProducts = prodConst;
        allProducts.forEach(prod=>addProduct(prod));
    }
}

function addCategoriesToDropdown() {
    const categories = [];

    allProducts.forEach(product => {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });
    addAll(dropdownContent);
    categories.forEach((category, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = category;
        link.id = 'category-' + index;
        link.addEventListener('click', () => filterProductsByCategory(category));
        console.log(category);
        dropdownContent.appendChild(link);
    });
}

function saveArrayToLocalStorage(key, array){
    const arrayString = JSON.stringify(array);
    localStorage.setItem(key, arrayString);
}

function addSorttoDropdown(sortParam){
    switch(sortParam){
        case 'Name':
            allProducts.sort(sortByName);
            console.log(`${allProducts}`)
            break;
        case 'Price':
            allProducts.sort(sortByPrice);
            break;
        default:
            break;
    }
}

function sortByName(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function sortByPrice(a, b) {
    return a.price - b.price;
}

function handleSortButton(event){
    if (event.target.tagName === 'A') {
        const sortBy = event.target.textContent; 
        addSorttoDropdown(sortBy);
        productList.innerHTML = ''
        allProducts.forEach(prod=>addProduct(prod));
    }
}

function handleClickOnCartLink() {
    saveArrayToLocalStorage('shoppingCart', shoppingCart);
}

function drawPriceHistogram() {
    const ctx = document.getElementById('priceChart').getContext('2d');

    const prices = prodConst.map(product => product.price);

    const numBins = 10;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const binWidth = (maxPrice - minPrice) / numBins;

    const data = [];
    for (let i = 0; i < numBins; i++) {
        const lowerBound = minPrice + i * binWidth;
        const upperBound = lowerBound + binWidth;
        const count = prices.filter(price => price >= lowerBound && price < upperBound).length;
        data.push(count);
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const histogram = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map((_, index) => `Interval ${index + 1}`),
            datasets: [{
                label: 'Ціна',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: options
    });
}
