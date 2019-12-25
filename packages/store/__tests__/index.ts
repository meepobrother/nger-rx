import { StoreModule, Reducer, Store, createAction, Case, props } from '@nger/store';
import { Module, corePlatform, Injector, Injectable } from '@nger/core';
// state
@Injectable({
    providedIn: 'root'
})
export class DemoStore {
    title: string = `demo store`
}
// action
const updateTitle = createAction(`updateTitle`, props<{ title: string }>());
// reducer
@Reducer({
    name: `demo`,
    store: DemoStore
})
export class DemoReducer {
    constructor(private injector: Injector) { }
    @Case(updateTitle)
    updateTitle(store: DemoStore, action: { title: string }) {
        return {
            ...store,
            title: action.title
        }
    }
}
// module
@Module({
    imports: [
        StoreModule.forRoot()
    ],
    providers: [],
    reducers: [
        DemoReducer
    ]
})
export class AppModule {
    constructor(public injector: Injector) { }
}
const platform = corePlatform();
platform.bootstrapModule(AppModule).then(res => {
    const store = res.get(Store)
    store.select(`demo`).subscribe(res => {
        const title = res.title;
        console.log(res.title)
    })
    store.dispatch(updateTitle({ title: 'my first title' }))
    store.dispatch(updateTitle({ title: 'my first title2' }))
    store.dispatch(updateTitle({ title: 'my first title3' }))
});
