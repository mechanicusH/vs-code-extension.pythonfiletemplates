// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { File } from 'buffer';
import TemplateHandler from './templateHandler';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pythonfiletemplates" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let commands = [
		vscode.commands.registerCommand('pythonfiletemplates.createModule', async (args) => {
			try {
				let filePath = (args._fsPath ?? args.fsPath ?? args.path) as string;
				let fileName = await TemplateHandler.promptModuleName();
				TemplateHandler.writeTemplate(path.join(filePath, fileName), 'module');

				openFile(path.join(filePath, fileName));
			}
			catch {
				vscode.window.showErrorMessage("Error creating file from template. See output for details");
				// TODO: Error logging
			}
		}),
		vscode.commands.registerCommand('pythonfiletemplates.createClass', async (args) => {
			try {
				let filePath = (args._fsPath ?? args.fsPath ?? args.path) as string;
				let classInformation = await TemplateHandler.promtClassName();
	
				let tokens = (new Map<string, string>()).set('className', classInformation.className);
	
				TemplateHandler.writeTemplate(path.join(filePath, classInformation.fileName), 'class', tokens);
				openFile(path.join(filePath, classInformation.fileName));
			}
			catch {
				vscode.window.showErrorMessage("Error creating file from template. See output for details");
				// TODO: Error logging
			}
		})
	];

	commands.forEach((command) => context.subscriptions.push(command));
}

// This method is called when your extension is deactivated
export function deactivate() {}

export function openFile(filePath: string)
{
	var openPath = vscode.Uri.file(filePath);
	vscode.workspace.openTextDocument(openPath).then(doc => {
		vscode.window.showTextDocument(doc);
	  });
}