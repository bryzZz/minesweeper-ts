import { Mouse } from './Mouse';
import { Cell } from './Cell';
import { Render } from './Render';

type FieldParams = {
    render: Render;
    mouse: Mouse;
    gameSettings: {
        rows: number;
        columns: number;
        cellSize: number;
    };
};

export class Field {
    mouse!: Mouse;
    render!: Render;

    context!: CanvasRenderingContext2D;
    canvas!: HTMLCanvasElement;

    gameSettings!: {
        rows: number;
        columns: number;
        cellSize: number;
    };

    matrix: Cell[][] = [];

    hoverCell: Cell | null = null;

    constructor(data: FieldParams) {
        Object.assign(this, data);

        this.mouse.on('mousedown', this.mouseDownHandler);
        this.mouse.on('mousemove', this.mouseMoveHandler);
        this.mouse.on('mouseleave', this.mouseLeaveHandler);

        this.generateMatrix();
    }

    mouseDownHandler = () => {
        const row = Math.floor(this.mouse.y / this.gameSettings.cellSize);
        const col = Math.floor(this.mouse.x / this.gameSettings.cellSize);

        this.matrix[row][col].isOpen = true;
    };

    mouseMoveHandler = () => {
        const row = Math.floor(this.mouse.y / this.gameSettings.cellSize);
        const col = Math.floor(this.mouse.x / this.gameSettings.cellSize);

        const cell = this.matrix[row][col];
        if (cell !== this.hoverCell) {
            cell.mouseEnterHandler(this.context, this.canvas, this.render);
            this.hoverCell?.mouseLeaveHandler(
                this.context,
                this.canvas,
                this.render
            );

            this.hoverCell = cell;
        }
    };

    mouseLeaveHandler = () => {
        if (this.hoverCell) {
            this.hoverCell.mouseLeaveHandler(
                this.context,
                this.canvas,
                this.render
            );

            this.hoverCell = null;
        }
    };

    draw = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        this.context = context;
        this.canvas = canvas;

        for (const row of this.matrix) {
            for (const cell of row) {
                cell.draw(context, canvas);
            }
        }
    };

    generateMatrix() {
        const {
            matrix,
            gameSettings: { rows, columns, cellSize },
        } = this;

        let id = 0;
        for (let i = 0; i < rows; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < columns; j++) {
                row.push(
                    new Cell({
                        coords: {
                            y: i * cellSize,
                            x: j * cellSize,
                        },
                        number: id,
                        size: cellSize,
                    })
                );

                id++;
            }

            matrix.push(row);
        }
    }
}
