import { Render } from './Render';
import { colors } from './colors';

type CellParams = {
    coords: {
        y: number;
        x: number;
    };
    size: number;
    number: number;
};

export class Cell {
    isOpen = false;
    isHover = false;
    number!: number;

    isMouse = false;

    size!: number;
    coords!: {
        y: number;
        x: number;
    };
    sizeD!: number;
    coordsD!: {
        y: number;
        x: number;
    };
    procent!: number;

    unsubscribeFn!: false | (() => void);

    constructor(data: CellParams) {
        Object.assign(this, data);

        this.sizeD = data.size - 10;
        this.coordsD = {
            y: data.coords.y + 5,
            x: data.coords.x + 5,
        };
        this.procent = Math.abs(this.coords.x - this.coordsD.x) / 100;
    }

    draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        context.beginPath();

        context.rect(this.coordsD.x, this.coordsD.y, this.sizeD, this.sizeD);

        context.fillStyle = colors.cell.color.toString();

        if (this.isHover) {
            context.fillStyle = colors.cell.hover.toString();
        }

        context.fill();

        if (this.isOpen) {
            context.fillStyle = 'black';
            context.font = `${16}px ${'Arial'}`;

            context.fillText(
                this.number.toString(),
                this.coords.x + this.size / 2.9,
                this.coords.y + this.size / 1.5
            );
        }

        context.closePath();
    }

    mouseEnterHandler = (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        render: Render
    ) => {
        this.isHover = true;

        if (this.unsubscribeFn) {
            this.unsubscribeFn();
        }

        this.unsubscribeFn = render.subscribe(() => {
            if (this.coordsD.x !== this.coords.x) {
                this.coordsD.x -= this.procent;
                this.coordsD.y -= this.procent;
                this.sizeD += this.procent;

                this.clearCanvas(context);
                this.draw(context, canvas);
            } else {
                if (this.unsubscribeFn) {
                    this.unsubscribeFn();
                }
            }
        });
    };

    mouseLeaveHandler = (
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        render: Render
    ) => {
        this.isHover = false;

        if (this.unsubscribeFn) {
            this.unsubscribeFn();
        }

        this.unsubscribeFn = render.subscribe(() => {
            if (this.coordsD.x !== this.coords.x + 5) {
                this.coordsD.x += this.procent;
                this.coordsD.y += this.procent;
                this.sizeD -= this.procent;

                this.clearCanvas(context);
                this.draw(context, canvas);
            } else {
                if (this.unsubscribeFn) {
                    this.unsubscribeFn();
                }
            }
        });
    };

    clearCanvas = (context: CanvasRenderingContext2D) => {
        context.beginPath();
        context.rect(this.coords.x, this.coords.y, this.size, this.size);
        context.fillStyle = colors.background.toString();
        context.fill();
    };
}
