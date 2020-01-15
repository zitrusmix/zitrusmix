export class LogTableOptions {
    readonly columns: Array<string> | null;
    readonly columnColors: Map<string, string>;
    readonly columnWidth: Map<string, number>;
    readonly columnWidthDefault: number;

    constructor() {
        this.columns = null;
        this.columnWidthDefault = 20;
        this.columnWidth = new Map(Object.entries(
            {
                id: 5
            }
        ));

        this.columnColors = new Map(Object.entries(
            {
                id: '\x1b[31m'
            }
        ));
    }
}
