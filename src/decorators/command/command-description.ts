import {XComConfig} from "../../config";

export const CommandDescription = (description: string): MethodDecorator => {
	return function (target, propertyKey) {
		XComConfig.set(target.constructor, cmdSet => {
			const cmd = cmdSet.getCmd(propertyKey);
			cmd.description = description;
			return cmdSet;
		});
	};
};