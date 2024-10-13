import Konva from 'konva';

const SIZE_MULTIPLIER = 8;

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
	images: ChartImage[];
	attrs: {
		imagesSize: number;
		padding: number;
		spacing: number;
		rows: number;
		cols: number;
	};
	stage: Konva.Stage;
	mainLayer: Konva.Layer;
	tmpLayer: Konva.Layer;
	imageStash: ImageStash;
}

interface ChartImage {
	ID: string;
	Title: string;
	Caption: string;
	URL: string;
}

export function calculateDimensions(
	colsOrRows: number,
	imagesSize: number,
	spacing: number,
	padding: number,
	multiplier: number,
) {
	return imagesSize * colsOrRows + spacing * multiplier * (colsOrRows - 1) + padding * multiplier * 2;
}

function createImageAt(x: number, y: number, imgSize: number, id: string, htmlImage: HTMLImageElement, chart: Chart) {
	const cover = new Konva.Image({
		x,
		y,
		width: imgSize,
		height: imgSize,
		image: htmlImage,
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

export function resize(chart: Chart) {
	chart.mainLayer.destroyChildren();

	const chartElement = document.getElementById('chart');
	if (!chartElement) {
		throw new Error('no chart was found');
	}

	chart.attrs.imagesSize = Number(chartElement.dataset.imagesSize!);
	chart.attrs.padding = Number(chartElement.dataset.padding!);
	chart.attrs.spacing = Number(chartElement.dataset.spacing!);
	chart.attrs.rows = Number(chartElement.dataset.rows!);
	chart.attrs.cols = Number(chartElement.dataset.cols!);

	const w = calculateDimensions(
		chart.attrs.cols,
		chart.attrs.imagesSize,
		chart.attrs.spacing,
		chart.attrs.padding,
		SIZE_MULTIPLIER,
	);
	const h = calculateDimensions(
		chart.attrs.rows,
		chart.attrs.imagesSize,
		chart.attrs.spacing,
		chart.attrs.padding,
		SIZE_MULTIPLIER,
	);

	chart.stage.width(w);
	chart.stage.height(h);

	const totalImgs = chart.attrs.cols * chart.attrs.rows;
	const imgs = chart.images.slice(0, totalImgs);

	placeImages(chart, imgs);
}

export function create(): Chart {
	const chartElement = document.getElementById('chart');
	if (!chartElement) {
		throw new Error('no chart was found');
	}

	const imagesSize = Number(chartElement.dataset.imagesSize!);
	const padding = Number(chartElement.dataset.padding!);
	const spacing = Number(chartElement.dataset.spacing!);
	const rows = Number(chartElement.dataset.rows!);
	const cols = Number(chartElement.dataset.cols!);

	const chart: Chart = {
		images: JSON.parse(chartElement.dataset.images!),
		attrs: {
			imagesSize,
			padding,
			spacing,
			rows,
			cols,
		},
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

	const w = calculateDimensions(cols, chart.attrs.imagesSize, spacing, padding, SIZE_MULTIPLIER);
	const h = calculateDimensions(rows, chart.attrs.imagesSize, spacing, padding, SIZE_MULTIPLIER);

	chart.stage.width(w);
	chart.stage.height(h);

	const totalImgs = cols * rows;
	const imgs = chart.images.slice(0, totalImgs);

	placeImages(chart, imgs);

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
	let droppedId = '';
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

		if (!cover) {
			return;
		}

		droppedCover = cover as Konva.Image;
		droppedId = cover.id();
	});

	con.addEventListener('drop', (e) => {
		e.preventDefault();

		if (!droppedCover) {
			return;
		}

		const img = droppedCover.getAttr('image');
		droppedCover.destroy();
		img.src = window.imageSearchData!.Url;

		console.debug(droppedId);
		chart.images[Number(droppedId)].URL = window.imageSearchData!.Url;
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

function placeImages(chart: Chart, imgs: ChartImage[]) {
	const { attrs } = chart;
	const imageGrid = chunkIntoN(imgs, attrs.rows);

	let i = 0;
	imageGrid.forEach((imgRow, row) => {
		imgRow.forEach((img, col) => {
			const imgSize = attrs.imagesSize;

			let x = (col % attrs.cols) * imgSize + attrs.padding * SIZE_MULTIPLIER;
			if (col > 0) {
				x += attrs.spacing * SIZE_MULTIPLIER * col;
			}

			let y = (row % attrs.rows) * imgSize + attrs.padding * SIZE_MULTIPLIER;
			if (row > 0) {
				y += attrs.spacing * SIZE_MULTIPLIER * row;
			}

			/*
			const [chartImage] = chart.mainLayer.getChildren((c) => c.id() === id) as Konva.Image[];
			if (!emptyChart && !!chartImage) {
				chartImage.x(x);
				chartImage.y(y);
				return;
			}
			*/

			const id = `${i}`;
			let image: HTMLImageElement = new Image();
			image.onload = () => createImageAt(x, y, imgSize, id, image, chart);
			image.crossOrigin = 'Anonymous';
			image.src = img.URL;

			i++;
		});
	});
}

function chunkIntoN<T>(arr: T[], n: number): T[][] {
	const size = Math.ceil(arr.length / n);
	return Array.from({ length: n }, (_v, i) => arr.slice(i * size, i * size + size));
}
