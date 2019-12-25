import { StoreModule, ActionReducerMap, Reducer } from '@nger/store';
import { Module, corePlatform, InjectionToken, Injector, Injectable } from '@nger/core';
import { SomeService } from './some.service';
import * as fromRoot from './reducers';
export const REDUCER_TOKEN = new InjectionToken<
    ActionReducerMap<fromRoot.State>
>('Registered Reducers');
export function getReducers(someService: SomeService) {
    return someService.getReducers();
}

@Injectable({
    providedIn: 'root'
})
export class DemoStore { }

@Reducer({
    name: `demo`,
    store: DemoStore
})
export class DemoReducer { }

@Module({
    imports: [
        StoreModule.forRoot({})
    ],
    providers: [
        SomeService
    ],
    reducers: [
        DemoReducer
    ]
})
export class AppModule {
    constructor(public injector: Injector) { }
}
const platform = corePlatform();
platform.bootstrapModule(AppModule).then(res => {
    debugger;
});
