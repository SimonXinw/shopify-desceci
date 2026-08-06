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

      const carousel = this.querySelector("[data-advantages-swiper]");

      if (!carousel) return;

      const previousButton = carousel.querySelector("[data-swiper-previous]");
      const nextButton = carousel.querySelector("[data-swiper-next]");

      this.swiperInstance = new window.Swiper(carousel, {
        slidesPerView: 1.15,
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
            slidesPerView: "auto",
            spaceBetween: 20,
            allowTouchMove: false,
          },
        },
      });
    }
  }

  customElements.define("product-advantages", ProductAdvantages);
}
