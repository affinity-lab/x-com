import {z} from "zod";
import {XComConfig} from "../../config";
import {ExtendedError} from "@affinity-lab/affinity-util"

export const CommandValidateZod = function (zodPattern: z.ZodObject<any>): MethodDecorator {
	return function (target: object, propertyKey: string | symbol) {
		XComConfig.set(target.constructor, cmdSet => {
			const cmd = cmdSet.getCmd(propertyKey);
			cmd.validate = (args: Record<string, any>) => {
				let parsed = zodPattern.safeParse(args);
				if (!parsed.success) throw new ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues);
				return parsed.data;
			};
			return cmdSet;
		});
	};
};