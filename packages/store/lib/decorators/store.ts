import { createClassDecorator, createMethodDecorator } from "@nger/decorator";
export const ReducerMetadataKey = `@nger/store ReducerMetadataKey`;
export interface ReducerOptions {
    name: string;
    store: any;
}
export const Reducer = createClassDecorator<ReducerOptions>(ReducerMetadataKey);
export const CaseMetadataKey = `@nger/store CaseMetadataKey`;
export const Case = createMethodDecorator<any>(CaseMetadataKey);
