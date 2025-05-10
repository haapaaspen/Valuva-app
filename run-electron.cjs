#!/usr/bin/env node

// This is a CommonJS file that starts the Electron app
const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');

const child = spawn(electron, [__dirname], { 
  stdio: 'inherit',
  windowsHide: false
});

child.on('close', (code) => {
  process.exit(code);
}); 