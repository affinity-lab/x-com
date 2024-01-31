import {xcomCfg} from "./../../x-com-cfg";

export const Command = (alias?: string): MethodDecorator => {
	return function (target, propertyKey) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "alias"],
			alias||propertyKey.toString()
		);
	};
};