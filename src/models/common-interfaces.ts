export interface SchemaList {
    app: string,
    slice: number,
    class: string,
    applong: string,
    slicedesc: string
}

export interface SchemaDetails {
    slice: number,
    app: string,
    class: string,
    patternschema: any,
    actionschema: any,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface AppInfo {
    discription: string;
    value: string;
}

export interface SliceInfo {
    discription: string;
    value: number;
}

export interface RulesetsList {
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    longdesc: string,
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface RuleDetails {
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    ruleset: Ruleset,
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}

export interface Ruleset{
    id: number,
    class: string,
    setname: string,
    rules: Rule[]
}

export interface Rule {
	rulepattern: RulePatternTerm[]
	ruleactions: RuleActions
}

export interface RTree {
	rulePattern: RulePatternTerm[]
	ruleActions: RuleActions
    thenRuleset?: RTree[]
    elseRuleset?: RTree[]
}

export interface RulePatternTerm {
	attrname: string
	op:       string
	attrval:  any
}

export interface RuleActions {
	tasks:      string[]
	properties: Property[]
	thencall?:   string
	elsecall?:   string
	return?: boolean
	exit?:   boolean
}

interface Property {
  [key: string]: string
}
    
export interface RulesetMap {
    [key: string]: RuleDetails
}