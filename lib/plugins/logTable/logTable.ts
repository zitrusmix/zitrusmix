import {LogTableOptions} from './LogTableOptions';
import {ZitrusmixPlugin} from '../../interfaces/ZitrusmixPlugin';
import {PluginContext} from '../../plugin/PluginContext';

const RESET = '\x1b[0m';

export function logTable(options?: LogTableOptions): ZitrusmixPlugin<LogTableOptions> {
    function formatCell(columnName: string, value: any | null, options: LogTableOptions): string {
        let cellText = (value || '').toString();
        const columnWidth = options.columnWidth.get(columnName) || options.columnWidthDefault;


        if (cellText.length > columnWidth) {
            cellText = cellText.slice(0, columnWidth - 1);
            cellText += '…';
        }

        cellText = cellText.padEnd(columnWidth, ' ');

        if (options.columnColors.has(columnName)) {
            cellText = [options.columnColors.get(columnName), cellText, RESET].join('');
        }

        return cellText;
    }

    function line(columnName: string, options: LogTableOptions): string {
        const columnWidth = options.columnWidth.get(columnName) || options.columnWidthDefault;

        return ''.padEnd(columnWidth, '─');
    }

    function logTablePlugin(context: PluginContext<LogTableOptions>): void {
        const options = Object.assign(new LogTableOptions(), context.options);

        const rows = context.collection.elements.map(element => {
            const row = {
                column: new Map<string, any>()
            };

            row.column.set('uri', element.uri);
            Object.entries(element).forEach(([key, value]) => row.column.set(key, value));

            return row;
        });

        const columns = new Set(rows.flatMap(row => [...row.column.keys()]));
        const columnNames = [...columns];

        const topDividerLine = columnNames.map(value => line(value, options)).join('─┬─');
        const bottomDividerLine = columnNames.map(value => line(value, options)).join('─┴─');
        const dividerLine = columnNames.map(value => line(value, options)).join('─┼─');
        const headerRow = columnNames.map(value => formatCell(value, value, options)).join(' | ');

        console.log('');
        console.log(topDividerLine);
        console.log(headerRow);
        console.log(dividerLine);

        rows.forEach(row => {
            const line = columnNames.map(columnName => formatCell(columnName, row.column.get(columnName), options)).join(' | ');
            console.log(line);
        });

        console.log(bottomDividerLine);
        console.log('');
    }

    return {
        options: options || new LogTableOptions(),
        call: logTablePlugin
    };
}


