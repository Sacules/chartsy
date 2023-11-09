import { css, PropertyValues, html, nothing } from 'lit';
import { map } from 'lit/directives/map.js';
import { customElement, state, property, query, queryAll, queryAssignedElements } from 'lit/decorators.js';
import { BaseElement } from './base';
import './icon';

@customElement('input-numeric')
export class InputNumeric extends BaseElement {
	@property() name = '';
	@property() class = '';
	@property({ type: Number }) value = 1;
	@property({ type: Number }) min = 1;
	@property({ type: Number }) max = 10;
	@property({ type: Number }) step = 1;
	@property() unit = '';

	@query('#minus-button') minusButton!: HTMLButtonElement;
	@query('#plus-button') plusButton!: HTMLButtonElement;

	decrement() {
		this.value = this.value - this.step;
		if (this.value <= this.min) {
			this.minusButton.setAttribute('disabled', 'true');
		}

		if (this.value < this.max) {
			this.plusButton.removeAttribute('disabled');
		}
	}

	increment() {
		this.value = this.value + this.step;
		if (this.value >= this.max) {
			this.plusButton.setAttribute('disabled', 'true');
		}

		if (this.value > this.min) {
			this.minusButton.removeAttribute('disabled');
		}
	}

	protected override updated(changedProperties: PropertyValues<this>) {
		if (!changedProperties.has('value')) {
			return;
		}

		const e = new CustomEvent('change', { detail: { value: this.value } });
		this.dispatchEvent(e);
	}

	override render() {
		return html`
			<div role="group" class="flex justify-between items-center">
				<label for="${this.id}">
					<slot></slot>
				</label>
				<div class="flex items-center justify-between w-24">
					<button
						id="minus-button"
						type="button"
						class="w-6 h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
						@click="${this.decrement}"
					>
						<icon-minus></icon-minus>
					</button>
					<output for="${this.id}" class="max-w-6 text-center">${this.value} ${this.unit}</output>
					<button
						id="plus-button"
						type="button"
						class="w-6 h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
						@click="${this.increment}"
					>
						<icon-plus></icon-plus>
					</button>
				</div>
				<input id="${this.id}" name="${this.name}" type="hidden" value="${this.value}" />
			</div>
		`;
	}
}

@customElement('input-text')
export class InputText extends BaseElement {
	@property() required = false;
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
		const c = `h-10 px-2 rounded bg-slate-800 border border-slate-500/75 focus:shadow-none \
			       hover:border-sky-600 focus:border-sky-600 focus:ring-0 focus-visible:outline-none \
				   transition text-sm invalid:border-rose-600 ${this.className}`;

		return html`
			<div class="flex flex-col gap-2">
				<label for="input-text" class="w-full md:text-sm font-bold">
					<slot></slot>
				</label>
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

type InputRadioGroupSetting = {
	default: boolean;
	value: string;
	class: string;
	label: string;
};

@customElement('input-radio-group')
export class InputRadioGroup extends BaseElement {
	@property() name = '';
	@property() value = '';

	@state() internals;
	@state() settings: InputRadioGroupSetting[] = [];

	@queryAssignedElements({ slot: 'item' }) groupSlot!: Array<HTMLElement>;
	@queryAll('input') inputs!: HTMLInputElement[];

	static formAssociated = true;

	constructor() {
		super();

		this.internals = this.attachInternals();
	}

	static override styles = [
		BaseElement.styles,
		css`
			.radio-group-2 {
				grid-template-columns: repeat(2, minmax(5rem, 1fr));
			}

			.radio-group-3 {
				grid-template-columns: repeat(3, minmax(5rem, 1fr));
			}
		`,
	];

	protected override firstUpdated() {
		this.settings = this.groupSlot.map((item) => ({
			default: Boolean(item.attributes.getNamedItem('default')),
			value: item.getAttribute('value') || '',
			class: item.className,
			label: item.innerText,
		}));

		this.addEventListener('focus', () => {
			this.inputs[0].focus();
		});
	}

	handlePress(e: KeyboardEvent, index: number) {
		if (e.key !== 'Enter') {
			return;
		}

		this.settings.forEach((s) => (s.default = false));
		this.settings[index].default = true;
		this.inputs[index].checked = true;
		this.handleChange(e);
	}

	handleChange(e: Event) {
		this.value = (e.target as HTMLInputElement).value;

		const changeEvent = new CustomEvent('change', { bubbles: true, detail: { value: this.value } });
		this.dispatchEvent(changeEvent);
	}

	renderSettings() {
		const labelClass =
			'z-10 hover:cursor-pointer peer-checked:font-bold peer-checked:bg-slate-50 peer-checked:text-slate-900 grid place-items-center border border-slate-700 select-none h-full';
		return map(
			this.settings,
			(s, i) => html`
				<div
					class="group focus-visible:outline focus-visible:outline-sky-600 h-8 relative hover:cursor-pointer"
					tabindex="0"
					@keydown="${(e: KeyboardEvent) => this.handlePress(e, i)}"
				>
					<input
						id="text-placement-${s.value}"
						type="radio"
						name="text-placement"
						?checked="${s.default}"
						value="${s.value}"
						class="opacity-0 absolute w-full h-full peer"
						autocomplete="off"
						@change="${this.handleChange}"
					/>
					<label for="text-placement-${s.value}" class="${labelClass} ${s.class}">${s.label}</label>
				</div>
			`,
		);
	}

	override render() {
		const listClass = `grid radio-group-${this.settings.length % 3 === 0 ? 3 : 2} grid-flow-row auto-rows-max`;

		return html`
			<fieldset role="group" class="flex flex-col gap-2">
				<legend class="contents">
					<slot name="legend"></slot>
				</legend>
				<slot name="item" class="hidden"></slot>
				<div class="${listClass}">${this.renderSettings()}</div>
			</fieldset>
		`;
	}
}
