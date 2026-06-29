export namespace backend {
	
	export class AppData {
	    systemConstants: Record<string, any>;
	    generalConfig: Record<string, any>;
	    translations: any[];
	    cfr21: Record<string, any>;
	    roles: Record<string, any>;
	    modules: any[];
	    equipment: Record<string, Array<any>>;
	    buttons: any[];
	    cycleButtons: any[];
	    counters: any[];
	    faults: Record<string, any>;
	    messageBoxes: any[];
	    pages: Record<string, Array<any>>;
	
	    static createFrom(source: any = {}) {
	        return new AppData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.systemConstants = source["systemConstants"];
	        this.generalConfig = source["generalConfig"];
	        this.translations = source["translations"];
	        this.cfr21 = source["cfr21"];
	        this.roles = source["roles"];
	        this.modules = source["modules"];
	        this.equipment = source["equipment"];
	        this.buttons = source["buttons"];
	        this.cycleButtons = source["cycleButtons"];
	        this.counters = source["counters"];
	        this.faults = source["faults"];
	        this.messageBoxes = source["messageBoxes"];
	        this.pages = source["pages"];
	    }
	}
	export class Parameter {
	    name: string;
	    actif: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Parameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.actif = source["actif"];
	    }
	}
	export class Electrovalve {
	    name: string;
	    enable: boolean;
	    cycleTime: number;
	    cmdType: string;
	    centerType: string;
	    sensorType: string;
	    parameters: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new Electrovalve(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.enable = source["enable"];
	        this.cycleTime = source["cycleTime"];
	        this.cmdType = source["cmdType"];
	        this.centerType = source["centerType"];
	        this.sensorType = source["sensorType"];
	        this.parameters = this.convertValues(source["parameters"], Parameter);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

