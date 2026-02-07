/* House of the Barbers INC — Demo JS */
(function(){
  const wavePath = document.getElementById("wavePath");
  if (wavePath){
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      const d = `M0,310 C180,${240 + y*40} 320,${410 - y*35} 500,${330 + x*30}
                 C670,${255 + y*35} 760,${120 + x*35} 910,${190 + y*30}
                 C1040,${250 - y*20} 1120,${370 + x*18} 1200,340`;
      wavePath.setAttribute("d", d);
    });
  }

  // Home: Book modal
  const openBookModal = document.getElementById("openBookModal");
  const bookModal = document.getElementById("bookModal");
  const closeBookModal = document.getElementById("closeBookModal");

  function showModal(modal){
    if (!modal) return;
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden","false");
  }
  function hideModal(modal){
    if (!modal) return;
    modal.style.display = "none";
    modal.setAttribute("aria-hidden","true");
  }

  if (openBookModal && bookModal){
    openBookModal.addEventListener("click", () => showModal(bookModal));
  }
  if (closeBookModal && bookModal){
    closeBookModal.addEventListener("click", () => hideModal(bookModal));
  }
  if (bookModal){
    bookModal.addEventListener("click", (e) => {
      if (e.target === bookModal) hideModal(bookModal);
    });
  }

  // Booking page interactions
  const dateBtns = Array.from(document.querySelectorAll(".chip[data-date]"));
  const timeBtns = Array.from(document.querySelectorAll(".time[data-time]"));
  const barberBtns = Array.from(document.querySelectorAll(".barber[data-barber]"));

  const selDate = document.getElementById("selDate");
  const selTime = document.getElementById("selTime");
  const selBarber = document.getElementById("selBarber");

  function selectOne(btns, btn){
    btns.forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
  }

  dateBtns.forEach(btn => btn.addEventListener("click", () => {
    selectOne(dateBtns, btn);
    if (selDate) selDate.textContent = btn.dataset.date;
  }));

  timeBtns.forEach(btn => btn.addEventListener("click", () => {
    selectOne(timeBtns, btn);
    if (selTime) selTime.textContent = btn.dataset.time;
  }));

  barberBtns.forEach(btn => btn.addEventListener("click", () => {
    selectOne(barberBtns, btn);
    if (selBarber) selBarber.textContent = btn.dataset.barber;
  }));

  // Booking confirmation
  const confirmBtn = document.getElementById("confirmBtn");
  const confirmModal = document.getElementById("confirmModal");
  const closeConfirm = document.getElementById("closeConfirm");
  const confirmSummary = document.getElementById("confirmSummary");

  if (confirmBtn && confirmModal){
    confirmBtn.addEventListener("click", () => {
      const d = selDate ? selDate.textContent : "—";
      const t = selTime ? selTime.textContent : "—";
      const b = selBarber ? selBarber.textContent : "—";
      if (confirmSummary){
        confirmSummary.textContent = `Demo: Request for ${d} at ${t} with ${b}.`;
      }
      showModal(confirmModal);
    });
  }
  if (closeConfirm && confirmModal){
    closeConfirm.addEventListener("click", () => hideModal(confirmModal));
  }
  if (confirmModal){
    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) hideModal(confirmModal);
    });
  }

  // ESC closes any open modal
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    [bookModal, confirmModal].forEach(m => {
      if (m && m.style.display === "flex") hideModal(m);
    });
  });
})();
