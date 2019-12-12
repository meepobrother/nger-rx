import { StoreModule,ActionReducerMap } from '@nger/rx.store';
import { Module, corePlatform, InjectionToken, Injector } from '@nger/core';
import { SomeService } from './some.service';
import * as fromRoot from './reducers';
export const REDUCER_TOKEN = new InjectionToken<
  ActionReducerMap<fromRoot.State>
>('Registered Reducers');
export function getReducers(someService: SomeService) {
    return someService.getReducers();
}
@Module({
    imports: [
        StoreModule.forRoot(REDUCER_TOKEN)
    ],
    providers: [
        SomeService,
        {
            provide: REDUCER_TOKEN,
            deps: [SomeService],
            useFactory: getReducers,
        }
    ]
})
export class AppModule { 
    constructor(public injector: Injector){}
}
const platform = corePlatform();
platform.bootstrapModule(AppModule).then(res=>{
    debugger;
});
