function check(file, content) {
  const issues = {
    critical: [],
    warning: [],
    info: []
  };

  // Only check code files
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.py', '.rb', '.go', '.java'];
  const isCodeFile = codeExtensions.some(ext => file.endsWith(ext));
  
  if (!isCodeFile) return issues;

  // Check for console.log
  const consoleLogs = (content.match(/console\.(log|warn|error|debug|info)/g) || []).length;
  if (consoleLogs > 0) {
    issues.warning.push({
      file,
      message: `${consoleLogs} console statement${consoleLogs > 1 ? 's' : ''} found`
    });
  }

  // Check for debugger statements
  if (/debugger;?/g.test(content)) {
    issues.warning.push({
      file,
      message: 'Debugger statement found'
    });
  }

  // Check for TODO/FIXME comments
  const todos = (content.match(/\/\/\s*(TODO|FIXME|HACK|XXX|BUG)/gi) || []).length;
  if (todos > 0) {
    issues.info.push({
      file,
      message: `${todos} TODO/FIXME comment${todos > 1 ? 's' : ''} found`
    });
  }

  // Check for eval() usage (security risk) - but not in regex patterns or comments
  const evalMatches = content.match(/\beval\s*\(/g);
  if (evalMatches && !file.includes('checker') && !file.includes('test')) {
    issues.critical.push({
      file,
      message: 'eval() usage detected (security risk)'
    });
  }

  // Check for alert() in production code - but not in regex patterns or comments
  const alertMatches = content.match(/\balert\s*\(/g);
  if (alertMatches && !file.includes('checker') && !file.includes('test')) {
    issues.warning.push({
      file,
      message: 'alert() found (not production-ready)'
    });
  }

  return issues;
}

module.exports = { check };
