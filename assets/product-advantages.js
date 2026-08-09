if (!customElements.get("product-advantages")) {
  class ProductAdvantages extends HTMLElement {
    connectedCallback() {
      this.swiperInstance = null;
      this.initializeSwiper();
    }

    disconnectedCallback() {
      if (this.swiperInstance) {
        this.swiperInstance.destroy(true, true);
        this.swiperInstance = null;
      }
    }

    initializeSwiper() {
      if (typeof window.Swiper === "undefined") {
        window.addEventListener("load", () => this.initializeSwiper(), { once: true });
        return;
      }

      const carouselElement = this.querySelector("[data-advantages-swiper]");

      if (!carouselElement) return;

      const previousButton = carouselElement.querySelector("[data-swiper-previous]");
      const nextButton = carouselElement.querySelector("[data-swiper-next]");

      this.swiperInstance = new window.Swiper(carouselElement, {
        slidesPerView: 1.1,
        spaceBetween: 12,
        observer: true,
        observeParents: true,
        watchOverflow: true,
        navigation: {
          prevEl: previousButton,
          nextEl: nextButton,
        },
        breakpoints: {
          750: {
            slidesPerView: 3,
            spaceBetween: 20,
            allowTouchMove: false,
          },
        },
      });
    }
  }

  customElements.define("product-advantages", ProductAdvantages);
}
