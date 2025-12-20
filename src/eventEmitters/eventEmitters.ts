type TListener<T> = (args: T) => void;

export class EventEmitters<T> {
    private listeners: TListener<T>[] = [];

    subscibe(listener: TListener<T>) {
        this.listeners.push(listener);
        // console.log("subscribe this.listeners=", this.listeners);
    }

    emit(args: T) {
        this.listeners.forEach((listener) => listener(args));
        // console.log("emit this.listeners=", this.listeners);
    }
}
