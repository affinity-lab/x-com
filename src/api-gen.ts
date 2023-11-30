import {ClassDeclaration, Project} from "ts-morph";
import * as fs from "fs";
import path from "path";
import {CommandResolver} from "./command-resolver";


export function apiGen(src: string, commandResolver: CommandResolver, output: string) {

	const project = new Project({
		compilerOptions: {
			strictNullChecks: true
		}
	});
	project.addSourceFilesAtPaths(src);

	const sourceFiles = project.getSourceFiles();
	const filteredSourceFiles = sourceFiles.filter((file) => !file.isDeclarationFile() && !file.isFromExternalLibrary());
	const allClasses = filteredSourceFiles.reduce((classes, sourceFile) => {
		const fileClasses = sourceFile.getClasses();
		return classes.concat(fileClasses);
	}, [] as ClassDeclaration[]);

	const commands: Record<string, { args?: string, files?: string, ret?: string }> = {};

	allClasses.forEach((classDeclaration) => {
		if (classDeclaration.getDecorators().some((decorator) => decorator.getName() === "XCom")) {
			const methods = classDeclaration.getMethods();
			for (const method of methods) {
				if (method.getDecorators().some((decorator) => decorator.getName() === "Command")) {
					let cArgs: string = "", cFiles: string = "", cRet: string = "";
					let args = method.getParameters();
					if (args.length > 0) cArgs = args[0].getType().getText();
					if (args.length > 2) cFiles = args[2].getName();
					cRet = method.getReturnType().getText();
					commands[classDeclaration.getName() + ":" + method.getName()] = {args: cArgs, files: cFiles, ret: cRet};
				}
			}
		}
	});

	const commandMetadata = JSON.parse(JSON.stringify(commandResolver.resolvers));

	for (const clientKey in commandMetadata) {
		const client = commandMetadata[clientKey];
		for (const versionKey in client) {

			const groups: Record<string, any> = {};
			const version = client[versionKey];
			for (const cmdKey in version) {
				const cmd = version[cmdKey];
				cmd.types = commands[cmd.class + ":" + cmd.func];
				let [group, command] = cmdKey.split(".");
				if (!groups.hasOwnProperty(group)) groups[group] = {};
				groups[group][command] = cmd.types;
			}

			let api = `export type API_${clientKey.toUpperCase()}_${versionKey} = {\n`;
			for (const groupKey in groups) {
				api += `\t${groupKey}:{\n`;
				for (const commandKey in groups[groupKey]) {
					const command = groups[groupKey][commandKey];
					const args = [];
					if (command.args !== "undefined") args.push(`args: ${command.args}`);
					const fileArgs = [];
					if (command.files) {
						const files = command.files.slice(1, -1).replaceAll(" ", "").split(",");
						for (const file of files) fileArgs.push(`${file}?: any[]`);
					}
					if (fileArgs.length) args.push(`files: {${fileArgs.join(", ")}}`);
					api += `\t\t${commandKey}: (${args.join(", ")})=>${command.ret}\n`;
				}
				api += `\t}\n`;
			}
			api += "}\n\n";
			api += `export function api${clientKey.charAt(0).toUpperCase() + clientKey.slice(1)}${versionKey}Factory(cmd:string, fetcher:(args?:any, files?: any)=>Promise<any>):API_${clientKey.toUpperCase()}_${versionKey}{\n`;
			api += "\t return {\n";
			for (const groupKey in groups) {
				api += `\t\t${groupKey}:{\n`;
				for (const commandKey in groups[groupKey]) {
					const command = groups[groupKey][commandKey];
					let method = "";
					if (command.args === "undefined" && command.files === "") method = `()=>fetcher('${groupKey}.${commandKey}')`;
					if (command.args !== "undefined" && command.files !== "") method = `(args:any, files?: Record<string, string[]>)=>fetcher('${groupKey}.${commandKey}', args, files)`;
					if (command.args === "undefined" && command.files !== "") method = `(files?: Record<string, string[]>)=>fetcher('${groupKey}.${commandKey}', undefined, files)`;
					if (command.args !== "undefined" && command.files === "") method = `(args:any)=>fetcher('${groupKey}.${commandKey}', args)`;
					api += `\t\t\t${commandKey}: ${method},\n`;
				}
				api += `\t\t},\n`;
			}
			api += "\t}\n";
			api += "}\n";

			fs.writeFileSync(path.join(output, `api-${clientKey}-${versionKey}.ts`), api);
		}
	}
	fs.writeFileSync(path.join(output, "api.json"), JSON.stringify(commandMetadata, null, 2));
}
