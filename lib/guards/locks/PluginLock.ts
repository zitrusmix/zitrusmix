import {ZitrusmixError} from "../ZitrusmixError";

export class PluginLock {
    isLocked: boolean;

    constructor() {
        this.isLocked = false;
    }

    lock(): void | never {
        if (this.isLocked) {
            throw new ZitrusmixError('plugin-lock-error', 'Only one plugin can run at the same time. Please await until a plugin is resolved before using another plugin.')
        }

        this.isLocked = true;
    }

    async unlock(promise?: Promise<any> | null): Promise<any> {
        if (promise) {
            await promise;
        }

        this.isLocked = false;
    }
}
