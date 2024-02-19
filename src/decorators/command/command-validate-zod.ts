import {z} from "zod";
import {ExtendedError} from "@affinity-lab/affinity-util";
import {xcomCfg} from "../../x-com-cfg";

export const CommandValidateZod = function (zodPattern: z.ZodObject<any>): MethodDecorator {
	return function (target: object, propertyKey: string | symbol) {
		xcomCfg.metadataStore.get(target.constructor, true).set(
			["command", propertyKey.toString(), "validator"],
			(args: Record<string, any>) => {
				let parsed = zodPattern.safeParse(args);
				if (!parsed.success) throw new ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues, 400);
				return parsed.data;
			}
		);
	};
};