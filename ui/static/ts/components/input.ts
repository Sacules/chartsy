import { PropertyValues, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { BaseElement } from "./base";
import "./icon";

@customElement("input-numeric")
export class InputNumeric extends BaseElement {
  @property() name = "";
  @property() class = "";
  @property() value = 1;
  @property() min = 1;
  @property() max = 10;

  @query("#minus-button") minusButton!: HTMLButtonElement;
  @query("#plus-button") plusButton!: HTMLButtonElement;

  decrement() {
    this.value--;
    if (this.value <= this.min) {
      this.minusButton.setAttribute("disabled", "true");
    }

    if (this.value < this.max) {
      this.plusButton.removeAttribute("disabled");
    }
  }

  increment() {
    this.value++;
    if (this.value >= this.max) {
      this.plusButton.setAttribute("disabled", "true");
    }

    if (this.value > this.min) {
      this.minusButton.removeAttribute("disabled");
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("value")) {
      console.log(this.value);
    }
  }

  override render() {
    return html`
      <div
        role="group"
        class="flex flex-col gap-1 md:flex-row md:justify-between items-center"
      >
        <label for="${this.id}">
          <slot></slot>
        </label>
        <div class="flex items-center gap-4">
          <button
            id="minus-button"
            type="button"
            class="w-8 h-8 md:w-6 md:h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
            @click="${this.decrement}"
          >
            <icon-minus></icon-minus>
          </button>
          <output for="${this.id}" class="w-4 text-center">
            ${this.value}
          </output>
          <button
            id="plus-button"
            type="button"
            class="w-8 h-8 md:w-6 md:h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
            @click="${this.increment}"
          >
            <icon-plus></icon-plus>
          </button>
        </div>
        <input
          id="${this.id}"
          name="${this.name}"
          type="hidden"
          value="${this.value}"
        />
      </div>
    `;
  }
}
