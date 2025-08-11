// Loader logic
window.addEventListener("load", () => {
  const loaderEl = document.getElementById("loader");
  if (loaderEl) loaderEl.style.display = "none";
});

// Light/Dark Mode Toggle
const modeToggleBtn = document.getElementById("modeToggle");
if (modeToggleBtn) {
  modeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// Image enlarge modal logic
const modal = document.getElementById('imageModal');
const modalImg = modal ? modal.querySelector('img') : null;

if (modal && modalImg) {
  document.querySelectorAll('.enlargeable').forEach(img => {
    img.addEventListener('click', () => {
      modal.classList.add('active');
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modalImg.src = '';
    }
  });
}

// Hero carousel logic
const carouselImgs = document.querySelectorAll('.carousel-img');
const indicators = document.querySelectorAll('.indicator');
const leftArrow = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
let currentSlide = 0;
let carouselInterval;

function showSlide(idx) {
  carouselImgs.forEach((img, i) => {
    img.classList.toggle('active', i === idx);
  });
  indicators.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
  currentSlide = idx;
}

function nextSlide() {
  if (carouselImgs.length === 0) return;
  showSlide((currentSlide + 1) % carouselImgs.length);
}

function prevSlide() {
  if (carouselImgs.length === 0) return;
  showSlide((currentSlide - 1 + carouselImgs.length) % carouselImgs.length);
}

if (rightArrow) rightArrow.addEventListener('click', () => {
  nextSlide();
  resetCarouselInterval();
});
if (leftArrow) leftArrow.addEventListener('click', () => {
  prevSlide();
  resetCarouselInterval();
});
indicators.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showSlide(i);
    resetCarouselInterval();
  });
});

function startCarouselInterval() {
  if (carouselImgs.length === 0) return;
  carouselInterval = setInterval(nextSlide, 4000);
}
function resetCarouselInterval() {
  if (carouselInterval) clearInterval(carouselInterval);
  startCarouselInterval();
}
if (carouselImgs.length > 0) {
  startCarouselInterval();
}

// Nav active link logic
const navLinks = document.querySelectorAll('.nav-links a');
function setActiveNavLink() {
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      (href === 'index.html' && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html')) ||
      (href !== 'index.html' && window.location.pathname.endsWith(href))
    ) {
      link.classList.add('active');
    }
  });
}
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
setActiveNavLink();

// Card link active state logic
const cardLinks = document.querySelectorAll('.card-link');
function setActiveCardLink() {
  cardLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href && window.location.pathname.endsWith(href)) {
      link.classList.add('active');
    }
  });
}
cardLinks.forEach(link => {
  link.addEventListener('click', function() {
    cardLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
setActiveCardLink();

// Add to Cart button logic
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Loader magic fade-out with 5 second delay
window.addEventListener('load', () => {
  const loaderMagic = document.getElementById('loader-magic');
  if (loaderMagic) {
    setTimeout(() => {
      loaderMagic.classList.add('hide');
      setTimeout(() => loaderMagic.style.display = 'none', 800);
    }, 1000);
  }
});

// Cart counter functionality
function updateCartCounter() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const cartCounters = document.querySelectorAll('.cart-counter');
  cartCounters.forEach(counter => {
    counter.textContent = totalItems;
  });
}

// Initialize cart counter on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();
});

// Add to Cart logic for all cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    const bookSelector = card.querySelector('.book-type-selector');
    const priceDisplay = card.querySelector('.item-rate');
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    const productImg = card.querySelector('img');
    const productName = card.querySelector('p');

    if (bookSelector && priceDisplay && addToCartBtn) {
      bookSelector.addEventListener('change', () => {
        const selectedOption = bookSelector.options[bookSelector.selectedIndex];
        if (!selectedOption) return;
        priceDisplay.textContent = `₹${selectedOption.value}`;
      });

      addToCartBtn.addEventListener('click', () => {
        const selectedOption = bookSelector.options[bookSelector.selectedIndex];
        if (!selectedOption) return;
        const item = {
          name: selectedOption.dataset.name,
          img: productImg ? productImg.src : '',
          price: parseFloat(selectedOption.value),
          quantity: 1
        };
        let cart = getCart();
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push(item);
        }
        setCart(cart);
        updateCartCounter();
        alert(`${item.name} added to cart!`);
      });
    } else if (addToCartBtn && productImg && productName) {
      addToCartBtn.addEventListener('click', () => {
        const itemName = addToCartBtn.dataset.name || productName.textContent || 'Item';
        const itemImg = addToCartBtn.dataset.img || (productImg ? productImg.src : '');
        const itemPrice = parseFloat(addToCartBtn.dataset.price || (priceDisplay ? priceDisplay.textContent.replace('₹', '') : '0')) || 0;

        const item = { name: itemName, img: itemImg, price: itemPrice, quantity: 1 };
        let cart = getCart();
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push(item);
        }
        setCart(cart);
        updateCartCounter();
        alert(`${item.name} added to cart!`);
      });
    }
  });
});

const siteSearchForm = document.getElementById('siteSearchForm');
if (siteSearchForm) {
  siteSearchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('siteSearchInput');
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.cards .card');
    let found = false;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
        found = true;
      } else {
        card.style.display = 'none';
      }
    });
    let noResults = document.getElementById('noResultsMsg');
    if (!found) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'noResultsMsg';
        noResults.textContent = 'No results found.';
        noResults.style.textAlign = 'center';
        noResults.style.margin = '20px';
        const cardsContainer = document.querySelector('.cards');
        if (cardsContainer) cardsContainer.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });

  const siteSearchInput = document.getElementById('siteSearchInput');
  if (siteSearchInput) {
    siteSearchInput.addEventListener('input', function(e) {
      if (!e.target.value.trim()) {
        document.querySelectorAll('.cards .card').forEach(card => {
          card.style.display = '';
        });
        const noResults = document.getElementById('noResultsMsg');
        if (noResults) noResults.remove();
      }
    });
  }
}

// PWA: register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// Optional: install prompt UI
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // You can show a custom install button elsewhere
});

function promptInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(() => {
      deferredPrompt = null;
    });
  }
}
