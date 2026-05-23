
    import {products} from '../data/products.js';

document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const checkoutCountElement = document.querySelector(".header__checkout-count");
    const cartPreviewElement = document.querySelector(".header__cart-preview");
    const cartItemsElement = document.querySelector(".header__cart-items");
    const cartTotalElement = document.querySelector(".header__cart-total-amount");
    const productListElement = document.querySelector(".store__products-list");
    const toastContainer = document.querySelector('.toast-container');
    const checkoutLink = document.querySelector('.header__checkout-link'); // FIX 1: moved inside DOMContentLoaded, added missing dot

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
                showToast(`${productName} added to basket`, 'success');
            });
        });
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        checkoutCountElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        renderCartPreview(); // FIX 2: this now calls the correctly named and structured function below
    }

    function renderCartPreview() { // FIX 3: was "updateCartPreview" but called as "renderCartPreview"; also the forEach and total logic were outside this function
        cartItemsElement.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.add('header__cart-item');
            li.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="header__cart-item-image">
                <span class="header__cart-item-name">${item.name}</span>
                <span class="header__cart-item-quantity">x${item.quantity}</span>
                <span class="header__cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="header__cart-item-increase">+</button>
                <button class="header__cart-item-decrease">-</button>
                <button class="header__cart-item-remove">Remove</button>
            `;

            li.querySelector('.header__cart-item-increase').addEventListener('click', () => {
                item.quantity++;
                updateCart();
            });

            li.querySelector('.header__cart-item-decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(index, 1);
                }
                showToast(`${item.name} removed from basket`, 'error');
                updateCart();
            });

            li.querySelector('.header__cart-item-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                showToast(`${item.name} removed from basket`, 'error');
                updateCart();
            });

            cartItemsElement.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toFixed(2);
    }

    function clearCart() { // FIX 4: was outside the DOMContentLoaded callback, so cart, updateCart, showToast were all out of scope
        cart = [];
        updateCart();
        showToast('Cleared entire basket', 'error');
    }

    function showToast(message, type) { // FIX 5: was outside the DOMContentLoaded callback, so toastContainer was out of scope
        const toast = document.createElement('div');
        toast.className = `toast toast--${type} toast--visible`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('toast--visible');
            toast.addEventListener('transitionend', () => toast.remove());    
        }, 3000);
    }

    cartPreviewElement.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    checkoutLink.addEventListener('mouseenter', () => {
        cartPreviewElement.style.display = 'flex';
    });

    cartPreviewElement.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    checkoutLink.addEventListener('mouseleave', () => {
        cartPreviewElement.style.display = 'none';
    });

    renderProducts(products);
    updateCart();

    document.querySelector('.header__clear-cart-button').addEventListener('click', clearCart);
});
       