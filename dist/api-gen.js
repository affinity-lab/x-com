"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGen = void 0;
const ts_morph_1 = require("ts-morph");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
function apiGen(src, commandResolver, output) {
    const project = new ts_morph_1.Project({
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
    }, []);
    const commands = {};
    allClasses.forEach((classDeclaration) => {
        if (classDeclaration.getDecorators().some((decorator) => decorator.getName() === "XCom")) {
            const methods = classDeclaration.getMethods();
            for (const method of methods) {
                if (method.getDecorators().some((decorator) => decorator.getName() === "Command")) {
                    let cArgs = "", cFiles = "", cRet = "";
                    let args = method.getParameters();
                    if (args.length > 0)
                        cArgs = args[0].getType().getText();
                    if (args.length > 2)
                        cFiles = args[2].getName();
                    cRet = method.getReturnType().getText();
                    commands[classDeclaration.getName() + ":" + method.getName()] = { args: cArgs, files: cFiles, ret: cRet };
                }
            }
        }
    });
    const commandMetadata = JSON.parse(JSON.stringify(commandResolver.resolvers));
    for (const clientKey in commandMetadata) {
        const client = commandMetadata[clientKey];
        for (const versionKey in client) {
            const groups = {};
            const version = client[versionKey];
            for (const cmdKey in version) {
                const cmd = version[cmdKey];
                cmd.types = commands[cmd.class + ":" + cmd.func];
                let [group, command] = cmdKey.split(".");
                if (!groups.hasOwnProperty(group))
                    groups[group] = {};
                groups[group][command] = cmd.types;
            }
            let api = `export type API_${clientKey.toUpperCase()}_${versionKey} = {\n`;
            for (const groupKey in groups) {
                api += `\t${groupKey}:{\n`;
                for (const commandKey in groups[groupKey]) {
                    const command = groups[groupKey][commandKey];
                    const args = [];
                    if (command.args !== "undefined")
                        args.push(`args: ${command.args}`);
                    const fileArgs = [];
                    if (command.files) {
                        const files = command.files.slice(1, -1).replaceAll(" ", "").split(",");
                        for (const file of files)
                            fileArgs.push(`${file}?: any[]`);
                    }
                    if (fileArgs.length)
                        args.push(`files: {${fileArgs.join(", ")}}`);
                    api += `\t\t${commandKey}: (${args.join(", ")})=>${command.ret}\n`;
                }
                api += `\t}\n`;
            }
            api += "}\n\n";
            api += `export function api${clientKey.charAt(0).toUpperCase() + clientKey.slice(1)}${versionKey}Factory(fetcher:(args?:any, files?: any)=>Promise<any>):API_${clientKey.toUpperCase()}_${versionKey}{\n`;
            api += "\t return {\n";
            for (const groupKey in groups) {
                api += `\t\t${groupKey}:{\n`;
                for (const commandKey in groups[groupKey]) {
                    const command = groups[groupKey][commandKey];
                    let method = "";
                    if (command.args === "undefined" && command.files === "")
                        method = `()=>fetcher('${groupKey}.${commandKey}')`;
                    if (command.args !== "undefined" && command.files !== "")
                        method = `(args:any, files?: Record<string, string[]>)=>fetcher('${groupKey}.${commandKey}', args, files)`;
                    if (command.args === "undefined" && command.files !== "")
                        method = `(files?: Record<string, string[]>)=>fetcher('${groupKey}.${commandKey}', undefined, files)`;
                    if (command.args !== "undefined" && command.files === "")
                        method = `(args:any)=>fetcher('${groupKey}.${commandKey}', args)`;
                    api += `\t\t\t${commandKey}: ${method},\n`;
                }
                api += `\t\t},\n`;
            }
            api += "\t}\n";
            api += "}\n";
            fs.writeFileSync(path_1.default.join(output, `api-${clientKey}-${versionKey}.ts`), api);
        }
    }
    fs.writeFileSync(path_1.default.join(output, "api.json"), JSON.stringify(commandMetadata, null, 2));
}
exports.apiGen = apiGen;
//# sourceMappingURL=api-gen.js.map