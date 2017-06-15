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

    createLine () {
      if (this.currentLine) this.currentLine.parentElement.appendChild(document.createElement('br'));
      let lineElem = document.createElement('span');
      let textElem = document.createElement('span');
      lineElem.appendChild(textElem);
      this.rootElem.insertBefore(lineElem, this.rootElem.lastChild);
      return textElem;
    }

    addText (text) {
      if (!this.currentLine) this.currentLine = this.createLine();
      let lines = text.split('\n');
      for (let i = 0; i < lines.length; ++i) {
        if (i > 0) {
          this.currentLine = this.createLine();
        }
        this.currentLine.innerHTML += lines[i].replace(/ /g, '&nbsp;');
      }
      this.rootElem.scrollTop = this.rootElem.scrollHeight;
    }

    onStdout (text) {
      this.addText(text);
    }

    onStderr (text) {
      this.addText(text);
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
            this.stdout.write(`$&nbsp;${this.textBuffer.replace(/ /g, '&nbsp;')}\n`);
            this.stdin.write(this.textBuffer + '\n');
            this.textBuffer = '';
            break;
        }
      }
      if (oldText !== this.textBuffer) this.inputElem.innerHTML = this.textBuffer.replace(/ /g, '&nbsp');
    }
  };
});