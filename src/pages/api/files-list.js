import fs from 'fs';

export default function handler(req, res) {
    const testFolder = './public/input';
    const files = fs.readdirSync(testFolder)
    res.status(200).json({ files });
}