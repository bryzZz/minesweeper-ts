import { Render } from './Render';
import { colors } from './colors';
import { ClearCanvas } from './types';

type CellParams = {
    clearCanvas: ClearCanvas;
    positionInMatrix: { y: number; x: number };
    coords: {
        y: number;
        x: number;
    };
    size: number;
    drawSize: number;
};

export class Cell {
    clearCanvas!: ClearCanvas;
    positionInMatrix!: { y: number; x: number };

    isOpen = false;
    isMine = false;
    isFlag = false;
    isHover = false;
    number = 0;

    isMouse = false;

    size!: number;
    drawSize!: number;
    coords!: {
        y: number;
        x: number;
    };
    hoverSize!: number;
    nonHoverSize!: number;

    unsubscribeFn!: false | (() => void);

    constructor(data: CellParams) {
        Object.assign(this, data);

        this.hoverSize = data.drawSize + 2;
        this.nonHoverSize = data.drawSize;
    }

    draw(context: CanvasRenderingContext2D) {
        const y = this.coords.y + (this.size - this.drawSize) / 2,
            x = this.coords.x + (this.size - this.drawSize) / 2,
            size = this.drawSize,
            radius = {
                tl: 2,
                tr: 2,
                bl: 2,
                br: 2,
            };

        this.clearCanvas(this.coords.y, this.coords.x, this.size, this.size);

        context.beginPath();
        context.strokeStyle = colors.cell.color.toString();

        if (!this.isOpen) {
            context.moveTo(x + radius.tl, y);
            context.lineTo(x + size - radius.tr, y);
            context.quadraticCurveTo(x + size, y, x + size, y + radius.tr);
            context.lineTo(x + size, y + size - radius.br);
            context.quadraticCurveTo(
                x + size,
                y + size,
                x + size - radius.br,
                y + size
            );
            context.lineTo(x + radius.bl, y + size);
            context.quadraticCurveTo(x, y + size, x, y + size - radius.bl);
            context.lineTo(x, y + radius.tl);
            context.quadraticCurveTo(x, y, x + radius.tl, y);

            context.fillStyle = colors.cell.color.toString();

            if (this.isHover) {
                context.fillStyle = colors.cell.hover.toString();
            }

            if (this.isFlag) {
                context.fillStyle = 'grey';
            }

            context.fill();
        }

        if (this.isOpen && this.number) {
            context.fillStyle = 'white';
            context.font = `400 ${this.size / 2}px/1 ${'Roboto'}`;
            context.textAlign = 'center';
            context.textBaseline = 'middle';

            context.fillText(
                this.number.toString(),
                this.coords.x + this.size / 2,
                this.coords.y + this.size / 2
            );
        }

        context.closePath();
    }

    mouseEnterHandler = (context: CanvasRenderingContext2D, render: Render) => {
        this.isHover = true;

        if (!this.isOpen) {
            if (this.unsubscribeFn) {
                this.unsubscribeFn();
            }
            const procent = (this.hoverSize - this.drawSize) / 10;

            this.unsubscribeFn = render.subscribe(() => {
                if (this.drawSize < this.hoverSize) {
                    this.drawSize += procent;

                    this.draw(context);
                } else {
                    if (this.unsubscribeFn) {
                        this.unsubscribeFn();
                    }
                }
            });
        }
    };

    mouseLeaveHandler = (context: CanvasRenderingContext2D, render: Render) => {
        this.isHover = false;

        if (!this.isOpen) {
            if (this.unsubscribeFn) {
                this.unsubscribeFn();
            }

            const procent = (this.nonHoverSize - this.drawSize) / 10;

            this.unsubscribeFn = render.subscribe(() => {
                if (this.drawSize > this.nonHoverSize) {
                    this.drawSize += procent;

                    this.draw(context);
                } else {
                    if (this.unsubscribeFn) {
                        this.unsubscribeFn();
                    }
                }
            });
        }
    };
}
