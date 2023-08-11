import { css, LitElement, CSSResultGroup } from 'lit';

export class BaseElement extends LitElement {
	static override styles: CSSResultGroup = css`
		@tailwind base;
		@tailwind components;
		@tailwind utilities;
	`;
}
