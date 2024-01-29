export interface SchemaList{
    app:string,
    slice:number,
    class:string,
    applong: string,
}

export interface SchemaDetails{
    slice:number,
    app:string,
    class:string,
    patternschema:any,
    actionschema:any,
    createdat:string,
    createdby:string,
    editedat:string,
    editedby:string
}

export interface AppInfo {
    discription: string;
    value: string;
  }

export interface RulesetsList{
    id: number,
    slice: number,
    app: string,
    class: string,
    name: string,
    is_active: boolean,
    is_internal: boolean,
    createdat: string,
    createdby: string,
    editedat: string,
    editedby: string
}