function initializeProductSlideCounters() {
    const slides = document.querySelectorAll('.swiper-slide');
    const cartPopups = document.querySelectorAll(".cart-popup"); // Select all popups
    const cartSpan = document.querySelectorAll(".cart-span");

    slides.forEach(slide => {
        const btnAddToCart = slide.querySelector('.add-to-cart-btn:not(.btn-2)');
        const btnAddToCart2 = slide.querySelector('.add-to-cart-btn.btn-2');
        const btnPlus = slide.querySelector('.sign-greater-sign');
        const btnMinus = slide.querySelector('.sign-lesser-sign');
        const counterDisplay = slide.querySelector('.product-number-add');
        const cartValue = slide.querySelector('#cart-value');

        const slideId = slide.getAttribute('data-slide-id');
        const heading = slide.getAttribute('data-heading') || 'No heading';
        const description = slide.getAttribute('data-description') || 'No description';
        const price = parseFloat(slide.getAttribute('data-price')) || 0; // Ensure price is a number
        const imageUrl = slide.getAttribute('data-image') || '';

        // Initialize
        let counter = 0;
        slide.setAttribute('data-counter', counter);
        updateAllDisplays();

        function updateAllDisplays() {
            counter = parseInt(slide.getAttribute('data-counter')) || 0;
            counterDisplay.textContent = counter;
            if (cartValue) cartValue.textContent = counter;
            btnAddToCart2.classList.toggle('btn-active', counter > 0);
            counterDisplay.classList.add('cart-active');
            setTimeout(() => counterDisplay.classList.remove('cart-active'), 300);
            updateCartSpanTotal(); // <-- Added line
        }

        function updateCartSpanTotal() {
            let total = 0;
            document.querySelectorAll('.swiper-slide').forEach(slide => {
                total += parseInt(slide.getAttribute('data-counter')) || 0;
            });
            cartSpan.forEach(span => {
                span.textContent = total;
                span.classList.toggle('span-active', total > 0);
            });
        }

        function addToCartPopup() {
            // Loop through all cart popups
            cartPopups.forEach(cartPopup => {
                let existingItem = cartPopup.querySelector(`[data-slide-id="${slideId}"]`);
                if (existingItem) return; // Don't re-add if already exists

                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item-wrapper');
                cartItem.setAttribute('data-slide-id', slideId);
                cartItem.innerHTML = `
                    <div class="cart-item-image-container">
                        <img src="${imageUrl}" alt="${heading}" class="cart-item-image"/>
                    </div>
                    <div class="cart-item-content-container">
                        <div class="cart-item-content-container-left">
                            <div>
                                <h4 class="cart-item-heading">${heading}</h4>
                                <p class="cart-item-description">Size: ${description}</p>
                            </div>
                            <div>
                                <button class="quantity-adjust-btn">
                                    <span class="lesser-sign">-</span>
                                    <span class="cart-popup-value">${counter}</span>
                                    <span class="greater-sign">+</span>
                                </button>
                            </div>
                        </div>
                        <div class="cart-item-content-container-right">
                            <span class="all-items-price">$${(price * counter).toFixed(2)}</span>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                `;
                cartPopup.appendChild(cartItem);
                cartPopup.style.display = 'block';

                // Handlers inside cart
                const popupValue = cartItem.querySelector('.cart-popup-value');
                const lessBtn = cartItem.querySelector('.lesser-sign');
                const moreBtn = cartItem.querySelector('.greater-sign');
                const removeBtn = cartItem.querySelector('.remove-item');
                const priceSpan = cartItem.querySelector('.all-items-price'); // Corrected placement of priceSpan

                lessBtn.addEventListener('click', () => {
                    let val = parseInt(slide.getAttribute('data-counter'));
                    if (val > 1) {
                        val--;
                        slide.setAttribute('data-counter', val);
                        popupValue.textContent = val;
                        updateAllDisplays();
                    } else {
                        // remove item
                        cartItem.remove();
                        slide.setAttribute('data-counter', 0);
                        updateAllDisplays();
                    }

                    priceSpan.textContent = `$${(price * val).toFixed(2)}`;
                });

                moreBtn.addEventListener('click', () => {
                    let val = parseInt(slide.getAttribute('data-counter'));
                    val++;
                    slide.setAttribute('data-counter', val);
                    popupValue.textContent = val;
                    updateAllDisplays();

                    priceSpan.textContent = `$${(price * val).toFixed(2)}`;
                });

                removeBtn.addEventListener('click', () => {
                    cartItem.remove();
                    slide.setAttribute('data-counter', 0);
                    updateAllDisplays();
                });
            });
        };

        // Main add-to-cart button (btn-1)
        btnAddToCart.addEventListener('click', (e) => {
            e.preventDefault();
            let currentCount = parseInt(slide.getAttribute('data-counter')) || 0;
            if (currentCount === 0) {
                slide.setAttribute('data-counter', 1);
                updateAllDisplays();
                addToCartPopup();
            }
        });

        // Plus/Minus buttons
        btnPlus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(slide.getAttribute('data-counter')) || 0;
            slide.setAttribute('data-counter', val + 1);
            updateAllDisplays();

            cartPopups.forEach(cartPopup => {
                const popupItem = cartPopup.querySelector(`[data-slide-id="${slideId}"]`);
                if (popupItem) {
                    popupItem.querySelector('.cart-popup-value').textContent = val + 1;
                    const priceSpan = popupItem.querySelector('.all-items-price'); // Get priceSpan here
                    priceSpan.textContent = `$${(price * (val + 1)).toFixed(2)}`;
                }
            });
        });

        btnMinus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(slide.getAttribute('data-counter')) || 0;
            if (val > 0) {
                slide.setAttribute('data-counter', val - 1);
                updateAllDisplays();

                cartPopups.forEach(cartPopup => {
                    const popupItem = cartPopup.querySelector(`[data-slide-id="${slideId}"]`);
                    if (popupItem) {
                        if (val - 1 === 0) {
                            popupItem.remove();
                        } else {
                            popupItem.querySelector('.cart-popup-value').textContent = val - 1;
                        }
                        const priceSpan = popupItem.querySelector('.all-items-price'); // Get priceSpan here
                        priceSpan.textContent = `$${(price * (val - 1)).toFixed(2)}`;
                    }
                });
            }
        });
    });
};

initializeProductSlideCounters();
