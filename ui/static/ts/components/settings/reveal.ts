import { html } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { BaseElement } from '../base';

@customElement('settings-reveal')
export class SettingsReveal extends BaseElement {
	@query('icon-chevron-down') chevron!: HTMLFormElement;

	handleToggle() {
		this.chevron.classList.toggle('rotate-180');
	}

	override render() {
		return html`
			<details @toggle="${this.handleToggle}">
				<summary
					class="p-4 list-none flex items-center justify-between hover:bg-slate-800 hover:cursor-pointer border-y border-slate-700"
				>
					<strong>${this.title}</strong>
					<icon-chevron-down class="w-4 h-4 transition transform"></icon-chevron-down>
				</summary>
				<slot />
			</details>
		`;
	}
}
