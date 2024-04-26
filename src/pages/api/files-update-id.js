import { getStaticCols, readXLSXFile } from '@/utils/utils';
import * as XLSX from 'xlsx';
import fs from 'fs';
const ExcelJS = require('exceljs');


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fileName, Id, updatedRow } = req.body
        const testFolder = `./public/input/${fileName}`;
        const filename = `./public/input/${fileName}`;
        const historyFile = `./public/input/history/before-ID-${Id}-${fileName}`;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(testFolder);
        const worksheet = workbook.getWorksheet(1);
        await workbook.xlsx.writeFile(historyFile);
        const row = worksheet.getRow(Id + 1);
        const updatedData = []
        getStaticCols().forEach(e => {
            let val = String(updatedRow[e] || '')
            updatedData.push(val.trim())
        });
        let X = 0
        for (let i = 1; i <= row.cellCount; i++) {
            const cell = row.getCell(i);
            if (cell.hasFormat) {
                updatedData[i] = { ...updatedData[X], ...cell.format }; // Merge existing formatting
            }
            cell.value = updatedData[X];
            X++;
        }
        await workbook.xlsx.writeFile(filename);
        res.status(200).json({ found: updatedRow, cols: Array.from(new Set([...Object.keys(updatedRow)])) });
    } else {
        res.status(200).json({ found: null, cols: [] });
    }
}