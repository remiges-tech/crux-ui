import { RuleDetails, RulesetsList, SchemaDetails, SchemaList } from "./common-interfaces";

export interface SchemaListResp{
    data: {
        schemas: SchemaList[]
    },
    status: string,
    statusCode: number,
    message: string
}

export interface SchemaDetailResp{
    data: SchemaDetails,
    status: string,
    statusCode: number,
    message: string
}

export interface RuleSetListResp{
    data: {
        rulesets: RulesetsList[]
    },
    status: string,
    statusCode: number,
    message: string
}

export interface RuleSetDetailResp{
    data: RuleDetails,
    status: string,
    statusCode: number,
    message: string
}