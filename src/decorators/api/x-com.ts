import {xcomCfg} from "../../x-com-cfg";

export const XCom = (alias?: string): ClassDecorator => {
	return function (target) {
		xcomCfg.metadataStore.get(target, true).set("xcom.alias", alias ? alias : target.name);
	};
};