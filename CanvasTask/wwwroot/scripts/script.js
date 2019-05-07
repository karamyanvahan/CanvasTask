const canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    loadButton = document.getElementById('loadButton'),
    saveButton = document.getElementById('saveButton'),
    canvasWrapper = document.getElementById('canvasWrapper'),
    thumbnailList = document.getElementById('thumbnails'),
    selectedThumbnails = document.getElementsByClassName('thumbnail-selected'),
    imageViewer = document.getElementById('imageViewer'),
    imageViewerImg = document.getElementById('imageViewerImg'),
    closeButton = document.getElementById('closeButton'),
    img = document.getElementById('img'),
    buttons = document.getElementById('buttons');

const imagesPath = 'images';

let shape;

showImages();

saveButton.addEventListener('click', save);

loadButton.addEventListener('click', load);

closeButton.addEventListener('click', closeViewer);

imageViewerImg.style.maxHeight = window.innerHeight - document.getElementsByClassName('buttons')[0].offsetHeight + 'px';
canvasWrapper.style.height = window.innerHeight - buttons.offsetHeight - 20 + 'px';
canvasWrapper.style.maxHeight = window.innerHeight - buttons.offsetHeight - 20 + 'px';
img.style.maxWidth = window.innerWidth - thumbnailList.offsetWidth - 20 + 'px';

let resizeObserver = new ResizeObserver(entries => { updateCanvas(entries); });
resizeObserver.observe(canvasWrapper);

window.addEventListener('resize', function () {
    img.style.maxWidth = window.innerWidth - thumbnailList.offsetWidth - 20 + 'px';
});

class Shape {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        ctx.lineWidth = 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = this.color;
    }

    update() {
        if (!initialState.shape)
            return;
        this.x = initialState.shape.x * (canvas.width / initialState.canvasWidth);
        this.y = initialState.shape.y * (canvas.height / initialState.canvasHeight);
    }
}

class Rectangle extends Shape {
    constructor(x, y, color, width, height, type) {
        super(x, y, color);
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    update() {
        super.update();
        this.width = initialState.shape.width * (canvas.width / initialState.canvasWidth);
        this.height = initialState.shape.height * (canvas.height / initialState.canvasHeight);
        this.draw();
    }
}

class Circle extends Shape {
    constructor(x, y, color, radius) {
        super(x, y, color);
        this.radiusX = radius;
        this.radiusY = radius;
    }

    draw() {
        super.draw();
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        super.update();
        this.radiusX = initialState.shape.radiusX * (canvas.width / initialState.canvasWidth);
        this.radiusY = initialState.shape.radiusY * (canvas.height / initialState.canvasHeight);
        this.draw();
    }
}

async function getShape() {
    let res = await fetch(`/getShape/${canvas.width}/${canvas.height}`);
    let json = await res.json();
    if (json.type === 'Circle') {
        return new Circle(json.x, json.y, json.color, json.radius);
    } else {
        return new Rectangle(json.x, json.y, json.color, json.width, json.height);
    }
}

let initialState = {
    canvasWidth: 0,
    canvasHeight: 0
};

async function load() {
    shape = await getShape();
    shape.draw();
    initialState.shape = {};
    Object.assign(initialState.shape, shape);
    Object.setPrototypeOf(initialState.shape, shape.__proto__);
    initialState.canvasWidth = canvas.width;
    initialState.canvasHeight = canvas.height;
    img.style.display = 'none';
    if (selectedThumbnails[0])
        selectedThumbnails[0].classList.remove('thumbnail-selected');
    canvasWrapper.style.resize = 'both';
    saveButton.disabled = false;
}

function updateCanvas(entries) {
    //update size
    canvas.width = entries[0].target.offsetWidth;
    canvas.height = entries[0].target.offsetHeight;

    //redraw
    if (shape)
        shape.update();
}


async function save() {
    let image = canvas.toDataURL();
    let base64 = image.replace('data:image/png;base64,', '');
    let response = await fetch('/save', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(base64)
    });

    let fileName = await response.text();

    if (response.ok)
        addImage(`${fileName}`, true);
}


async function getImages() {
    let response = await fetch('/getImages');
    let images = await response.json();
    images = JSON.parse(images);
    return images;
}

async function showImages() {
    let images = await getImages();
    for (image of images) {
        addImage(image);
    }
}

function addImage(fileName, toStart) {
    let img = document.createElement('div');
    fileName = `${imagesPath}/${fileName}`;
    img.style.backgroundImage = `url(${fileName})`;
    img.classList.add('thumbnail');
    img.dataset.image = fileName;
    if (toStart) {
        thumbnailList.prepend(img);
    } else {
        thumbnailList.appendChild(img);
    }

    img.addEventListener('click', selectThumbnail);
}

function selectThumbnail(e) {
    if (selectedThumbnails[0])
        selectedThumbnails[0].classList.remove('thumbnail-selected');
    e.target.classList.add('thumbnail-selected');
    showImage(e.target.dataset.image);
}

function showImage(src) {
    //imageViewer.style.display = 'flex';
    //imageViewerImg.src = src;
    img.src = src;
    img.style.display = 'block';
    canvasWrapper.style.width = img.offsetWidth + 'px';
    canvasWrapper.style.height = img.offsetHeight + 'px';
    canvasWrapper.style.resize = 'none';
    saveButton.disabled = true;
}

function closeViewer() {
    imageViewer.style.display = 'none';
    selectedThumbnails[0].classList.remove('thumbnail-selected');
}