import { Application } from './Application';
import './style.css';

const app = new Application({
    root: document.querySelector('#field') as HTMLDivElement,
    background: 'transparent',
    bombsCounter: document.querySelector('#bombs-counter') as HTMLElement,
});
