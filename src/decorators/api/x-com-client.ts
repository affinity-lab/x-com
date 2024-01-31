import {xcomCfg} from "../../x-com-cfg";
import {IClient} from "../../types";

export const XComClient = (client: IClient, version: number | Array<number> = 1): ClassDecorator => {
	return function (target) {
		xcomCfg.metadataStore.get(target, true).push("xcom.clients", {client, version});
	};
};
