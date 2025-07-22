import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface WsColInterface {
  wch: number;
}
/**
 * Downloads CSV data as an Excel file with specified headers and column widths.
 *
 * The function converts JSON data (`csvData`) to an Excel sheet, adds headers, and applies custom column widths.
 * The resulting file is then downloaded using `file-saver` as an `.xlsx` file.
 *
 * @param csvData - The data to be exported as an Excel sheet, represented as an array of objects.
 * @param fileName - The name of the file to be downloaded (without extension).
 * @param headers - The headers for the Excel sheet.
 * @param xlsxHeader - The header data to be used for the Excel file (should match `headers`).
 * @param wscols - The column width configuration, where each item corresponds to a column.
 *
 * @example
 * const data = [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }];
 * const headers = ['name', 'age'];
 * const xlsxHeader = {
 *  name: "Full Name",
 *  age: "Age",
 * };
 * const columnWidths = [{ wch: 10 }, { wch: 5 }];
 * excelDownload(data, 'user_data', headers, xlsxHeader, columnWidths);
 */

export const excelDownload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  fileName: string,
  headers: string[],
  xlsxHeader: {
    [key: string]: string;
  },
  wscols: WsColInterface[],
) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const ws = XLSX.utils.json_to_sheet([xlsxHeader], {
    header: headers,
    skipHeader: true,
  });

  ws['!cols'] = wscols;
  XLSX.utils.sheet_add_json(ws, csvData, {
    header: headers,
    skipHeader: true,
    origin: -1,
  });
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataForExcel = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(dataForExcel, `${fileName}.xlsx`);
};
