export type GameSettings = {
    rows: number;
    columns: number;
    cellSize: number;
    minesCount: number;
};

export enum PointerTypes {
    Pointer = 'pointer',
    Default = 'default',
}

export type ClearCanvas = (
    y?: number,
    x?: number,
    width?: number,
    height?: number
) => void;
