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
