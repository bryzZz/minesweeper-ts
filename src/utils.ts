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
