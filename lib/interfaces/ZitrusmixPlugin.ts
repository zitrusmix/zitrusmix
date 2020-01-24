import {PluginContext} from '../plugin/PluginContext';
import {ContentElement} from '../ContentElement';

export declare type PluginOptions = object | any | null;

export interface ZitrusmixPluginFunc<TOptions extends PluginOptions> {
    (context: PluginContext<TOptions>): (Promise<any> | void);
}

export interface ZitrusmixUpdateFunc<TOptions extends PluginOptions> {
    (element: ContentElement, options?: TOptions): ContentElement;
}

export interface ZitrusmixPlugin<TOptions extends PluginOptions = null> {
    call?: ZitrusmixPluginFunc<TOptions>;
    update?: ZitrusmixUpdateFunc<TOptions>;
    options?: TOptions;
}
