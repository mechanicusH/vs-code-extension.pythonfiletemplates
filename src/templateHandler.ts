import * as vscode from 'vscode';
import * as path from 'path';
import FileHandler from './filehandler';
import * as templateTypes from './TemplateTypes';

export default class TemplateHandler {
    public static async promptModuleName() : Promise<string> {
        
		let fileName = await vscode.window.showInputBox( {
			ignoreFocusOut: true,
			prompt: "Enter the module name (snake_case)"
		});
		
		if(fileName === undefined || fileName === "") {
			throw new Error("No name provided");
		}
        fileName = this.removePyFileExtension(fileName);
        return fileName + ".py";
    }

    public static async promtClassName() {
        
		let className = await vscode.window.showInputBox( {
			ignoreFocusOut: true,
			prompt: "Enter the class name (PascalCase)"
		});
		
		return this.getClassInformation(className);
    }
    
    public static async getClassInformation(className : string | undefined) {
        if(className === undefined || className === "") {
			throw new Error("No name provided");
		}
        className = this.removePyFileExtension(className); 
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

    public static removePyFileExtension(name: string) : string {
        
        let extension = path.extname(name);
        if(extension !== '.py')
        {
            return name;
        }
        
        return name.substring(0, name.length-3);
    }

    public static async writeTemplate(newFilePath: string, templateType: templateTypes.TemplateType, tokens?: Map<string, string>) {
        let templateText = await TemplateHandler.getTemplateContent(templateType);
        
        if(tokens) {
            templateText = await TemplateHandler.replaceTemplatePlaceholders(templateText, tokens);
        }
            
        FileHandler.writeFile(newFilePath, templateText);
    }

    public static async getTemplateContent(templateType: templateTypes.TemplateType): Promise<string> {
        return vscode.workspace.getConfiguration('pythonfiletemplates').get(`${templateType}TemplateText`) as string;
    }
}