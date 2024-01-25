import {XComConfig} from "../../config";


export const CommandPreprocessArgs = function (preprocess: (args: Record<string, any>) => Record<string, any>|void): MethodDecorator {
	return function (target: object, propertyKey: string | symbol) {
		XComConfig.set(target.constructor, cmdSet => {
			const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
			cmd.preprocess = preprocess;
			return cmdSet;
		});
	};
};
