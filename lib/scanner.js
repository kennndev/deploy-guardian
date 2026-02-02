const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const secretChecker = require('./checkers/secrets');
const mistakeChecker = require('./checkers/mistakes');
const bestPracticeChecker = require('./checkers/best-practices');

class Scanner {
  constructor(targetDir) {
    this.targetDir = targetDir;
    this.issues = {
      critical: [],
      warning: [],
      info: []
    };
  }

  async scan() {
    console.log(chalk.cyan(`📁 Scanning: ${this.targetDir}\n`));

    // Get all files (excluding node_modules, .git, etc.)
    const files = glob.sync('**/*', {
      cwd: this.targetDir,
      nodir: true,
      ignore: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'build/**',
        '.next/**',
        'coverage/**',
        '*.lock',
        'package-lock.json',
        'yarn.lock'
      ]
    });

    console.log(chalk.gray(`Found ${files.length} files to check...\n`));

    // Run checks
    for (const file of files) {
      const filePath = path.join(this.targetDir, file);
      const content = this.readFile(filePath);
      
      if (!content) continue;

      // Check for secrets
      const secretIssues = secretChecker.check(file, content);
      this.addIssues(secretIssues);

      // Check for common mistakes
      const mistakeIssues = mistakeChecker.check(file, content);
      this.addIssues(mistakeIssues);
    }

    // Check best practices (project-level)
    const practiceIssues = bestPracticeChecker.check(this.targetDir);
    this.addIssues(practiceIssues);

    this.printResults();
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      return null;
    }
  }

  addIssues(issues) {
    if (issues.critical) this.issues.critical.push(...issues.critical);
    if (issues.warning) this.issues.warning.push(...issues.warning);
    if (issues.info) this.issues.info.push(...issues.info);
  }

  printResults() {
    const totalIssues = 
      this.issues.critical.length + 
      this.issues.warning.length + 
      this.issues.info.length;

    console.log(chalk.bold('\n📊 Scan Results:\n'));

    if (totalIssues === 0) {
      console.log(chalk.green('✅ No issues found! Safe to deploy.\n'));
      process.exit(0);
    }

    // Critical issues
    if (this.issues.critical.length > 0) {
      console.log(chalk.red.bold(`🚨 CRITICAL (${this.issues.critical.length}):`));
      this.issues.critical.forEach(issue => {
        console.log(chalk.red(`  ❌ ${issue.file}: ${issue.message}`));
      });
      console.log('');
    }

    // Warnings
    if (this.issues.warning.length > 0) {
      console.log(chalk.yellow.bold(`⚠️  WARNINGS (${this.issues.warning.length}):`));
      this.issues.warning.forEach(issue => {
        console.log(chalk.yellow(`  ⚠️  ${issue.file}: ${issue.message}`));
      });
      console.log('');
    }

    // Info
    if (this.issues.info.length > 0) {
      console.log(chalk.blue.bold(`ℹ️  INFO (${this.issues.info.length}):`));
      this.issues.info.forEach(issue => {
        console.log(chalk.blue(`  ℹ️  ${issue.file}: ${issue.message}`));
      });
      console.log('');
    }

    // Summary
    console.log(chalk.bold('Summary:'));
    console.log(`  Critical: ${chalk.red(this.issues.critical.length)}`);
    console.log(`  Warnings: ${chalk.yellow(this.issues.warning.length)}`);
    console.log(`  Info: ${chalk.blue(this.issues.info.length)}`);
    console.log('');

    if (this.issues.critical.length > 0) {
      console.log(chalk.red.bold('⛔ NOT SAFE TO DEPLOY - Fix critical issues first!\n'));
      process.exit(1);
    } else if (this.issues.warning.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Review warnings before deploying\n'));
      process.exit(0);
    }
  }
}

function runScan(targetDir) {
  const scanner = new Scanner(targetDir);
  scanner.scan();
}

module.exports = { runScan };
