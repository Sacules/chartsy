import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseElement } from './base';

@customElement('chart-image')
export class ChartImage extends BaseElement {
	override render() {
		return html`
			<figure class="outline-cyan-600 hover:outline hover:outline-4 relative" style="width: {{ imagesHeight }}px;">
				<img
					_="on dragover
					 if not $draggingFromResults
					     exit
					 end
				     halt the event
					 set the target's style.outline to '1px solid red'
				 on dragleave or drop
					 set the target's style.outline to ''
				 on drop
					 if not $draggingFromResults
					     exit
					 end
				     get the event.dataTransfer.getData('text/plain')
					 then set result to it as an Object
				     put result.url into me.src
					 put result.title into the next <.inlined .title/>
					 put result.title into the next <.overlay .title/>
					 put result.caption into the next <.inlined .caption/>
					 put result.caption into the next <.overlay .caption/>
			     on replace(data)
				     set d to data as Object
				     put d.url into me.src
					 put d.title into the next <.inlined .title/>
					 put d.title into the next <.overlay .title/>
					 put d.caption into the next <.inlined .caption/>
					 put d.caption into the next <.overlay .caption/>"
					id="chart-img-{{ i }}"
					class="{{ imagesShape }} {{ imagesRoundedCorners }} object-center object-cover 					 transition-all duration-75 shadow-md"
					role="img"
					src="{{ .URL }}"
				/>
				<figcaption
					class="aria-hidden:hidden z-10 absolute inset-0 text-left text-sm leading-tight 					 bg-gradient-to-t from-slate-800/80 grid overlay text-slate-50"
					aria-hidden="true"
				>
					<div class="justify-self-start self-end p-2">
						<strong class="title">{{ .Title }}</strong>
						<br />
						<span class="caption"> {{ .Caption }} </span>
					</div>
				</figcaption>
				<figcaption
					class="aria-hidden:hidden text-sm mt-2 grid place-items-center leading-tight inlined"
					style="color: {{ textColor }};"
					aria-hidden="true"
				>
					<strong class="title text-center">{{ .Title }}</strong>
					<br />
					<span class="caption text-center"> {{ .Caption }} </span>
				</figcaption>
			</figure>
		`;
	}
}
