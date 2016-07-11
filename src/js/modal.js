/*
 * Kevin M Ryan | www.basehum.com
 * Modal Module
 */
import CartTo from './cart-to.js';

export default class Modal {

  constructor(data) {
    this.modal = document.querySelector('.modal');
    this.close = this.modal.querySelector('.close');
    this.container = this.modal.querySelector('.container');
    this.backSplash = document.querySelector('.back-splash');
    this.image = this.modal.querySelector('.rack-item') || new Image();
    this.image.className = "rack-item";
    this.docFrag = document.createDocumentFragment();
    this.content = document.createElement('div');
    this.appContainer = null;
  }

  create(data) {
    this.appContainer = data.appContainer;
    this.setEvents();
    this.show(data);
  }

  setEvents() {
    window.addEventListener('keydown', this.keyNav.bind(this));
    this.close.addEventListener('click', this.closeModal.bind(this));
    this.backSplash.addEventListener('click', this.closeModal.bind(this));
  }

  keyNav(key) {
    if (key.which === 27) {
      return this.closeModal();
    } else {
      return false;
    }
  }

  cartButton(data) {
    let button = document.createElement('button');
    button.className = "add-to-cart";
    button.textContent = "Add to Cart";
    new CartTo({
      container: '.container',
      trigger: button,
      target: '.cart',
      itemToAnimate: data.target.id
    });
    return button;
  }

  buildFragment(data) {
    this.image.src = data.imageSrc;
    this.image.id = data.target.id;
    this.content.className = 'content';
    this.content.innerHTML = data.blurb;
    this.content.appendChild(this.cartButton(data));
    this.docFrag.appendChild(this.image);
    this.docFrag.appendChild(this.content);
    this.container.appendChild(this.docFrag);
  }

  clearContainer() {
    return this.container.innerHTML = '';
  }

  show(data) {
    this.clearContainer();
    this.buildFragment(data);
    this.modal.classList.remove('hide');
    this.modal.classList.add('show');
    this.backSplash.classList.remove('hidden');
    this.backSplash.classList.add('visible');
  }

  closeModal() {
    this.clearContainer();
    this.modal.classList.remove('show');
    this.modal.classList.add('hide');
    this.backSplash.classList.remove('visible');
    this.backSplash.classList.add('hidden');
  }

}
