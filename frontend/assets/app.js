const API = "/api";
const state = {
  products: [],
  categories: [],
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  lastOrder: JSON.parse(localStorage.getItem("lastOrder") || "null"),
  addresses: JSON.parse(localStorage.getItem("addresses") || "[]"),
  selectedAddressId: localStorage.getItem("selectedAddressId") || "",
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  buyNowItem: null,
  selectedProductId: null,
  page: 1
};

const placeholderSVG = (text, bgColor) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='${bgColor}' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;

const localProductImages = {
  "Nova X1 Wireless Headphones": "assets/images/headphones.jpg",
  "AeroFit Smart Watch": "assets/images/smartwatch.jpg",
  "Everyday Cotton Hoodie": "assets/images/hoodie.jpg",
  "Ceramic Dinner Set": "assets/images/dinnerset.jpg",
  "GlowCare Vitamin C Serum": "assets/images/serum.jpg",
  "StridePro Running Shoes": "assets/images/shoes.jpg",
  "JBL Bluetooth Speaker": "assets/images/speaker.jpg",
  "HyperX Gaming Mouse": "assets/images/mouse.jpg",
  "FUR JADEN Leather Backpack": "assets/images/backpack.jpg",
  "Classic UV Sunglasses": "assets/images/sunglasses.jpg",
  "VANTRO Espresso Coffee Machine": "assets/images/coffee-maker.jpg",
  "Floor Lamp": "assets/images/lamp.jpg",
  "Curology Face Wash": "assets/images/facewash.jpg",
  "FlexFit Yoga Mat": "assets/images/yogamat.jpg",
  "Ikigai Book": "assets/images/book.jpg",
  "Pure Organic Honey": "assets/images/honey.jpg"
};

function resolveImageSrc(src) {
  if (!src) return placeholderSVG("No image", "999");
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

function imageTag(src, alt, extra = "") {
  return `<img src="${resolveImageSrc(src)}" alt="${alt}" ${extra} onerror="this.onerror=null;this.src='${placeholderSVG(alt, '999')}'">`;
}

function normalizeProduct(product) {
  const fallbackImage = localProductImages[product.name] || product.image || "";
  return {
    ...product,
    image: fallbackImage,
    images: Array.isArray(product.images) && product.images.length ? product.images.map(img => img || fallbackImage) : [fallbackImage]
  };
}

const sampleProducts = [
  { id: 1, name: "Nova X1 Wireless Headphones", price: 4999, discount_percent: 12, stock: 42, rating: 4.8, category_name: "Electronics", category_id: 1, is_featured: true, is_best_seller: true, image: "assets/images/headphones.jpg", description: "Active noise cancelling headphones with 40 hour battery life.", specifications: { battery: "40 hours", connectivity: "Bluetooth 5.3" } },
  { id: 2, name: "AeroFit Smart Watch", price: 6999, discount_percent: 10, stock: 35, rating: 4.5, category_name: "Electronics", category_id: 1, is_featured: true, image: "assets/images/smartwatch.jpg", description: "Fitness watch with AMOLED display, SpO2, GPS, and NFC.", specifications: { display: "AMOLED", water: "5 ATM" } },
  { id: 3, name: "Everyday Cotton Hoodie", price: 1799, discount_percent: 15, stock: 80, rating: 4.3, category_name: "Fashion", category_id: 2, is_best_seller: true, image: "assets/images/hoodie.jpg", description: "Soft mid-weight hoodie for travel and daily wear.", specifications: { fabric: "Cotton blend", fit: "Regular" } },
  { id: 4, name: "Ceramic Dinner Set", price: 3499, discount_percent: 8, stock: 25, rating: 4.4, category_name: "Home", category_id: 3, is_featured: true, image: "assets/images/dinnerset.jpg", description: "Six place matte ceramic dinner set.", specifications: { pieces: "24", material: "Ceramic" } },
  { id: 5, name: "GlowCare Vitamin C Serum", price: 899, discount_percent: 5, stock: 120, rating: 4.6, category_name: "Beauty", category_id: 4, is_best_seller: true, image: "assets/images/serum.jpg", description: "Lightweight serum for brighter skin.", specifications: { volume: "30ml", skin: "All" } },
  { id: 6, name: "StridePro Running Shoes", price: 4299, discount_percent: 18, stock: 50, rating: 4.9, category_name: "Sports", category_id: 5, is_featured: true, is_best_seller: true, image: "assets/images/shoes.jpg", description: "Responsive road running shoes with knit upper.", specifications: { drop: "8mm", use: "Road running" } },
  { id: 7, name: "JBL Bluetooth Speaker", price: 2999, discount_percent: 15, stock: 35, rating: 4.6, category_name: "Electronics", category_id: 1, is_featured: true, image: "assets/images/speaker.jpg", description: "Portable Bluetooth speaker with deep bass.", specifications: { Battery: "18 Hours", Bluetooth: "5.2" } },
  { id: 8, name: "HyperX Gaming Mouse", price: 1499, discount_percent: 10, stock: 50, rating: 4.7, category_name: "Electronics", category_id: 1, is_best_seller: true, image: "assets/images/mouse.jpg", description: "RGB gaming mouse with adjustable DPI.", specifications: { DPI: "16000", Buttons: "7" } },
  { id: 9, name: "FUR JADEN Leather Backpack", price: 2499, discount_percent: 20, stock: 40, rating: 4.5, category_name: "Fashion", category_id: 2, image: "assets/images/backpack.jpg", description: "FUR JADEN Anti Theft Number Lock Backpack Bag with 15.6 Inch Laptop Compartment, USB Charging Port & Organizer Pocket for Men Women Boys Girls", specifications: { Capacity: "25L", Material: "Leather" } },
  { id: 10, name: "Classic UV Sunglasses", price: 999, discount_percent: 25, stock: 80, rating: 4.3, category_name: "Fashion", category_id: 2, image: "assets/images/sunglasses.jpg", description: "Polarized UV400 sunglasses.", specifications: { Lens: "Polarized", Frame: "Metal" } },
  { id: 11, name: "VANTRO Espresso Coffee Machine", price: 4599, discount_percent: 12, stock: 22, rating: 4.6, category_name: "Home", category_id: 3, is_featured: true, image: "assets/images/coffee-maker.jpg", description: "20 Bar Professional Pressure | 1500W | Stainless Steel Housing | Touch Control Panel | Adjustable Temperature & Extraction Time.", specifications: { Capacity: "1.5L", Power: "1000W" } },
  { id: 12, name: "Floor Lamp", price: 1799, discount_percent: 15, stock: 60, rating: 4.4, category_name: "Home", category_id: 3, image: "assets/images/lamp.jpg", description: "Floor Lamp with Storage Shelves, Tripod Design, Black Metal Frame, Wooden Accents, Beige Fabric Shade, for Living Room, Bedroom, Office", specifications: { Brightness: "3 Levels", Power: "USB" } },
  { id: 13, name: "Curology Face Wash", price: 499, discount_percent: 8, stock: 100, rating: 4.5, category_name: "Beauty", category_id: 4, image: "assets/images/facewash.jpg", description: "Gentle face wash for all skin types.", specifications: { Volume: "150ml", Skin: "All" } },
  { id: 14, name: "FlexFit Yoga Mat", price: 1399, discount_percent: 18, stock: 75, rating: 4.7, category_name: "Sports", category_id: 5, is_best_seller: true, image: "assets/images/yogamat.jpg", description: "Anti-slip yoga mat.", specifications: { Thickness: "6mm", Material: "TPE" } },
  { id: 15, name: "Ikigai Book", price: 799, discount_percent: 10, stock: 55, rating: 4.8, category_name: "Books", category_id: 6, image: "assets/images/book.jpg", description: "“Workers looking for more fulfilling positions should start by identifying their ikigai.” ―Business Insider.", specifications: { Pages: "620", Language: "English" } },
  { id: 16, name: "Pure Organic Honey", price: 649, discount_percent: 5, stock: 90, rating: 4.9, category_name: "Grocery", category_id: 7, image: "assets/images/honey.jpg", description: "Nature's Nectar Raw Organic Honey 400g | 100% Pure NMR Tested | Raw and Unprocessed", specifications: { Weight: "500g", Origin: "India" } }
];

function withLocalProducts(products) {
  const existing = new Set(products.map(product => String(product.id)));
  const additions = sampleProducts.filter(product => !existing.has(String(product.id)));
  return [...products, ...additions].map(normalizeProduct);
}

const rupee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const $ = (id) => document.getElementById(id);

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2400);
}

function updateAuthMode(mode) {
  const fullNameInput = $("fullNameInput");
  const authModeInput = $("authModeInput");
  const loginModeButton = $("loginModeButton");
  const registerModeButton = $("registerModeButton");
  const isRegister = mode === "register";

  if (fullNameInput) {
    fullNameInput.hidden = !isRegister;
    fullNameInput.required = isRegister;
    if (!isRegister) fullNameInput.value = "";
  }

  if (authModeInput) {
    authModeInput.value = mode;
  }

  if (loginModeButton && registerModeButton) {
    loginModeButton.type = isRegister ? "button" : "submit";
    registerModeButton.type = isRegister ? "submit" : "button";
    loginModeButton.classList.toggle("primary", !isRegister);
    loginModeButton.classList.toggle("ghost", isRegister);
    registerModeButton.classList.toggle("primary", isRegister);
    registerModeButton.classList.toggle("ghost", !isRegister);
  }
}

function renderProfileMenu() {
  const menu = $("profileMenu");
  if (!menu) return;
  const isLoggedIn = Boolean(state.token && state.user);
 if (isLoggedIn) {
  menu.innerHTML = `
    <button class="profile-menu-item" type="button" data-profile-view="true">
      View Profile
    </button>
    <button class="profile-menu-item" type="button" data-logout="true">
      Logout
    </button>
  `;
} else {
  menu.innerHTML = "";
}
  menu.hidden = true;
  menu.setAttribute("aria-hidden", "true");
  menu.classList.remove("active");
}

function renderAuthButton() {
  const button = $("profileButtonLabel");
  if (!button) return;
  const isLoggedIn = Boolean(state.token && state.user);
  button.textContent = isLoggedIn
    ? (state.user.full_name || state.user.email || "Profile")
    : "Login";
  renderProfileMenu();
}

function toggleProfileMenu(show) {
  const menu = $("profileMenu");
  if (!menu) return;
  menu.hidden = !show;
  menu.setAttribute("aria-hidden", String(!show));
  menu.classList.toggle("active", show);
}

function setupProfileMenu() {
  const button = $("profileButton");
  const menu = $("profileMenu");
  if (!button || !menu) return;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    renderProfileMenu();
    const isLoggedIn = Boolean(state.token && state.user);
  if (!isLoggedIn) {
  updateAuthMode("login");
  $("authModal").classList.add("open");
  return;
}
    toggleProfileMenu(menu.hidden);
  });

  document.addEventListener("click", (event) => {
  
    if (!event.target.closest(".profile-wrap")) {
      toggleProfileMenu(false);
    }
  });
}

setupProfileMenu();

function renderProfile() {
  const profileSummary = $("profileSummary");
  if (profileSummary) {
    profileSummary.innerHTML = state.user ? `
      <div class="profile-card">
        <h3>${state.user.full_name || "Customer"}</h3>
        <p class="muted">${state.user.email}</p>
      </div>
    ` : "<p>Please log in to view your profile.</p>";
  }
}

function renderAddresses() {
  const box = $("checkoutAddressBox");
  const list = $("savedAddresses");
  if (box) {
    if (!state.token || !state.user) {
      box.innerHTML = '<p class="muted">Please login before placing an order.</p>';
    } else if (!state.addresses.length) {
      box.innerHTML = '<p class="muted">No saved addresses yet. Add one below.</p>';
    } else {
      box.innerHTML = state.addresses.map(address => `
        <label class="address-card">
          <input type="radio" name="selectedAddress" value="${address.id}" ${address.id === state.selectedAddressId ? "checked" : ""} />
          <div>
            <strong>${address.label}</strong>
            <p class="muted">${address.line1}, ${address.city}, ${address.state} ${address.postal_code}</p>
          </div>
        </label>
      `).join("");
    }
  }
  if (list) {
    list.innerHTML = state.addresses.length ? state.addresses.map(address => `
      <div class="address-card">
        <div>
          <strong>${address.label}</strong>
          <p class="muted">${address.line1}, ${address.city}, ${address.state} ${address.postal_code}</p>
        </div>
        <div class="address-actions">
          <button class="btn ghost" type="button" data-select-address="${address.id}">Use for order</button>
        </div>
      </div>
    `).join("") : "<p>No saved addresses yet.</p>";
  }
}

function saveAddress(address) {
  if (!state.token || !state.user) return toast("Please login first");
  const entry = { id: `addr-${Date.now()}`, ...address };
  state.addresses.unshift(entry);
  state.selectedAddressId = entry.id;
  localStorage.setItem("addresses", JSON.stringify(state.addresses));
  localStorage.setItem("selectedAddressId", state.selectedAddressId);
  renderAddresses();
  renderProfile();
  toast("Address saved");
}

function selectAddress(id) {
  state.selectedAddressId = id;
  localStorage.setItem("selectedAddressId", id);
  renderAddresses();
  toast("Address selected");
}

function logout() {
  console.log("LOGOUT CLICKED");

  state.token = null;
  state.user = null;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  renderAuthButton();
  renderProfile();
  renderAddresses();

  toggleProfileMenu(false);

  toast("Logged out");

  location.hash = "#home";
  route(); // IMPORTANT
  window.scrollTo(0, 0);
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: state.token ? `Bearer ${state.token}` : "", ...(options.headers || {}) }
  });
  if (!res.ok) throw new Error((await res.json()).error || "Request failed");
  return res.status === 204 ? null : res.json();
}

function discounted(product) {
  return Number(product.price) * (1 - Number(product.discount_percent || 0) / 100);
}

function productCard(product) {
  return `<article class="card">
    ${imageTag(product.image, product.name, 'loading="lazy"')}
    <div class="card-body">
      <p class="muted">${product.category_name} • ★ ${product.rating || 0}</p>
      <h3>${product.name}</h3>
      <p class="price">${rupee.format(discounted(product))} <span class="muted">${product.discount_percent ? `${product.discount_percent}% off` : ""}</span></p>
      <div class="row">
        <button class="btn primary" data-add="${product.id}">Add to Cart</button>
        <button class="btn ghost" data-view="${product.id}">Details</button>
      </div>
    </div>
  </article>`;
}

function renderHome() {
  $("categories").innerHTML = state.categories.map(c => `<button class="category-pill" data-category="${c}">${c}</button>`).join("");
  $("featuredProducts").innerHTML = state.products.filter(p => p.is_featured).map(productCard).join("");
  $("latestProducts").innerHTML = state.products.slice(0, 4).map(compactItem).join("");
  $("bestSellers").innerHTML = state.products.filter(p => p.is_best_seller).map(compactItem).join("");
}

function compactItem(product) {
  return `<div class="compact-item">${imageTag(product.image, product.name)}<div><strong>${product.name}</strong><p class="muted">${product.category_name}</p></div><div class="price">${rupee.format(discounted(product))}</div></div>`;
}

function filteredProducts() {
  const search = $("searchInput").value.toLowerCase();
  const category = $("categoryFilter").value;
  const min = Number($("minPrice").value || 0);
  const max = Number($("maxPrice").value || Infinity);
  const rating = Number($("ratingFilter").value || 0);
  const sort = $("sortInput").value;
  let items = state.products.filter(p =>
    (!search || `${p.name} ${p.description}`.toLowerCase().includes(search)) &&
    (!category || p.category_name === category) &&
    discounted(p) >= min && discounted(p) <= max &&
    Number(p.rating || 0) >= rating
  );
  if (sort === "price_asc") items.sort((a, b) => discounted(a) - discounted(b));
  if (sort === "price_desc") items.sort((a, b) => discounted(b) - discounted(a));
  if (sort === "rating") items.sort((a, b) => Number(b.rating) - Number(a.rating));
  return items;
}

function renderProducts() {
  const items = filteredProducts();
  const perPage = 8;
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  state.page = Math.min(Math.max(state.page, 1), totalPages);
  const pageItems = items.slice((state.page - 1) * perPage, state.page * perPage);
  $("productGrid").innerHTML = pageItems.map(productCard).join("") || "<p>No products found.</p>";
  $("pageLabel").textContent = `Page ${state.page} of ${totalPages}`;
  $("prevPage").disabled = state.page <= 1;
  $("nextPage").disabled = state.page >= totalPages;
  const q = $("searchInput").value.toLowerCase();
  $("suggestions").innerHTML = q ? state.products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 5).map(p => `<button data-suggest="${p.name}">${p.name}</button>`).join("") : "";
}

function renderDetails(id) {
  const product = state.products.find(p => p.id === Number(id));
  if (!product) return;
  state.selectedProductId = product.id;
  $("productDetails").innerHTML = `${imageTag(product.image, product.name)}
    <div>
      <p class="muted">${product.category_name} • ★ ${product.rating || 0} • ${product.stock > 0 ? "In stock" : "Out of stock"}</p>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p class="price">${rupee.format(discounted(product))}</p>
      <h3>Specifications</h3>
      <ul>${Object.entries(product.specifications || {}).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>
      <div class="row"><input id="qty" type="number" min="1" value="1"><button class="btn primary" data-add="${product.id}">Add to Cart</button><button class="btn ghost" data-buy-now="${product.id}">
    Buy Now
</button></div>
      <h3>Related Products</h3>
      <div class="compact-list">${state.products.filter(p => p.category_name === product.category_name && p.id !== product.id).slice(0, 3).map(compactItem).join("")}</div>
    </div>`;
}

function addToCart(id) {
  const product = state.products.find(p => p.id === Number(id));
  const found = state.cart.find(i => i.id === product.id);
  found ? found.quantity++ : state.cart.push({ ...product, quantity: Number($("qty")?.value || 1) });
  localStorage.setItem("cart", JSON.stringify(state.cart));
  renderCart();
  toast("Product added to cart");
}
function buyNow(id) {
    const product = state.products.find(p => p.id == id);

    if (!product) return;

  state.buyNowItem = {
    ...product,
    quantity: Number($("qty")?.value || 1)
  };

    location.hash = "checkout";
    renderAddresses();
}

function renderCart() {
  $("cartCount").textContent = state.cart.reduce((n, item) => n + item.quantity, 0);
  $("cartItems").innerHTML = state.cart.map(item => `<div class="cart-item">
    ${imageTag(item.image, item.name)}<div><strong>${item.name}</strong><p>${rupee.format(discounted(item))}</p></div>
    <div class="row"><input type="number" min="1" value="${item.quantity}" data-qty="${item.id}"><button class="btn ghost" data-remove="${item.id}">Remove</button></div>
  </div>`).join("") || "<p>Your cart is empty.</p>";
  const total = state.cart.reduce((sum, item) => sum + discounted(item) * item.quantity, 0);
  const tax = total * .18;
  const shipping = total ? 49 : 0;
  $("cartSummary").innerHTML = `<h3>Order Summary</h3><p>Subtotal: ${rupee.format(total)}</p><p>Tax: ${rupee.format(tax)}</p><p>Shipping: ${rupee.format(shipping)}</p><h3>Grand Total: ${rupee.format(total + tax + shipping)}</h3><a class="btn primary" href="#checkout">Checkout</a>`;
}

function downloadInvoice(order) {
  if (!order) return toast("No order available to download");

  const invoiceHtml = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #14213d; }
          h1 { margin-bottom: 8px; }
          .muted { color: #5f6c7b; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border-bottom: 1px solid #d9e2ec; padding: 8px 0; text-align: left; }
          .total { font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>ShopSphere Invoice</h1>
        <p class="muted">Order ID: ${order.id}</p>
        <p class="muted">Placed On: ${new Date(order.createdAt).toLocaleString()}</p>
        <p class="muted">Customer: ${order.customerName || "Guest"}</p>
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Amount</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${rupee.format(item.price * item.quantity)}</td></tr>`).join("")}
          </tbody>
        </table>
        <p style="margin-top: 16px;">Subtotal: ${rupee.format(order.subtotal)}</p>
        <p>Tax: ${rupee.format(order.tax)}</p>
        <p>Shipping: ${rupee.format(order.shipping)}</p>
        <p class="total">Grand Total: ${rupee.format(order.total)}</p>
        <p class="muted">Status: ${order.status}</p>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    toast("Please allow popups for invoice download");
    return;
  }

  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  toast("Invoice ready");
}

function renderOrders() {
  $("ordersList").innerHTML = state.orders.length
  ? state.orders.map(order => {

      const productNames = order.items
        .map(item => item.name)
        .join(", ");

      return `
        <div class="compact-item">
          <div></div>

          <div>
            <strong>${productNames}</strong>

            <p class="muted">
              Order ID: ${order.id}
            </p>

            <p class="muted">
              ${order.status} • ${new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            class="btn ghost"
            data-download-invoice="${order.id}">
            Download Invoice
          </button>
        </div>
      `;
  }).join("")
  : "<p>No orders yet.</p>";

if (state.lastOrder) {


  const productNames = state.lastOrder.items
    .map(item => item.name)
    .join(", ");

  $("ordersList").insertAdjacentHTML("afterbegin", `
    <div class="order-success">
      <span class="order-chip">Order placed</span>

      <h3>Your order for <strong>${productNames}</strong> is confirmed.</h3>

      <p>
        Your order for <strong>${productNames}</strong> has been placed successfully.
        It is being prepared for shipment and will be delivered soon.
      </p>

      <div class="row">
        <button class="btn primary"
                data-download-invoice="${state.lastOrder.id}">
          Download Invoice
        </button>

        <a class="btn ghost" href="#home">
          Continue Shopping
        </a>
      </div>
    </div>
  `);
}
}


function route() {
  const page = location.hash.replace("#", "") || "home";
  document.querySelectorAll(".page").forEach(el => el.classList.toggle("active", el.id === page));

  if (page === "home") {
    renderHome();
    renderProducts();
  }

  if (page === "products") {
    renderProducts();
  }

  if (page === "details") {
    if (state.selectedProductId != null) {
      renderDetails(state.selectedProductId);
    }
  }

  if (page === "cart") renderCart();
  if (page === "orders") renderOrders();
  if (page === "checkout") renderAddresses();
  if (page === "profile") {
    renderProfile();
    renderAddresses();
  }
}

window.addEventListener("hashchange", route);

async function load() {
  try {
    const data = await api("/products?limit=50");
    state.products = withLocalProducts(data.products || []);
  } catch {
    state.products = withLocalProducts([]);
  }
  state.categories = [...new Set(state.products.map(p => p.category_name))];
  $("categoryFilter").innerHTML += state.categories.map(c => `<option>${c}</option>`).join("");
  toggleProfileMenu(false);
  renderHome();
  renderProducts();
  renderCart();
  renderProfile();
  renderAddresses();
  renderOrders();
  renderAuthButton();
  route();
}

document.addEventListener("click", async (event) => {
  const target = event.target;
  const el = target.closest ? target : target.parentElement;
  if (!el) return;

  const addBtn = el.closest("[data-add]");
  const buyBtn = el.closest("[data-buy-now]");
  const viewBtn = el.closest("[data-view]");
  const removeBtn = el.closest("[data-remove]");
  const categoryBtn = el.closest("[data-category]");
  const suggestBtn = el.closest("[data-suggest]");
  const downloadInvoiceBtn = el.closest("[data-download-invoice]");
  const selectAddressBtn = el.closest("[data-select-address]");
  const profileViewBtn = el.closest("[data-profile-view]");
  const logoutBtn = el.closest("[data-logout]");

  if (el.matches(".nav-toggle")) {
    document.querySelector(".site-header").classList.toggle("open");
  }

  if (addBtn) {
    addToCart(addBtn.dataset.add);
    return;
  }

  if (buyBtn) {
    buyNow(buyBtn.dataset.buyNow);
    return;
  }

  if (viewBtn) {
    state.selectedProductId = viewBtn.dataset.view;
    location.hash = "details";
    return;
  }

  if (removeBtn) {
    state.cart = state.cart.filter(i => i.id !== Number(removeBtn.dataset.remove));
    localStorage.setItem("cart", JSON.stringify(state.cart));
    renderCart();
  }

  if (categoryBtn) {
    $("categoryFilter").value = categoryBtn.dataset.category;
    state.page = 1;
    location.hash = "products";
    renderProducts();
  }

  if (suggestBtn) {
    $("searchInput").value = suggestBtn.dataset.suggest;
    state.page = 1;
    renderProducts();
  }

  if (downloadInvoiceBtn) {
    const order =
      state.orders.find(o => String(o.id) === String(downloadInvoiceBtn.dataset.downloadInvoice)) ||
      state.lastOrder;

    downloadInvoice(order);
  }

  if (selectAddressBtn) {
    selectAddress(selectAddressBtn.dataset.selectAddress);
  }

  if (profileViewBtn) {
    toggleProfileMenu(false);
    location.hash = "profile";
  }

  if (logoutBtn) {
    logout();
  }

  if (target.id === "profileButton" || target.id === "profileButtonLabel") {
    if (state.token) {
      logout();
    } else {
      updateAuthMode("login");
      $("authModal").classList.add("open");
    }
  }

  if (target.matches(".modal-close")) {
    $("authModal").classList.remove("open");
  }
});
updateAuthMode("login");

["searchInput", "categoryFilter", "sortInput", "minPrice", "maxPrice", "ratingFilter"].forEach(id => {
  const control = $(id);
  if (!control) return;
  ["input", "change"].forEach(eventName => {
    control.addEventListener(eventName, () => {
      state.page = 1;
      renderProducts();
    });
  });
});

$("prevPage").addEventListener("click", () => {
  if (state.page > 1) {
    state.page--;
    renderProducts();
  }
});

$("nextPage").addEventListener("click", () => {
  state.page++;
  renderProducts();
});

$("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!state.token || !state.user)
        return toast("Please login first");

    const selectedAddress = state.addresses.find(
        address => address.id === state.selectedAddressId
    );

    if (!selectedAddress)
        return toast("Please select or add a delivery address");

    
    const items = state.buyNowItem ? [state.buyNowItem] : state.cart;

    if (!items.length)
        return toast("Your cart is empty");

    const form = new FormData(event.target);

    const subtotal = items.reduce(
        (sum, item) => sum + discounted(item) * item.quantity,
        0
    );

    const tax = subtotal * 0.18;
    const shipping = subtotal ? 49 : 0;

    const order = {
        id: `ORDER-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "Confirmed",
        customerName: state.user.full_name,

        address: selectedAddress,
        paymentMethod: form.get("payment_method") || "cod",

        items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: discounted(item)
        })),

        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping
    };

    state.orders.unshift(order);
    state.lastOrder = order;

    // clear correct mode
    if (state.buyNowItem) {
        state.buyNowItem = null;
    } else {
        state.cart = [];
        localStorage.setItem("cart", "[]");
    }

    localStorage.setItem("orders", JSON.stringify(state.orders));
    localStorage.setItem("lastOrder", JSON.stringify(order));

    renderCart();
    renderOrders();

    toast("Order placed successfully");

    location.hash = "orders";
    event.target.reset();
});

$("saveCheckoutAddress").addEventListener("click", () => {
  const payload = {
    label: $("checkoutLabel").value,
    line1: $("checkoutLine1").value,
    city: $("checkoutCity").value,
    state: $("checkoutState").value,
    postal_code: $("checkoutPostal").value
  };
  if (!payload.label || !payload.line1 || !payload.city || !payload.state || !payload.postal_code) {
    return toast("Please fill all address fields");
  }
  saveAddress(payload);
  $("checkoutAddressFormWrap").hidden = true;
});

$("addressForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(event.target).entries());
  saveAddress({
    label: formData.label,
    line1: formData.line1,
    city: formData.city,
    state: formData.state,
    postal_code: formData.postal_code
  });
  event.target.reset();
});

$("toggleAddressForm").addEventListener("click", () => {
  const wrap = $("checkoutAddressFormWrap");
  if (wrap) wrap.hidden = !wrap.hidden;
});

$("loginModeButton").addEventListener("click", (event) => {
  if ($("authModeInput").value !== "login") {
    event.preventDefault();
    updateAuthMode("login");
  }
});

$("registerModeButton").addEventListener("click", (event) => {
  if ($("authModeInput").value !== "register") {
    event.preventDefault();
    updateAuthMode("register");
  }
});

// Auth form submit handler (login / register)
$("authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  const fd = new FormData(form);
  const mode = fd.get("mode") || "login";
  const payload = Object.fromEntries(fd.entries());

  // normalize checkbox
  payload.remember_me = payload.remember_me === "on" || payload.remember_me === "true";

  // keep the payload clean; backend only needs login/register fields
  payload.mode = mode;

  // backend expects confirm_password for registration schema — mirror password
  if (mode === "register") {
    payload.confirm_password = payload.password;
  }

  try {
    const path = mode === "register" ? "/register" : "/login";
    const res = await api(path, { method: "POST", body: JSON.stringify(payload) });

    // server returns { user, token }
    state.token = res.token;
    state.user = res.user;
    localStorage.setItem("token", state.token);
    localStorage.setItem("user", JSON.stringify(state.user));

    renderAuthButton();
    renderProfile();
    $("authModal").classList.remove("open");
    toast(mode === "register" ? "Registered successfully" : `welcome ${state.user.full_name}`);
  } catch (err) {
    toast(err.message || "Authentication failed");
  }
});

load(); 
