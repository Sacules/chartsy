import { css, html, nothing } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { map } from 'lit/directives/map.js';
import { query, property, customElement, state } from 'lit/decorators.js';
import { marked } from 'marked';

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
		this.addEventListener('chart:replace', this.handleReplace);
	}

	handleReplace(e: CustomEvent<Image>) {
		const { src, title, caption } = e.detail;
		this.src = src;
		this.title = title;
		this.caption = caption;
	}

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
		const className = `outline-cyan-600 hover:outline hover:outline-4 object-center object-cover \
			 w-full transition-all duration-75 shadow-md data-[dragging-over=true]:outline \
			 data-[dragging-over=true]:outline-green-600 ${this.shape === 'portrait' ? 'aspect-[4/5]' : 'aspect-square'}`;

		return html`
			<li>
				<figure class="relative">
					${this.overlayTemplate()}
					<img class="${className}" data-dragging-over="${this.isDraggingOver}" role="img" src="${this.src}" />
					${this.inlineTemplate()}
				</figure>
			</li>
		`;
	}
}

@customElement('chart-images-text')
export class ChartImagesText extends BaseElement {
	@property({ attribute: 'text-placement' }) textPlacement: ChartTextPlacement = 'hide';
	@property({ attribute: 'chart-title' }) chartTitle = '';

	@query('h1') heading!: HTMLHeadingElement;

	private textPlacementStyles = {
		hide: '',
		left: 'left',
		below: 'below',
		right: 'right',
	};

	static override styles = [
		BaseElement.styles,
		css`
			:host {
				--layout: 'title' 'images';
				--layout-left: '.  title' 'text images';
				--layout-below: 'title' 'images' 'text';
				--layout-right: 'title  .' 'images text';
			}
			#chart {
				grid-template-areas: var(--layout);
			}

			.left {
				--layout: var(--layout-left);
			}

			.below {
				--layout: var(--layout-below);
			}

			.right {
				--layout: var(--layout-right);
			}

			slot[name='title']::slotted(*) {
				grid-area: title;
			}

			slot[name='images']::slotted(*) {
				grid-area: images;
			}

			slot[name='text']::slotted(*) {
				grid-area: text;
			}
		`,
	];

	constructor() {
		super();

		this.addEventListener('chart:title', (e) => {
			this.chartTitle = marked.parse(e.detail.value);
		});
	}

	override render() {
		return staticHtml`
			<div id="chart" class="grid ${this.textPlacementStyles[this.textPlacement]}">
				<div id="chart-title" class="text-slate-900 font-condensed place-self-center max-w-[60ch]">
					${this.chartTitle === '' ? nothing : unsafeStatic(this.chartTitle)}
				</div>
				<slot name="images"></slot>
				<slot name="text" class="aria-hidden:hidden" aria-hidden="${this.textPlacement === 'hide'}"></slot>
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

		this.addEventListener('chart:update', (e: CustomEvent<ImageTextUpdate>) => {
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
		return html`
			<ul class="px-4 grid w-max">
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

		this.addEventListener('chart:replace', this.handleReplace);
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
