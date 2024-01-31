import {xcomCfg} from "../../x-com-cfg";

export const XComAuthenticated = (status: boolean = true): ClassDecorator => {
	return function (target) {
		xcomCfg.metadataStore.get(target, true).set("xcom.authenticated", status);
	};
};
