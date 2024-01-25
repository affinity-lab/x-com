import {XComConfig} from "../../config";

export const CommandAuthenticated = (status: boolean = true): MethodDecorator => {
	return function (target, propertyKey) {
		XComConfig.set(target.constructor, cmdSet => {
			const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
			cmd.authenticated = status;
			return cmdSet;
		});
	};
};