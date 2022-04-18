import { colors } from './colors';
import { PointerTypes } from './types';

export class Canvas {
    element = document.createElement('canvas');
    context = this.element.getContext('2d') as CanvasRenderingContext2D;

    whatToDrawWhenResize!: (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
    ) => void;

    constructor(root: HTMLDivElement) {
        root.append(this.element);

        this.resize();
        this.clear();

        this.element.oncontextmenu = () => false;

        window.addEventListener('resize', this.resize);
    }

    resize = () => {
        if (!this.element.parentElement) {
            return;
        }

        this.element.width = this.element.parentElement.offsetWidth;
        this.element.height = this.element.parentElement.offsetHeight;

        this.clear();
        if (this.whatToDrawWhenResize) {
            this.whatToDrawWhenResize(this.context, this.element);
        }
    };

    clear = (
        y: number = 0,
        x: number = 0,
        width: number = this.element.width,
        height: number = this.element.height
    ) => {
        const { context } = this;

        context.beginPath();
        context.rect(x, y, width, height);
        context.fillStyle = colors.background.toString();
        context.fill();
    };

    draw = (
        callback: (
            context?: CanvasRenderingContext2D,
            canvas?: HTMLCanvasElement
        ) => void
    ) => {
        callback(this.context, this.element);
    };

    changePointer = (pointerType: PointerTypes) => {
        this.element.style.cursor = pointerType;
    };

    get width() {
        return this.element.width;
    }

    get height() {
        return this.element.height;
    }
}
