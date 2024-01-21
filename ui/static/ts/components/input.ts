import { PropertyValues, html, nothing } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { BaseElement } from './base';
import './icon';

@customElement('input-text')
export class InputText extends BaseElement {
	@property() required = false;
	@property() label = '';
	@property() name = '';
	@property() value = '';
	@property() caption = '';
	@property() placeholder = '';
	@property() type = 'text';
	@property() error = '';
	@property() autocomplete = 'on';

	@state() internals;

	@query('input') input!: HTMLInputElement;

	static formAssociated = true;

	constructor() {
		super();

		this.internals = this.attachInternals();
	}

	protected override firstUpdated() {
		this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input);

		this.input.addEventListener('input', (e) => {
			this.internals.setValidity(this.input.validity, this.input.validationMessage, this.input);
			this.value = (e.target as HTMLInputElement).value;

			const changeEvent = new CustomEvent('input', { detail: { value: this.value } });
			this.dispatchEvent(changeEvent);
			e.stopPropagation();
		});
	}

	protected override updated(changedProperties: PropertyValues<this>) {
		if (changedProperties.has('value')) {
			this.internals.setFormValue(this.input.value);
		}
	}

	public checkValidity(): boolean {
		return this.internals.checkValidity();
	}

	public reportValidity(): boolean {
		return this.internals.reportValidity();
	}

	public get validity(): ValidityState {
		return this.internals.validity;
	}

	public get validationMessage(): string {
		return this.internals.validationMessage;
	}

	renderCaption() {
		if (this.error !== '') {
			return html`<span class="text-sm text-rose-600">${this.error}</span>`;
		}

		return this.caption !== '' ? html`<span class="text-sm">${this.caption}</span>` : nothing;
	}

	override render() {
		const c = `h-10 w-full px-2 rounded bg-slate-800 border border-slate-500/75 focus:shadow-none \
			       hover:border-sky-600 focus:border-sky-600 focus:ring-0 focus-visible:outline-none \
				   transition text-sm invalid:border-rose-600 ${this.className}`;

		return html`
			<div class="w-full">
				<label for="input-text" class="empty:hidden block mb-2 w-full md:text-sm font-bold">${this.label}</label>
				<input
					?required=${this.required}
					id="input-text"
					type="${this.type}"
					name="${this.name}"
					value="${this.value}"
					maxlength="128"
					?autocomplete=${this.autocomplete}
					placeholder="${this.placeholder}"
					class="${c}"
				/>
				${this.renderCaption()}
			</div>
		`;
	}
}
