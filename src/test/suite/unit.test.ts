import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import TemplateHandler from '../../templateHandler';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start unit tests.');

    test('TemplateHandler.getClassInformation: all lowercase returns same classname an file name', async () => {
		let result = await TemplateHandler.getClassInformation('abcd');
        		
		assert.strictEqual(result.className, "abcd");
        assert.strictEqual(result.className + ".py", result.fileName);
	});
    
    test('TemplateHandler.getClassInformation: CamelCase returns fileName in snake case', async () => {
		let result = await TemplateHandler.getClassInformation('abCde');
        		
		assert.strictEqual(result.className, "abCde");
		assert.strictEqual(result.fileName, "ab_cde.py");
	});
    
    test('TemplateHandler.getClassInformation: upper case at start is not replaced by _', async () => {
		let result = await TemplateHandler.getClassInformation('AbCde');
        		
		assert.strictEqual(result.className, "AbCde");
		assert.strictEqual(result.fileName, "ab_cde.py");
	});

    test('TemplateHandler.getClassInformation: digits do not get replaced', async () => {
		let result = await TemplateHandler.getClassInformation('AbCde0');
        		
		assert.strictEqual(result.className, "AbCde0");
		assert.strictEqual(result.fileName, "ab_cde0.py");
	});
    
    test('TemplateHandler.getClassInformation: empty and undefined throws Error', async () => {
        assert.rejects(TemplateHandler.getClassInformation(''), Error, 'No name provided');
        assert.rejects(TemplateHandler.getClassInformation(undefined), Error, 'No name provided');
	});
    
    
    test('TemplateHandler.replaceTemplatePlaceholders: empty map returns unchanged text', async () => {
        let result = await TemplateHandler.replaceTemplatePlaceholders('token: $_something', new Map<string, string>());
        
        assert.strictEqual(result, 'token: $_something');
	});
    
    test('TemplateHandler.replaceTemplatePlaceholders: one token gets replaced', async () => {
        let map = (new Map<string, string>())
            .set('something', 'replacedValue');
        let result = await TemplateHandler.replaceTemplatePlaceholders('token: $_something', map);
        
        assert.strictEqual('token: replacedValue', result);
	});

    test('TemplateHandler.replaceTemplatePlaceholders: multiple tokens get replaced', async () => {
        let map = (new Map<string, string>())
            .set('something', 'replacedValue')
            .set('somethingElse', 'secondReplacedValue');
        let result = await TemplateHandler.replaceTemplatePlaceholders('token: $_something, $_somethingElse', map);
        
        assert.strictEqual('token: replacedValue, secondReplacedValue', result);
	});

    test('TemplateHandler.replaceTemplatePlaceholders: tokens not in map do not get replaced', async () => {
        let map = (new Map<string, string>())
            .set('something', 'replacedValue');
        let result = await TemplateHandler.replaceTemplatePlaceholders('token: $_something, $_somethingElse', map);
        
        assert.strictEqual('token: replacedValue, $_somethingElse', result);
	});
});
