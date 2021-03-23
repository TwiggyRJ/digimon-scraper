import fs from 'fs';

export const dir = './data';

export function storeData(path: string, data: any) {
    try {
        fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
    } catch (err) {
        console.error(err)
    }
}

export function readData(path: string) {
    try {
        const data = fs.readFileSync(path, 'utf8');

        return JSON.parse(data);
    } catch (err) {
        console.error(err)
    }
}

export function readDataAsync(path: string) {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(path, 'utf8', (error, dataFile) => {
                if (error) throw error;

                const data = JSON.parse(dataFile);
                resolve(data);
            });
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
}

export function getFilenames(directory: string): Promise<string[] | Error> {
    return new Promise((resolve, reject) => {
        try {
            fs.readdir(directory, (error, filenames: string[]) => {
                if (error) throw error;

                resolve(filenames);
            });
        } catch (error) {
            console.info(error);
            reject(error);
        }
    });
}

export async function getArrayOfFiles(files: string[]): Promise<any[] | Error> {
    return new Promise(async (resolve, reject) => {
        try {
            const dataArray: any[] = await files.map(async (file: string) => {
                const path = `${dir}/${file}`;
                const data = await readDataAsync(path);
                return data;
            });

            resolve(Promise.all(dataArray));
        } catch (error) {
            console.info(error);
            reject(error);
        }
    });
}

export async function readAllFiles(directory: string): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const filenames = await getFilenames(directory);

            if (!Array.isArray(filenames)) throw filenames;

            const files = await getArrayOfFiles(filenames);

            if (!Array.isArray(files)) throw files;

            resolve(files);
        } catch (error) {
            console.info(error);
            reject(error);
        }
    });
}

export function doesDataFolderExist() {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}