import {xcomCfg} from "../../x-com-cfg";

export const CommandDescription = (description: string): MethodDecorator => {
	return function (target, propertyKey) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "description"],
			description
		);
	};
};