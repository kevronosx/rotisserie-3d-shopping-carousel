/*
 * Kevin M Ryan | www.basehum.com
 * CartTo Module
 */

export default class CartTo {

  constructor(options) {
    this.container = document.querySelector(options.container);
    this.cart = document.querySelector(options.target);
    this.trigger = options.trigger;
    this.itemToAnimate = options.itemToAnimate;
    this.clone = null;
    this.run();
  }

  run() {
    this.trigger.addEventListener('click', (e) => {
      return this.set(e, e.target);
    });
  }

  set(e, target) {
    let elementtofly = this.container.querySelector(`#${this.itemToAnimate}`);
    let { top, left } = elementtofly.getBoundingClientRect();
    let width = elementtofly.offsetWidth;
    let height = elementtofly.offsetHeight;
    this.clone = elementtofly.cloneNode(false);
    this.clone.className = "clone";
    this.setStyles(this.clone, {
      'top': `${top}px`,
      'left': `${left}px`,
      'width': `${width}px`,
      'height': `${height}px`,
    });
    document.body.appendChild(this.clone);
    return requestAnimationFrame(() => {
      this.animate(target.parentNode);
    });
  }

  animate(parentNode) {
    let { top, left, width, height } = this.cart.getBoundingClientRect();
    top = top + (height / 2);
    left = left + (width / 2);
    this.setStyles(this.clone, {
      'top': `${top}px`,
      'left': `${left}px`,
      'width': "20px",
      'height': "20px",
    });
    return this.trackAnim(this.clone).then((plot) => {
      plot.remove();
    });
  }

  trackAnim(plot) {
    return new Promise(function(resolve, reject) {
      plot.addEventListener('transitionend', function runner(e) {
        e.target.removeEventListener(e.type, runner);
        if (e.propertyName === 'width') {
          return resolve(plot);
        }
      }.bind(this), false);
    });
  }

  setStyles(elem, props) {
    for (let prop in props) {
      elem.style[prop] = props[prop];
    }
    return elem;
  }

}
