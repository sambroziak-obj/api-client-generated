/**
 * This file is generated by the SwaggerTSGenerator.
 * Do not edit.
*/
/* tslint:disable */
import { Validators, FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { minValueValidator, maxValueValidator, enumValidator } from './validators';
import { BaseModel } from './base-model';
import { SubTypeFactory } from './sub-type-factory';


export interface IApiResponse {
    code?: number;
    type?: string;
    message?: string;
}


export class ApiResponse extends BaseModel implements IApiResponse  {

    static CODE_FIELD_NAME = 'code';
    static TYPE_FIELD_NAME = 'type';
    static MESSAGE_FIELD_NAME = 'message';

    code: number;
    type: string;
    message: string;

    /**
     * constructor
     * @param values Can be used to set a webapi response or formValues to this newly constructed model
    * @useFormGroupValuesToModel if true use formValues
    */
    constructor(values?: Partial<IApiResponse>, useFormGroupValuesToModel = false) {
        super();

        if (values) {
            this.setValues(values, useFormGroupValuesToModel);
        }
    }

    /**
     * set the values.
     * @param values Can be used to set a webapi response to this newly constructed model
    */
    setValues(values: Partial<IApiResponse>, useFormGroupValuesToModel = false): void {
        if (values) {
            const rawValues = this.getValuesToUse(values, useFormGroupValuesToModel);
            this.code = this.getValue<number>(rawValues, ApiResponse.CODE_FIELD_NAME);
            this.type = this.getValue<string>(rawValues, ApiResponse.TYPE_FIELD_NAME);
            this.message = this.getValue<string>(rawValues, ApiResponse.MESSAGE_FIELD_NAME);
            // set values in model properties for added formControls
            super.setValuesInAddedPropertiesOfAttachedFormControls(values, useFormGroupValuesToModel);
        }
    }

    protected getFormGroup(): FormGroup {
        if (!this._formGroup) {
            this._formGroup = new FormGroup({
                code: new FormControl(this.code),
                type: new FormControl(this.type),
                message: new FormControl(this.message),
            });
        }
        return this._formGroup;
    }

    /**
     * set the FormGroup values to the model values.
    */
    setFormGroupValues() {
        this.$formGroup.controls[ApiResponse.CODE_FIELD_NAME].setValue(this.code);
        this.$formGroup.controls[ApiResponse.TYPE_FIELD_NAME].setValue(this.type);
        this.$formGroup.controls[ApiResponse.MESSAGE_FIELD_NAME].setValue(this.message);
        // set formValues in added formControls
        super.setFormGroupValuesInAddedFormControls();
    }
}
