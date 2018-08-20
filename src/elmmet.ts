'use strict';

import * as vscode from 'vscode';
import {
  extractAbbreviation,
  parseAbbreviation,
  execCmd,
  getPureResultFromFormaterOutput
} from './util';
import { buildComposition } from './treeParser';

interface AbbreviationSource {
  abbr: string,
  rangeToReplace: vscode.Range,
};

class Elmmet {
  _formaterPrefixString: string = 'tempFormaterFunc = ';

  getAbbreviationSource() : AbbreviationSource {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage('No editor is active');
        return null;
    }
    let rangeToReplace: vscode.Range = editor.selection;
    let abbr = editor.document.getText(rangeToReplace);
    if (rangeToReplace.isEmpty) {
        [rangeToReplace, abbr] = extractAbbreviation(rangeToReplace.start);
    }

    return {
      rangeToReplace,
      abbr,
    }
  }

  generateMarkup(): void {
    const { abbr, rangeToReplace } = this.getAbbreviationSource();
    let tree = null;

    try {
      tree = parseAbbreviation(abbr);
    } catch(e) {
      console.log(e.message);
      return;
    }

    this.parseAbbreviationTree(tree)
      .then(result => this.insertSnippet(result, rangeToReplace));
  }

  parseAbbreviationTree(tree: any): Promise<string> {
    if (!tree) { return; }

    let parsingResult = buildComposition(tree);
    
    return this.formatResult(parsingResult);
  }

  formatResult(parsingResult: string): Promise<string> {
    const prefixString = this._formaterPrefixString;
    const format = execCmd('./node_modules/.bin/elm-format --stdin', {});
    format.stdin.write(prefixString + parsingResult);
    format.stdin.end();
  
    return format
      .then((value: { stdout: string, stderr: string }): string => 
        getPureResultFromFormaterOutput(value.stdout, prefixString.trim())
      )
      .catch(err => {
        console.log('Got an error while was formating the code with elm-format', err);
        return parsingResult;
      })
  }

  insertSnippet(snippet: string, rangeToReplace: vscode.Range): void {
    if (snippet === null) { return; }
    const editor = vscode.window.activeTextEditor;
    editor.insertSnippet(new vscode.SnippetString(snippet), rangeToReplace);
  }

  dispose() {
    // empty disposing method
  }
}

export default Elmmet;
