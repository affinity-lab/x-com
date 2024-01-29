"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reflektor = void 0;
class Reflektor {
    storage = [];
    get(target, def) {
        for (let entry of this.storage)
            if (target === entry.target)
                return entry;
        if (!def)
            return undefined;
        let parent = Object.getPrototypeOf(target);
        while (parent) {
            let parentEntry = this.get(parent);
            if (parentEntry) {
                let clone = structuredClone(parentEntry.value);
                // @ts-ignore
                clone.alias = target.name;
                return this.set(target, clone);
            }
            else
                parent = Object.getPrototypeOf(parent);
        }
        this.set(target, def());
        return this.get(target);
    }
    set(target, value) {
        let entry = this.get(target);
        if (!entry) {
            entry = { target, value };
            this.storage.push(entry);
        }
        else
            entry.value = value;
        return entry;
    }
}
exports.Reflektor = Reflektor;
//# sourceMappingURL=reflektor.js.map