import { Mouse } from './Mouse';
import { Cell } from './Cell';

type FieldParams = {
    mouse: Mouse;
    rows: number;
    columns: number;
    cellSize: number;
};

// type Cell = {
//     isOpen: boolean;
//     isHover: boolean;
//     number: number;
//     color: string;
// };

export class Field {
    rows!: number;
    columns!: number;
    mouse!: Mouse;

    matrix: Cell[][] = [];

    pHover!: Cell;

    cellSize!: number;

    constructor(data: FieldParams) {
        Object.assign(this, data);

        this.mouse.on('mousedown', this.mouseDownHandler);
        this.mouse.on('mousemove', this.mouseMoveHandler);

        this.generateMatrix();
    }

    mouseDownHandler = () => {
        const row = Math.floor(this.mouse.y / this.cellSize);
        const col = Math.floor(this.mouse.x / this.cellSize);

        this.matrix[row][col].isOpen = true;
    };

    mouseMoveHandler = () => {
        const row = Math.floor(this.mouse.y / this.cellSize);
        const col = Math.floor(this.mouse.x / this.cellSize);

        if (this.pHover) {
            this.pHover.isHover = false;
        }
        this.pHover = this.matrix[row][col];

        this.matrix[row][col].isHover = true;
    };

    draw = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        for (const row of this.matrix) {
            for (const cell of row) {
                cell.draw(context, canvas);
            }
        }
    };

    generateMatrix() {
        let id = 0;
        for (let i = 0; i < this.rows; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < this.columns; j++) {
                row.push(
                    new Cell({
                        coords: { y: i * this.cellSize, x: j * this.cellSize },
                        number: id,
                        size: this.cellSize,
                        color: 'rgba(125, 125, 125, 1)',
                    })
                );

                id++;
            }

            this.matrix.push(row);
        }

        console.log(this);
    }
}
