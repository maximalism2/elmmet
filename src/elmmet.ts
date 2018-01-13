'use strict';

import * as vscode from 'vscode';
import { extractAbbreviation, parseAbbreviation } from './util';

interface AbbreviationSource {
  abbr: string,
  rangeToReplace: vscode.Range,
};

class Elmmet {
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
    const abbreviations = this.getAbbreviationSource();
    let tree = null;

    try {
      tree = parseAbbreviation(abbreviations.abbr);
    } catch(e) {
      console.log(e.message);
      return;
    }

    this.parseAbbreviationTree(tree);
  }

  parseAbbreviationTree(tree: any): void {
    console.log(tree);
  }

  dispose() {
    // empty method for dispossing class
  }
}

export default Elmmet;