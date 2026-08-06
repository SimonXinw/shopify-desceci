if (!customElements.get("faq-accordion")) {
  class FaqAccordion extends HTMLElement {
    connectedCallback() {
      this.summaries = Array.from(this.querySelectorAll("summary"));
      this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      this.summaries.forEach((summary) => {
        summary.addEventListener("click", (event) => this.handleClick(event));
      });
    }

    handleClick(event) {
      const summary = event.currentTarget;
      const details = summary.closest("details");

      if (!details || details.dataset.animating === "true") return;

      event.preventDefault();

      if (this.prefersReducedMotion.matches) {
        details.open = !details.open;
        return;
      }

      if (details.open) {
        this.close(details, summary);
        return;
      }

      this.open(details, summary);
    }

    open(details, summary) {
      const startHeight = summary.offsetHeight;

      details.dataset.animating = "true";
      details.open = true;

      const endHeight = details.scrollHeight;

      details.classList.add("is-opening");
      this.animate(details, startHeight, endHeight, true);
    }

    close(details, summary) {
      const startHeight = details.offsetHeight;
      const endHeight = summary.offsetHeight;

      details.dataset.animating = "true";
      details.classList.add("is-closing");
      this.animate(details, startHeight, endHeight, false);
    }

    animate(details, startHeight, endHeight, isOpening) {
      const animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        {
          duration: 300,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "both",
        }
      );

      animation.addEventListener("finish", () => {
        if (!isOpening) details.open = false;

        details.classList.remove("is-opening", "is-closing");
        details.removeAttribute("data-animating");
        animation.cancel();
      });
    }
  }

  customElements.define("faq-accordion", FaqAccordion);
}
