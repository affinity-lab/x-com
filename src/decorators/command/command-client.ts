import {xcomCfg} from "../../x-com-cfg";
import {CacheOptions, IClient} from "../../types";

export const CommandClient = (client: IClient, version: number | Array<number> = 1, cache: boolean | CacheOptions = true): MethodDecorator => {
	return function (target, propertyKey) {
		xcomCfg.metadataStore.get(target.constructor, true).push(
			["command", propertyKey.toString(), "clients"],
			{client, version, cache}
		);
	};
};