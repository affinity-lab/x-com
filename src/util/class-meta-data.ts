import { unflatten } from 'uni-flatten';


type Constructor = (new () => Object) | Function;

type ClassMetaDataStore = Record<string, SingleStore | ArrayStore>;

class ObjectStore {public value: Record<string, any> = {};}

class SingleStore {public value: any;}

class ArrayStore {public value: any[] = [];}

export class MetaValue {
	readonly self: any = undefined;
	readonly inherited: Array<any> = [];
	constructor(readonly value: any, self: boolean = false) {
		if (self) this.self = value;
		this.inherited.push(value);
	}
}

class MetaDataStore {
	records: ClassMetaDataStore = {};
	constructor(readonly target: Constructor) {}

	merge(key: string | string[], value: Record<string, any>) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new ObjectStore();
		if (!(this.records[key] instanceof ObjectStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value = {...this.records[key], ...value};
	}
	set(key: string | string[], value: any) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new SingleStore();
		if (!(this.records[key] instanceof SingleStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value = value;
	}
	push(key: string | string[], value: any) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new ArrayStore();
		if (!(this.records[key] instanceof ArrayStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value.push(value);
	}
	delete(key: string | string[]) { delete (this.records[this.key(key)]);}
	private key(key: string | string[]) {return Array.isArray(key) ? key.join(".") : key;}
}


export class ClassMetaData {

	stores: Array<MetaDataStore> = [];

	constructor() {}

	get(target: Constructor): MetaDataStore | undefined ;
	get(target: Constructor, create: false): MetaDataStore | undefined ;
	get(target: Constructor, create: true): MetaDataStore ;
	get(target: Constructor, create: boolean = false): MetaDataStore | undefined {
		for (const store of this.stores) if (store.target === target) return store;
		const store = new MetaDataStore(target);
		if (create) this.stores.push(store);
		return store;
	}
	read(target: Constructor, options: { flatten?: boolean, simple?: boolean } = {}): undefined | Record<string, any> {
		options = {...{flatten: false, simple: true}, ...options};

		const result: Record<string, { value: any, self: any, inherited: Array<any> }> = {};
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
					} else {
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

		return options.flatten ? result : unflatten(result);
	}
}

