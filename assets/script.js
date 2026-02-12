/* Demo JS (accordion + wave) */
(function(){
  const acc=document.getElementById("barberAccordion");
  if(acc){
    acc.querySelectorAll(".barber-head[data-target]").forEach(head=>{
      head.addEventListener("click", ()=>{
        const id=head.getAttribute("data-target");
        const body=document.getElementById(id);
        const open=body && body.style.display==="block";
        acc.querySelectorAll(".barber-body").forEach(b=>b.style.display="none");
        acc.querySelectorAll(".barber-head .chev").forEach(c=>c.textContent="▾");
        if(body && !open){
          body.style.display="block";
          const chev=head.querySelector(".chev"); if(chev) chev.textContent="▴";
        }
      });
    });
  }
  document.addEventListener("click",(e)=>{
    const a=e.target.closest("a[data-cal-link]");
    if(!a) return;
    const link=a.getAttribute("data-cal-link")||"";
    if(link.startsWith("PASTE_")){
      e.preventDefault();
      alert("Demo: paste this barber's Calendly link into the HTML (data-cal-link).");
    }
  });
})();
/* ==========================
   HERO SLIDER (auto + swipe)
========================== */
(function(){
  const slider = document.getElementById("heroSlider");
  if(!slider) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dots = Array.from(slider.querySelectorAll(".dot"));
  let i = 0;
  let timer = null;

  function show(idx){
    i = (idx + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
  }

  function next(){ show(i + 1); }
  function start(){ stop(); timer = setInterval(next, 3500); }
  function stop(){ if(timer) clearInterval(timer); timer = null; }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => { show(idx); start(); });
  });

  // Swipe support (mobile)
  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    stop();
  }, {passive:true});

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if(Math.abs(dx) > 40){
      show(i + (dx < 0 ? 1 : -1));
    }
    start();
  }, {passive:true});

  // Pause on hover (desktop)
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  show(0);
  start();
})();
/* ==========================
   HERO AUTO SLIDER
========================== */

document.addEventListener("DOMContentLoaded", function(){

  const slider = document.getElementById("heroSlider");
  if(!slider) return;

  const slides = slider.querySelectorAll(".slide");
  const dots   = slider.querySelectorAll(".dot");

  let index = 0;

  function showSlide(i){
    slides.forEach((slide, sIndex) => {
      slide.classList.toggle("is-active", sIndex === i);
    });

    dots.forEach((dot, dIndex) => {
      dot.classList.toggle("is-active", dIndex === i);
    });
  }

  function nextSlide(){
    index++;
    if(index >= slides.length){
      index = 0;
    }
    showSlide(index);
  }

  // Auto switch every 3 seconds
  setInterval(nextSlide, 3000);

});

/* ==========================
   SHOP CART DEMO
========================== */
(function(){
  const shopRoot = document.getElementById("shopExperience");
  if(!shopRoot) return;

  const CART_KEY = "barber_shop_cart_v1";
  const list = document.getElementById("cartList");
  const count = document.getElementById("cartCount");
  const subtotalEl = document.getElementById("cartSubtotal");
  const taxEl = document.getElementById("cartTax");
  const totalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  let cart = {};
  try{
    cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}") || {};
  }catch(_e){
    cart = {};
  }

  function money(value){
    return "$" + value.toFixed(2);
  }

  function persist(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function totals(){
    const values = Object.values(cart);
    const itemCount = values.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = values.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { itemCount, subtotal, tax, total };
  }

  function render(){
    const entries = Object.entries(cart);
    if(entries.length === 0){
      list.innerHTML = '<p class="cart-empty">Your cart is empty. Add products to get started.</p>';
    }else{
      list.innerHTML = entries.map(([id, item]) => (
        '<article class="cart-item">' +
          '<div class="cart-item-head">' +
            '<span class="cart-item-name">' + item.name + '</span>' +
            '<span class="cart-item-price">' + money(item.price * item.qty) + '</span>' +
          '</div>' +
          '<div class="cart-controls">' +
            '<div class="qty-wrap">' +
              '<button class="qty-btn" type="button" data-qty-change data-id="' + id + '" data-delta="-1">-</button>' +
              '<span class="qty">' + item.qty + '</span>' +
              '<button class="qty-btn" type="button" data-qty-change data-id="' + id + '" data-delta="1">+</button>' +
            '</div>' +
            '<button class="remove-btn" type="button" data-remove-item data-id="' + id + '">Remove</button>' +
          '</div>' +
        '</article>'
      )).join("");
    }

    const t = totals();
    count.textContent = t.itemCount + (t.itemCount === 1 ? " item" : " items");
    subtotalEl.textContent = money(t.subtotal);
    taxEl.textContent = money(t.tax);
    totalEl.textContent = money(t.total);
    checkoutBtn.disabled = t.itemCount === 0;
  }

  function addProduct(btn){
    const id = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name") || "Product";
    const price = parseFloat(btn.getAttribute("data-price") || "0");
    if(!id || !price) return;

    if(!cart[id]){
      cart[id] = { name, price, qty: 0 };
    }
    cart[id].qty += 1;
    persist();
    render();
  }

  shopRoot.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-product]");
    if(addBtn){
      addProduct(addBtn);
      return;
    }

    const qtyBtn = e.target.closest("[data-qty-change]");
    if(qtyBtn){
      const id = qtyBtn.getAttribute("data-id");
      const delta = parseInt(qtyBtn.getAttribute("data-delta") || "0", 10);
      if(!cart[id]) return;
      cart[id].qty += delta;
      if(cart[id].qty <= 0){
        delete cart[id];
      }
      persist();
      render();
      return;
    }

    const removeBtn = e.target.closest("[data-remove-item]");
    if(removeBtn){
      const id = removeBtn.getAttribute("data-id");
      if(cart[id]){
        delete cart[id];
        persist();
        render();
      }
    }
  });

  checkoutBtn.addEventListener("click", () => {
    const t = totals();
    if(t.itemCount === 0) return;
    alert("Demo checkout only. Total: " + money(t.total));
  });

  render();
})();

/* ==========================
   HOME ENHANCEMENTS
========================== */
(function(){
  const tiltItems = Array.from(document.querySelectorAll("[data-tilt]"));
  tiltItems.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 9;
      el.style.transform = "perspective(700px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
    });
  });

  const counters = Array.from(document.querySelectorAll("[data-count-to]"));
  if(!counters.length) return;

  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const el = entry.target;
      const goal = parseInt(el.getAttribute("data-count-to") || "0", 10);
      const duration = 1100;
      const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(goal * eased).toLocaleString();
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.35 });

  counters.forEach((c) => io.observe(c));
})();

/* ==========================
   PRICING BUILDER
========================== */
(function(){
  const root = document.getElementById("pricingExperience");
  if(!root) return;

  const options = Array.from(root.querySelectorAll("[data-price-option]"));
  const selectedEl = root.querySelector("#pricingSelected");
  const subtotalEl = root.querySelector("#pricingSubtotal");
  const taxEl = root.querySelector("#pricingTax");
  const totalEl = root.querySelector("#pricingTotal");
  if(!options.length || !selectedEl || !subtotalEl || !taxEl || !totalEl) return;

  function money(v){ return "$" + Math.round(v).toLocaleString(); }

  function update(){
    const selected = options.filter((o) => o.checked).map((o) => ({
      name: o.getAttribute("data-name") || "Service",
      price: parseFloat(o.value || "0")
    }));
    const subtotal = selected.reduce((acc, s) => acc + s.price, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if(selected.length === 0){
      selectedEl.textContent = "No services selected yet.";
    }else{
      selectedEl.innerHTML = selected.map((s) => s.name + " - " + money(s.price)).join("<br/>");
    }

    subtotalEl.textContent = money(subtotal);
    taxEl.textContent = money(tax);
    totalEl.textContent = money(total);
  }

  options.forEach((o) => o.addEventListener("change", update));
  update();
})();
