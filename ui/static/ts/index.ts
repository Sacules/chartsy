// Components
import './components/icon';

// Types
import { ImageTextUpdate, ImageTextPlacement, Image } from './components/image';

declare global {
	interface HTMLElementEventMap {
		'chart:update': CustomEvent<ImageTextUpdate>;
		'chart:replace': CustomEvent<Image>;
		'chart:textplacement': CustomEvent<ImageTextPlacement>;
		'chart:title': CustomEvent<{ value: string }>;
	}
}
