'use strict';

import * as vscode from 'vscode';
import { extractAbbreviation, parseAbbreviation, execCmd } from './util';

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

  parseAbbreviationTree(tree: any): string {
    if (!tree) { return; }

    let parsingResult = '';
    
    const format = execCmd('./node_modules/.bin/elm-format --stdin', {});

    format.stdin.write(a);
    format.stdin.end();
  
    format
      .then((value: { stdout: string, stderr: string }): void => {
        const { stdout, stderr } = value;
        console.log('stdout', stdout, stderr);
      })
      .catch(err => {
        console.log(err);
      })
  }

  dispose() {
    // empty disposing method
  }
}

export default Elmmet;

var b = `module App.View exposing (..)

import Html exposing (Html, div, img, h1, input, textarea, p, button, a, text)
import Html.Attributes exposing (class, src, placeholder, href)
import App.Messages exposing (Msg)
import App.Model exposing (Model)
import App.Router exposing (..)
import Header.View as Header
import Homepage.View as Homepage
`;

var a = `
view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ Header.view model
        , case model.routes of
            IndexRoute ->
                Homepage.view model

            PageRoute pageName ->
                sitePage pageName model

            EditCardRoute pageName cardId ->
                cardEditPage pageName cardId model

            GenerateAccessTokenRoute githubCode ->
                takingAccessToken githubCode

            PageNotFoundRoute ->
                notFound
        ]


sitePage : String -> Model -> Html Msg
sitePage pageName _ =
    div []
        [ h1 [] [ text "Page of rebbix site page" ]
        , p [ class "monospace" ] [ text pageName ]
        ]
cardEditPage : String -> String -> Model -> Html Msg
cardEditPage pageName cardId _ =
    div []
        [ h1 [] [ text "Card edit page" ]
        , p [ class "monospace" ] [ text <| pageName ++ ":" ++ cardId ]
        ]
takingAccessToken : Maybe GitHubCode -> Html msg
takingAccessToken githubCode =
    case githubCode of
        Just code ->
            div []
                [ h1 [] [ text "Taking access token" ]
                , p [ class "monospace" ] [ text <| "Code is: " ++ code ]
                ]

        Nothing ->
            div []
                [ h1 [] [ text "There is no github code presented" ]
                ]
notFound : Html Msg
notFound =
    div []
        [ p [] [ text "Page not found" ] ]`