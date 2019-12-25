import { StaticProvider, Injector, Type, setStaticProviderWithRoot, InjectionToken } from "@nger/core";
import { IMethodDecorator, IClassDecorator, getINgerDecorator } from '@nger/decorator';
import { ReducerOptions, CaseMetadataKey, ReducerMetadataKey } from "../decorators";
import { createReducer, on } from "../reducer_creator";
import { REDUCERS } from "../tokens";
import { State } from "../state";
export interface ReducerCaseHandler<T = any, O = any> {
    (instance: T, method: IMethodDecorator<T, O>, injector: Injector): any;
}
export interface ReducerHandler<T = any, O = any> {
    (type: Type<any>, injector: Injector, decorator: IClassDecorator<T, O>): any;
}
const reducerHandler = (old: any, decorator: IClassDecorator<any, ReducerOptions>, injector: Injector) => {
    const options = decorator.options;
    const type = decorator.type;
    const handlers: any[] = [];
    const nger = getINgerDecorator(type)
    const instance = injector.get(type)
    if (options && nger) {
        const state = injector.get(options.store)
        nger.methods.map(method => {
            if (method.metadataKey) {
                const handler = injector.get<ReducerCaseHandler>(method.metadataKey)
                if (handler) {
                    const res = handler(instance, method, injector);
                    if (res) handlers.push(res)
                }
            }
        });
        setStaticProviderWithRoot(injector, [{
            provide: REDUCERS,
            useValue: { [`${options.name}`]: createReducer(state, ...handlers) },
            multi: true
        }])
    }
}
export const CURRENT_STATE = new InjectionToken(`CURRENT_STATE`)
export const CURRENT_ACTION = new InjectionToken(`CURRENT_ACTION`)

export const caseHandler: ReducerCaseHandler = (instance: any, method: IMethodDecorator<any, any>, injector: Injector) => {
    const options = method.options;
    if (options) {
        const mth = instance[method.property];
        if (mth) {
            return on(options, (state, action) => {
                injector.setStatic([{
                    provide: CURRENT_STATE,
                    useValue: state
                },{
                    provide: CURRENT_ACTION,
                    useValue: action
                }])
                return mth(state, action)
            })
        }
    }
}
export const caseProvider: StaticProvider = {
    provide: CaseMetadataKey,
    useValue: caseHandler
}
export const reducerProvider: StaticProvider = {
    provide: ReducerMetadataKey,
    useValue: reducerHandler
}

