
import {promises as fs} from 'fs';
import * as path from 'path';

export default class FileHandler
{
    private static async fileExists(filePath: string) : Promise<boolean> {
        
        try {
            await fs.access(filePath);
            return true;
        } catch (error) {
            
            return false;
        }
    }

    //TODO: templateType as enum
    public static async readFile(filePath: string) : Promise<string> {
        
        if(!(await FileHandler.fileExists(filePath))) {
            throw new Error("Template does not exist");
        }
        
        return await fs.readFile(filePath, 'utf8');
    }

    public static async writeFile(filePath: string, fileContent: string) 
    {
        if(await FileHandler.fileExists(filePath)) {
            throw new Error("File already exists");
        }

        await fs.writeFile(filePath, fileContent);
    }


}