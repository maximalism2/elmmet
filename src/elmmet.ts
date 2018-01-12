import * as vscode from 'vscode';
import abbreviationParser from '@emmetio/abbreviation';
import extract from '@emmetio/extract-abbreviation';

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
        [rangeToReplace, abbr] = this.extractAbbreviation(rangeToReplace.start);
    }

    return {
      rangeToReplace,
      abbr,
    }
  }

  extractAbbreviation(position: vscode.Position): [vscode.Range, string] {
    let editor = vscode.window.activeTextEditor;
    let currentLine = editor.document.lineAt(position.line).text;
    let result = extract(currentLine, position.character, true);
    if (!result) {
        return [null, ''];
    }

    let rangeToReplace = new vscode.Range(position.line, result.location, position.line, result.location + result.abbreviation.length);
    return [rangeToReplace, result.abbreviation];
  }

  generateMarkup() {
    const abbreviations = this.getAbbreviationSource();
    let tree = null;

    try {
      tree = abbreviationParser(tree);
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