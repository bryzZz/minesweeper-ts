import { Canvas } from './Canvas';
import { Field } from './Field';
import { Mouse } from './Mouse';
import { Render } from './Render';

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
        this.canvas = new Canvas({
            background: data.background,
            root: this.root,
        });
        this.render = new Render();
        this.mouse = new Mouse(this.canvas.element);
        this.field = new Field({
            mouse: this.mouse,
            rows: data.rows || 10,
            columns: data.columns || 10,
            cellSize: this.canvas.width / (data.columns || 10),
        });

        this.render.subscribe((renderData) => {
            this.canvas.clear();

            this.canvas.draw((context, canvas) => {
                this.field.draw(context, canvas);
            });
        });
    }
}
