import { emitKeypressEvents } from 'node:readline';

export function askPassword(label, input = process.stdin, output = process.stdout) {
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run owner setup in an interactive terminal.');
  }
  return new Promise((resolve, reject) => {
    let value = '';
    const wasRaw = !!input.isRaw;
    emitKeypressEvents(input);
    const finish = (error) => {
      input.removeListener('keypress', onKey);
      input.setRawMode(wasRaw);
      input.pause();
      output.write('\n');
      if (error) reject(error); else resolve(value);
    };
    const onKey = (text, key = {}) => {
      if (key.ctrl && key.name === 'c') return finish(new Error('Owner setup cancelled.'));
      if (key.name === 'return' || key.name === 'enter') return finish();
      if (key.name === 'backspace') {
        if (value.length) { value = value.slice(0, -1); output.write('\b \b'); }
        return;
      }
      if (key.ctrl || key.meta || !text || /[\x00-\x1f\x7f\x1b]/.test(text)) return;
      value += text;
      output.write('*'.repeat(text.length));
    };
    input.on('keypress', onKey);
    input.setRawMode(true);
    input.resume();
    output.write(label);
  });
}
