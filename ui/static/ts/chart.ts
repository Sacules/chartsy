import Konva from 'konva';

const downloadend = new Event('downloadend');

export function download(dataUrl: string) {
	const button = document.getElementById('download-button') as HTMLButtonElement;
	const link = document.createElement('a');

	// Some older browsers may not fully support downloading
	if (typeof link.download !== 'string') {
		window.open(dataUrl);
		button.dispatchEvent(downloadend);
		return 'ok';
	}
	link.href = dataUrl;
	link.download = 'chartsy.png';
	link.click();

	button.dispatchEvent(downloadend);
	return 'ok';
}

// By default, Konva doesn't allow DataTransfer, so we'll have to do it manually...
interface ImageStash {
	konvaImg: Konva.Image | null;
	img: HTMLImageElement | null;
	x: number;
	y: number;
}

export interface Chart {
	stage: Konva.Stage;
	mainLayer: Konva.Layer;
	tmpLayer: Konva.Layer;
	imageStash: ImageStash;
}

interface ChartImage {
	ID: number;
	Title: string;
	Caption: string;
	URL: string;
}

function calculateDimensions(
	colsOrRows: number,
	imagesSize: number,
	spacing: number,
	padding: number,
	multiplier: number,
) {
	return imagesSize * colsOrRows + spacing * multiplier * (colsOrRows - 1) + padding * multiplier * 2;
}

function getAttrs(chart: HTMLElement) {
	const imagesSize = Number(chart.dataset.imagesSize!);
	const padding = Number(chart.dataset.padding!);
	const spacing = Number(chart.dataset.spacing!);
	const rows = Number(chart.dataset.rows!);
	const cols = Number(chart.dataset.cols!);

	return {
		imagesSize,
		padding,
		spacing,
		rows,
		cols,
	};
}

function createChartImage(x: number, y: number, imgSize: number, id: string, image: HTMLImageElement, chart: Chart) {
	const cover = new Konva.Image({
		x,
		y,
		width: imgSize,
		height: imgSize,
		image,
		id,
		stroke: 'cyan',
		draggable: true,
		strokeWidth: 0,
		strokeEnabled: false,
	});

	cover.on('mouseover', (e) => {
		const img = e.target as Konva.Image;
		document.body.style.cursor = 'grab';
		img.strokeEnabled(true);
	});

	cover.on('mouseout', (e) => {
		const img = e.target as Konva.Image;
		document.body.style.cursor = 'default';
		img.strokeEnabled(false);
	});

	cover.on('dragenter', (e) => {
		const img = e.target as Konva.Image;
		img.strokeEnabled(false);
	});

	cover.on('dragstart', (e) => {
		chart.imageStash.konvaImg = e.target as Konva.Image;
		chart.imageStash.x = e.target.attrs.x;
		chart.imageStash.y = e.target.attrs.y;
	});

	cover.on('drop', (e) => {
		const img = e.target;

		if (!chart.imageStash.konvaImg) {
			return;
		}

		chart.imageStash.konvaImg!.setAttr('x', cover.getAttr('x'));
		chart.imageStash.konvaImg!.setAttr('y', cover.getAttr('y'));

		img.setAttr('x', chart.imageStash.x);
		img.setAttr('y', chart.imageStash.y);

		chart.imageStash.x = 0;
		chart.imageStash.y = 0;
		chart.imageStash.konvaImg = null;
	});

	cover.on('dragend', (e) => {
		// Go back to where it began the drag, to keep it in the grid
		e.target.setAttr('x', chart.imageStash.x);
		e.target.setAttr('y', chart.imageStash.y);
	});

	chart.mainLayer.add(cover);
}

export function create(): Chart {
	const chartElement = document.getElementById('chart');
	if (!chartElement) {
		throw new Error('no chart was found');
	}

	const chart: Chart = {
		stage: new Konva.Stage({
			container: 'chart',
			width: 0,
			height: 0,
		}),
		mainLayer: new Konva.Layer(),
		tmpLayer: new Konva.Layer(),
		imageStash: {
			konvaImg: null,
			img: null,
			x: 0,
			y: 0,
		},
	};

	chart.stage.container(chartElement as HTMLDivElement);

	const attrs = getAttrs(chartElement);
	const { cols, rows, spacing, padding } = attrs;

	const sizeMultiplier = 8;
	let images: ChartImage[] = JSON.parse(chartElement.dataset.images!);

	const w = calculateDimensions(cols, attrs.imagesSize, spacing, padding, sizeMultiplier);
	const h = calculateDimensions(rows, attrs.imagesSize, spacing, padding, sizeMultiplier);

	chart.stage.width(w);
	chart.stage.height(h);

	const totalImgs = cols * rows;
	images = images.slice(0, totalImgs);

	const imageGrid = chunkIntoN(images, rows);

	const emptyChart = chart.mainLayer.getChildren().length === 0;
	if (emptyChart) {
		chart.mainLayer.destroyChildren();
	}

	let i = 0;
	imageGrid.forEach((imgRow, row) => {
		imgRow.forEach((img, col) => {
			const imgSize = attrs.imagesSize;

			let x = (col % cols) * imgSize + padding * sizeMultiplier;
			if (col > 0) {
				x += spacing * sizeMultiplier * col;
			}

			let y = (row % rows) * imgSize + padding * sizeMultiplier;
			if (row > 0) {
				y += spacing * sizeMultiplier * row;
			}

			i++;

			const id = `${img.ID}`;
			const [chartImage] = chart.mainLayer.getChildren((c) => c.id() === id) as Konva.Image[];
			if (!emptyChart && !!chartImage) {
				chartImage.x(x);
				chartImage.y(y);
				return;
			}

			let image: HTMLImageElement = new Image();
			image.onload = () => createChartImage(x, y, imgSize, id, image, chart);
			image.crossOrigin = 'Anonymous';
			image.src = img.URL;
		});
	});

	chart.stage.add(chart.mainLayer);
	chart.stage.add(chart.tmpLayer);

	chart.stage.on('dragstart', (e) => {
		e.target.moveTo(chart.tmpLayer);
		chart.mainLayer.draw();
	});

	let previousImg: Konva.Image | undefined;
	chart.stage.on('dragmove', (e) => {
		const pos = chart.stage!.getPointerPosition();
		const img = chart.mainLayer.getIntersection(pos!) as Konva.Image;
		if (previousImg && img) {
			if (previousImg === img) {
				previousImg.fire('dragover', { evt: e.evt }, true);
				return;
			}

			// leave old target
			previousImg.fire('dragleave', { evt: e.evt }, true);

			// enter new one
			img.fire('dragenter', { evt: e.evt }, true);
			return;
		}

		if (!previousImg && img) {
			previousImg = img;
			img.fire('dragenter', { evt: e.evt }, true);
		}

		if (previousImg && !img) {
			previousImg.fire('dragleave', { evt: e.evt }, true);
			previousImg = undefined;
		}

		document.body.style.cursor = 'grab';
	});

	chart.stage.on('dragend', (e) => {
		const pos = chart.stage.getPointerPosition();
		const img = chart.mainLayer.getIntersection(pos!);

		if (img && previousImg) {
			previousImg.fire('drop', { evt: e.evt }, true);
			previousImg = undefined;
			e.target.moveTo(chart.mainLayer);
		}
	});

	chart.stage.on('dragenter', (e) => {
		const img = e.target as Konva.Image;
		img.stroke('green');
		img.strokeEnabled(true);
	});

	chart.stage.on('dragleave', (e) => {
		const img = e.target as Konva.Image;
		img.stroke('blue');
		img.strokeEnabled(true);
	});

	let droppedCover: Konva.Image | undefined;
	const con = chart.stage.container();
	con.addEventListener('dragover', (e) => {
		e.preventDefault();

		// manually register where the pointer is
		chart.stage.setPointersPositions(e);

		const pointerPos = chart.stage.getPointerPosition()!;
		const [cover] = chart.mainLayer.getChildren((c) => {
			const coverSize = c.size();
			const coverPos = c.absolutePosition();

			return (
				pointerPos.x > coverPos.x &&
				pointerPos.x < coverPos.x + coverSize.width &&
				pointerPos.y > coverPos.y &&
				pointerPos.y < coverPos.y + coverSize.height
			);
		});

		droppedCover = cover as Konva.Image;
	});

	con.addEventListener('drop', (e) => {
		e.preventDefault();

		if (!droppedCover) {
			return;
		}

		const img = droppedCover.getAttr('image');
		droppedCover.destroy();
		img.src = window.imageSearchData!.Url;
	});

	// Enable downloads
	const button = document.getElementById('download-button')!;
	button.addEventListener(
		'click',
		() => {
			const dataUrl = chart.stage.toDataURL();
			download(dataUrl);
		},
		false,
	);

	return chart;
}

function chunkIntoN<T>(arr: T[], n: number): T[][] {
	const size = Math.ceil(arr.length / n);
	return Array.from({ length: n }, (_v, i) => arr.slice(i * size, i * size + size));
}
