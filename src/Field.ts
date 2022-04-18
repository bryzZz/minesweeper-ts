import { Render } from './Render';
import { Mouse } from './Mouse';
import { Cell } from './Cell';
import { randomInteger } from './utils';
import { colors } from './colors';
import { GameSettings, PointerTypes, ClearCanvas } from './types';

type ChangePointer = (pointerType: PointerTypes) => void;

type FieldParams = {
    context: CanvasRenderingContext2D;
    clearCanvas: ClearCanvas;
    changePointer: ChangePointer;
    render: Render;
    mouse: Mouse;
    gameSettings: GameSettings;
};

export class Field {
    render!: Render;
    mouse!: Mouse;

    context!: CanvasRenderingContext2D;
    clearCanvas!: ClearCanvas;
    changePointer!: ChangePointer;

    gameSettings!: {
        rows: number;
        columns: number;
        cellSize: number;
        minesCount: {
            initial: number;
            current: number;
        };
    };

    matrix: Cell[][] = [];

    currentCell: Cell | null = null;
    isFieldMined = true;

    constructor(data: FieldParams) {
        Object.assign(this, data);
        this.gameSettings.minesCount = {
            initial: data.gameSettings.minesCount,
            current: data.gameSettings.minesCount,
        };

        this.mouse.on('mousedown', this.mouseDownHandler);
        this.mouse.on('mouseup', this.mouseUpHandler);
        this.mouse.on('mousemove', this.mouseMoveHandler);
        this.mouse.on('mouseleave', this.mouseLeaveHandler);

        this.generateMatrix();
    }

    mouseDownHandler = () => {
        // const row = Math.floor(this.mouse.y / this.gameSettings.cellSize);
        // const col = Math.floor(this.mouse.x / this.gameSettings.cellSize);
        // this.matrix[row][col].isOpen = true;
    };

    mouseUpHandler = () => {
        const { isOpen } = this.currentCell as Cell;

        if (this.mouse.button === 'left' && this.currentCell) {
            if (this.isFieldMined) {
                const cellsToNotMine = [
                    this.currentCell,
                    ...this.getCellsAround(this.currentCell),
                ];

                this.mineMatrix(cellsToNotMine);

                this.isFieldMined = false;
            }

            if (!isOpen) {
                this.open(this.currentCell);
            }
        } else if (this.mouse.button === 'right' && this.currentCell) {
            if (!isOpen) {
                this.currentCell.isFlag = !this.currentCell.isFlag;
            }
        }

        this.clearCanvas();
        this.draw();
    };

    mouseMoveHandler = () => {
        const row = Math.floor(this.mouse.y / this.gameSettings.cellSize);
        const col = Math.floor(this.mouse.x / this.gameSettings.cellSize);

        const cell = this.matrix[row][col];

        if (!cell.isOpen) {
            this.changePointer(PointerTypes.Pointer);
        } else {
            this.changePointer(PointerTypes.Default);
        }

        if (cell !== this.currentCell) {
            cell.mouseEnterHandler(this.context, this.render);
            this.currentCell?.mouseLeaveHandler(this.context, this.render);

            this.currentCell = cell;
        }
    };

    mouseLeaveHandler = () => {
        if (this.currentCell) {
            this.currentCell.mouseLeaveHandler(this.context, this.render);

            this.currentCell = null;
        }
    };

    draw = () => {
        this.drawCells();
        this.drawLines();
    };

    drawCells() {
        for (const row of this.matrix) {
            for (const cell of row) {
                cell.draw(this.context);
            }
        }
    }

    drawLines() {
        const { context } = this;

        const spaceBetweenLines = 20;
        const linesLength = 30;
        // const spaceBetweenLines = (dpiWidth - linesLength * columns) / columns;
        const {
            gameSettings: { rows, columns, cellSize },
        } = this;

        context.strokeStyle = colors.stroke.toString();
        context.lineWidth = 1;

        // horizontal
        for (let i = 1; i < rows; i++) {
            const y = cellSize * i;

            for (let j = 0; j < columns; j++) {
                let x = spaceBetweenLines / 2 + j * cellSize;
                context.moveTo(x, y);
                context.lineTo(x + linesLength, y);
            }
        }

        // vertical
        for (let i = 1; i < columns; i++) {
            const x = cellSize * i;

            for (let j = 0; j < rows; j++) {
                const y = spaceBetweenLines / 2 + j * cellSize;
                context.moveTo(x, y);
                context.lineTo(x, y + linesLength);
            }
        }

        context.stroke();
    }

    generateMatrix() {
        const {
            matrix,
            gameSettings: { rows, columns, cellSize },
        } = this;

        for (let i = 0; i < rows; i++) {
            const row: Cell[] = [];
            for (let j = 0; j < columns; j++) {
                row.push(
                    new Cell({
                        clearCanvas: this.clearCanvas,
                        positionInMatrix: { y: i, x: j },
                        coords: {
                            y: i * cellSize,
                            x: j * cellSize,
                        },
                        size: cellSize,
                        drawSize: cellSize - 10,
                    })
                );
            }

            matrix.push(row);
        }
    }

    getCellsAround(cell: Cell) {
        const {
            positionInMatrix: { y, x },
        } = cell;
        const cellsAround: Cell[] = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;

                const cell = this.matrix?.[y + dy]?.[x + dx];

                if (cell) {
                    cellsAround.push(cell);
                }
            }
        }

        return cellsAround;
    }

    mineMatrix(cellsToNotMine: Cell[]) {
        const {
            gameSettings: {
                rows,
                columns,
                minesCount: { initial: minesCount },
            },
        } = this;

        const minedCells: Cell[] = [];
        for (let i = 0; i < minesCount; i++) {
            let randomY = randomInteger(0, rows - 1);
            let randomX = randomInteger(0, columns - 1);
            let randomCell = this.matrix[randomY][randomX];
            while (
                minedCells.includes(randomCell) ||
                cellsToNotMine.includes(randomCell)
            ) {
                randomY = randomInteger(0, rows - 1);
                randomX = randomInteger(0, columns - 1);
                randomCell = this.matrix[randomY][randomX];
            }

            minedCells.push(randomCell);

            randomCell.isMine = true;

            this.getCellsAround(randomCell).forEach((cell) => {
                cell.number += 1;
            });
        }
    }

    open(cell: Cell) {
        if (!cell.isMine && !cell.isFlag && !cell.isOpen) {
            cell.isOpen = true;

            if (cell.number === 0) {
                this.getCellsAround(cell).forEach((item) => {
                    this.open(item);
                });
            }
        } else if (cell.isMine) {
            console.log('lose');
        }
    }
}
