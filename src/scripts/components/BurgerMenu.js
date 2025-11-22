class BurgerMenu {
  selectors = {
    root: "[data-js-header]",
    overlay: "[data-js-header-overlay]",
    burgerButton: "[data-js-header-burger-button]",
  };

  stateClasses = {
    isActive: "is-active",
    isLock: "is-lock",
  };

  ariaAttribute = {
    open: "Open menu",
    close: "Close menu",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay
    );
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton
    );
    this.isOpen = false;
    this.bindEvents();
  }

  updateAriaAttributes() {
    this.burgerButtonElement.setAttribute("aria-expanded", this.isOpen);
    this.isOpen
      ? this.burgerButtonElement.setAttribute(
          "aria-label",
          this.ariaAttribute.close
        )
      : this.burgerButtonElement.setAttribute(
          "aria-label",
          this.ariaAttribute.open
        );
    this.isOpen
      ? this.burgerButtonElement.setAttribute("title", this.ariaAttribute.close)
      : this.burgerButtonElement.setAttribute("title", this.ariaAttribute.open);
  }

  onBurgerClick = () => {
    this.isOpen = !this.isOpen;
    this.overlayElement.classList.toggle(this.stateClasses.isActive);
    this.burgerButtonElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock);
    this.updateAriaAttributes();
  };

  bindEvents() {
    this.burgerButtonElement.addEventListener("click", this.onBurgerClick);
  }
}

export default BurgerMenu;
