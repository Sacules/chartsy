import Konva from 'konva';

// By default, Konva doesn't allow DataTransfer, so we'll have to do it manually...
interface ImageStash {
	konvaImg: Konva.Image | null;
	img: HTMLImageElement | null;
	x: number;
	y: number;
}

const imageStash: ImageStash = {
	konvaImg: null,
	img: null,
	x: 0,
	y: 0,
};

function chunkIntoN<T>(arr: T[], n: number): T[][] {
	const size = Math.ceil(arr.length / n);
	return Array.from({ length: n }, (_v, i) => arr.slice(i * size, i * size + size));
}

interface ChartImage {
	ID: number;
	Title: string;
	Caption: string;
	URL: string;
}

export default function chartRender() {
	const chart = document.getElementById('chart');
	if (!chart) {
		console.error('no chart was found');
		return;
	}

	const imagesSize = Number(chart.dataset.imagesSize!);
	const padding = Number(chart.dataset.padding!);
	const spacing = Number(chart.dataset.spacing!);
	const rows = Number(chart.dataset.rows!);
	const cols = Number(chart.dataset.cols!);
	let images: ChartImage[] = JSON.parse(chart.dataset.images!);

	const sizeMultiplier = 8;

	const width = imagesSize * cols + spacing * sizeMultiplier * (cols - 1) + padding * sizeMultiplier * 2;
	const height = imagesSize * rows + spacing * sizeMultiplier * (rows - 1) + padding * sizeMultiplier * 2;

	const stage = new Konva.Stage({
		container: 'chart',
		width,
		height,
	});

	const layer = new Konva.Layer();
	const tempLayer = new Konva.Layer();

	const totalImgs = cols * rows;
	images = images.slice(0, totalImgs);

	const imageGrid = chunkIntoN(images, rows);

	imageGrid.forEach((imgRow, row) => {
		imgRow.forEach((img, col) => {
			const imgSize = imagesSize;
			const name = `${img.ID}. ${img.Title} - ${img.Caption}`;

			let x = (col % cols) * imgSize + padding * sizeMultiplier;
			if (col > 0) {
				x += spacing * sizeMultiplier * col;
			}

			let y = (row % rows) * imgSize + padding * sizeMultiplier;
			if (row > 0) {
				y += spacing * sizeMultiplier * row;
			}

			const image = new Image();
			image.onload = () => {
				const cover = new Konva.Image({
					x,
					y,
					width: imgSize,
					height: imgSize,
					image,
					name,
					stroke: 'cyan',
					draggable: true,
					strokeWidth: 4,
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
					console.log('dragenter');
				});
				cover.on('dragover', (e) => {
					console.log('dragover');
				});

				cover.on('dragstart', (e) => {
					imageStash.konvaImg = e.target as Konva.Image;
					imageStash.x = e.target.attrs.x;
					imageStash.y = e.target.attrs.y;
				});

				cover.on('drop', (e) => {
					const img = e.target;

					imageStash.konvaImg!.setAttr('x', cover.getAttr('x'));
					imageStash.konvaImg!.setAttr('y', cover.getAttr('y'));

					img.setAttr('x', imageStash.x);
					img.setAttr('y', imageStash.y);

					imageStash.x = 0;
					imageStash.y = 0;
					imageStash.konvaImg = null;
				});

				cover.on('dragend', (e) => {
					// Go back to where it began the drag, to keep it in the grid
					e.target.setAttr('x', imageStash.x);
					e.target.setAttr('y', imageStash.y);
				});

				layer.add(cover);
			};
			image.crossOrigin = 'Anonymous';
			image.src = img.URL;
		});
	});

	stage.add(layer);
	stage.add(tempLayer);

	stage.on('dragstart', (e) => {
		e.target.moveTo(tempLayer);
		layer.draw();
	});

	let previousImg: Konva.Image | undefined;
	stage.on('dragmove', (e) => {
		const pos = stage.getPointerPosition();
		const img = layer.getIntersection(pos!) as Konva.Image;
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

	stage.on('dragend', (e) => {
		const pos = stage.getPointerPosition();
		const img = layer.getIntersection(pos!);

		if (img && previousImg) {
			previousImg.fire('drop', { evt: e.evt }, true);
			previousImg = undefined;
			e.target.moveTo(layer);
		}
	});

	stage.on('dragenter', (e) => {
		const img = e.target as Konva.Image;
		img.stroke('green');
		img.strokeEnabled(true);
	});

	stage.on('dragleave', (e) => {
		const img = e.target as Konva.Image;
		img.stroke('blue');
		img.strokeEnabled(true);
	});

	let droppedCover: Konva.Image | undefined;
	const con = stage.container();
	con.addEventListener('dragover', (e) => {
		e.preventDefault();

		// manually register where the pointer is
		stage.setPointersPositions(e);

		const pointerPos = stage.getPointerPosition()!;
		const [cover] = layer.getChildren((c) => {
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
			const dataUrl = stage.toDataURL();
			window.downloadChart(dataUrl);
		},
		false,
	);
}
