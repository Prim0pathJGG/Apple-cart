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
        const addToCartButtons = document.querySelectorAll('.store__add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productElement = this.closest('.store__product');
                const productId = parseInt(productElement.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                const cartItem = cart.find(item => item.id === productId);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.push({...product, quantity: 1});
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            });
        });
    }

    function updateCartDisplay() {
        checkoutCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotalElement.textContent = '$' + cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    }
    
    renderProducts(products);
                 
});