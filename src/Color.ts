export class Color {
    r!: number;
    g!: number;
    b!: number;
    a!: number;

    constructor(r: number, g: number, b: number, a: number = 1) {
        Object.assign(this, { r, g, b, a });
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
