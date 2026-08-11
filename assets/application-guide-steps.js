if (!customElements.get("application-guide-steps")) {
  class ApplicationGuideSteps extends HTMLElement {
    connectedCallback() {
      this.swiperInstance = null;
      this.mobileBreakpoint = window.matchMedia("(max-width: 749px)");
      this.handleBreakpointChange = this.updateCarousel.bind(this);

      this.mobileBreakpoint.addEventListener("change", this.handleBreakpointChange);
      this.updateCarousel();
    }

    disconnectedCallback() {
      this.mobileBreakpoint?.removeEventListener("change", this.handleBreakpointChange);
      this.destroyCarousel();
    }

    updateCarousel() {
      if (!this.mobileBreakpoint.matches) {
        this.destroyCarousel();
        return;
      }

      if (this.swiperInstance) return;

      if (typeof window.Swiper === "undefined") {
        window.addEventListener("load", this.handleBreakpointChange, { once: true });
        return;
      }

      const carouselElement = this.querySelector("[data-guide-swiper]");

      if (!carouselElement) return;

      this.swiperInstance = new window.Swiper(carouselElement, {
        slidesPerView: 1.08,
        spaceBetween: 16,
        grabCursor: true,
        observer: true,
        observeParents: true,
        watchOverflow: true,
        pagination: {
          el: carouselElement.querySelector("[data-guide-pagination]"),
          clickable: true,
        },
      });
    }

    destroyCarousel() {
      if (!this.swiperInstance) return;

      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  customElements.define("application-guide-steps", ApplicationGuideSteps);
}
