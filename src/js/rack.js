/*
 * Kevin M Ryan | www.basehum.com
 * Rack Module
 */
import Drag from './dragger-event.js';
import Modal from './modal.js';

const transformProp = (function() {
  var testEl = document.createElement('div');
  if (testEl.style.transform === null) {
    var vendors = ['Webkit', 'Moz', 'ms'];
    for (var vendor in vendors) {
      if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
        return vendors[vendor] + 'Transform';
      }
    }
  }
  return 'transform';
})();

export class Rack {

  constructor(element, options) {
    this.elem = element;
    this.itemClass = options.itemClass;
    this.parentElem = document.querySelector(this.elem);
    this.startElem = this.parentElem.children[0];
    this.hangers = this.parentElem.querySelectorAll(this.itemClass);
    this.hangersArry = Array.prototype.slice.call(this.hangers);
    this.hangerLen = this.hangers.length;
    this.hanggerClickEvent = null;
    this.moveX = 0;
    this.startDragTime = 0;
    this.endDragTime = 0;
    this.velocity = 0;
    this.currentElem = null;
    this.currentElemIndex = null;
    this.modal = new Modal();
    this.drag = new Drag({
      container: this.elem,
      views: this.itemClass
    });
    this.init();
  }

  init() {
    this.setCount(this.hangersArry);
    this.setEvents();
    this.drag.init();
  }

  setEvents() {
    this.parentElem.addEventListener('click', this.hanggerClickEvent = function(e) {
      this.onClickHanger(e, e.target);
    }.bind(this));
    window.addEventListener('keydown', this.keyNav.bind(this));
    window.addEventListener('drag:down', this.dragDown.bind(this));
    window.addEventListener('drag:move', this.dragRack.bind(this));
    window.addEventListener('drag:up', this.dragUp.bind(this));
    // window.addEventListener("mousewheel", this.wheelRack.bind(this));
    // window.addEventListener("DOMMouseScroll", this.wheelRack.bind(this));
  }

  dragDown(e) {
    return this.startDragTime = e.detail.startTime;
  }

  dragUp(e) {
    return this.endDragTime = e.detail.endTime;
  }

  keyNav(key) {
    let inc = this.currentElemIndex;
    if (key.which === 39 || key.which === 38) {
      return this.seek(inc + 1);
    } else if (key.which === 37 || key.which === 40) {
      return this.seek(inc - 1);
    } else if (key.which === 13) {
      return this.onClickHanger(null, this.currentElem);
    } else {
      return null;
    }
  }

  dragRack(e) {
    e.preventDefault();
    e.stopPropagation();
    this.moveX = Math.abs(e.detail.moveX - e.detail.startX);
    // this.velocity = Math.abs(e.detail.moveX - e.detail.startX) / (this.endDragTime - this.startDragTime);
    let timing = 360 / 4;
    let inc = this.currentElemIndex;
    requestAnimationFrame(() => {
      if (this.moveX > 15) {
        if (e.detail.direction === 'right') {
          setTimeout(() => {
            this.seek(inc - 1);
          }, timing);
        } else if (e.detail.direction === 'left') {
          setTimeout(() => {
            this.seek(inc + 1);
          }, timing);
        }
      }
    });
  }

  wheelRack(e) {
    let inc = this.currentElemIndex;
    let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    return setTimeout(() => {
      if (delta > 0) {
        this.seek(inc - 1);
        e.stopPropagation();
      }
      if (delta < 0) {
        this.seek(inc + 1);
        e.stopPropagation();
      }
    }, 120);
  }

  broadcast() {
    let currentItemEvent = new CustomEvent("rack:currentItem", {
      detail: {
        current: this.currentElemIndex,
        count: this.hangersArry.length,
      }
    });
    window.dispatchEvent(currentItemEvent);
  }

  setCount(hangers) {
    let counter = 0;
    hangers.forEach((item, i) => {
      item.querySelector('img').id = `frame-${counter++}`;
      return item.setAttribute('data-rackcount', i);
    });
    return this.initState();
  }

  initState() {
    this.parentElem.style.display = "none";
    this.startElem.classList.add('active');
    this.currentElem = this.startElem;
    this.currentElemIndex = parseInt(this.startElem.getAttribute('data-rackcount'), 10);
    this.parentElem.style.display = "";
    return this.seek(this.currentElemIndex);
  }

  onClickHanger(e, target) {
    if (e) {
      e.preventDefault();
    }
    let count = parseInt(target.getAttribute('data-rackcount'), 10);
    if (target.classList.contains('active')) {
      let image = target.querySelector(".rack-item");
      let blurb = target.querySelector(".blurb").outerHTML;
      return this.modal.create({
        appContainer: '.rack-container',
        target: image,
        imageSrc: image.src,
        blurb: blurb
      });
    } else {
      return this.seek(count);
    }
  }

  seek(num) {
    let hangers = this.hangersArry;
    let count = 0;
    hangers.filter((item) => {
      let rackcount = parseInt(item.getAttribute('data-rackcount'), 10);
      if (rackcount === num) {
        count = rackcount;
        return item;
      }
    }).forEach((next) => {
      this.currentElem.classList.remove('active');
      this.currentElem = next;
      this.currentElemIndex = count;
      return this.buildMatrix(this.parentElem, next);
    });
    if (document.querySelector('.modal').classList.contains('show')) {
      this.onClickHanger(null, this.currentElem);
    }
  }

  buildMatrix(parentElem, current) {
    this.currentElem.classList.add("active");
    this.transformPrevAll(this.getPrevAll(this.hangers, current), 350);
    this.transformNextAll(this.getNextAll(this.hangers, current), 350);
    this.broadcast();
  }

  getPrevAll(hangers, current) {
    let prevAll = true;
    return prevAll = Array.prototype.filter.call(hangers, (elem) => {
      return (elem === current) ? prevAll = false : prevAll;
    });
  }

  getNextAll(hangers, current) {
    let nextAll = false;
    return nextAll = Array.prototype.filter.call(hangers, (elem) => {
      return (elem.previousElementSibling === current) ? nextAll = true : nextAll;
    });
  }

  transformPrevAll(prevAll, spread) {
    let y = spread * 0.15;
    prevAll.reverse();
    for (let i = prevAll.length; i-- > 0;) {
      prevAll[i].style.cssText = `
        display: ${(i <= 8) ? 'initial' : 'none'};
        z-index: -${spread * i};
        ${[transformProp]}: translateX(-${spread}px) rotateY(${y}deg) translateZ(-${50 * (i + 1)}px)
      `;
    }
  }

  transformNextAll(nextAll, spread) {
    let y = spread * 0.15;
    for (let i = nextAll.length; i-- > 0;) {
      nextAll[i].style.cssText = `
        display: ${(i <= 8) ? 'initial' : 'none'};
        z-index: -${spread * i};
        ${[transformProp]}: translateX(${spread}px) rotateY(-${y}deg) translateZ(-${50 * (i + 1)}px)
      `;
    }
  }

}
