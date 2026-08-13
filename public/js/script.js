const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartButton = document.querySelector('.cart-button');

let cartCount = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        cartButton.classList.add('active');
        cartButton.innerHTML = `<img src="/images/cart.svg" alt="Cart Icon" width="18" height="18"> Cart ${cartCount}`;
        
        button.textContent = '✓ Added';
        button.classList.add('btn-added');
        button.classList.remove('btn-again');
        
        setTimeout(() => {
            button.textContent = 'Add again';
            button.classList.remove('btn-added');
            button.classList.add('btn-again');
        }, 2000);
    });
});

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