import { cardsData } from "../data/cardsData.js";

class Tabs {
  selectors = {
    root: "[data-js-tabs]",
    tabButtons: "[data-js-tabs-button]",
    tabContents: "[data-js-tabs-content]",
    tabLoadMore: "[data-js-tabs-load-more]",
  };

  stateClasses = {
    isActive: "is-active",
    isVisible: "is-visible",
  };

  stateAria = {
    ariaSelected: "aria-selected",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) return;
    this.tabButtonsElement = this.rootElement.querySelectorAll(
      this.selectors.tabButtons
    );
    this.tabContentsElement = this.rootElement.querySelectorAll(
      this.selectors.tabContents
    );
    this.tabLoadMoreElement = this.rootElement.querySelector(
      this.selectors.tabLoadMore
    );
    this.activeTabCategory = "coffee";
    this.bindEvents();
  }

  bindEvents() {
    this.renderAllCards();
    this.tabsButtonEvents();
    this.checkWindowSize();
    this.loadMoreEvents();
    this.visibleLoadMoreButton();
  }

  loadMoreEvents() {
    this.tabLoadMoreElement.addEventListener("click", this.visibleAllCards);
  }

  visibleAllCards = () => {
    this.rootElement
      .querySelector(`#tabpanel-${this.activeTabCategory}`)
      .classList.add(this.stateClasses.isVisible);
    this.tabLoadMoreElement.classList.remove(this.stateClasses.isActive);
  };

  checkWindowSize() {
    window.addEventListener("resize", this.visibleLoadMoreButton);
  }

  visibleLoadMoreButton = () => {
    if (
      cardsData[this.activeTabCategory].length > 4 &&
      window.innerWidth < 1100
    ) {
      this.tabLoadMoreElement.classList.add(this.stateClasses.isActive);
    } else {
      this.tabLoadMoreElement.classList.remove(this.stateClasses.isActive);
    }
  };

  tabsButtonEvents() {
    this.tabButtonsElement.forEach((button) => {
      button.addEventListener("click", (e) => {
        const getButtonId = e.currentTarget.id.replace("tab-", "");
        const getPanelAria = e.currentTarget
          .getAttribute("aria-controls")
          .replace("tabpanel-", "");
        this.tabContentsElement.forEach((content) => {
          content.classList.remove(this.stateClasses.isVisible);
        });
        this.switchTab(getButtonId, getPanelAria);
        this.visibleLoadMoreButton();
      });
    });
  }

  switchTab(tabId, panelAria) {
    this.activeTabCategory = panelAria;

    this.tabButtonsElement.forEach((button) => {
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
