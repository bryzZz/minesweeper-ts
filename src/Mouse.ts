import { EventEmitter } from './EventEmitter';

enum Button {
    Left,
}

export class Mouse extends EventEmitter<MouseEvent> {
    element!: HTMLElement;

    x!: number;
    y!: number;

    left = false;

    constructor(element: HTMLElement) {
        super();

        this.element = element;

        this.element.addEventListener('mousedown', this.mouseDownHandler);
        this.element.addEventListener('mousemove', this.mouseMoveHandler);
        this.element.addEventListener('mouseup', this.mouseUpHandler);
        this.element.addEventListener('mouseleave', this.mouseLeaveHandler);
    }

    mouseDownHandler = (e: MouseEvent) => {
        if (e.button === Button.Left) {
            this.left = true;
        }

        this.emit('mousedown', e);
    };

    mouseUpHandler = (e: MouseEvent) => {
        if (e.button === Button.Left) {
            this.left = true;
        }

        this.emit('mouseup', e);
    };

    mouseMoveHandler = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top } = this.element.getBoundingClientRect();

        const x = clientX - left;
        const y = clientY - top;

        Object.assign(this, { x, y });

        this.emit('mousemove', e);
    };

    mouseLeaveHandler = (e: MouseEvent) => {
        this.emit('mouseleave', e);
    };
}
