export namespace models {
	
	export class MessageBoxEntityUI {
	    showTitle: boolean;
	    showLine1: boolean;
	    showLine2: boolean;
	    showBtnLeft: boolean;
	    showBtnRight: boolean;
	
	    static createFrom(source: any = {}) {
	        return new MessageBoxEntityUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.showTitle = source["showTitle"];
	        this.showLine1 = source["showLine1"];
	        this.showLine2 = source["showLine2"];
	        this.showBtnLeft = source["showBtnLeft"];
	        this.showBtnRight = source["showBtnRight"];
	    }
	}
	export class MessageBoxEntity {
	    name: string;
	    id: string;
	    index: number;
	    ui: MessageBoxEntityUI;
	    title: Parameter;
	    line1: Parameter;
	    line2: Parameter;
	    btnLeft: Parameter;
	    btnRight: Parameter;
	
	    static createFrom(source: any = {}) {
	        return new MessageBoxEntity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.index = source["index"];
	        this.ui = this.convertValues(source["ui"], MessageBoxEntityUI);
	        this.title = this.convertValues(source["title"], Parameter);
	        this.line1 = this.convertValues(source["line1"], Parameter);
	        this.line2 = this.convertValues(source["line2"], Parameter);
	        this.btnLeft = this.convertValues(source["btnLeft"], Parameter);
	        this.btnRight = this.convertValues(source["btnRight"], Parameter);
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
	export class FaultCategory {
	    name: string;
	    ui: CounterGroupUI;
	    items: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new FaultCategory(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.ui = this.convertValues(source["ui"], CounterGroupUI);
	        this.items = this.convertValues(source["items"], Parameter);
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
	export class FaultGroup {
	    name: string;
	    id: string;
	    categories: FaultCategory[];
	
	    static createFrom(source: any = {}) {
	        return new FaultGroup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.categories = this.convertValues(source["categories"], FaultCategory);
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
	export class CounterGroupUI {
	    show: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CounterGroupUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.show = source["show"];
	    }
	}
	export class CounterGroup {
	    name: string;
	    id: string;
	    ui: CounterGroupUI;
	    parameters: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new CounterGroup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.ui = this.convertValues(source["ui"], CounterGroupUI);
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
	export class CycleButtonEntityUI {
	    showCycles: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CycleButtonEntityUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.showCycles = source["showCycles"];
	    }
	}
	export class CycleButtonEntity {
	    name: string;
	    id: string;
	    linkedTo: string;
	    ui: CycleButtonEntityUI;
	    cycles: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new CycleButtonEntity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.linkedTo = source["linkedTo"];
	        this.ui = this.convertValues(source["ui"], CycleButtonEntityUI);
	        this.cycles = this.convertValues(source["cycles"], Parameter);
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
	export class ButtonEntityUI {
	    showToggles: boolean;
	    showMomentaries: boolean;
	
	    static createFrom(source: any = {}) {
	        return new ButtonEntityUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.showToggles = source["showToggles"];
	        this.showMomentaries = source["showMomentaries"];
	    }
	}
	export class ButtonEntity {
	    name: string;
	    id: string;
	    linkedTo: string;
	    ui: ButtonEntityUI;
	    toggleButtons: Parameter[];
	    momentaryButtons: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new ButtonEntity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.id = source["id"];
	        this.linkedTo = source["linkedTo"];
	        this.ui = this.convertValues(source["ui"], ButtonEntityUI);
	        this.toggleButtons = this.convertValues(source["toggleButtons"], Parameter);
	        this.momentaryButtons = this.convertValues(source["momentaryButtons"], Parameter);
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
	export class CycleStep {
	    commentFr: string;
	    commentEn: string;
	    commentDe: string;
	    commentEs: string;
	    reserve1: string;
	    reserve2: string;
	    stepId: number;
	
	    static createFrom(source: any = {}) {
	        return new CycleStep(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.commentFr = source["commentFr"];
	        this.commentEn = source["commentEn"];
	        this.commentDe = source["commentDe"];
	        this.commentEs = source["commentEs"];
	        this.reserve1 = source["reserve1"];
	        this.reserve2 = source["reserve2"];
	        this.stepId = source["stepId"];
	    }
	}
	export class int {
	
	
	    static createFrom(source: any = {}) {
	        return new int(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}
	export class Parameter {
	    name: string;
	    commentFr: string;
	    commentEn: string;
	    commentDe: string;
	    commentEs: string;
	    reserve1: string;
	    reserve2: string;
	    detail: string;
	    id: number;
	    actif: boolean;
	    resetVisible?: boolean;
	    robotMask: string;
	    robotVarIndex: Record<string, number>;
	    robotVarName?: string;
	    steps?: CycleStep[];
	    faultCode?: string;
	    severity?: number;
	    value?: any;
	
	    static createFrom(source: any = {}) {
	        return new Parameter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.commentFr = source["commentFr"];
	        this.commentEn = source["commentEn"];
	        this.commentDe = source["commentDe"];
	        this.commentEs = source["commentEs"];
	        this.reserve1 = source["reserve1"];
	        this.reserve2 = source["reserve2"];
	        this.detail = source["detail"];
	        this.id = source["id"];
	        this.actif = source["actif"];
	        this.resetVisible = source["resetVisible"];
	        this.robotMask = source["robotMask"];
	        this.robotVarIndex = source["robotVarIndex"];
	        this.robotVarName = source["robotVarName"];
	        this.steps = this.convertValues(source["steps"], CycleStep);
	        this.faultCode = source["faultCode"];
	        this.severity = source["severity"];
	        this.value = source["value"];
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
	export class MachineModuleUI {
	    showModuleProps: boolean;
	    showBools: boolean;
	    showInts: boolean;
	    showReals: boolean;
	    showStrings: boolean;
	
	    static createFrom(source: any = {}) {
	        return new MachineModuleUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.showModuleProps = source["showModuleProps"];
	        this.showBools = source["showBools"];
	        this.showInts = source["showInts"];
	        this.showReals = source["showReals"];
	        this.showStrings = source["showStrings"];
	    }
	}
	export class MachineModule {
	    name: string;
	    commentFr: string;
	    commentEn: string;
	    commentDe: string;
	    commentEs: string;
	    reserve1: string;
	    reserve2: string;
	    detail: string;
	    id: string;
	    index: number;
	    enable: boolean;
	    isEM: boolean;
	    ui: MachineModuleUI;
	    paramBools: Parameter[];
	    paramInts: Parameter[];
	    paramReals: Parameter[];
	    paramStrings: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new MachineModule(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.commentFr = source["commentFr"];
	        this.commentEn = source["commentEn"];
	        this.commentDe = source["commentDe"];
	        this.commentEs = source["commentEs"];
	        this.reserve1 = source["reserve1"];
	        this.reserve2 = source["reserve2"];
	        this.detail = source["detail"];
	        this.id = source["id"];
	        this.index = source["index"];
	        this.enable = source["enable"];
	        this.isEM = source["isEM"];
	        this.ui = this.convertValues(source["ui"], MachineModuleUI);
	        this.paramBools = this.convertValues(source["paramBools"], Parameter);
	        this.paramInts = this.convertValues(source["paramInts"], Parameter);
	        this.paramReals = this.convertValues(source["paramReals"], Parameter);
	        this.paramStrings = this.convertValues(source["paramStrings"], Parameter);
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
	export class HardwareChannel {
	    channelNumber: number;
	
	    static createFrom(source: any = {}) {
	        return new HardwareChannel(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.channelNumber = source["channelNumber"];
	    }
	}
	export class HardwareModule {
	    name: string;
	    moduleType: string;
	    category: string;
	    nodeNumber: number;
	    axesCount: number;
	    channels: HardwareChannel[];
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new HardwareModule(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.moduleType = source["moduleType"];
	        this.category = source["category"];
	        this.nodeNumber = source["nodeNumber"];
	        this.axesCount = source["axesCount"];
	        this.channels = this.convertValues(source["channels"], HardwareChannel);
	        this.description = source["description"];
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
	export class AppData {
	    schemaVersion?: number;
	    systemConstants: Record<string, any>;
	    generalConfig: Record<string, any>;
	    translations: any[];
	    cfr21: Record<string, any>;
	    roles: Record<string, any>;
	    detectedHardware: HardwareModule[];
	    modules: MachineModule[];
	    equipment: Record<string, Array<any>>;
	    buttons: ButtonEntity[];
	    cycleButtons: CycleButtonEntity[];
	    counters: CounterGroup[];
	    faults: Record<string, FaultGroup>;
	    messageBoxes: MessageBoxEntity[];
	    pages: Record<string, Array<MachinePage>>;
	
	    static createFrom(source: any = {}) {
	        return new AppData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.schemaVersion = source["schemaVersion"];
	        this.systemConstants = source["systemConstants"];
	        this.generalConfig = source["generalConfig"];
	        this.translations = source["translations"];
	        this.cfr21 = source["cfr21"];
	        this.roles = source["roles"];
	        this.detectedHardware = this.convertValues(source["detectedHardware"], HardwareModule);
	        this.modules = this.convertValues(source["modules"], MachineModule);
	        this.equipment = source["equipment"];
	        this.buttons = this.convertValues(source["buttons"], ButtonEntity);
	        this.cycleButtons = this.convertValues(source["cycleButtons"], CycleButtonEntity);
	        this.counters = this.convertValues(source["counters"], CounterGroup);
	        this.faults = this.convertValues(source["faults"], FaultGroup, true);
	        this.messageBoxes = this.convertValues(source["messageBoxes"], MessageBoxEntity);
	        this.pages = this.convertValues(source["pages"], Array<MachinePage>, true);
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
	
	
	
	
	
	
	export class MachinePageUI {
	    showProps: boolean;
	    showBools: boolean;
	    showInts: boolean;
	    showReals: boolean;
	    showStrings: boolean;
	
	    static createFrom(source: any = {}) {
	        return new MachinePageUI(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.showProps = source["showProps"];
	        this.showBools = source["showBools"];
	        this.showInts = source["showInts"];
	        this.showReals = source["showReals"];
	        this.showStrings = source["showStrings"];
	    }
	}
	export class MachinePage {
	    name: string;
	    commentFr: string;
	    commentEn: string;
	    commentDe: string;
	    commentEs: string;
	    reserve1: string;
	    reserve2: string;
	    detail: string;
	    id: string;
	    index: number;
	    enable: boolean;
	    isEM: boolean;
	    ui: MachinePageUI;
	    paramBools: Parameter[];
	    paramInts: Parameter[];
	    paramReals: Parameter[];
	    paramStrings: Parameter[];
	
	    static createFrom(source: any = {}) {
	        return new MachinePage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.commentFr = source["commentFr"];
	        this.commentEn = source["commentEn"];
	        this.commentDe = source["commentDe"];
	        this.commentEs = source["commentEs"];
	        this.reserve1 = source["reserve1"];
	        this.reserve2 = source["reserve2"];
	        this.detail = source["detail"];
	        this.id = source["id"];
	        this.index = source["index"];
	        this.enable = source["enable"];
	        this.isEM = source["isEM"];
	        this.ui = this.convertValues(source["ui"], MachinePageUI);
	        this.paramBools = this.convertValues(source["paramBools"], Parameter);
	        this.paramInts = this.convertValues(source["paramInts"], Parameter);
	        this.paramReals = this.convertValues(source["paramReals"], Parameter);
	        this.paramStrings = this.convertValues(source["paramStrings"], Parameter);
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

export namespace registry {
	
	export class EquipmentFieldSection {
	    label: string;
	    fieldsKey: string;
	    iconKey?: string;
	    uiKey: string;
	    filterVisible?: boolean;
	
	    static createFrom(source: any = {}) {
	        return new EquipmentFieldSection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.label = source["label"];
	        this.fieldsKey = source["fieldsKey"];
	        this.iconKey = source["iconKey"];
	        this.uiKey = source["uiKey"];
	        this.filterVisible = source["filterVisible"];
	    }
	}

}

export namespace services {
	
	export class RobotVarIndexValidation {
	    hasError: boolean;
	    message: string;
	
	    static createFrom(source: any = {}) {
	        return new RobotVarIndexValidation(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hasError = source["hasError"];
	        this.message = source["message"];
	    }
	}

}

