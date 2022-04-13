import { Canvas } from './Canvas';
import { Field } from './Field';
import { Mouse } from './Mouse';
import { Render } from './Render';
import { isPointInRect } from './utils';

type ApplicationParams = {
    root: HTMLDivElement;
    background: string;
    bombsCounter: HTMLElement;
    rows?: number;
    columns?: number;
};

export class Application {
    root!: HTMLDivElement;
    bombsCounter!: HTMLElement;
    canvas!: Canvas;
    render!: Render;
    field!: Field;
    mouse!: Mouse;

    constructor(data: ApplicationParams) {
        this.root = data.root;
        this.bombsCounter = data.bombsCounter;
        this.canvas = new Canvas({ background: data.background });
        this.render = new Render();
        this.mouse = new Mouse(this.canvas.element);
        this.field = new Field({
            mouse: this.mouse,
            rows: data.rows || 10,
            columns: data.columns || 10,
        });

        this.root.append(this.canvas.element);
        this.canvas.resize();
        this.canvas.clear();

        this.render.subscribe((renderData) => {
            this.canvas.clear();

            this.canvas.draw((context, canvas) => {
                const cellSize = this.canvas.width / this.field.columns;

                for (let i = 0; i < this.field.rows; i++) {
                    for (let j = 0; j < this.field.columns; j++) {
                        const cell = this.field.matrix[i][j];
                        const y = i * cellSize;
                        const x = j * cellSize;

                        context.beginPath();

                        context.rect(x, y, cellSize, cellSize);
                        if (
                            isPointInRect(
                                { x: this.mouse.x, y: this.mouse.y },
                                { x, y, width: cellSize, height: cellSize }
                            )
                        ) {
                            context.fillStyle = 'white';
                        } else {
                            context.fillStyle = 'yellow';
                        }
                        context.fill();

                        if (cell.isOpen) {
                            context.fillStyle = 'black';
                            context.font = `${16}px ${'Arial'}`;

                            context.fillText(
                                cell.number.toString(),
                                x + cellSize / 2.9,
                                y + cellSize / 1.5
                            );
                        }

                        context.closePath();
                    }
                }
            });
        });
    }
}
