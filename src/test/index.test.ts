declare const jest : any;
declare const expect: (any) => any;

import { parseAbbreviation } from "../util";
import Elmmet from "../elmmet";

describe("Elm formatter", () => {
  const elmmet = new Elmmet();

  const expand = abbr => {
    const tree = parseAbbreviation(abbr);
    return elmmet.parseAbbreviationTree(tree);
  };

  const abbreviations = [
    'div>p',
    'div>p*3',
    'div#a>p.b*2>span',
    'div>div>div',
    'table>tr*2>td{item}*2',
    'i{a}+i{b}',
    'img[src]/+p',
    'div>img[src]/+p',
    'div>p+img[src]/',
    'div>p+img[src]/+p',
    'div>p+img[src]/*2+p',
    'div>p+img[src]/*3+p',
    'div{foo}',
    'div>{foo}',
    'div>{foo}+{bar}',
    'div>{foo}+{bar}+p',
    'div>{foo}+{bar}+p+{foo}+{bar}+p',
    'div>{foo}+p+{bar}',
    'a[contenteditable]',
    'a[contenteditable=foo]',
    'div>ul>li.item#foo',
  ];

  Promise.all(
    abbreviations.map(abbreviation => {
      it(abbreviation, () => expand(abbreviation).then(markup => expect(markup).toMatchSnapshot()))
    })
  );
});
