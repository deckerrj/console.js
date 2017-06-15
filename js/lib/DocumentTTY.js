define(['./TTY'], function (TTY) {
  'use strict';
  return class DocumentTTY extends TTY {
    constructor (elem) {
      super();
      this.rootElem = elem;
      this.promptElem = document.createElement('span');
      let promptText = document.createElement('span');
      promptText.innerHTML = '$&nbsp;';
      this.promptElem.appendChild(promptText);
      this.inputElem = document.createElement('span');
      this.promptElem.appendChild(this.inputElem);
      this.rootElem.appendChild(this.promptElem);
      this.keyDown = this.keyDown.bind(this);
      this.textBuffer = '';
    }

    printLn (text) {
      let line = document.createElement('span');
      line.appendChild(document.createElement('span'))
      line.innerHTML = text.replace(/ /g, '&nbsp;');
      line.appendChild(document.createElement('br'));
      this.rootElem.insertBefore(line, this.rootElem.lastChild);
      this.rootElem.scrollTop = this.rootElem.scrollHeight;
    }

    toStdout (text) {
      this.printLn(text);
    }

    toStderr (text) {
      this.printLn(text);
    }

    keyDown (event) {
      let oldText = this.textBuffer;
      if (event.ctrlKey) {
        switch (event.code) {
          case 'KeyD': // eof
            this.emit('stdin', null);
            break;
          case 'KeyC': // SIGINT
            break;
          case 'KeyU': // SIGKILL
            break;
          case 'Backslash': // SIGQUIT
            break;
          case 'KeyZ': // suspend
            break;
        }
      } else if (event.key.length === 1) {
        this.textBuffer += event.key;
      } else {
        switch (event.key) {
          case 'Backspace':
            event.preventDefault();
            this.textBuffer = this.textBuffer.slice(0, -1);
            break;
          case 'Enter':
            event.preventDefault();
            //this.emit('stdin', this.textBuffer);
            //this.stdin.emit('data', this.textBuffer);
            this.printLn('$&nbsp;' + this.textBuffer.replace(/ /g, '&nbsp;'));
            this.toStdin(this.textBuffer);
            this.textBuffer = '';
            break;
        }
      }
      if (oldText !== this.textBuffer) this.inputElem.innerHTML = this.textBuffer.replace(/ /g, '&nbsp');
    }
  };
});