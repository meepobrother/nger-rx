import { StaticProvider, Injector, Type, setStaticProviderWithRoot } from "@nger/core";
import { IMethodDecorator, IClassDecorator, getINgerDecorator } from '@nger/decorator';
import { ReducerOptions, CaseMetadataKey, ReducerMetadataKey } from "../decorators";
import { createReducer, on } from "../reducer_creator";
import { REDUCERS } from "../tokens";
export interface ReducerCaseHandler<T = any, O = any> {
    (instance: T, method: IMethodDecorator<T, O>): any;
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
                    const res = handler(instance, method);
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
export const caseHandler: ReducerCaseHandler = (instance: any, method: IMethodDecorator<any, any>) => {
    const options = method.options;
    if (options) {
        const mth = Reflect.get(instance, method.property);
        if (mth) {
            return on(options, mth.bind(instance))
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

