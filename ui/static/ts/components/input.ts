import { css, PropertyValues, html, nothing } from 'lit';
import { map } from 'lit/directives/map.js';
import { customElement, state, property, query, queryAssignedElements } from 'lit/decorators.js';
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
	@property() targetId = '';
	@property() targetEvent = '';

	@state() chart: HTMLElement = document.getElementById('chart')!;

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

		this.chart.style.setProperty(`--chart-settings-${this.name}`, String(this.value));

		const e = new CustomEvent(this.targetEvent);
		this.chart.dispatchEvent(e);
	}

	override render() {
		return html`
			<div role="group" class="flex justify-between items-center">
				<label for="${this.id}">
					<slot></slot>
				</label>
				<div class="flex items-center justify-between w-20">
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
	@property() name = '';
	@property() value = '';
	@property() caption = '';
	@property() placeholder = '';
	@property() targetId = '';
	@property() targetEvent = '';

	@state() internals;

	@query('input') input!: HTMLInputElement;

	static formAssociated = true;

	constructor() {
		super();

		this.internals = this.attachInternals();
	}

	protected override firstUpdated() {
		this.input.addEventListener('input', (e) => {
			this.value = (e.target as HTMLInputElement).value;

			const changeEvent = new Event('input', { bubbles: true });
			this.dispatchEvent(changeEvent);
		});
	}

	protected override updated(changedProperties: PropertyValues<this>) {
		if (changedProperties.has('value')) {
			this.internals.setFormValue(this.input.value);
		}

		if (!changedProperties.has('value') || !this.targetId) {
			return;
		}

		const target = document.getElementById(this.targetId);
		if (!target) {
			console.error("couldn't find target with id:", this.targetId);
			return;
		}

		const e = new CustomEvent(this.targetEvent, {
			detail: { val: this.value },
		});
		target.dispatchEvent(e);
	}

	renderCaption() {
		return this.caption !== '' ? html`<span class="text-sm">${this.caption}</span>` : nothing;
	}

	override render() {
		const c = `${this.className} h-10 px-2 rounded bg-slate-800 border border-slate-500/75 focus:shadow-none \
			   hover:border-sky-600 focus:border-sky-600 focus:ring-0 focus-visible:outline-none transition text-sm`;

		return html`
			<div class="flex flex-col gap-2">
				<label for="input-text" class="w-full">
					<strong class="md:text-sm">
						<slot></slot>
					</strong>
				</label>
				<input
					id="input-text"
					type="text"
					name="${this.name}"
					value="${this.value}"
					maxlength="128"
					autocomplete="off"
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
	@property() targetId = 'chart';
	@property() targetEvent = '';

	@state() settings: InputRadioGroupSetting[] = [];

	@queryAssignedElements({ slot: 'item' }) groupSlot!: Array<HTMLElement>;

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

	handleChange(value: string) {
		const target = document.getElementById(this.targetId)!;
		if (!target) {
			console.error("couldn't find target id:", this.targetId);
			return;
		}

		if (!this.targetEvent) {
			target.style.setProperty(`--chart-settings-${this.name}`, value);
			return;
		}

		const update = new CustomEvent(this.targetEvent, { detail: { value } });
		target.dispatchEvent(update);
	}

	protected override firstUpdated() {
		this.settings = this.groupSlot.map((item) => ({
			default: Boolean(item.attributes.getNamedItem('default')),
			value: item.getAttribute('value') || '',
			class: item.className,
			label: item.innerText,
		}));
	}

	override render() {
		const radioClass =
			'hover:cursor-pointer peer-checked:font-bold peer-checked:bg-slate-50 peer-checked:text-slate-900 grid place-items-center border border-slate-700 select-none h-full';
		const listClass = `grid radio-group-${this.settings.length % 3 === 0 ? 3 : 2} grid-flow-row auto-rows-max`;

		return html`
			<form>
				<fieldset role="group" class="flex flex-col gap-2">
					<legend class="contents">
						<slot name="legend"></slot>
					</legend>
					<slot name="item" class="hidden"></slot>
					<div class="${listClass}">
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
										@change="${() => this.handleChange(s.value)}"
									/>
									<label for="text-placement-${s.value}" class="${radioClass} ${s.class}">${s.label}</label>
								</div>
							`,
		)}
					</div>
				</fieldset>
			</form>
		`;
	}
}
