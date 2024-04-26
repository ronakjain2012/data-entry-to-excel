import * as XLSX from 'xlsx';
import fs from 'fs';

export const makeid = function (length = 10) {
    let result = ''
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567892eYGXEQR9rHo7VPlyILbJs3uOjkWBNK5AFDgfq10pm86aiZwSTtC4vzcUxMnhd'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}

export const generateRandomInt = () => {
    return Math.round(Math.random() * 1000000, 0)
}

export const generateRandomChar = () => {
    return makeid(10)
}

export const randomColorGenerator = () => {
    let c = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    while (c.length != 7) {
        c = randomColorGenerator()
    }
    return c
}

export const toSlug = (st) => {
    return st
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
}

export const getStaticCols = () => fs.readFileSync('./public/input/config/cols.txt', 'utf8').toString().split('\n').map(e => String(e).trim())

export const readXLSXFile = async function (fileName) {
    try {
        var workbook = XLSX.readFile(fileName, {
            type: 'binary', cellDates: true,
            cellNF: false,
            cellText: false
        });
        var sheet_name_list = workbook.SheetNames;
        let data = []
        const sheets = sheet_name_list
        for (let i = 0; i < 1; i++) {
            // for (let i = 0; i < sheets.length; i++) {
            const temp = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]])
            data = temp;
        }
        return data;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}