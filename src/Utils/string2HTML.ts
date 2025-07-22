import xss from 'xss';
import Handlebars from 'handlebars';
import Mexp from 'math-expression-evaluator';
import { marked } from 'marked';

import { numberFormattingFunction } from './numberFormattingFunction';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDescendantProp(data: any, desc: string) {
  const renderer = new marked.Renderer();
  const mexp = new Mexp();
  renderer.link = ({ href, title, text }) => {
    const target = href.startsWith('/') ? '_self' : '_blank';
    return `<a href="${href}" target="${target}" title="${title || ''}">${text}</a>`;
  };

  Handlebars.registerHelper('formatNumber', value => {
    if (typeof value === 'string') return value;
    return numberFormattingFunction(value);
  });
  Handlebars.registerHelper('mathExpression', expression => {
    const tempTemplate = Handlebars.compile(expression);
    const exp = tempTemplate(data);
    const result = mexp.eval(exp);
    return result;
  });
  Handlebars.registerHelper('mathExpressionWithFormatting', expression => {
    const tempTemplate = Handlebars.compile(expression);
    const exp = tempTemplate(data);
    const result = mexp.eval(exp);
    return numberFormattingFunction(result);
  });

  marked.setOptions({ renderer });
  Handlebars.registerHelper('markdown', text => {
    return marked.parse(text || '');
  });
  const template = Handlebars.compile(desc);
  return template(data);
}

function decodeHTMLEntities(input: string) {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function string2HTML(htmlString: string, data?: any) {
  // Custom XSS filter configuration
  const options = {
    whiteList: {
      b: ['class', 'id', 'style'],
      i: ['class', 'id', 'style'],
      strong: ['class', 'id', 'style'],
      em: ['class', 'id', 'style'],
      u: ['class', 'id', 'style'],
      small: ['class', 'id', 'style'],
      sub: ['class', 'id', 'style'],
      sup: ['class', 'id', 'style'],
      mark: ['class', 'id', 'style'],
      br: ['class', 'id', 'style'],
      hr: ['class', 'id', 'style'],
      p: ['class', 'id', 'style'],
      div: ['class', 'id', 'style'],
      span: ['class', 'id', 'style'],
      blockquote: ['class', 'id', 'style'],
      pre: ['class', 'id', 'style'],
      code: ['class', 'id', 'style'],
      h1: ['class', 'id', 'style'],
      h2: ['class', 'id', 'style'],
      h3: ['class', 'id', 'style'],
      h4: ['class', 'id', 'style'],
      h5: ['class', 'id', 'style'],
      h6: ['class', 'id', 'style'],
      ul: ['class', 'id', 'style'],
      ol: ['class', 'id', 'style'],
      li: ['class', 'id', 'style'],
      dl: ['class', 'id', 'style'],
      dt: ['class', 'id', 'style'],
      dd: ['class', 'id', 'style'],
      table: ['class', 'id', 'style'],
      thead: ['class', 'id', 'style'],
      tbody: ['class', 'id', 'style'],
      tfoot: ['class', 'id', 'style'],
      tr: ['class', 'id', 'style'],
      th: ['class', 'id', 'style'],
      td: ['class', 'id', 'style'],
      caption: ['class', 'id', 'style'],
      img: ['class', 'id', 'style', 'src', 'alt', 'width', 'height'],
      figure: ['class', 'id', 'style'],
      figcaption: ['class', 'id', 'style'],
      a: ['class', 'id', 'style', 'href', 'title'],
      abbr: ['class', 'id', 'style', 'title'],
      cite: ['class', 'id', 'style'],
      dfn: ['class', 'id', 'style'],
      kbd: ['class', 'id', 'style'],
      samp: ['class', 'id', 'style'],
    },
    css: {
      whiteList: {
        color: true,
        background: true,
        'background-color': true,
        'background-image': true,
        'font-size': true,
        'font-weight': true,
        'text-transform': true,
        'font-style': true,
        'font-family': true,
        'text-align': true,
        margin: true,
        padding: true,
        border: true,
        overflow: true,
        'overflow-x': true,
        'overflow-y': true,
        'border-radius': true,
        'border-color': true,
        display: true,
        flex: true,
        'flex-direction': true,
        'flex-wrap': true,
        'flex-flow': true,
        'flex-shrink': true,
        'flex-grow': true,
        order: true,
        'flex-basis': true,
        'align-self': true,
        gap: true,
        'row-gap': true,
        'column-gap': true,
        'justify-content': true,
        'align-items': true,
        'align-content': true,
        width: true,
        height: true,
        position: true,
        top: true,
        left: true,
        right: true,
        bottom: true,
        'padding-top': true,
        'padding-left': true,
        'padding-right': true,
        'padding-bottom': true,
        'margin-top': true,
        'margin-left': true,
        'margin-right': true,
        'margin-bottom': true,
        'border-top': true,
        'border-left': true,
        'border-right': true,
        'border-bottom': true,
        'z-index': true,
        'word-wrap': true,
        visibility: true,
        opacity: true,
        filter: true,
        transform: true,
        transition: true,
        cursor: true,
        clip: true,
        hyphens: true,
        direction: true,
        'word-break': true,
        'max-width': true,
        'min-width': true,
        'max-height': true,
        'min-height': true,
        fill: true,
        'clip-path': true,
        'border-width': true,
        'border-style': true,
        'box-sizing': true,
        'grid-template-rows': true,
        'grid-template-columns': true,
        'font-variant': true,
        'letter-spacing': true,
        'line-height': true,
        'text-decoration': true,
        'text-indent': true,
        'white-space': true,
        'word-spacing': true,
        'box-shadow': true,
        'transition-property': true,
        'transition-duration': true,
        'transition-timing-function': true,
        'animation-name': true,
        'animation-duration': true,
      },
    },
  };
  if (!data) return xss(htmlString, options);
  const replacedString = xss(getDescendantProp(data, htmlString), options);
  return decodeHTMLEntities(replacedString);
}
