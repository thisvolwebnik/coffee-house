class Slider {
  selectors = {
    root: "[data-js-slider]",
    sliderContainer: "[data-js-slider-container]",
    sliderSlide: "[data-js-slider-slide]",
    sliderButtonPrev: "[data-js-slider-button-prev]",
    sliderButtonNext: "[data-js-slider-button-next]",
    sliderIndicator: "[data-js-slider-indicator]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.sliderContainerelement = this.rootElement.querySelector(
      this.selectors.sliderContainer
    );
    this.sliderSlideElements = this.rootElement.querySelectorAll(
      this.selectors.sliderSlide
    );
    this.sliderButtonPrevElement = this.rootElement.querySelector(
      this.selectors.sliderButtonPrev
    );
    this.sliderButtonNextElement = this.rootElement.querySelector(
      this.selectors.sliderButtonNext
    );
    this.sliderIndicatorElements = this.rootElement.querySelectorAll(
      this.selectors.sliderIndicator
    );
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.totalSlides = this.sliderSlideElements.length;
    this.animationFrameId = null;

    this.sliderContainerelement.style.transition = "transform 0.3s ease";

    this.bindEvents();
  }

  bindEvents() {
    this.sliderButtonNextElement.addEventListener("click", (e) =>
      this.handleClick(e, "next")
    );
    this.sliderButtonPrevElement.addEventListener("click", (e) =>
      this.handleClick(e, "prev")
    );

    this.sliderIndicatorElements.forEach((indicator, index) => {
      indicator.addEventListener("click", (e) =>
        this.handleClick(e, "indicator", index)
      );
    });

    this.sliderContainerelement.addEventListener(
      "touchstart",
      this.handleTouchStart,
      { passive: true }
    );
    this.sliderContainerelement.addEventListener(
      "touchmove",
      this.handleTouchMove,
      { passive: true }
    );
    this.sliderContainerelement.addEventListener(
      "touchend",
      this.handleTouchEnd
    );
    this.sliderContainerelement.addEventListener(
      "touchcancel",
      this.handleTouchCancel
    );
  }

  handleClick = (e, type, index = null) => {
    if (this.isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    switch (type) {
      case "next":
        this.nextSlide();
        break;
      case "prev":
        this.prevSlide();
        break;
      case "indicator":
        if (index !== null) {
          this.currentIndex = index;
          this.updateSlider();
        }
        break;
    }
  };

  handleTouchStart = (e) => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.touchStartX = e.touches[0].clientX;
    this.touchEndX = this.touchStartX;
    this.isDragging = false;

    this.sliderContainerelement.style.transition = "none";
  };

  handleTouchMove = (e) => {
    if (!this.isDragging) {
      const diff = Math.abs(e.touches[0].clientX - this.touchStartX);
      if (diff > 10) {
        this.isDragging = true;
      }
    }

    if (!this.isDragging) return;

    this.touchEndX = e.touches[0].clientX;

    // Используем requestAnimationFrame для плавности
    this.animationFrameId = requestAnimationFrame(() => {
      const diff = this.touchEndX - this.touchStartX;
      const currentOffset = -this.currentIndex * 100;
      const dragOffset = (diff / window.innerWidth) * 100;
      const totalOffset = currentOffset + dragOffset;

      this.sliderContainerelement.style.transform = `translateX(${totalOffset}%)`;
    });
  };

  handleTouchEnd = () => {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.isDragging) {
      this.sliderContainerelement.style.transition = "transform 0.3s ease";
      this.handleSwipe();
    }

    this.isDragging = false;
  };

  handleTouchCancel = () => {
    this.handleTouchEnd();
  };

  handleSwipe() {
    const diff = this.touchEndX - this.touchStartX;
    const minSwipeDistance = 50;
    const swipeThreshold = window.innerWidth * 0.15; // Увеличили порог

    if (Math.abs(diff) < minSwipeDistance) {
      this.updateSlider(); // Возвращаем на место
      return;
    }

    if (diff > swipeThreshold) {
      this.prevSlide();
    } else if (diff < -swipeThreshold) {
      this.nextSlide();
    } else {
      this.updateSlider();
    }
  }

  nextSlide = () => {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlider();
  };

  prevSlide = () => {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  };

  updateSlider() {
    const offset = -this.currentIndex * 100;
    this.sliderContainerelement.style.transform = `translateX(${offset}%)`;

    this.sliderSlideElements.forEach((slide, index) => {
      slide.classList.toggle(
        this.stateClasses.isActive,
        index === this.currentIndex
      );
    });

    this.sliderIndicatorElements.forEach((indicator, index) => {
      indicator.classList.toggle(
        this.stateClasses.isActive,
        index === this.currentIndex
      );
    });
  }

  reset() {
    this.isDragging = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.updateSlider();
  }
}

export default Slider;
