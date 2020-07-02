/**
 * This file is generated by the SwaggerTSGenerator.
 * Do not edit.
*/
/* tslint:disable */
import { Validators, FormControl, FormGroup, FormArray, ValidatorFn } from '@angular/forms';
import { minValueValidator, maxValueValidator, enumValidator } from './validators';
import { BaseModel } from './base-model';
import { SubTypeFactory } from './sub-type-factory';


export interface IUser {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    userStatus?: number;
}


export class User extends BaseModel implements IUser  {

    static ID_FIELD_NAME = 'id';
    static USERNAME_FIELD_NAME = 'username';
    static FIRST_NAME_FIELD_NAME = 'firstName';
    static LAST_NAME_FIELD_NAME = 'lastName';
    static EMAIL_FIELD_NAME = 'email';
    static PASSWORD_FIELD_NAME = 'password';
    static PHONE_FIELD_NAME = 'phone';
    static USER_STATUS_FIELD_NAME = 'userStatus';

    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    /** User Status */
    userStatus: number;

    /**
     * constructor
     * @param values Can be used to set a webapi response or formValues to this newly constructed model
    * @useFormGroupValuesToModel if true use formValues
    */
    constructor(values?: Partial<IUser>, useFormGroupValuesToModel = false) {
        super();

        if (values) {
            this.setValues(values, useFormGroupValuesToModel);
        }
    }

    /**
     * set the values.
     * @param values Can be used to set a webapi response to this newly constructed model
    */
    setValues(values: Partial<IUser>, useFormGroupValuesToModel = false): void {
        if (values) {
            const rawValues = this.getValuesToUse(values, useFormGroupValuesToModel);
            this.id = this.getValue<number>(rawValues, User.ID_FIELD_NAME);
            this.username = this.getValue<string>(rawValues, User.USERNAME_FIELD_NAME);
            this.firstName = this.getValue<string>(rawValues, User.FIRST_NAME_FIELD_NAME);
            this.lastName = this.getValue<string>(rawValues, User.LAST_NAME_FIELD_NAME);
            this.email = this.getValue<string>(rawValues, User.EMAIL_FIELD_NAME);
            this.password = this.getValue<string>(rawValues, User.PASSWORD_FIELD_NAME);
            this.phone = this.getValue<string>(rawValues, User.PHONE_FIELD_NAME);
            this.userStatus = this.getValue<number>(rawValues, User.USER_STATUS_FIELD_NAME);
            // set values in model properties for added formControls
            super.setValuesInAddedPropertiesOfAttachedFormControls(values, useFormGroupValuesToModel);
        }
    }

    protected getFormGroup(): FormGroup {
        if (!this._formGroup) {
            this._formGroup = new FormGroup({
                id: new FormControl(this.id),
                username: new FormControl(this.username),
                firstName: new FormControl(this.firstName),
                lastName: new FormControl(this.lastName),
                email: new FormControl(this.email),
                password: new FormControl(this.password),
                phone: new FormControl(this.phone),
                userStatus: new FormControl(this.userStatus),
            });
        }
        return this._formGroup;
    }

    /**
     * set the FormGroup values to the model values.
    */
    setFormGroupValues() {
        this.$formGroup.controls[User.ID_FIELD_NAME].setValue(this.id);
        this.$formGroup.controls[User.USERNAME_FIELD_NAME].setValue(this.username);
        this.$formGroup.controls[User.FIRST_NAME_FIELD_NAME].setValue(this.firstName);
        this.$formGroup.controls[User.LAST_NAME_FIELD_NAME].setValue(this.lastName);
        this.$formGroup.controls[User.EMAIL_FIELD_NAME].setValue(this.email);
        this.$formGroup.controls[User.PASSWORD_FIELD_NAME].setValue(this.password);
        this.$formGroup.controls[User.PHONE_FIELD_NAME].setValue(this.phone);
        this.$formGroup.controls[User.USER_STATUS_FIELD_NAME].setValue(this.userStatus);
        // set formValues in added formControls
        super.setFormGroupValuesInAddedFormControls();
    }
}
