// Starts the server and frontend together. Usage: npm run dev [-- <media folder>]
// The folder goes to the server as BUBBLEGUM_MEDIA rather than as a command-line argument, so no
// shell quoting is involved (concurrently's argument passthrough single-quotes paths, which cmd.exe
// on Windows keeps as part of the path).
const path = require('path')
const { concurrently } = require('concurrently')

const env = {}
if (process.argv[2]) {
  // Relative paths are relative to where npm run was started
  env.BUBBLEGUM_MEDIA = path.resolve(process.env.INIT_CWD || process.cwd(), process.argv[2])
}

const { result } = concurrently([
  { command: 'npm -w server start', name: 'server', prefixColor: 'blue', env },
  { command: 'npm -w frontend run dev', name: 'frontend', prefixColor: 'green' }
], { killOthersOn: ['failure', 'success'], cwd: path.join(__dirname, '..') })

result.catch(() => { process.exitCode = 1 })
