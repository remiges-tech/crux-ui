import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { DataInterface } from 'src/app/rulesets/rule-modal/rule-modal.component';

export function checkConstraints(index:number,schemaPatternDetails:DataInterface[]): ValidatorFn {
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