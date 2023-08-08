import { html } from "lit";
import { map } from "lit/directives/map.js";
import { customElement, query, property, state } from "lit/decorators.js";
import { BaseElement } from "../base";

@customElement("settings-images")
export class SettingsImages extends BaseElement {
  @query("form") form!: HTMLFormElement;

  @state() settings = [
    {
      label: "Hide",
      value: "hide",
      class: "rounded-tl border-b-0",
      default: true,
    },
    { label: "Inline", value: "inline", class: "border-b-0" },
    { label: "Overlay", value: "overlay", class: "rounded-tr border-b-0" },
    { label: "Left", value: "left", class: "rounded-bl" },
    { label: "Below", value: "below" },
    { label: "Right", value: "right", class: "rounded-br" },
  ];

  static formAssociated = true;

  override render() {
    const radioClass =
      "hover:cursor-pointer peer-checked:font-bold peer-checked:bg-slate-50 peer-checked:text-slate-900 grid place-items-center border border-slate-700 select-none h-full";
    return html`
      <form class="flex flex-col gap-4 px-4">
        <strong>Images</strong>
        <fieldset role="group">
          <legend class="mb-2">
            <strong>Titles placement</strong>
          </legend>
          <div class="grid grid-flow-row grid-cols-3 grid-rows-2">
            ${map(
              this.settings,
              (s) => html`
                <div class="h-8 relative hover:cursor-pointer">
                  <input
                    id="text-placement-${s.value}"
                    type="radio"
                    name="text-placement"
                    ?checked="${s.default}"
                    value="${s.value}"
                    class="opacity-0 absolute w-full h-full peer"
                    autocomplete="off"
                  />
                  <label
                    for="text-placement-${s}"
                    class="${radioClass} ${s.class}"
                  >
                    ${s.label}
                  </label>
                </div>
              `,
            )}
          </div>
        </fieldset>
      </form>
    `;
  }
}
