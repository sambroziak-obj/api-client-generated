/**
 * This file is generated by the SwaggerTSGenerator.
 * Do not edit.
*/
/* tslint:disable */
import { Validators, FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { minValueValidator, maxValueValidator, enumValidator } from './validators';
import { BaseModel } from './base-model';
import { SubTypeFactory } from './sub-type-factory';


export interface ITag {
    id?: number;
    name?: string;
}


export class Tag extends BaseModel implements ITag  {

    static ID_FIELD_NAME = 'id';
    static NAME_FIELD_NAME = 'name';

    id: number;
    name: string;

    /**
     * constructor
     * @param values Can be used to set a webapi response or formValues to this newly constructed model
    * @useFormGroupValuesToModel if true use formValues
    */
    constructor(values?: Partial<ITag>, useFormGroupValuesToModel = false) {
        super();

        if (values) {
            this.setValues(values, useFormGroupValuesToModel);
        }
    }

    /**
     * set the values.
     * @param values Can be used to set a webapi response to this newly constructed model
    */
    setValues(values: Partial<ITag>, useFormGroupValuesToModel = false): void {
        if (values) {
            const rawValues = this.getValuesToUse(values, useFormGroupValuesToModel);
            this.id = this.getValue<number>(rawValues, Tag.ID_FIELD_NAME);
            this.name = this.getValue<string>(rawValues, Tag.NAME_FIELD_NAME);
            // set values in model properties for added formControls
            super.setValuesInAddedPropertiesOfAttachedFormControls(values, useFormGroupValuesToModel);
        }
    }

    protected getFormGroup(): FormGroup {
        if (!this._formGroup) {
            this._formGroup = new FormGroup({
                id: new FormControl(this.id),
                name: new FormControl(this.name),
            });
        }
        return this._formGroup;
    }

    /**
     * set the FormGroup values to the model values.
    */
    setFormGroupValues() {
        this.$formGroup.controls[Tag.ID_FIELD_NAME].setValue(this.id);
        this.$formGroup.controls[Tag.NAME_FIELD_NAME].setValue(this.name);
        // set formValues in added formControls
        super.setFormGroupValuesInAddedFormControls();
    }
}
