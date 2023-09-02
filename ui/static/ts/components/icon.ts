import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseElement } from './base';

@customElement('icon-minus')
export class IconMinus extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<g clip-path="url(#a)">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.889 12H17.11m6.389 0c0 6.351-5.149 11.5-11.5 11.5S.5 18.351.5 12 5.649.5 12 .5 23.5 5.649 23.5 12Z"
					/>
				</g>
				<defs>
					<clipPath id="a">
						<path fill="currentColor" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</svg>
		`;
	}
}

@customElement('icon-plus')
export class IconPlus extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<g clip-path="url(#a)">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.889 12H17.11M12 6.889V17.11M23.5 12c0 6.351-5.149 11.5-11.5 11.5S.5 18.351.5 12 5.649.5 12 .5 23.5 5.649 23.5 12Z"
					/>
				</g>
				<defs>
					<clipPath id="a">
						<path fill="currentColor" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</svg>
		`;
	}
}

@customElement('icon-settings')
export class IconSettings extends BaseElement {
	override render() {
		return html`
			<svg
				width="23.999996"
				height="24"
				viewBox="0 0 0.71999989 0.72"
				version="1.1"
				id="svg1"
				sodipodi:docname="sliders-svgrepo-com.svg"
				inkscape:export-filename="sliders-svgrepo-com-edited.svg"
				inkscape:export-xdpi="96"
				inkscape:export-ydpi="96"
				xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
				xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:svg="http://www.w3.org/2000/svg"
			>
				<path
					d="m 0.35999995,0.1108345 c 0,0.052927 -0.0429064,0.0958329 -0.0958329,0.0958329 -0.0529269,0 -0.0958329,-0.0429059 -0.0958329,-0.0958329 m 0.19166569,0 c 0,-0.05292698 -0.0429064,-0.09583288 -0.0958329,-0.09583288 -0.0529269,0 -0.0958328,0.0429059 -0.0958328,0.09583288 m 0.19166569,0 h 0.34499819 m -0.53666394,0 H 0.01500169 M 0.6283319,0.36000002 c 0,0.0529265 -0.0429064,0.0958329 -0.0958328,0.0958329 -0.0529266,0 -0.0958328,-0.0429063 -0.0958328,-0.0958329 m 0.19166568,0 c 0,-0.0529266 -0.0429064,-0.0958329 -0.0958328,-0.0958329 -0.0529266,0 -0.0958328,0.0429062 -0.0958328,0.0958329 m 0.19166568,0 h 0.0766663 m -0.26833198,0 H 0.01500169 m 0.26833199,0.24916552 c 0,0.0529266 -0.0429059,0.0958329 -0.0958329,0.0958329 -0.0529269,0 -0.09583282,-0.0429063 -0.09583282,-0.0958329 m 0.1916657,0 c 0,-0.0529265 -0.0429059,-0.0958329 -0.0958328,-0.0958329 -0.0529269,0 -0.09583283,0.0429063 -0.09583283,0.0958329 m 0.1916657,0 h 0.42166441 m -0.61333021,0 H 0.01500162"
					stroke="currentColor"
					stroke-width="0.072"
					stroke-linecap="round"
					stroke-linejoin="round"
					style="stroke-width:0.0300032;stroke-dasharray:none"
				/>
			</svg>
		`;
	}
}

@customElement('icon-layout')
export class IconLayout extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 24">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.875 2.8c0-.804 0-1.207.156-1.514.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156h-4.024c-.806 0-1.208 0-1.515-.156a1.437 1.437 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515V2.801ZM.5 2.8c0-.804 0-1.207.157-1.514.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024C7.63.5 8.033.5 8.34.657c.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156H2.801c-.805 0-1.208 0-1.515-.156a1.438 1.438 0 0 1-.629-.629C.501 8.033.501 7.63.501 6.825V2.801Zm0 14.375c0-.806 0-1.208.157-1.515.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156H2.801c-.805 0-1.208 0-1.515-.156a1.438 1.438 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515v-4.024Zm14.375 0c0-.806 0-1.208.156-1.515.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156h-4.024c-.806 0-1.208 0-1.515-.156a1.437 1.437 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515v-4.024Z"
				/>
			</svg>
		`;
	}
}

@customElement('icon-image')
export class IconImage extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<g clip-path="url(#a)">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m15.254 17.66-2.398-2.378c-1.157-1.147-1.735-1.72-2.399-1.93a2.876 2.876 0 0 0-1.791.019c-.66.224-1.225.81-2.357 1.982L.564 21.027m14.69-3.367.491-.487c1.159-1.148 1.738-1.723 2.402-1.933a2.874 2.874 0 0 1 1.793.021c.66.225 1.225.813 2.357 1.988l1.203 1.21m-8.246-.799 5.766 5.777M.564 21.027c.044.363.12.649.25.903.275.54.715.98 1.256 1.256.615.314 1.42.314 3.03.314h13.8c.94 0 1.606 0 2.12-.063M.564 21.027C.5 20.513.5 19.845.5 18.9V5.1c0-1.61 0-2.415.314-3.03.275-.54.715-.98 1.256-1.256C2.685.5 3.49.5 5.1.5h13.8c1.61 0 2.415 0 3.03.314.54.275.98.715 1.256 1.256.314.615.314 1.42.314 3.03v13.36m0 0v.44c0 1.61 0 2.416-.314 3.031-.275.54-.715.98-1.256 1.256-.256.13-.544.207-.91.251m-1.833-15.75a2.875 2.875 0 1 1-5.75 0 2.875 2.875 0 0 1 5.75 0Z"
					/>
				</g>
				<defs>
					<clipPath id="a">
						<path fill="#fff" d="M0 0h24v24H0z" />
					</clipPath>
				</defs>
			</svg>
		`;
	}
}

@customElement('icon-text')
export class IconText extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" fill="none" viewBox="0 0 18 22">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 1v20m-3.429 0h6.858M17 4.333V1H1v3.333"
				/>
			</svg>
		`;
	}
}

@customElement('icon-burger')
export class IconBurger extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" fill="none" viewBox="0 0 26 18">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M1 1h24M1 9h24M1 17h24" />
			</svg>
		`;
	}
}

@customElement('icon-download')
export class IconDownload extends BaseElement {
	override render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 26 26">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.667 20.5h.013m.52-4.5h.8c1.242 0 1.864 0 2.354.228.653.305 1.172.889 1.443 1.624.203.551.203 1.25.203 2.648 0 1.398 0 2.097-.203 2.648-.27.735-.79 1.32-1.443 1.624C22.864 25 22.243 25 21 25H5c-1.243 0-1.864 0-2.354-.228-.653-.305-1.172-.889-1.443-1.624C1 22.597 1 21.898 1 20.5c0-1.398 0-2.097.203-2.648.27-.735.79-1.32 1.443-1.624C3.136 16 3.757 16 5 16h.8m7.2 1.5V1m0 16.5L9 13m4 4.5 4-4.5"
				/>
			</svg>
		`;
	}
}
