import {xcomCfg} from "../../x-com-cfg";

export const CommandAuthenticated = (status: boolean = true): MethodDecorator => {
	return function (target, propertyKey) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "authenticated"],
			status
		);
	};
};