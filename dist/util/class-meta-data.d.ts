type Constructor = (new () => Object) | Function;
type ClassMetaDataStore = Record<string, SingleStore | ArrayStore>;
declare class SingleStore {
    value: any;
}
declare class ArrayStore {
    value: any[];
}
export declare class MetaValue {
    readonly value: any;
    readonly self: any;
    readonly inherited: Array<any>;
    constructor(value: any, self?: boolean);
}
declare class MetaDataStore {
    readonly target: Constructor;
    records: ClassMetaDataStore;
    constructor(target: Constructor);
    merge(key: string | string[], value: Record<string, any>): void;
    set(key: string | string[], value: any): void;
    push(key: string | string[], value: any): void;
    delete(key: string | string[]): void;
    private key;
}
export declare class ClassMetaData {
    stores: Array<MetaDataStore>;
    constructor();
    get(target: Constructor): MetaDataStore | undefined;
    get(target: Constructor, create: false): MetaDataStore | undefined;
    get(target: Constructor, create: true): MetaDataStore;
    read(target: Constructor, options?: {
        flatten?: boolean;
        simple?: boolean;
    }): undefined | Record<string, any>;
}
export {};
