import { html, nothing } from 'lit';
import { property, customElement, state, query } from 'lit/decorators.js';
import { BaseElement } from './base';

export interface SearchResult {
	src: string;
	title: string;
	caption: string;
}

export type ImageTextPlacement = 'hide' | 'inline' | 'overlay';

export type ChartTextPlacement = 'hide' | 'left' | 'below' | 'right';

@customElement('chart-image')
export class ChartImage extends BaseElement {
	@property() index = 0;
	@property() src = '';
	@property({ attribute: 'caption' }) caption = '';
	@property() width = 150;
	@property({ attribute: 'text-color' }) textColor = '';
	@property({ attribute: 'text-placement' }) textPlacement?: ImageTextPlacement = 'hide';

	@state() isDraggingOver = false;

	constructor() {
		super();

		this.addEventListener('dragover', (e) => {
			this.isDraggingOver = true;
			e.preventDefault();
		});
		this.addEventListener('dragleave', () => (this.isDraggingOver = false));
		this.addEventListener('dragend', () => console.log('in the end'));
		this.addEventListener('drop', (e) => {
			const data = e.dataTransfer!.getData('text/plain');
			if (data.trim() === '') {
				console.log('empty datatransfer');
				this.isDraggingOver = false;
				return;
			}
			console.log('datatransfer', data);
			const { src, title, caption } = JSON.parse(data) as SearchResult;
			this.src = src;
			this.title = title;
			this.caption = caption;
			this.isDraggingOver = false;

			this.dataset.caption = caption;
		});

		// mobile only
		this.addEventListener('replace', this.handleReplace);
	}

	handleReplace(e: CustomEvent<SearchResult>) {
		const { src, title, caption } = e.detail;
		this.src = src;
		this.title = title;
		this.caption = caption;
	}

	/*
on dragover
	not $draggingFromResults
		 exit
	 end
	 halt the event
	 set the target's style.outline to '1px solid red'
on dragleave or drop
	 the target's style.outline to ''
on drop
	not $draggingFromResults
		exit
	end
	get the event.dataTransfer.getData('text/plain')
	then set result to it as an Object
	put result.url into me.src
	put result.title into the next <.inlined .title/>
	put result.title into the next <.overlay .title/>
	put result.caption into the next <.inlined .caption/>
	put result.caption into the next <.overlay .caption/>
	*/

	overlayTemplate() {
		if (this.textPlacement !== 'overlay') {
			return nothing;
		}

		return html`
			<figcaption
				class="aria-hidden:hidden z-10 absolute inset-0 text-left text-sm leading-tight bg-gradient-to-t from-slate-800/80 grid text-slate-50"
			>
				<div class="justify-self-start self-end p-2">
					<strong class="title">${this.title}</strong>
					<p class="caption">${this.caption}</p>
				</div>
			</figcaption>
		`;
	}

	inlineTemplate() {
		if (this.textPlacement !== 'inline') {
			return nothing;
		}

		return html`
			<figcaption
				class="aria-hidden:hidden text-sm mt-2 grid place-items-center leading-tight"
				style="color: ${this.textColor};"
			>
				<strong class="text-center">${this.title}</strong>
				<span class="text-center">${this.caption}</span>
			</figcaption>
		`;
	}

	override render() {
		const className =
			'outline-cyan-600 hover:outline hover:outline-4 object-center object-cover transition-all duration-75 shadow-md data-[dragging-over=true]:outline data-[dragging-over=true]:outline-green-600';

		return html`
			<li>
				<figure class="relative" style="width: ${this.width}px;">
					${this.overlayTemplate()}
					<img class="${className}" data-dragging-over="${this.isDraggingOver}" role="img" src="${this.src}" />
					${this.inlineTemplate()}
				</figure>
			</li>
		`;
	}
}

const textPlacementStyles = {
	hide: '',
	left: 'flex-row-reverse ',
	below: 'flex-col',
	right: 'flow-row',
};

@customElement('chart-images-text')
export class ChartImagesText extends BaseElement {
	@property({ attribute: 'text-placement' }) textPlacement?: ChartTextPlacement;

	@query('slot[name="images"]') imagesSlot!: HTMLSlotElement;

	textTemplate() {
		if (this.textPlacement === 'hide') {
			return nothing;
		}

		return html`<slot name="text"></slot>`;
	}

	override render() {
		const containerClass = `flex gap-8 ${textPlacementStyles[this.textPlacement ?? 'right']}`;

		return html`
			<div class="${containerClass}">
				<slot name="images"></slot>
				${this.textTemplate()}
			</div>
		`;
	}
}

@customElement('chart-text')
export class ChartText extends BaseElement {
	@property({ attribute: 'text-placement' }) textPlacement?: ChartTextPlacement;
	@property({ attribute: 'columns' }) columns = 1;

	override render() {
		const styles = `grid-template-rows: repeat(${this.columns}, 1fr)`;
		return html`
			<ul>
				<slot class="grid" style="${styles}"></slot>
			</ul>
		`;
	}
}

@customElement('chart-text-item')
export class ChartTextItem extends BaseElement {
	@property({ type: Number }) index = 0;
	@property() caption = '';

	constructor() {
		super();

		this.addEventListener('replace', this.handleReplace);
	}

	handleReplace(e: CustomEvent<SearchResult>) {
		const { title, caption } = e.detail;
		this.title = title;
		this.caption = caption;
		console.log('replaced on index', this.index, 'caption', caption, 'title', title);
	}

	override render() {
		return html`
			<li class="text-slate-900">
				<strong>${this.title}</strong>
				<span>${this.caption}</span>
			</li>
		`;
	}
}
