type Constructor = (new () => Object) | Function;
type ReflektorEntry<T> = {target: Constructor, value: T}

export class Reflektor<T> {
	storage: Array<{target: Constructor, value: T}> = [];

	get(target: Constructor): ReflektorEntry<T> | undefined
	get(target: Constructor, def: () => T): ReflektorEntry<T>
	get(target: Constructor, def?: () => T): ReflektorEntry<T> | undefined {
		for (let entry of this.storage) if(target === entry.target) return entry;
		if(!def) return undefined;
		let parent = Object.getPrototypeOf(target);
		while (parent) {
			let parentEntry = this.get(parent);
			if(parentEntry) {
				let clone = structuredClone(parentEntry.value);
				Object.setPrototypeOf(clone, Object.getPrototypeOf(parentEntry.value));
				// @ts-ignore
				clone.alias = target.name;
				return this.set(target, clone);
			}
			else parent = Object.getPrototypeOf(parent);
		}
		this.set(target, def());
		return this.get(target);
	}

	set(target: Constructor, value: T): ReflektorEntry<T> {
		let entry = this.get(target);
		if(!entry) {
			entry = {target, value}
			this.storage.push(entry);
		}
		else entry.value = value;
		return entry;
	}

}