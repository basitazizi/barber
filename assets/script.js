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
