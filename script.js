/* ============================================================
   ELEMENTS
   ============================================================ */
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const promoJoinBtn = document.getElementById("promoJoinBtn");
const cartBtn = document.getElementById("cartBtn");

const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");

const modalOverlay = document.getElementById("modalOverlay");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");

const switchToSignup = document.getElementById("switchToSignup");
const switchToLogin = document.getElementById("switchToLogin");

const userGreeting = document.getElementById("userGreeting");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");

const toast = document.getElementById("toast");


/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}


/* ============================================================
   USER SYSTEM (LOCALSTORAGE)
   ============================================================ */
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
        localStorage.removeItem("currentUser");
    }
    updateGreeting();
}

function updateGreeting() {
    const user = getCurrentUser();
    if (user) {
        userGreeting.textContent = `Hi, ${user.name}`;
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
        // If you want to hide buttons when logged in, uncomment below:
        // loginBtn.style.display = "none";
        // signupBtn.style.display = "none";
    } else {
        userGreeting.textContent = "";
        loginBtn.style.display = "inline-block";
        signupBtn.style.display = "inline-block";
    }
}


/* ============================================================
   MODALS
   ============================================================ */
function openModal(modal) {
    modalOverlay.style.display = "block";
    modal.style.display = "flex";
}

function closeModals() {
    modalOverlay.style.display = "none";
    loginModal.style.display = "none";
    signupModal.style.display = "none";
}

modalOverlay.addEventListener("click", closeModals);

switchToSignup.addEventListener("click", () => {
    loginModal.style.display = "none";
    signupModal.style.display = "flex";
});

switchToLogin.addEventListener("click", () => {
    signupModal.style.display = "none";
    loginModal.style.display = "flex";
});


/* ============================================================
   SIGNUP
   ============================================================ */
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
        showToast("Please fill all fields.");
        return;
    }

    let users = getUsers();

    if (users.some(u => u.email === email)) {
        showToast("Email already registered.");
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);

    setCurrentUser(newUser);
    closeModals();
    showToast("Signup successful!");

    signupForm.reset();
});


/* ============================================================
   LOGIN
   ============================================================ */
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast("Invalid email or password.");
        return;
    }

    setCurrentUser(user);
    closeModals();
    showToast("Logged in!");
    loginForm.reset();
});


/* ============================================================
   CART (LOCALSTORAGE)
   ============================================================ */
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(product) {
    const user = getCurrentUser();
    if (!user) {
        openModal(loginModal);
        showToast("Please login first.");
        return;
    }

    let cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    showToast("Added to cart!");
}

function removeFromCart(id) {
    let cart = getCart().filter(item => item.id !== id);
    saveCart(cart);
}

function updateCartUI() {
    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const lineTotal = item.qty * item.price;
        total += lineTotal;
        count += item.qty;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>₹${lineTotal}</span>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotalEl.textContent = total;
    cartCountEl.textContent = count;
}


/* ============================================================
   ADD TO CART BUTTONS
   ============================================================ */
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseInt(card.dataset.price)
        };
        addToCart(product);
    });
});


/* ============================================================
   CART OPEN/CLOSE
   ============================================================ */
cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("open");
});

closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("open");
});


/* ============================================================
   CART ITEM REMOVE (DELEGATION)
   ============================================================ */
cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
        const id = e.target.dataset.id;
        removeFromCart(id);
        showToast("Removed from cart.");
    }
});


/* ============================================================
   CHECKOUT
   ============================================================ */
document.getElementById("checkoutBtn").addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
        showToast("Cart is empty.");
        return;
    }

    showToast("Checkout demo — no payment processing.");
});


/* ============================================================
   OPEN MODALS FROM BUTTONS
   ============================================================ */
loginBtn.addEventListener("click", () => openModal(loginModal));
signupBtn.addEventListener("click", () => openModal(signupModal));
promoJoinBtn?.addEventListener("click", () => openModal(signupModal));


/* ============================================================
   INITIALIZE
   ============================================================ */
updateGreeting();
updateCartUI();
