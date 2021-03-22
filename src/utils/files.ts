import fs from 'fs';

export const dir = './data';

export function storeData(path: string, data: any) {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

export function doesDataFolderExist() {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}