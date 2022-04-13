export class EventEmitter<T extends Event> {
    handlers = new Map<T['type'], Set<Function>>();

    on(eventName: T['type'], handler: (e: T) => any) {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, new Set());
        }

        this.handlers.get(eventName)?.add(handler);
    }

    off(eventName: T['type'], handler: (e: T) => any) {
        if (!this.handlers.has(eventName)) {
            return;
        }

        const handlers = this.handlers.get(eventName);
        handlers?.delete(handler);

        if (handlers?.size === 0) {
            this.handlers.delete(eventName);
        }
    }

    emit(eventName: T['type'], event: T) {
        if (this.handlers.has(eventName)) {
            const handlers = this.handlers.get(eventName);

            if (handlers) {
                for (const handler of handlers.values()) {
                    handler(event);
                }
            }
        }
    }
}
