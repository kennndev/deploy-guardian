const fs = require('fs');
const path = require('path');

function check(targetDir) {
  const issues = {
    critical: [],
    warning: [],
    info: []
  };

  // Check for .env file in repo
  const envPath = path.join(targetDir, '.env');
  if (fs.existsSync(envPath)) {
    issues.critical.push({
      file: '.env',
      message: '.env file should NOT be committed (use .env.example instead)'
    });
  }

  // Check for .gitignore
  const gitignorePath = path.join(targetDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    issues.warning.push({
      file: '.gitignore',
      message: 'No .gitignore file found'
    });
  } else {
    // Check if .gitignore includes common patterns
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    const requiredPatterns = ['node_modules', '.env'];
    requiredPatterns.forEach(pattern => {
      if (!gitignoreContent.includes(pattern)) {
        issues.warning.push({
          file: '.gitignore',
          message: `Missing pattern: ${pattern}`
        });
      }
    });
  }

  // Check for package.json (if it's a Node project)
  const packagePath = path.join(targetDir, 'package.json');
  if (fs.existsSync(packagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      // Check for missing important fields
      if (!pkg.name) {
        issues.info.push({
          file: 'package.json',
          message: 'Missing "name" field'
        });
      }
      
      if (!pkg.version) {
        issues.info.push({
          file: 'package.json',
          message: 'Missing "version" field'
        });
      }

      // Check for dev dependencies in dependencies
      if (pkg.dependencies) {
        const devDeps = ['nodemon', 'jest', 'mocha', 'chai', 'eslint', 'prettier'];
        devDeps.forEach(dep => {
          if (pkg.dependencies[dep]) {
            issues.warning.push({
              file: 'package.json',
              message: `"${dep}" should be in devDependencies, not dependencies`
            });
          }
        });
      }
    } catch (err) {
      issues.warning.push({
        file: 'package.json',
        message: 'Invalid JSON format'
      });
    }
  }

  // Check for README
  const readmePath = path.join(targetDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    issues.info.push({
      file: 'README.md',
      message: 'No README file found'
    });
  }

  return issues;
}

module.exports = { check };
