//WFSchemGet API Response Model Structure
export const schemaDetailsModel = {
    slice: { type: 'number', isRequired: true },
    app: { type: 'string', isRequired: true },
    class: { type: 'string', isRequired: true },
    patternschema: {
        type: 'array', isRequired: true, nestedData: {
            attr: { type: 'string', isRequired: true },
            shortdesc: { type: 'string', isRequired: false },
            longdesc: { type: 'string', isRequired: true },
            valtype: { type: 'string', isRequired: true },
            vals: { type: 'array', isRequired: false, nestedData: { type: 'string' } },
            valmin: { type: 'number', isRequired: false },
            valmax: { type: 'number', isRequired: false },
            lenmin: { type: 'number', isRequired: false },
            lenmax: { type: 'number', isRequired: false }
        }
    },
    actionschema: {
        type: 'object', isRequired: true, nestedData: {
            tasks: { type: 'array', isRequired: true, nestedData: { type: 'string', isRequired: true } },
            properties: { type: 'array', isRequired: true, nestedData: { type: 'string', isRequired: true } }
        }
    },
    createdat: { type: 'string', isRequired: false },
    createdby: { type: 'string', isRequired: false },
    editedat: { type: 'string', isRequired: false },
    editedby: { type: 'string', isRequired: false }
};


//SchemaList API Response Model Structure
export const schemaListModel = {
    data: {
        type: 'array',
        isRequired: true,
        nestedData: {
            slice: { type: 'number', isRequired: true},
            app: { type: 'string', isRequired: true},
            slicedesc: { type: 'string', isRequired: true},
            longname: { type: 'string', isRequired: true},
            class: { type: 'string', isRequired: true},
            // "createdby": "gonita@frappe.cn",
            // "createdat": "2024-01-03T04:51:31Z",
            // "editedby": "mannata@frappe.cn",
            // "editedat": "2024-01-05T09:01:26Z"
        }

    }
}

