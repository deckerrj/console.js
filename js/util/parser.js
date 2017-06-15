define(function () {
  'use strict';
  function parser (text) {
    let index = 0;
    let parseState = 0;
    let parts = [];
    let currentPart = '';
    while (parseState >= 0 && index < text.length) {
      switch (parseState) {
        case 0: // init/space
          switch (text[index]) {
            case ';': parseState = -1; break;
            case ' ': break;
            case '"':
              parseState = 3;
              break;
            case "'":
              parseState = 2;
              break;
            default:
              currentPart += text[index];
              parseState = 1;
          }
          break;
        case 1: // text
          switch (text[index]) {
            case ';': parseState = -1; break;
            case ' ':
              parseState = 0;
              parts.push(currentPart);
              currentPart = '';
              break;
            case '"':
              parseState = 3;
              break;
            case "'":
              parseState = 2;
              break;
            default:
              currentPart += text[index];
          }
          break;
        case 2: // single quote
          switch (text[index]) {
            case "'":
              parseState = 1;
              break;
            default:
              currentPart += text[index];
          }
          break;
        case 3: // double quote
          switch (text[index]) {
            case '"':
              parseState = 1;
              break;
            default:
              currentPart += text[index];
          }
          break;
      }
      index++;
    }
    if (currentPart && parseState < 2) {
      parts.push(currentPart);
      currentPart = '';
    }
    return {
      text: text.substr(index),
      parts,
      parseState
    };
  }
  function line (text) {
    if (text == null) throw new Error('Invalid text')
    let parsed = {text};
    let lines = [];
    while (parsed.text) {
      parsed = parser(parsed.text);
      if (parsed.parseState > 1) break;
      lines.push(parsed.parts);
    }
    return {
      lines,
      isComplete: parsed.parseState <= 1,
      lastLine: parsed.text
    };
  }
  function options (opt, args) {
    //
  }
  return {line};
});