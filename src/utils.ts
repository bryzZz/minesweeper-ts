export const isPointInRect = (
    point: {
        x: number;
        y: number;
    },
    rect: { x: number; y: number; width: number; height: number }
) => {
    return (
        rect.y < point.y &&
        rect.y + rect.height > point.y &&
        rect.x < point.x &&
        rect.x + rect.width > point.x
    );
};

export const randomInteger = (min: number, max: number) => {
    const rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
};
