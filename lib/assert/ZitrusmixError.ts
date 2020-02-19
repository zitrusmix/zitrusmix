export class ZitrusmixError extends Error {
    /**
     * @param {string} name
     * @param {string} message
     */
    constructor(name, message) {
        const errorMessage = [
            `[ZitrusmixError] ${name}`,
            message,
            `https://github.com/zitrusmix/zitrusmix/blob/master/doc/errors/${name}.md`
        ];

        super(errorMessage.join('\n'));

        Object.setPrototypeOf(this, ZitrusmixError.prototype);
    }
}
