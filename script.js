// Function to update the counter in both the product slide and the cart popup
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

// Function to handle the product slide and cart operations, ensuring both are synchronized
function handleProductSlideAndCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn:not(.btn-2)');
    const cartPopup = document.getElementById("cart-popup");

    // Loop through each product slide and handle interactions
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            const slide = button.closest('.swiper-slide');
            if (!slide) return;

            // Get initial counter value from the product slide
            let counter = Number(slide.querySelector('.product-number-add').textContent || 0);

            // Create a new cart item
            const heading = slide.getAttribute('data-heading') || 'No heading';
            const description = slide.getAttribute('data-description') || 'No description';
            const price = slide.getAttribute('data-price') || 'No price';
            const imageUrl = slide.getAttribute('data-image') || '';

            // Create a new cart item div
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item-wrapper');

            // Build the cart item HTML
            cartItem.innerHTML = `
                <div class="cart-item-image-container">
                    <img src="${imageUrl}" alt="${heading}" class="cart-item-image"/>
                </div>
                <div class="cart-item-content-container">
                    <div class="cart-item-content-container-left">
                        <div>
                            <h4 class="cart-item-heading">${heading}</h4>
                            <p class="cart-item-description">${description}</p>
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
                        <button class="remove-item">remove</button>
                    </div>
                </div>
            `;

            // Append the cart item to the cart popup
            cartPopup.appendChild(cartItem);

            // Show the cart popup (if it's hidden)
            cartPopup.style.display = "block";

            // Manage the item quantity in the cart popup
            const popupValue = cartItem.querySelector('.cart-popup-value');
            const lesserSign = cartItem.querySelector('.lesser-sign');
            const greaterSign = cartItem.querySelector('.greater-sign');

            // Decrease item quantity in the cart popup
            lesserSign.addEventListener('click', function () {
                counter--; // Decrease the counter
                popupValue.textContent = counter; // Update cart popup counter
                slide.querySelector('.product-number-add').textContent = counter; // Update product slide counter
                updateCounter(slide, counter); // Update both places
                if (counter === 0) {
                    cartItem.remove();
                    slide.querySelector('.add-to-cart-btn:not(.btn-2)').classList.remove('btn-active'); // Reset the button state
                }
            });

            // Increase item quantity in the cart popup
            greaterSign.addEventListener('click', function () {
                counter++; // Increase the counter
                popupValue.textContent = counter; // Update cart popup counter
                slide.querySelector('.product-number-add').textContent = counter; // Update product slide counter
                updateCounter(slide, counter); // Update both places
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

        // Function to update the counter on the product slide
        function updateCounterOnSlide() {
            productNumberAdd.textContent = counter;
            updateCounter(slide, counter); // Also update the cart and other necessary places
        }

        // Click listener for the "Add to Cart" button (1st button)
        addToCartBtn1.addEventListener('click', function (event) {
            event.preventDefault();
            counter++; // Increment the counter
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
// updateCounter();