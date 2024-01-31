import {xcomCfg} from "../../x-com-cfg";
import {CacheOptions} from "../../types";

export const CommandCache = (cache: CacheOptions): MethodDecorator => {
	return function (target, propertyKey) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "cache"],
			cache
		);
	};
};