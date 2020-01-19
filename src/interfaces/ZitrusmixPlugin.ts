import {PluginContext} from '../plugin/PluginContext';
import {ContentElement} from '../ContentElement';

export interface ZitrusmixPluginFunc<TOptions> {
    (context: PluginContext<TOptions>):(Promise<void>|void)
}

export interface ZitrusmixUpdateFunc<TOptions> {
    (element: ContentElement, options?: TOptions):ContentElement
}

export interface ZitrusmixPlugin<TOptions> {
    call?: ZitrusmixPluginFunc<TOptions>;
    update?: ZitrusmixUpdateFunc<TOptions>
    options?: TOptions;
}
