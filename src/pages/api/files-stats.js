import fs from 'fs';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { fileName } = req.body
        const testFolder = './public/input/' + fileName;
        const stats = fs.statSync(testFolder);
        res.status(200).json({ stats });
    } else {
        res.status(200).json({ stats: null });
    }
}