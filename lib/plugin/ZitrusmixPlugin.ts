import {PluginContext} from './PluginContext';
import {ContentElement} from '../ContentElement';

export declare type ZitrusmixPluginOptions = object | any | null;

export interface ZitrusmixPluginProcessFunc<TOptions extends ZitrusmixPluginOptions> {
    (context: PluginContext<TOptions>): Promise<any> | void;
}

export interface ZitrusmixPluginForEachFunc<TOptions extends ZitrusmixPluginOptions> {
    (element: ContentElement, options: TOptions | object): Promise<any> | void;
}

export interface ZitrusmixPlugin<TZitrusmixPluginOptions extends ZitrusmixPluginOptions = null> {
    process?: ZitrusmixPluginProcessFunc<TZitrusmixPluginOptions>;
    forEach?: ZitrusmixPluginForEachFunc<TZitrusmixPluginOptions>;
    options?: TZitrusmixPluginOptions;
}
