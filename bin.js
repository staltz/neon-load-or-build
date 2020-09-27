#!/usr/bin/env node

var proc = require('child_process')
var os = require('os')
var fs = require('fs')
var path = require('path')

if (inProjectRepo()) {
  process.exit(0)
}

if (!buildFromSource()) {
  proc.exec('neon-load-or-build-test', function (err, stdout, stderr) {
    if (err) {
      console.error(stderr)
      preinstall()
    }
  })
} else {
  preinstall()
}

function build () {
  var args = ['neon', 'build', '--release']

  proc.spawn(args[0], args.slice(1), { stdio: 'inherit' }).on('exit', function (code) {
    if (code || !process.argv[3]) process.exit(code)
    exec(process.argv[3]).on('exit', function (code) {
      process.exit(code)
    })
  })
}

function preinstall () {
  if (!process.argv[2]) return build()
  exec(process.argv[2]).on('exit', function (code) {
    if (code) process.exit(code)
    build()
  })
}

function exec (cmd) {
  if (process.platform !== 'win32') {
    var shell = os.platform() === 'android' ? 'sh' : '/bin/sh'
    return proc.spawn(shell, ['-c', '--', cmd], {
      stdio: 'inherit'
    })
  }

  return proc.spawn(process.env.comspec || 'cmd.exe', ['/s', '/c', '"' + cmd + '"'], {
    windowsVerbatimArguments: true,
    stdio: 'inherit'
  })
}

function inProjectRepo () {
  var gitpath = path.join(process.cwd(), '.git')
  return fs.existsSync(gitpath)
}

function buildFromSource () {
  return hasFlag('--build-from-source') || process.env.npm_config_build_from_source === 'true'
}

// TODO (next major): remove in favor of env.npm_config_* which works since npm
// 0.1.8 while npm_config_argv will stop working in npm 7. See npm/rfcs#90
function hasFlag (flag) {
  if (!process.env.npm_config_argv) return false

  try {
    return JSON.parse(process.env.npm_config_argv).original.indexOf(flag) !== -1
  } catch (_) {
    return false
  }
}
