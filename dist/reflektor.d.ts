type Constructor = (new () => Object) | Function;
type ReflektorEntry<T> = {
    target: Constructor;
    value: T;
};
export declare class Reflektor<T> {
    storage: Array<{
        target: Constructor;
        value: T;
    }>;
    get(target: Constructor): ReflektorEntry<T> | undefined;
    get(target: Constructor, def: () => T): ReflektorEntry<T>;
    set(target: Constructor, value: T): ReflektorEntry<T>;
}
export {};
