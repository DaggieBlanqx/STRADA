import { Injectable } from "@angular/core";

import { Store } from '@ngrx/store';

import * as fromWizard from '../models/reducers';
import { WizardActionTypes } from '../models/actions/wizard.actions';

@Injectable() export class WizardService {

    constructor(private store: Store<fromWizard.State>) { }

    public updateStep(data: any, index: number): void {
        this.store.dispatch({
            type: WizardActionTypes.StepChanged,
            payload: { step: { data: data }, index: index }
        });
    }

    public putInError(error: string): void {
        this.store.dispatch({
            type: WizardActionTypes.StepError,
            payload: error
        });
    }

    public putOnHold(): void {
        this.store.dispatch({
            type: WizardActionTypes.StepPending,
            payload: true
        });
    }

    public reset(): void {
        this.store.dispatch({
            type: WizardActionTypes.Reset
        });
    }

}
