export class Lock {
    name: string;
    isLocked: boolean;

    constructor(name) {
        this.name = name;
        this.isLocked = false;
    }

    activate(): void | never {
        if (this.isLocked) {
            throw new Error(this.name);
        }

        this.isLocked = true;
    }

    deactivate(): void {
        this.isLocked = false;
    }

    release(promise: Promise<any> | null): void {
        if (promise) {
            promise.then(() => {
                this.isLocked = false;
            })
        } else {
            this.isLocked = false;
        }
    }
}
