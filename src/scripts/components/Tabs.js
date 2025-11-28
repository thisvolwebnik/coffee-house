import { cardsData } from "@/scripts/data/cardsData.js";

class Tabs {
  selectors = {
    root: "[data-js-tabs]",
    tabButtons: "[data-js-tabs-button]",
    tabContents: "[data-js-tabs-content]",
    tabLoadMore: "[data-js-tabs-load-more]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  stateAria = {
    ariaSelected: "aria-selected",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) return;
    this.tabButtonsElemenet = this.rootElement.querySelectorAll(
      this.selectors.tabButtons
    );
    this.tabContentsElement = this.rootElement.querySelectorAll(
      this.selectors.tabContents
    );
    this.tabLoadMoreElement = this.rootElement.querySelector(
      this.selectors.tabLoadMore
    );
    this.bindEvents();
  }

  bindEvents() {
    this.renderAllCards();
    this.tabsButtonEvents();
  }

  tabsButtonEvents() {
    this.tabButtonsElemenet.forEach((button) => {
      button.addEventListener("click", (e) => {
        const getButtonId = e.currentTarget.id.replace("tab-", "");
        const getPanelAria = e.currentTarget
          .getAttribute("aria-controls")
          .replace("tabpanel-", "");
        this.switchTab(getButtonId, getPanelAria);
      });
    });
  }

  switchTab(tabId, panelAria) {
    this.tabButtonsElemenet.forEach((button) => {
      const isActiveButton = button.id === `tab-${tabId}`;
      button.classList.toggle(this.stateClasses.isActive, isActiveButton);
      button.setAttribute(this.stateAria.ariaSelected, isActiveButton);
    });

    this.tabContentsElement.forEach((panel) => {
      const isActivePanel = panel.id === `tabpanel-${panelAria}`;
      panel.classList.toggle(this.stateClasses.isActive, isActivePanel);
    });
  }

  renderAllCards() {
    Object.keys(cardsData).forEach((tabName) => {
      const panel = this.rootElement.querySelector(`#tabpanel-${tabName}`);
      if (panel) {
        const cards = cardsData[tabName];
        panel.innerHTML = this.generateCardsHtml(cards, tabName);
      }
    });
  }

  generateCardsHtml(cards, tabName) {
    if (cards.length === 0) {
      return '<div class="no-cards">No items available</div>';
    }

    return cards
      .map(
        (card) => `
      <div class="tabs__content-card card" data-card-id="${card.id}" data-js-card="${tabName}" data-price="${card.price}">
        <div class="card__image-wrapper">
          <img
            class="card__image"
            src="${card.img}"
            alt="${card.alt}"
            width="340"
            height="340"
            loading="lazy"
          >
        </div>
        <div class="card__body">
          <h3 class="card__title">${card.title}</h3>
          <div class="card__description">
            <p>${card.description}</p>
          </div>
          <p class="card__price h3" data-price="${card.price}">$${card.price}</p>
        </div>
      </div>
    `
      )
      .join("");
  }
}

export default Tabs;
