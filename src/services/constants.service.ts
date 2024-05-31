export enum CONSTANTS {
  SUCCESS = 'success',
  FAILED = 'failed',
  ERROR = 'Error',
  WARNING = 'Warning',
  DATA_NOT_FOUND = 'Data not found!',
  CANNOT_EDIT_RULESET_MSG = 'Ruleset cannot be edited as it is active',
  CANNOT_ADD_RULE_MSG = 'Rule cannot be added as it is active',
  SCHEMA_DETAILS_DATA_NOT_FOUND = 'Details for the selected schema not found.',
  WORKFLOW_LIST_DATA_NOT_FOUND = 'No Workflow list present.',
  PLEASE_WAIT_PROCESSING_YOUR_DATA = 'Please wait, processing your data',
  WF_SCHEMA_LIST_API = '/wfschemaList',
  WF_SCHEMA_GET_API = '/wfschemaget',
  WF_RULESETS_LIST_API = '/workflowlist',
  WF_RULESETS_GET_API = '/workflowget',
  WF_RULESETS_UPDATE_API = '/workflowUpdate',
  WF_WORKFLOW_NEW_API = '/workflowNew',
  WF_INSTANCE_TRY_API = '/wfinstancetry',
  Realm_Slice_New_API = '/realmslicenew',
  Realm_Slice_LIST_API = '/realmslicelist',
  Realm_Slice_Apps_API = '/realmsliceapps',
  Realm_Slice_Activate_API = '/realmsliceactivate',
  Realm_Slice_Deactivate_API = '/realmslicedeactivate'
}

export const OperatorsUnicode = {
  ge : '&#8805;',
  gt : '&#62;',
  le : '&#8804;',
  lt : '&#60;',
  eq : '&#61;',
  ne : '&#8800;',
}

export enum AttrDataTypes {
  typeBool = 'bool',
  typeEnum = 'enum',
  typeStr = 'str',
  typeFloat = 'float',
  typeInt = 'int',
  typeTs = 'ts'
}