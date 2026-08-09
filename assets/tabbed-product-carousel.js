if (!customElements.get("tabbed-product-carousel")) {
  class TabbedProductCarousel extends HTMLElement {
    connectedCallback() {
      this.tabButtons = Array.from(this.querySelectorAll("[data-tab-button]"));
      this.panels = Array.from(this.querySelectorAll("[data-tab-panel]"));
      this.indicator = this.querySelector("[data-tab-indicator]");
      this.swipers = [];
      this.activeIndex = Math.max(
        0,
        this.tabButtons.findIndex((button) => button.getAttribute("aria-selected") === "true")
      );

      this.handleResize = this.updateIndicator.bind(this);
      this.handleBlockSelect = this.onBlockSelect.bind(this);

      this.bindTabEvents();
      this.initializeSwipers();
      this.activateTab(this.activeIndex);

      window.addEventListener("resize", this.handleResize);
      document.addEventListener("shopify:block:select", this.handleBlockSelect);
      document.fonts?.ready.then(() => this.updateIndicator());
    }

    disconnectedCallback() {
      window.removeEventListener("resize", this.handleResize);
      document.removeEventListener("shopify:block:select", this.handleBlockSelect);

      this.swipers.forEach((swiper) => swiper.destroy(true, true));
      this.swipers = [];
    }

    bindTabEvents() {
      this.tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => this.activateTab(index, true));
        button.addEventListener("keydown", (event) => this.onTabKeydown(event, index));
      });
    }

    initializeSwipers() {
      if (typeof window.Swiper === "undefined") {
        window.addEventListener("load", () => this.initializeSwipers(), { once: true });
        return;
      }

      this.querySelectorAll("[data-product-swiper]").forEach((carousel) => {
        const previousButton = carousel.querySelector("[data-swiper-previous]");
        const nextButton = carousel.querySelector("[data-swiper-next]");
        const swiper = new window.Swiper(carousel, {
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
              slidesPerView: 2.3,
              spaceBetween: 16,
            },
            990: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          },
        });

        this.swipers.push(swiper);
      });
    }

    activateTab(index, shouldFocus = false) {
      if (!this.tabButtons[index] || !this.panels[index]) return;

      this.activeIndex = index;

      this.tabButtons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;

        button.setAttribute("aria-selected", isActive.toString());
        button.setAttribute("tabindex", isActive ? "0" : "-1");
        button.classList.toggle("is-active", isActive);
      });

      this.panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === index;

        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });

      if (shouldFocus) {
        this.tabButtons[index].focus();

        this.tabButtons[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }

      requestAnimationFrame(() => {
        this.updateIndicator();
        this.swipers[index]?.update();
      });
    }

    updateIndicator() {
      const activeButton = this.tabButtons[this.activeIndex];

      if (!activeButton || !this.indicator) return;

      this.indicator.style.width = `${activeButton.offsetWidth}px`;
      this.indicator.style.transform = `translate3d(${activeButton.offsetLeft}px, 0, 0)`;
    }

    onTabKeydown(event, index) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + this.tabButtons.length) % this.tabButtons.length;
      }

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % this.tabButtons.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = this.tabButtons.length - 1;
      }

      this.activateTab(nextIndex, true);
    }

    onBlockSelect(event) {
      const selectedButton = this.querySelector(`[data-block-id="${event.detail.blockId}"]`);

      if (!selectedButton) return;

      this.activateTab(this.tabButtons.indexOf(selectedButton));
    }
  }

  customElements.define("tabbed-product-carousel", TabbedProductCarousel);
}
