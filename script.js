function updateCounter(slide, counter) {
    const cartSpan = document.querySelector(".cart-span");
    const productNumberAdd = slide.querySelector('.product-number-add');
    const cartValue = slide.querySelector('#cart-value');
    const addToCartBtn2 = slide.querySelector('.add-to-cart-btn.btn-2'); // second button

    // Update counter text on the product slide
    if (productNumberAdd) productNumberAdd.textContent = counter;
    if (cartValue) cartValue.textContent = counter;
    if (cartSpan) cartSpan.textContent = counter;

    // Manage the state of the second "Add to Cart" button (add class 'btn-active')
    if (addToCartBtn2) {
        if (counter > 0) {
            addToCartBtn2.classList.add('btn-active');
            cartSpan.classList.add('span-active');
        } else {
            addToCartBtn2.classList.remove('btn-active');
            cartSpan.classList.remove('span-active');
        }
    }
}

function handleProductSlideAndCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById("cart-popup");

    // Loop through each product slide and handle interactions
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            const slide = button.closest('.swiper-slide');
            if (!slide) return;

            const slideId = slide.getAttribute('data-slide-id'); // Unique slide ID
            let counter = Number(slide.querySelector('.product-number-add').textContent || 0);

            // Get product details
            const heading = slide.getAttribute('data-heading') || 'No heading';
            const description = slide.getAttribute('data-description') || 'No description';
            const price = slide.getAttribute('data-price') || 'No price';
            const imageUrl = slide.getAttribute('data-image') || '';

            // Create a new cart item
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item-wrapper');
            cartItem.setAttribute('data-slide-id', slideId); // Use the unique slide ID to identify the item in the cart

            // Build the cart item HTML
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
                        <span>${price}</span>
                        <button class="remove-item">Remove</button>
                    </div>
                </div>
            `;

            // Check if the item is already in the cart
            const existingCartItem = cartPopup.querySelector(`[data-slide-id="${slideId}"]`);
            if (existingCartItem) {
                const popupValue = existingCartItem.querySelector('.cart-popup-value');
                counter = Number(popupValue.textContent) + 1;  // Increment the counter if the product already exists in the cart
                popupValue.textContent = counter;
                slide.querySelector('.product-number-add').textContent = counter;
                updateCounter(slide, counter); // Update the counter for both places
                return;
            }

            // Append the cart item to the cart popup
            cartPopup.appendChild(cartItem);

            // Show the cart popup (if it's hidden)
            cartPopup.style.display = "block";

            const popupValue = cartItem.querySelector('.cart-popup-value');
            const lesserSign = cartItem.querySelector('.lesser-sign');
            const greaterSign = cartItem.querySelector('.greater-sign');

            // Decrease item quantity in the cart popup
            lesserSign.addEventListener('click', function () {
                let currentValue = Number(popupValue.textContent);

                if (currentValue > 1) {  // Ensure the value doesn't go below 1
                    currentValue--; // Decrease the counter by 1
                    popupValue.textContent = currentValue; // Update cart popup counter
                    slide.querySelector('.product-number-add').textContent = currentValue; // Update product slide counter
                    updateCounter(slide, currentValue); // Update both places
                } else if (currentValue === 1) {
                    currentValue--; // Decrease the counter to 0
                    popupValue.textContent = currentValue; // Update cart popup counter
                    slide.querySelector('.product-number-add').textContent = 0; // Update product slide counter
                    updateCounter(slide, 0); // Update both places

                    // Now, check if counter is 0, remove the item from the cart after a delay
                    setTimeout(() => {
                        cartItem.remove(); // Remove item from cart after decrementing to zero
                    }, 300);  // Small delay to allow for the decrement animation if needed
                }
            });

            // Increase item quantity in the cart popup
            greaterSign.addEventListener('click', function () {
                let currentValue = Number(popupValue.textContent);
                currentValue++; // Increase the counter by 1
                popupValue.textContent = currentValue; // Update cart popup counter
                slide.querySelector('.product-number-add').textContent = currentValue; // Update product slide counter
                updateCounter(slide, currentValue); // Update both places
            });

            // Remove item from the cart
            const removeButton = cartItem.querySelector('.remove-item');
            removeButton.addEventListener('click', function () {
                // Remove the item from the cart popup
                cartItem.remove();

                // Reset the product slide counter to 0
                slide.querySelector('.product-number-add').textContent = 0;

                // Reset the "Add to Cart" button to inactive state
                slide.querySelector('.add-to-cart-btn:not(.btn-2)').classList.remove('btn-active');

                // Call the updateCounter function to ensure everything is reset properly
                updateCounter(slide, 0); // Reset product slide counter
            });
        });
    });
}



// Handle the product slide counter interaction (increment/decrement)
function handleProductSlide() {
    const slides = document.querySelectorAll('.swiper-slide');

    slides.forEach(slide => {
        const lesserSign = slide.querySelector('.sign.lesser-sign');
        const greaterSign = slide.querySelector('.sign.greater-sign');
        const addToCartBtn1 = slide.querySelector('.add-to-cart-btn:not(.btn-2)'); // normal button
        const productNumberAdd = slide.querySelector('.product-number-add');

        let counter = 0; // Initialize the counter for the current slide

        // Function to update the counter on the product slide and the cart popup
        function updateCounterOnSlide() {
            productNumberAdd.textContent = counter;
            updateCounter(slide, counter); // Also update the cart and other necessary places

            // ALSO update cart popup quantity if the item exists
            const slideId = slide.getAttribute('data-slide-id');
            const cartItems = document.querySelectorAll('.cart-item-wrapper');
            cartItems.forEach(item => {
                const itemSlideId = item.getAttribute('data-slide-id');
                if (itemSlideId === slideId) {
                    const popupValue = item.querySelector('.cart-popup-value');
                    if (popupValue) popupValue.textContent = counter;
                }
            });
        }

        // Click listener for the "Add to Cart" button (1st button)
        addToCartBtn1.addEventListener('click', function (event) {
            event.preventDefault();
            counter = 1; // Always start the counter at 1 when a new product is added to the cart
            updateCounterOnSlide();
        });

        // Decrease counter when the lesser sign (-) is clicked
        lesserSign.addEventListener('click', function (event) {
            event.preventDefault();
            if (counter > 0) {
                counter--; // Decrement the counter
                updateCounterOnSlide();
            }
        });

        // Increase counter when the greater sign (+) is clicked
        greaterSign.addEventListener('click', function (event) {
            event.preventDefault();
            counter++; // Increment the counter
            updateCounterOnSlide();
        });

        // Initialize counter for each slide
        updateCounterOnSlide();
    });
}

// Initialize both functions
handleProductSlide();
handleProductSlideAndCart();
