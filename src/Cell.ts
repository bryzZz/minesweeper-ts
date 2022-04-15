type CellParams = {
    coords: {
        y: number;
        x: number;
    };
    size: number;
    number: number;
    color: string;
};

export class Cell {
    isOpen = true;
    isHover = false;
    number!: number;
    color!: string;

    size!: number;
    coords!: {
        y: number;
        x: number;
    };

    constructor(data: CellParams) {
        Object.assign(this, data);
    }

    draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        context.beginPath();

        context.rect(this.coords.x, this.coords.y, this.size, this.size);

        context.fillStyle = this.color;

        if (this.isHover) {
            context.fillStyle = 'yellow';
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
}
