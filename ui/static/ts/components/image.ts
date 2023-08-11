import { html, nothing } from 'lit';
import { map } from 'lit/directives/map.js';
import { property, customElement, state, query } from 'lit/decorators.js';
import { BaseElement } from './base';

export interface Image {
	src: string;
	title: string;
	caption: string;
}

export type ImageTextPlacement = 'hide' | 'inline' | 'overlay';

export type ChartTextPlacement = 'hide' | 'left' | 'below' | 'right';

export type ImageShape = 'square' | 'portrait';

export type ImageTextUpdate = {
	images: HTMLElement;
};

@customElement('chart-image')
export class ChartImage extends BaseElement {
	@property() index = 0;
	@property() src = '';
	@property({ attribute: 'caption' }) caption = '';
	@property() width = 150;
	@property({ attribute: 'text-color' }) textColor = '';
	@property({ attribute: 'text-placement' }) textPlacement?: ImageTextPlacement = 'hide';
	@property() shape: ImageShape = 'square';

	@state() isDraggingOver = false;

	constructor() {
		super();

		this.addEventListener('dragover', (e) => {
			this.isDraggingOver = true;
			e.preventDefault();
			e.stopPropagation();
		});
		this.addEventListener('dragleave', () => (this.isDraggingOver = false));
		this.addEventListener('dragend', () => console.log('in the end'));
		this.addEventListener('drop', (e) => {
			const data = e.dataTransfer!.getData('text/plain');
			if (data.trim() === '') {
				this.isDraggingOver = false;
				return;
			}

			const { src, title, caption } = JSON.parse(data) as Image;
			this.src = src;
			this.title = title;
			this.caption = caption;
			this.isDraggingOver = false;

			this.dataset.caption = caption;
		});

		// mobile only
		this.addEventListener('replace', this.handleReplace);
	}

	handleReplace(e: CustomEvent<Image>) {
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
				style="color: ${this.textColor}; width: ${this.width}px;"
			>
				<strong class="text-center">${this.title}</strong>
				<span class="text-center">${this.caption}</span>
			</figcaption>
		`;
	}

	override render() {
		const className = `outline-cyan-600 hover:outline hover:outline-4 object-center object-cover \
			 transition-all duration-75 shadow-md data-[dragging-over=true]:outline \
			 data-[dragging-over=true]:outline-green-600 ${this.shape === 'portrait' ? 'aspect-[4/5]' : 'aspect-square'}`;

		return html`
			<li>
				<figure class="relative">
					${this.overlayTemplate()}
					<img
						class="${className}"
						data-dragging-over="${this.isDraggingOver}"
						role="img"
						src="${this.src}"
						style="width: ${this.width}px;"
					/>
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
	@property({ attribute: 'text-placement' }) textPlacement: ChartTextPlacement = 'hide';

	@query('slot[name="images"]') imagesSlot!: HTMLSlotElement;

	textTemplate() {
		if (this.textPlacement === 'hide') {
			return nothing;
		}

		return html`<slot name="text"></slot>`;
	}

	override render() {
		const containerClass = `flex gap-8 ${textPlacementStyles[this.textPlacement]}`;

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
	@property({ attribute: 'text-placement' }) textPlacement: ChartTextPlacement = 'hide';
	@property({ type: Number }) columns = 1;
	@property({ type: Number }) rows = 1;

	@state() images: Omit<Image, 'src'>[] = [];

	constructor() {
		super();

		this.addEventListener('update', (e: CustomEvent<ImageTextUpdate>) => {
			this.images = Array.from(e.detail.images.children)
				.slice(0, this.rows * this.columns)
				.map((e) => {
					const { title, dataset } = e as ChartImage;
					const caption = dataset.caption!;

					return { title, caption };
				});
		});
	}

	imagesTemplate() {
		return map(
			this.images,
			(img, i) => html`
				<chart-text-item class="aria-hidden:hidden" index="${i}" title="${img.title}" caption="${img.caption}">
				</chart-text-item>
				${i % this.columns === this.columns - 1 ? html`<br class="aria-hidden:hidden" />` : nothing}
			`,
		);
	}

	override render() {
		//const styles = `grid-template-rows: repeat(${this.columns}, 1fr)`;
		return html`
			<ul class="grid w-max">
				${this.imagesTemplate()}
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

	handleReplace(e: CustomEvent<Image>) {
		const { title, caption } = e.detail;
		this.title = title;
		this.caption = caption;
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
