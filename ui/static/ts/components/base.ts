import { css, LitElement } from "lit";

export class BaseElement extends LitElement {
  static override styles = css`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `;
}
