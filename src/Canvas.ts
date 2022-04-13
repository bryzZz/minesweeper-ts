type CanvasParams = {
    background: string;
};

export class Canvas {
    element = document.createElement('canvas');
    context = this.element.getContext('2d') as CanvasRenderingContext2D;

    background!: string;

    constructor(data: CanvasParams) {
        this.background = data.background;

        window.addEventListener('resize', this.resize);
    }

    resize = () => {
        if (!this.element.parentElement) {
            return;
        }

        this.element.width = this.element.parentElement.offsetWidth;
        this.element.height = this.element.parentElement.offsetHeight;
    };

    clear = () => {
        const {
            context,
            background,
            element: { width, height },
        } = this;

        context.beginPath();
        context.rect(0, 0, width, height);
        context.fillStyle = background;
        context.fill();
    };

    draw = (
        callback: (
            context: CanvasRenderingContext2D,
            canvas: HTMLCanvasElement
        ) => void
    ) => {
        callback(this.context, this.element);
    };

    get width() {
        return this.element.width;
    }

    get height() {
        return this.element.height;
    }
}
