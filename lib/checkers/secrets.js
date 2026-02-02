// Patterns for common secrets
const SECRET_PATTERNS = [
  // API Keys
  { pattern: /(?:api[_-]?key|apikey)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})/gi, type: 'API Key' },
  
  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/g, type: 'AWS Access Key' },
  { pattern: /aws[_-]?secret[_-]?access[_-]?key/gi, type: 'AWS Secret Key' },
  
  // Generic tokens
  { pattern: /(?:token|access[_-]?token)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})/gi, type: 'Access Token' },
  
  // Private keys
  { pattern: /-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----/g, type: 'Private Key' },
  
  // Database URLs
  { pattern: /(?:postgres|mysql|mongodb):\/\/[^\s]+/gi, type: 'Database URL' },
  
  // Stripe
  { pattern: /sk_live_[a-zA-Z0-9]{24,}/g, type: 'Stripe Secret Key' },
  { pattern: /pk_live_[a-zA-Z0-9]{24,}/g, type: 'Stripe Publishable Key' },
  
  // Google OAuth
  { pattern: /[0-9]+-[a-zA-Z0-9_]{32}\.apps\.googleusercontent\.com/g, type: 'Google OAuth Client ID' },
  
  // GitHub Token
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, type: 'GitHub Personal Access Token' },
  
  // Slack
  { pattern: /xox[baprs]-[a-zA-Z0-9-]{10,}/g, type: 'Slack Token' },
  
  // SendGrid
  { pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, type: 'SendGrid API Key' },
  
  // Generic password in code
  { pattern: /(?:password|passwd|pwd)[\s]*[:=][\s]*['"]([^'"]{8,})['"]/gi, type: 'Hardcoded Password' }
];

function check(file, content) {
  const issues = {
    critical: [],
    warning: [],
    info: []
  };

  // Skip if it's a .env.example file
  if (file.includes('.env.example') || file.includes('.env.sample')) {
    return issues;
  }

  // Check each pattern
  SECRET_PATTERNS.forEach(({ pattern, type }) => {
    const matches = content.match(pattern);
    if (matches) {
      issues.critical.push({
        file,
        message: `Exposed ${type} detected (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`
      });
    }
  });

  return issues;
}

module.exports = { check };
