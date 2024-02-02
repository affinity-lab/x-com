"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMetaData = exports.MetaValue = void 0;
const uni_flatten_1 = require("uni-flatten");
class ObjectStore {
    value = {};
}
class SingleStore {
    value;
}
class ArrayStore {
    value = [];
}
class MetaValue {
    value;
    self = undefined;
    inherited = [];
    constructor(value, self = false) {
        this.value = value;
        if (self)
            this.self = value;
        this.inherited.push(value);
    }
}
exports.MetaValue = MetaValue;
class MetaDataStore {
    target;
    records = {};
    constructor(target) {
        this.target = target;
    }
    merge(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ObjectStore();
        if (!(this.records[key] instanceof ObjectStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value = { ...this.records[key], ...value };
    }
    set(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new SingleStore();
        if (!(this.records[key] instanceof SingleStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value = value;
    }
    push(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ArrayStore();
        if (!(this.records[key] instanceof ArrayStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value.push(value);
    }
    delete(key) { delete (this.records[this.key(key)]); }
    key(key) { return Array.isArray(key) ? key.join(".") : key; }
}
class ClassMetaData {
    stores = [];
    constructor() { }
    get(target, create = false) {
        for (const store of this.stores)
            if (store.target === target)
                return store;
        const store = new MetaDataStore(target);
        if (create)
            this.stores.push(store);
        return store;
    }
    read(target, options = {}) {
        options = { ...{ flatten: false, simple: true }, ...options };
        const result = {};
        let store = this.get(target);
        if (store !== undefined) {
            for (const key in store.records) {
                result[key] = new MetaValue(store.records[key].value, true);
            }
        }
        target = Object.getPrototypeOf(target);
        while (target) {
            store = this.get(target);
            if (store !== undefined) {
                for (const key in store.records) {
                    if (result.hasOwnProperty(key)) {
                        result[key].inherited.push(store.records[key].value);
                    }
                    else {
                        result[key] = new MetaValue(store.records[key].value, false);
                    }
                }
            }
            target = Object.getPrototypeOf(target);
        }
        if (options.simple) {
            for (const key in result) {
                result[key] = result[key].value;
            }
        }
        return options.flatten ? result : (0, uni_flatten_1.unflatten)(result);
    }
}
exports.ClassMetaData = ClassMetaData;
//# sourceMappingURL=class-meta-data.js.map