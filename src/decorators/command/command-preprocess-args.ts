import {xcomCfg} from "../../x-com-cfg";


export const CommandPreprocessArgs = function (preprocess: (args: Record<string, any>) => Record<string, any>|void): MethodDecorator {
	return function (target: object, propertyKey: string | symbol) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "preprocess"],
			preprocess
		);
	};
};
