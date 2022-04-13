import { Observer } from './Observer';

type Subscriber = (data: Render) => void;

export class Render extends Observer<Subscriber> {
    timestamp: number = 0;
    pTimestamp: number = 0;
    fps: number = 0;
    secondPart: number = 0;

    constructor() {
        super();

        requestAnimationFrame((timestamp) => this.tick(timestamp));
    }

    tick(timestamp: number) {
        requestAnimationFrame((timestamp) => this.tick(timestamp));

        Object.assign(this, {
            timestamp,
            pTimestamp: this.timestamp,
            fps: 1000 / (timestamp - this.pTimestamp),
            secondPart: (timestamp - this.pTimestamp) / 1000,
        });

        this.dispatch(this);
    }
}
