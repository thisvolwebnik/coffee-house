import { cardsData } from "../data/cardsData.js";
import { formModalData } from "../data/formModalData.js";

class Modal {
  selectors = {
    root: "[data-js-tabs]",
    content: "[data-js-tabs-content]",
    modal: "[data-js-modal]",
    modalImage: "[data-js-modal-image]",
    modalTitle: "[data-js-modal-title]",
    modalDescription: "[data-js-modal-description]",
    modalForm: "[data-js-modal-form]",
    modalFormSize: "[data-js-modal-form-size]",
    modalFormAdditives: "[data-js-modal-form-additives]",
    modalPrice: "[data-js-modal-price]",
    modalButton: "[data-js-modal-button]",
    card: "[data-js-card]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.contentElements = this.rootElement.querySelectorAll(
      this.selectors.content
    );
    this.modalElement = this.rootElement.querySelector(this.selectors.modal);
    this.modalImageElement = this.rootElement.querySelector(
      this.selectors.modalImage
    );
    this.modalTitleElement = this.rootElement.querySelector(
      this.selectors.modalTitle
    );
    this.modalDescriptionElement = this.rootElement.querySelector(
      this.selectors.modalDescription
    );
    this.modalFormElement = this.rootElement.querySelector(
      this.selectors.modalForm
    );
    this.modalFormSizeElement = this.modalFormElement.querySelector(
      this.selectors.modalFormSize
    );
    this.modalFormAdditivesElement = this.modalFormElement.querySelector(
      this.selectors.modalFormAdditives
    );
    this.modalButtonElement = this.rootElement.querySelector(
      this.selectors.modalButton
    );
    this.modalPriceElement = this.rootElement.querySelector(
      this.selectors.modalPrice
    );
    this.price = 0;
    this.selectSizePrice = 0;
    this.selectAdditivesPrices = [];
    this.bindEvents();
  }

  bindEvents() {
    this.contentElements.forEach((container) => {
      container.querySelectorAll(this.selectors.card).forEach((card) => {
        card.addEventListener("click", this.openModal);
      });
    });
  }

  openModal = (e) => {
    const card = e.currentTarget;
    const cardCategory = card.dataset.jsCard;
    const cardId = parseInt(card.dataset.cardId);
    const cardData = cardsData[cardCategory].find((item) => item.id === cardId);

    this.renderCardInfo(cardData);
    this.renderForm(cardCategory);

    this.bindFormEvents();

    this.modalElement.classList.toggle(this.stateClasses.isActive);
    this.modalElement.addEventListener("click", this.closeModalClickOverlay);
    this.modalButtonElement.addEventListener("click", this.closeModal);
  };

  closeModalClickOverlay = (e) => {
    if (e.target === this.modalElement) {
      this.modalElement.classList.toggle(this.stateClasses.isActive);
      this.price = 0;
      this.selectSizePrice = 0;
      this.selectAdditivesPrices = [];
    }
  };

  closeModal = (e) => {
    e.preventDefault();
    this.modalElement.classList.toggle(this.stateClasses.isActive);
    this.price = 0;
    this.selectSizePrice = 0;
    this.selectAdditivesPrices = [];
  };

  bindFormEvents() {
    this.modalFormSizeElement.addEventListener("change", (e) => {
      if (e.target.name === "size") {
        this.selectSizePrice = parseFloat(e.target.dataset.price) || 0;
      }

      this.calculatePrice();
    });

    this.modalFormAdditivesElement.addEventListener("change", (e) => {
      if (e.target.name === "additives") {
        const addPrice = parseFloat(e.target.dataset.price) || 0;

        if (e.target.checked) {
          this.selectAdditivesPrices.push(addPrice);
        } else {
          this.selectAdditivesPrices = this.selectAdditivesPrices.filter(
            (price) => price !== addPrice
          );
        }
      }

      this.calculatePrice();
    });
  }

  calculatePrice() {
    const additivesPrice = this.selectAdditivesPrices.reduce(
      (sum, price) => sum + price,
      0
    );
    const total = +this.price + +this.selectSizePrice + additivesPrice;

    this.modalPriceElement.textContent = `$${total.toFixed(2)}`;
  }

  renderCardInfo(data) {
    this.price = data.price;

    this.modalImageElement.src = data.img;
    this.modalImageElement.alt = data.title;

    this.modalTitleElement.textContent = data.title;
    this.modalDescriptionElement.innerHTML = `<p>${data.description}</p>`;
    this.modalPriceElement.textContent = `$${data.price}`;
  }

  renderForm(category) {
    const config = formModalData[category];

    this.modalFormSizeElement.innerHTML = this.renderSizes(config.sizes);
    this.modalFormAdditivesElement.innerHTML = this.renderAdditives(
      config.additives
    );
  }

  renderSizes(sizes) {
    return `
      <legend class="modal__form-name">Size</legend>
      ${sizes
        .map(
          (size, index) => `
        <input
          class="modal__form-input visually-hidden"
          id="${size.id}"
          type="radio"
          name="size"
          value="${size.value}"
          data-price="${size.price}"
          ${index === 0 ? "checked" : ""}
        >
        <label class="modal__form-label" for="${size.id}">
          <span class="modal__form-label-icon link-button">${size.label}</span>
          <span class="modal__form-label-name link-button">${size.value}</span>
        </label>
      `
        )
        .join("")}
  `;
  }

  renderAdditives(additives) {
    return `
    <fieldset class="modal__form-group">
      <legend class="modal__form-name">Additives</legend>
      ${additives
        .map(
          (additive) => `
        <input
          class="modal__form-input visually-hidden"
          id="${additive.id}"
          type="checkbox"
          name="additives"
          value="${additive.value}"
          data-price="${additive.price}"
        >
        <label class="modal__form-label" for="${additive.id}">
          <span class="modal__form-label-icon link-button">${additive.label}</span>
          <span class="modal__form-label-name link-button">${additive.value}</span>
        </label>
      `
        )
        .join("")}
    </fieldset>
  `;
  }
}

export default Modal;
