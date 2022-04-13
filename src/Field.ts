import { Mouse } from './Mouse';

type FieldParams = {
    mouse: Mouse;
    rows: number;
    columns: number;
};

type Cell = {
    isOpen: boolean;
    number: number;
};

export class Field {
    rows!: number;
    columns!: number;
    mouse!: Mouse;

    matrix: Cell[][] = [];

    constructor(data: FieldParams) {
        this.rows = data.rows;
        this.columns = data.columns;
        this.mouse = data.mouse;

        this.mouse.on('mousedown', this.mouseDownHandler);

        this.generateMatrix();
    }

    mouseDownHandler = () => {
        const row = Math.floor(this.mouse.y / 40);
        const col = Math.floor(this.mouse.x / 40);

        this.matrix[row][col].isOpen = true;
    };

    generateMatrix() {
        let id = 0;
        for (let i = 1; i <= this.rows; i++) {
            const row: Cell[] = [];
            for (let j = 1; j <= this.columns; j++) {
                const cell: Cell = {
                    number: id,
                    isOpen: false,
                };

                row.push(cell);

                id++;
            }

            this.matrix.push(row);
        }
    }
}
