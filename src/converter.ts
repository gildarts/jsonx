import * as xj from 'xml-js';

export function toJson(xmlString: string): xj.ElementCompact {
    return xj.xml2js(xmlString, { compact: true });
}

export function toXml(jsonObj: xj.ElementCompact, rootName?: string) {

    if (rootName) {
        const root: any = {};
        root[rootName] = jsonObj;
        return xj.js2xml(root, { compact: true, spaces: 4 });
    } else {
        return xj.js2xml(jsonObj, { compact: true, spaces: 4 });
    }
}
