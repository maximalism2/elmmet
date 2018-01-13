'use strict';

import * as vscode from 'vscode';
import * as extract from '@emmetio/extract-abbreviation';
import * as abbreviationParser from '@emmetio/abbreviation';

export function extractAbbreviation(position: vscode.Position): [vscode.Range, string] {
    let editor = vscode.window.activeTextEditor;
    let currentLine = editor.document.lineAt(position.line).text;
    let result = extract(currentLine, position.character, true);
    if (!result) {
        return [null, ''];
    }

    let rangeToReplace = new vscode.Range(position.line, result.location, position.line, result.location + result.abbreviation.length);
    return [rangeToReplace, result.abbreviation];
}

export function parseAbbreviation(abbr: string): any {
    let result = null;

    try {
        result = abbreviationParser(abbr);
    } catch(e) {
        console.log('tree parsing error: ', e.message);
    }

    return result;
}
