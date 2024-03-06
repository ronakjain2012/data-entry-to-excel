import { readXLSXFile } from '@/utils/utils';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fileName, Id } = req.body
        const testFolder = './public/input/' + fileName;
        let data = await readXLSXFile(testFolder)
        const findOne = data.find(e => e['ID'] == Id) || null
        res.status(200).json({found: findOne, cols: Object.keys(data[0])});

    } else {
        res.status(200).json({found: null, cols: []});
    }
}