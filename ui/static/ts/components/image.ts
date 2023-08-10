import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BaseElement } from './base';

export interface SearchResult {
	src: string;
	title: string;
	caption: string;
}

export type ImageTextPlacement = 'hide' | 'inline' | 'overlay';

@customElement('chart-image')
export class ChartImage extends BaseElement {
	@property() src = '';
	@property() caption = '';
	@property() width = 150;
	@property({ attribute: 'text-color' }) textColor = '';
	@property({ attribute: 'text-placement' }) textPlacement?: ImageTextPlacement = 'hide';

	constructor() {
		super();

		this.addEventListener('dragover', (e) => {
			console.log("it's so over");
			e.preventDefault();
		});
		this.addEventListener('dragleave', () => console.log('leaving'));
		this.addEventListener('dragend', () => console.log('in the end'));
		this.addEventListener('drop', () => console.log('dropping da bomb'));

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
					<span class="caption">${this.caption}</span>
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
				<strong class="title">${this.title}</strong>
				<span class="caption">${this.caption}</span>
			</figcaption>
		`;
	}

	override render() {
		return html`
			<figure class="outline-cyan-600 hover:outline hover:outline-4 relative" style="width: ${this.width}px;">
				${this.overlayTemplate()}
				<img class="object-center object-cover transition-all duration-75 shadow-md" role="img" src="${this.src}" />
				${this.inlineTemplate()}
			</figure>
		`;
	}
}
