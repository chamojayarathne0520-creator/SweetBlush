// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('bakery_cart') || '[]');

function saveCart() { localStorage.setItem('bakery_cart', JSON.stringify(cart)); }

// ===== NAVBAR HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}



// ===== CART SIDEBAR =====
const cartSidebar = document.getElementById('cartSidebar');
const cartCloseBtn = document.getElementById('cartClose');
const openCartBtn = document.getElementById('openCart');

if (openCartBtn) openCartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">🛒 Your cart is empty.<br>Add some sweet treats!</div>';
  } else {
    cartItems.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='../images/hero.jpg'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>LKR ${item.price} × ${item.qty}</span>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
      </div>
    `).join('');
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (cartTotal) cartTotal.textContent = `LKR ${total.toFixed(2)}`;
  if (cartCount) cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function addToCart(name, price, img) {
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, img, qty: 1 });
  saveCart();
  renderCart();
  cartSidebar.classList.add('open');
  showToast(`${name} added to cart! `);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { showToast('Your cart is empty!'); return; }
    cartSidebar.classList.remove('open');
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth' });
      showToast('Please enter your details');
    }
  });
}

// ===== TOAST =====
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
window.showToast = showToast;

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! We\'ll reply soon 💌');
    contactForm.reset();
  });
}

// ===== INIT =====
renderCart();
