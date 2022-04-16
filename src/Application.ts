import { Canvas } from './Canvas';
import { Field } from './Field';
import { Mouse } from './Mouse';
import { Render } from './Render';

type ApplicationParams = {
    root: HTMLDivElement;
    bombsCounter: HTMLElement;
    gameSettings: {
        rows: number;
        columns: number;
        cellSize: number;
    };
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

        this.canvas = new Canvas(data.root);
        this.render = new Render();
        this.mouse = new Mouse(this.canvas.element);

        this.field = new Field({
            render: this.render,
            mouse: this.mouse,
            gameSettings: data.gameSettings,
        });

        this.canvas.draw((context, canvas) => {
            this.field.draw(context, canvas);
        });
    }
}
