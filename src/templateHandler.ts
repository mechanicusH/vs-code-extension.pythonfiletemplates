import * as vscode from 'vscode';
import * as path from 'path';
import FileHandler from './filehandler';

export default class TemplateHandler {
    public static async promptModuleName() : Promise<string> {
        
		let fileName = await vscode.window.showInputBox( {
			ignoreFocusOut: true,
			prompt: "Enter the module name"
		});
		
		if(fileName === undefined || fileName === "") {
			throw new Error("No name provided");
		}
        return fileName + ".py";
    }

    public static async promtClassName() {
        
		let className = await vscode.window.showInputBox( {
			ignoreFocusOut: true,
			prompt: "Enter the module name"
		});
		
		return this.getClassInformation(className);
    }
    
    public static async getClassInformation(className : string | undefined) {
        if(className === undefined || className === "") {
			throw new Error("No name provided");
		}
        
        let fileName = className!
            .replace(/^./g, letter => `${letter.toLowerCase()}`) // first charakter to lowercase
            .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`); // all other upper case letters to _ + lower case letter
        
        return {
            fileName: fileName + ".py",
            className: className
        };
    }

    public static async replaceTemplatePlaceholders(templateText: string, tokens : Map<string, string>) : Promise<string> {
        
        tokens.forEach((value, key) => {
            templateText = templateText.replace(`$_${key}`, value);
        });

        return templateText;
    }


    public static async writeTemplate(newFilePath: string, templateType: string, tokens?: Map<string, string>) {
        let templateText = await TemplateHandler.getTemplateContent(templateType);
        
        if(tokens) {
            templateText = await TemplateHandler.replaceTemplatePlaceholders(templateText, tokens);
        }
            
        FileHandler.writeFile(newFilePath, templateText);
    }

    //TODO: templateType as enum
    public static async getTemplateContent(templateType: string): Promise<string> {
        let extensionPath = vscode.extensions.getExtension('mechanicusH.pythonfiletemplates')!.extensionPath;
        let filePath = path.join(extensionPath, "src", "templates", templateType + ".txt");

        return await FileHandler.readFile(filePath);
    }
}