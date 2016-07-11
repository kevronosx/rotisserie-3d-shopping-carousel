/*
 * Kevin M Ryan | www.basehum.com
 * Drag Event Module
 */

export default class Drag {

  constructor(options) {
    this.container = document.querySelector(options.container);
    this.views = document.querySelector(options.views);
    this.numOfViews = this.views.children.length;
    this.winW = this.container.offsetWidth;
    this.curX = 0;
    this.diff = 0;
    this.curViewNum = 1;
    this.onMoveEvent = null;
    this.lastPosition = { x: 0, y: 0 };
  }

  init() {
    document.addEventListener('mousedown', this.onDown.bind(this));
    document.addEventListener('touchstart', this.onDown.bind(this));
    document.addEventListener('mouseup', this.onUp.bind(this));
    document.addEventListener('touchend', this.onUp.bind(this));
  }

  onDown(e) {
    let startX = e.pageX || e.touches[0].pageX;
    let startTime = e.timeStamp;
    let dragEventDown = new CustomEvent("drag:down", {
      detail: {
        startTime: startTime,
        startX: startX,
      }
    });
    window.dispatchEvent(dragEventDown);
    document.addEventListener('touchmove', this.onMoveEvent = function(e) {
      this.onMove(e, startX);
    }.bind(this));
    document.addEventListener('mousemove', this.onMoveEvent = function(e) {
      this.onMove(e, startX);
    }.bind(this));
  }

  onMove(e, startX) {
    document.body.style.pointerEvents = "none";
    let clientX = e.clientX || e.touches[0].clientX;
    let clientY = e.clientY || e.touches[0].clientY;
    let deltaX = this.lastPosition.x - clientX;
    let deltaY = this.lastPosition.y - clientY;
    let deltaXabs = Math.abs(deltaX);
    let deltaYabs = Math.abs(deltaY);
    let direction = "";

    if (deltaXabs > deltaYabs && deltaX < 0) {
      direction = "right";
    } else if (deltaXabs > deltaYabs && deltaX > 0) {
      direction = "left";
    } else if (deltaYabs > deltaXabs && deltaY > 0) {
      direction = "up";
    } else if (deltaYabs > deltaXabs && deltaY < 0) {
      direction = "down";
    }

    this.lastPosition = {
      x: clientX,
      y: clientY
    };

    let moveX = e.pageX || e.touches[0].pageX;
    let custOnMoveEvent = new CustomEvent("drag:move", {
      detail: {
        direction: direction,
        moveX: moveX,
        startX: startX,
      }
    });
    window.dispatchEvent(custOnMoveEvent);
  }

  onUp(e) {
    document.body.style.pointerEvents = "auto";
    let endTime = e.timeStamp;
    let upEvent = new CustomEvent("drag:up", {
      detail: {
        endTime: endTime,
      }
    });
    window.dispatchEvent(upEvent);
    document.removeEventListener('mousemove', this.onMoveEvent);
    document.removeEventListener('touchmove', this.onMoveEvent);
  }
}
