import {PluginContext} from '../plugin/PluginContext';

export interface ZitrusmixPluginFunc<TOptions> {
    (context: PluginContext<TOptions>):(Promise<void>|void)
}

export interface ZitrusmixPlugin<TOptions> {
    call: ZitrusmixPluginFunc<TOptions>;
    options?: TOptions;
}
