// Patterns for common secrets
const SECRET_PATTERNS = [
  // API Keys
  { pattern: /(?:api[_-]?key|apikey)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})/gi, type: 'API Key' },
  
  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/g, type: 'AWS Access Key' },
  { pattern: /aws[_-]?secret[_-]?access[_-]?key/gi, type: 'AWS Secret Key' },
  
  // Generic tokens
  { pattern: /(?:token|access[_-]?token)[\s]*[:=][\s]*['"]?([a-zA-Z0-9_\-]{20,})/gi, type: 'Access Token' },
  
  // Private keys (PEM format)
  { pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g, type: 'Private Key (PEM)' },
  
  // SSH Private Keys
  { pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g, type: 'SSH Private Key' },
  
  // Bitcoin Private Keys (WIF format)
  { pattern: /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,51}\b/g, type: 'Bitcoin Private Key' },
  
  // Ethereum Private Keys (hex format)
  { pattern: /\b(?:0x)?[a-fA-F0-9]{64}\b/g, type: 'Ethereum Private Key (potential)' },
  
  // Solana Private Keys (base58, ~87 chars)
  { pattern: /\b[1-9A-HJ-NP-Za-km-z]{87,88}\b/g, type: 'Solana Private Key' },
  
  // Metamask/Wallet Recovery Phrases (look for seed/mnemonic keywords)
  { pattern: /(?:seed|mnemonic|recovery|phrase)[\s:=]+['"]([a-z]+\s){11,23}[a-z]+['"]/gi, type: 'Crypto Seed Phrase' },
  
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
  { pattern: /(?:password|passwd|pwd)[\s]*[:=][\s]*['"]([^'"]{8,})['"]/gi, type: 'Hardcoded Password' },
  
  // JWT Tokens (Base64 format with 2 dots)
  { pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, type: 'JWT Token' },
  
  // Discord Bot Token
  { pattern: /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g, type: 'Discord Bot Token' },
  
  // Twilio API Key
  { pattern: /SK[a-z0-9]{32}/g, type: 'Twilio API Key' },
  
  // Mailgun API Key
  { pattern: /key-[0-9a-zA-Z]{32}/g, type: 'Mailgun API Key' },
  
  // Heroku API Key
  { pattern: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g, type: 'Heroku API Key (UUID format)' },
  
  // Firebase
  { pattern: /AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/g, type: 'Firebase Cloud Messaging Token' },
  
  // NPM Token
  { pattern: /npm_[A-Za-z0-9]{36}/g, type: 'NPM Access Token' },
  
  // Docker Hub Token
  { pattern: /dckr_pat_[a-zA-Z0-9_-]{36,}/g, type: 'Docker Hub Access Token' }
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
