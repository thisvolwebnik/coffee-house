import { cardsData } from "../data/cardsData";

class Modal {
  selectors = {
    root: "[data-js-tabs-content]",
    card: "[data-js-card]",
  };

  constructor() {
    this.rootsElements = document.querySelectorAll(this.selectors.root);
    // this.cardsElements = this.rootElement.querySelectorAll(this.selectors.card);
    this.bindEvents();
  }

  bindEvents() {
    this.rootsElements.forEach((container) => {
      container.querySelectorAll(this.selectors.card).forEach((card) => {
        card.addEventListener("click", (e) => {
          const card = e.currentTarget;

          const cardCategory = card.dataset.jsCard;
          const cardId = card.dataset.cardId;
          console.log(cardsData[cardCategory][cardId]);
        });
      });
    });
  }
}

export default Modal;
