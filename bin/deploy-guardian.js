#!/usr/bin/env node

const scanner = require('../lib/scanner');
const chalk = require('chalk');

const args = process.argv.slice(2);
const command = args[0] || 'check';

console.log(chalk.blue.bold('\n🛡️  Deploy Guardian v1.0.0\n'));

if (command === 'check') {
  const targetDir = args[1] || process.cwd();
  scanner.runScan(targetDir);
} else if (command === '--help' || command === '-h') {
  console.log(`
Usage:
  deploy-guardian check [directory]    Scan directory for issues (default: current)
  deploy-guardian --help              Show this help
  
Alias: dg

Examples:
  deploy-guardian check
  deploy-guardian check ./my-project
  dg check
  `);
} else {
  console.log(chalk.red('Unknown command. Use --help for usage.'));
  process.exit(1);
}
