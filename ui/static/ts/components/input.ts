import { PropertyValues, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
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

		const target = document.getElementById(this.targetId);
		if (!target) {
			console.error("couldn't find target with id:", this.targetId);
			return;
		}

		const e = new CustomEvent(this.targetEvent, {
			detail: { setting: this.name, value: this.value },
		});
		target.dispatchEvent(e);
	}

	override render() {
		return html`
			<div role="group" class="flex flex-col gap-1 md:flex-row md:justify-between items-center">
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
					<output for="${this.id}" class="max-w-6 text-center">${this.value} ${this.unit}</output>
					<button
						id="plus-button"
						type="button"
						class="w-8 h-8 md:w-6 md:h-6 disabled:text-slate-600 disabled:cursor-not-allowed"
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
	@property() class = '';
	@property() value = '';
	@property() caption = '';
	@property() placeholder = '';
	@property() targetId = '';
	@property() targetEvent = '';

	handleInput(e: Event) {
		this.value = (e.target as HTMLInputElement).value;
	}

	protected override updated(changedProperties: PropertyValues<this>) {
		if (!changedProperties.has('value')) {
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

	override render() {
		const c = `${this.class} rounded bg-slate-800 border border-slate-500/75 focus:shadow-none \
			   hover:border-sky-600 focus:border-sky-600 focus:ring-0 transition md:text-sm`;

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
					@input="${this.handleInput}"
				/>
				<span class="italic text-sm">${this.caption}</span>
			</div>
		`;
	}
}
