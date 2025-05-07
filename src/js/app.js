import { Rack } from "./rack.js";

const init = () => {
  const cartPanel = document.querySelector(".cart-panel");
  const backSplash = document.querySelector(".back-splash-main");
  const cartPanelTrigger = document.querySelector(".cart-panel-trigger");

  new Rack('.rack', { itemClass: '.frame' });

  let toggleCartPanel = () => {
    cartPanelTrigger.classList.toggle("open");
    cartPanel.classList.toggle("is-visible");
    backSplash.classList.toggle("hidden");
    backSplash.classList.toggle("visible");
  };

  cartPanelTrigger.addEventListener("click", toggleCartPanel, false);
  backSplash.addEventListener("click", toggleCartPanel, false);
};

document.addEventListener("DOMContentLoaded", init, false);

const rackCountDisplay = document.querySelector(".rack-count-display");
window.addEventListener("rack:currentItem", (e) => {
  rackCountDisplay.textContent = `${e.detail.current + 1} of ${e.detail.count}`;
});
