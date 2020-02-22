import {PluginContext} from './PluginContext';
import {ContentElement} from '../ContentElement';

export declare type PluginOptions = object | any | null;

export interface ExecutePluginFunc<TOptions extends PluginOptions> {
    (context: PluginContext<TOptions>): Promise<any> | void;
}

export interface ForEachPluginFunc<TOptions extends PluginOptions> {
    (element: ContentElement, options: TOptions | object): Promise<any> | void;
}

export interface ZitrusmixPlugin<TOptions extends PluginOptions = null> {
    process?: ExecutePluginFunc<TOptions>;
    forEach?: ForEachPluginFunc<TOptions>;
    options?: TOptions;
}
