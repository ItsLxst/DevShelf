const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartButton = document.querySelector('.cart-button');

// cart elements
const cartItemsContainer = document.querySelector('.cart-items');
const emptyCartContainer = document.querySelector('.empty-cart');
const cartTitle = document.querySelector('.cart-title');
const totalPriceEl = document.querySelector('.total-price');
const cartFooter = document.querySelector('.cart-footer');

let cart = [];

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const price = parseInt(button.getAttribute('data-price'));
        const icon = button.getAttribute('data-icon');
        const id = button.getAttribute('data-id');

        // add to cart
        cart.push({ id, title, price, icon });

        cartButton.classList.add('active');
        cartButton.innerHTML = `<img src="/images/cart.svg" alt="Cart Icon" width="18" height="18"> Cart ${cart.length}`;
        
        button.textContent = '✓ Added';
        button.classList.add('btn-added');
        button.classList.remove('btn-again');
        
        setTimeout(() => {
            button.textContent = 'Add again';
            button.classList.remove('btn-added');
            button.classList.add('btn-again');
        }, 2000);
        updateCartUI();
    });
});

// update cart
function updateCartUI() {
    // title update Cart 1 - show number of items
    cartTitle.textContent = `Cart (${cart.length})`;

    if (cart.length === 0) {
        // cart empty show empty message, hide others
        emptyCartContainer.classList.remove('hidden');
        cartItemsContainer.classList.add('hidden');
        cartFooter.classList.add('hidden');
    } else {
        // cart has items render them, hide empty
        emptyCartContainer.classList.add('hidden');
        cartItemsContainer.classList.remove('hidden');
        cartFooter.classList.remove('hidden');

        // total price calculation
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceEl.textContent = `$${total}`;

        // draw items in cart html
        cartItemsContainer.innerHTML = ''; // empty the container before adding new items
        cart.forEach((item, index) => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-details">
                        <h4>${item.title}</h4>
                    </div>
                    <div class="item-actions">
                        <span class="item-price">$${item.price}</span>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            // add the html to the container
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // add event listeners to remove buttons in cart
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1); // delete item
                
                // change cart button text and number of items
                cartButton.innerHTML = `<img src="/images/cart.svg" alt="Cart Icon" width="18" height="18"> Cart ${cart.length > 0 ? cart.length : ''}`;
                if(cart.length === 0) cartButton.classList.remove('active');
                
                updateCartUI(); // render cart again because of changes
            });
        });
    }
}

// category filter
const filterButtons = document.querySelectorAll('.nav-item');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // when clicked won't jump to top of page

        // filtered class gets the color
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // iterate through cards and show/hide based on filter
        productCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || filterValue === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// cart drawer functionality
const cartOverlay = document.querySelector('.cart-overlay');
const cartDrawer = document.querySelector('.cart-drawer');
const closeCartBtn = document.querySelector('.close-cart');

// open cart
cartButton.addEventListener('click', () => {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
});

// close cart click X
closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
});

// close cart click outside
cartOverlay.addEventListener('click', () => {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
});