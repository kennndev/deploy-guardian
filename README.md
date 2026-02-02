# 🛡️ Deploy Guardian

**Pre-deployment security and quality checker for developers**

Never accidentally commit API keys, passwords, or debug code again. Deploy Guardian scans your project before deployment and catches common security issues and mistakes.

## Features

✅ **Secret Detection** - Finds exposed API keys, tokens, passwords  
⚠️ **Mistake Detection** - Catches console.logs, debugger statements, TODOs  
📋 **Best Practices** - Checks for .env files, .gitignore, package.json issues  
🚀 **Fast & Local** - Runs on your machine, never uploads your code  
💻 **Zero Config** - Works out of the box  

## Installation

```bash
npm install -g deploy-guardian
```

## Usage

### Check current directory
```bash
deploy-guardian check
```

### Check specific directory
```bash
deploy-guardian check ./my-project
```

### Short alias
```bash
dg check
```

## What It Checks

### 🚨 Critical Issues (Blocks deployment)
- Exposed API keys (AWS, Stripe, GitHub, etc.)
- Database connection strings
- Private keys
- Hardcoded passwords
- .env files in repo
- eval() usage

### ⚠️ Warnings (Should fix)
- console.log statements
- debugger statements
- alert() calls
- Missing .gitignore
- Dev dependencies in dependencies

### ℹ️ Info (Nice to have)
- TODO/FIXME comments
- Missing README
- Missing package.json fields

## Example Output

```
🛡️  Deploy Guardian v1.0.0

📁 Scanning: ./my-project

Found 42 files to check...

📊 Scan Results:

🚨 CRITICAL (2):
  ❌ config.js: Exposed API Key detected (1 occurrence)
  ❌ .env: .env file should NOT be committed

⚠️  WARNINGS (5):
  ⚠️  app.js: 3 console statements found
  ⚠️  debug.js: Debugger statement found

Summary:
  Critical: 2
  Warnings: 5
  Info: 1

⛔ NOT SAFE TO DEPLOY - Fix critical issues first!
```

## Supported Secrets (30+ patterns)

**Cloud Providers:**
- AWS Access Keys
- Heroku API Keys

**Version Control:**
- GitHub Personal Access Tokens
- NPM Access Tokens

**Payment:**
- Stripe API Keys (live and test)

**Communication:**
- Slack Tokens
- Discord Bot Tokens
- Twilio API Keys
- SendGrid API Keys
- Mailgun API Keys

**Crypto & Wallets:**
- Bitcoin Private Keys (WIF)
- Ethereum Private Keys
- Solana Private Keys
- Crypto Seed Phrases
- Private Keys (PEM, SSH, OpenSSH)

**Auth & Tokens:**
- JWT Tokens
- Google OAuth Client IDs
- Firebase Tokens
- Generic API keys and access tokens

**Infrastructure:**
- Database URLs (PostgreSQL, MySQL, MongoDB)
- Docker Hub Access Tokens

**Security:**
- Hardcoded passwords
- Private keys (RSA, EC, DSA, OpenSSH)

## Best Practices

Run before every deployment:
```bash
dg check && npm run deploy
```

Add to your CI/CD:
```yaml
- name: Security Check
  run: npx deploy-guardian check
```

Git pre-commit hook:
```bash
#!/bin/sh
deploy-guardian check || exit 1
```

## Coming Soon 🚀

- Auto-fix mode
- AI-powered analysis
- Custom rule configuration
- Integration with popular CI/CD platforms

## Why Deploy Guardian?

**Real stories:**
- Developer pushed AWS keys to GitHub → $10,000 bill in 2 hours
- Startup leaked database URL → entire user data exposed
- Production deploy with 200 console.logs → degraded performance

Don't let this happen to you.

## Author

Created by [@kennndev](https://github.com/kennndev)

Powered by Nyx ✨

## License

MIT

---

**Safe deploys, every time.** 🛡️
