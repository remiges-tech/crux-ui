import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { SchemaDetails, SchemaPatternAttr } from 'src/models/common-interfaces';

export function checkConstraints(index:number,schemaPatternDetails:SchemaPatternAttr[]): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;

        if (!value) {
            return null;
        }
        else if(value < 0){
            return {ConstraintsError: true, message: 'Value is negative'}
        }
        else if(schemaPatternDetails[index].valmax && value > schemaPatternDetails[index].valmax!){
            return {ConstraintsError: true, message: `Value is greater then ${schemaPatternDetails[index].valmax}`}
        }else if(schemaPatternDetails[index].valmin && value < schemaPatternDetails[index].valmin!){
            return {ConstraintsError: true, message: `Value is less then ${schemaPatternDetails[index].valmin}`}
        }else if(schemaPatternDetails[index].lenmax && value.length > schemaPatternDetails[index].lenmax!){
            return {ConstraintsError: true, message: `length is greater then ${schemaPatternDetails[index].lenmax}`}
        }else if(schemaPatternDetails[index].lenmin && value.length < schemaPatternDetails[index].lenmin!){
            return {ConstraintsError: true, message: `length is less then ${schemaPatternDetails[index].lenmin}`}
        }

        
        return null;
    }
}

export function checkAttributes(rulePatterns:any, index:number, schemaDetails:SchemaDetails): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;

        console.log(rulePatterns,'sdsdasdas')
        if (!value) {
            return null;
        }else{
            schemaDetails?.patternschema.attr.forEach((pattern: any) => {
                if (pattern.name == value && pattern.valtype == 'bool') {
                    // console.log(value)
                    if(rulePatterns.some((attribute:any) => attribute.attrname == value)){
                        // console.log('here',rulePatterns, value)
                        return {validationError: true}
                    }
                }
                return null;
            })
        }

        // console.log('somethinf',schemaDetails)
        // console.log('index',index)
        // console.log('pattern',schemaDetails)

        // if(schemaPatternDetails[index].valtype == 'bool'){
        //     console.log('sdasdasd')
        //     console.log(rulePatterns.some((attribute:any) => attribute.attrname == value),'here')
            // if(rulePatterns.some((attribute:any) => attribute.attrname == value)){
            //     console.log('here',rulePatterns, value)
            //     return {}
            // }
        // }

        
        return null;
    }
}