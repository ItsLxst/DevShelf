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