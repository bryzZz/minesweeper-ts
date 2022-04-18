import { Application } from './Application';
import './style.css';

const app = new Application({
    root: document.querySelector('#field') as HTMLDivElement,
    bombsCounter: document.querySelector('#bombs-counter') as HTMLElement,
    gameSettings: {
        rows: 10,
        columns: 10,
        cellSize: 50,
        minesCount: 10,
    },
});
