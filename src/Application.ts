import { Canvas } from './Canvas';
import { Field } from './Field';
import { Mouse } from './Mouse';
import { Render } from './Render';
import { GameSettings } from './types';

type ApplicationParams = {
    root: HTMLDivElement;
    bombsCounter: HTMLElement;
    gameSettings: GameSettings;
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
            context: this.canvas.context,
            clearCanvas: this.canvas.clear,
            changePointer: this.canvas.changePointer,
            render: this.render,
            mouse: this.mouse,
            gameSettings: data.gameSettings,
        });

        this.canvas.whatToDrawWhenResize = this.field.draw;
        this.canvas.draw(this.field.draw);
    }
}
