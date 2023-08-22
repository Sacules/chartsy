import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseElement } from './base';

@customElement('icon-minus')
export class IconMinus extends BaseElement {
	override render() {
		return html`
			<svg
				viewBox="0 0 32 32"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
			>
				<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
					<g
						id="Icon-Set-Filled"
						sketch:type="MSLayerGroup"
						transform="translate(-518.000000, -1089.000000)"
						fill="currentColor"
					>
						<path
							d="M540,1106 L528,1106 C527.447,1106 527,1105.55 527,1105 C527,1104.45 527.447,1104 528,1104 L540,1104 C540.553,1104 541,1104.45 541,1105 C541,1105.55 540.553,1106 540,1106 L540,1106 Z M534,1089 C525.163,1089 518,1096.16 518,1105 C518,1113.84 525.163,1121 534,1121 C542.837,1121 550,1113.84 550,1105 C550,1096.16 542.837,1089 534,1089 L534,1089 Z"
							id="minus-circle"
							sketch:type="MSShapeGroup"
						></path>
					</g>
				</g>
			</svg>
		`;
	}
}

@customElement('icon-plus')
export class IconPlus extends BaseElement {
	override render() {
		return html`
			<svg
				viewBox="0 0 32 32"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
			>
				<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
					<g
						id="Icon-Set-Filled"
						sketch:type="MSLayerGroup"
						transform="translate(-466.000000, -1089.000000)"
						fill="currentColor"
					>
						<path
							d="M488,1106 L483,1106 L483,1111 C483,1111.55 482.553,1112 482,1112 C481.447,1112 481,1111.55 481,1111 L481,1106 L476,1106 C475.447,1106 475,1105.55 475,1105 C475,1104.45 475.447,1104 476,1104 L481,1104 L481,1099 C481,1098.45 481.447,1098 482,1098 C482.553,1098 483,1098.45 483,1099 L483,1104 L488,1104 C488.553,1104 489,1104.45 489,1105 C489,1105.55 488.553,1106 488,1106 L488,1106 Z M482,1089 C473.163,1089 466,1096.16 466,1105 C466,1113.84 473.163,1121 482,1121 C490.837,1121 498,1113.84 498,1105 C498,1096.16 490.837,1089 482,1089 L482,1089 Z"
							id="plus-circle"
							sketch:type="MSShapeGroup"
						></path>
					</g>
				</g>
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
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M14.875 2.8c0-.804 0-1.207.156-1.514.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156h-4.024c-.806 0-1.208 0-1.515-.156a1.437 1.437 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515V2.801ZM.5 2.8c0-.804 0-1.207.157-1.514.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024C7.63.5 8.033.5 8.34.657c.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156H2.801c-.805 0-1.208 0-1.515-.156a1.438 1.438 0 0 1-.629-.629C.501 8.033.501 7.63.501 6.825V2.801Zm0 14.375c0-.806 0-1.208.157-1.515.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156H2.801c-.805 0-1.208 0-1.515-.156a1.438 1.438 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515v-4.024Zm14.375 0c0-.806 0-1.208.156-1.515.138-.27.358-.49.629-.629.307-.156.71-.156 1.515-.156h4.024c.805 0 1.208 0 1.515.156.27.138.49.358.629.629.156.307.156.71.156 1.515v4.024c0 .805 0 1.208-.156 1.515-.138.27-.358.49-.629.629-.307.156-.71.156-1.515.156h-4.024c-.806 0-1.208 0-1.515-.156a1.437 1.437 0 0 1-.629-.629c-.156-.307-.156-.71-.156-1.515v-4.024Z"/>
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
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m15.254 17.66-2.398-2.378c-1.157-1.147-1.735-1.72-2.399-1.93a2.876 2.876 0 0 0-1.791.019c-.66.224-1.225.81-2.357 1.982L.564 21.027m14.69-3.367.491-.487c1.159-1.148 1.738-1.723 2.402-1.933a2.874 2.874 0 0 1 1.793.021c.66.225 1.225.813 2.357 1.988l1.203 1.21m-8.246-.799 5.766 5.777M.564 21.027c.044.363.12.649.25.903.275.54.715.98 1.256 1.256.615.314 1.42.314 3.03.314h13.8c.94 0 1.606 0 2.12-.063M.564 21.027C.5 20.513.5 19.845.5 18.9V5.1c0-1.61 0-2.415.314-3.03.275-.54.715-.98 1.256-1.256C2.685.5 3.49.5 5.1.5h13.8c1.61 0 2.415 0 3.03.314.54.275.98.715 1.256 1.256.314.615.314 1.42.314 3.03v13.36m0 0v.44c0 1.61 0 2.416-.314 3.031-.275.54-.715.98-1.256 1.256-.256.13-.544.207-.91.251m-1.833-15.75a2.875 2.875 0 1 1-5.75 0 2.875 2.875 0 0 1 5.75 0Z"/>
  </g>
  <defs>
    <clipPath id="a">
      <path fill="#fff" d="M0 0h24v24H0z"/>
    </clipPath>
  </defs>
</svg>
		`;
	}
}
