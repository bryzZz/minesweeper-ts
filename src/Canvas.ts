import { colors } from './colors';

export class Canvas {
    element = document.createElement('canvas');
    context = this.element.getContext('2d') as CanvasRenderingContext2D;

    onResize!: Function;

    constructor(root: HTMLDivElement) {
        root.append(this.element);

        this.resize();
        this.clear();

        window.addEventListener('resize', this.resize);
    }

    resize = () => {
        if (!this.element.parentElement) {
            return;
        }

        this.element.width = this.element.parentElement.offsetWidth;
        this.element.height = this.element.parentElement.offsetHeight;

        this.clear();
        if (this.onResize) {
            this.onResize(this.context, this.element);
        }
    };

    clear = () => {
        const {
            context,
            element: { width, height },
        } = this;

        context.beginPath();
        context.rect(0, 0, width, height);
        context.fillStyle = colors.background.toString();
        context.fill();
    };

    draw = (
        callback: (
            context: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement
        ) => void
    ) => {
        this.onResize = callback;
        callback(this.context, this.element);
    };

    get width() {
        return this.element.width;
    }

    get height() {
        return this.element.height;
    }
}
