import { getStaticCols, readXLSXFile } from '@/utils/utils';

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const { fileName, Id } = req.body
        const testFolder = './public/input/' + fileName;
        let data = await readXLSXFile(testFolder)
        const findOne = data.find(e => e['ID'] == Id) || null
        const allCols = Array.from(new Set([...getStaticCols(), ...Object.keys(data[0])]))
        const newObj = {}
        console.log(allCols)
        allCols.forEach(e => {
            let val = String(findOne[e] || '')
            newObj[e] = val.trim()
        });
        res.status(200).json({found: newObj, cols: allCols});
    } else {
        res.status(200).json({found: null, cols: []});
    }
}