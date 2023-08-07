import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BaseElement } from "./base";
import "./icon";

@customElement("input-numeric")
export class InputNumeric extends BaseElement {
  @property() name = "";
  @property() class = "";
  @property() value = 1;
  @property() min = 1;
  @property() max = 10;

  override render() {
    return html`
      <div
        role="group"
        class="flex flex-col gap-1 md:flex-row md:justify-between items-center"
      >
        <label for="${this.id}">
          <slot name="label"></slot>
        </label>
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="w-8 h-8 md:w-6 md:h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
          >
            <icon-minus></icon-minus>
          </button>
          <output for="${this.id}" class="w-4 text-center">
            ${this.value}
          </output>
          <button
            type="button"
            class="w-8 h-8 md:w-6 md:h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
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
