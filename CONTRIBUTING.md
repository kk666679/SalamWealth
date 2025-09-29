# Contributing to SalamWealth Connect

Thank you for your interest in contributing to SalamWealth Connect! We welcome contributions from the community to help improve this Islamic financial platform.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (LTS)
- pnpm (recommended) or npm
- Git
- Docker (for local development)

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/salamwealth.git
   cd salamwealth
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
5. Start local development:
   ```bash
   pnpm run dev
   ```

## 📋 Development Workflow

### 1. Choose an Issue
- Check the [TODO.md](TODO.md) for current tasks
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Your Changes
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Test your changes thoroughly
- Update documentation if needed

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for adding tests
- `chore:` for maintenance

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```
Then create a pull request on GitHub.

## 🏗️ Project Structure

```
salamwealth-refactored/
├── apps/
│   ├── web/                 # Next.js Frontend
│   └── api/                 # Nest.js Backend
├── packages/
│   └── database/           # Prisma Database Package
├── docker-compose.yml
└── package.json
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e
```

### Testing Guidelines
- Write unit tests for all new functions
- Include integration tests for API endpoints
- Add e2e tests for critical user flows
- Ensure all tests pass before submitting PR

## 📝 Code Style

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional components in React

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use kebab-case for file names
- Use UPPER_CASE for constants

### Commit Messages
Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

## 🔒 Security Considerations

### Islamic Finance Compliance
- Ensure all financial calculations follow Shariah principles
- Validate Islamic finance rules in code
- Document compliance decisions

### Data Privacy
- Never commit sensitive data
- Use environment variables for secrets
- Follow GDPR and local privacy laws

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document API endpoints with examples
- Update README for new features

### Pull Request Guidelines
- Provide clear description of changes
- Reference related issues
- Include screenshots for UI changes
- List any breaking changes

## 🎯 Code Review Process

1. Automated checks run on PR
2. At least one maintainer reviews code
3. Address review comments
4. CI/CD must pass
5. Squash commits before merge

## 🐛 Reporting Issues

### Bug Reports
- Use the bug report template
- Include steps to reproduce
- Provide environment details
- Add screenshots if applicable

### Feature Requests
- Check if feature already exists
- Provide detailed use case
- Consider implementation complexity

## 📞 Communication

- Use GitHub Issues for bugs and features
- Join our Discord for discussions
- Follow code of conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to SalamWealth Connect! 🎉
