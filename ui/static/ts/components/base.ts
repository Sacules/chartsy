import { css, LitElement, CSSResultGroup } from 'lit';

export class BaseElement extends LitElement {
	static override styles: CSSResultGroup = css`
		@tailwind base;
		@tailwind components;
		@tailwind utilities;

		@layer components {
			#chart-title h1 {
				@apply text-5xl;
			}

			#chart-title h2 {
				@apply text-4xl;
			}

			#chart-title h3 {
				@apply text-3xl;
			}

			#chart-title h4 {
				@apply text-2xl;
			}

			#chart-title h5 {
				@apply text-xl;
			}

			#chart-title h6 {
				@apply text-lg;
			}
		}
	`;
}
