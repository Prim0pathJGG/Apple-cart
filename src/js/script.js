import {products} from '../data/products.js';
document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const checkoutCountElement =document.querySelector(".header__checkout-count");
    const cartPreviewElement =document.querySelector(".header__cart-preview");
    const cartItemsElement =document.querySelector(".header__cart-items");
    const cartTotalElement =document.querySelector(".header__cart-total-amount");
    const productListElement =document.querySelector(".store__products-list");
    const toastContainer =document.querySelector('.toast-container');

    function renderProducts(products) {
        productListElement.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('store__product');
            productElement.setAttribute('data-id', product.id);

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="store__product-image">
                <h2 class="store__product-name">${product.name}</h2>
                <p class="store__product-price">$${product.price.toFixed(2)}</p>
                <p class="store__product-description">${product.description}</p>
                <button class="store__add-to-cart">Add to basket</button>
            `;
            productListElement.appendChild(productElement);
        });

        attachAddToCartListeners();
    }

    function attachAddToCartListeners() {
        document.querySelectorAll(".store__add-to-cart").forEach(button => {
            button.addEventListener('click', function() {
                const productElement = this.parentElement;
                const productId = productElement.getAttribute("data-id");
                const productName = productElement.querySelector(".store__product-name").textContent;
                const productPrice = parseFloat(productElement.querySelector(".store__product-price").textContent.replace('$', ''));
                const productImage = productElement.querySelector(".store__product-image").src;

                const existingProduct = cart.find(item => item.id === productId);
                
            
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    cart.push(product);                   
                }

                updateCart();
                showToast(`${productName} added to basket`,'success');
            });
        });
    }             
                 
});