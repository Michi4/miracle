// Helper: create a bcrypt hash for ADMIN_PASSWORD_HASH. Password is read
// hidden from stdin (never as argv, never logged, never stored plaintext).
// Usage: node hash-password.mjs
import bcrypt from 'bcryptjs'
import readline from 'node:readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
function askHidden(q) {
  return new Promise((resolve) => {
    const stdin = process.stdin
    process.stdout.write(q)
    if (stdin.isTTY) stdin.setRawMode(true)
    let pw = ''
    const onData = (ch) => {
      const s = ch.toString()
      if (s === '\n' || s === '\r' || s === '\u0004') {
        if (stdin.isTTY) stdin.setRawMode(false)
        process.stdout.write('\n')
        stdin.removeListener('data', onData)
        rl.close()
        resolve(pw)
      } else if (s === '\u0003') {
        process.exit(1)
      } else if (s === '\u007f') {
        pw = pw.slice(0, -1)
      } else {
        pw += s
      }
    }
    stdin.on('data', onData)
  })
}

const a = await askHidden('Neues Admin-Passwort: ')
if (a.length < 10) { console.error('Fehler: mindestens 10 Zeichen.'); process.exit(1) }
const b = await askHidden('Wiederholen: ')
if (a !== b) { console.error('Fehler: stimmt nicht überein.'); process.exit(1) }
const hash = bcrypt.hashSync(a, 12)
console.log('\nADMIN_PASSWORD_HASH=' + hash)
