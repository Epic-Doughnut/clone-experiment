// @ts-nocheck

// Credit to https://codepen.io/rudtjd2548/pen/qBpVzxP
// Evan Jin (진경성)
const TOTAL = 10;
const petalArray = [];

// Petal class
class Petal {
    constructor(petalImg) {
        this.petalImg = petalImg;
        this.x = Math.random() * canvas.width;
        this.y = (Math.random() * canvas.height * 2) - canvas.height;
        this.w = 25 + Math.random() * 15;
        this.h = 20 + Math.random() * 10;
        this.opacity = this.w / 40;
        this.flip = Math.random();

        this.xSpeed = 1.5 + Math.random() * 2;
        this.ySpeed = 1 + Math.random() * 1;
        this.flipSpeed = Math.random() * 0.03;
    }

    draw() {
        if (this.y > canvas.height || this.x > canvas.width) {
            this.x = -this.petalImg.width;
            this.y = (Math.random() * canvas.height * 2) - canvas.height;
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flip = Math.random();
        }
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.petalImg,
            this.x,
            this.y,
            this.w * (0.6 + (Math.abs(Math.cos(this.flip)) / 3)),
            this.h * (0.8 + (Math.abs(Math.sin(this.flip)) / 5))
        );
    }

    animate() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
        this.draw();
    }
}


const canvas = document.querySelector('canvas#fullscreen');
canvas.width = window.outerWidth;
canvas.height = window.outerHeight;
const ctx = canvas.getContext('2d');

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    petalArray.forEach(petal => petal.animate());
    window.requestAnimationFrame(render);
}

function getTimeSegment() {
    const now = new Date();
    const minutes = now.getMinutes();
    return (minutes % 5);
}



/**
 * Set the total number of petals 
 * @param {number} newTotal How many petals are there?
 */
function setPetals(newTotal) {
    const petalImg = new Image();
    switch (getTimeSegment()) {
        default:
        case 1:
            petalImg.src = './petal.png';
            break;
        case 2:
            petalImg.src = './pollen.png';
            break;
        case 3:
            petalImg.src = './fall.png';
            break;
        case 4:
            petalImg.src = './snowflake.png';
            break;


    };

    if (newTotal > petalArray.length) {
        for (let i = 0; i < newTotal - petalArray.length; ++i) {
            petalArray.push(new Petal(petalImg));
        }
    }
    else if (newTotal < petalArray.length) {
        for (let i = 0; i < petalArray.length - newTotal; ++i) {
            petalArray.pop();
        }
    }
    render();
}

exports.setPetals = setPetals;