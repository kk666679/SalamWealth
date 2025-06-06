# SalamWealth Connect

SalamWealth Connect is a modern Islamic financial platform built with Next.js, offering Shariah-compliant financial solutions for Malaysian families and businesses.

![SalamWealth Homepage](https://raw.githubusercontent.com/yourusername/salamwealth/main/public/screenshots/homepage.png)

## Features

### 🏦 Islamic Financing
Shariah-compliant personal and business financing solutions with competitive rates and flexible terms.

### 📈 Halal Investments
Including ASB, sukuk, and Islamic unit trusts. Grow your wealth through our curated halal investment platform.

### 🕌 Zakat Management
Automated zakat calculation and distribution system with verified recipients.

## Screenshots

### Homepage
![Homepage](https://raw.githubusercontent.com/yourusername/salamwealth/main/public/screenshots/homepage.png)

### Dashboard
![Dashboard](https://raw.githubusercontent.com/yourusername/salamwealth/main/public/screenshots/dashboard.png)

### Calculator
![Calculator](https://raw.githubusercontent.com/yourusername/salamwealth/main/public/screenshots/calculator.png)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Custom auth with secure session management
- **Database**: Supabase
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/salamwealth.git
cd salamwealth
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes, you can use these demo accounts:

- **Ahmad bin Abdullah**
  - Email: ahmad@example.com
  - Password: password123

- **Siti binti Rahman**
  - Email: siti@example.com
  - Password: password123

## Project Structure

```
SalamWealth/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── financing/         # Financing features
│   └── investment/        # Investment features
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── auth/             # Auth components
├── lib/                   # Utilities and configurations
│   ├── auth/             # Auth utilities
│   ├── db/               # Database utilities
│   └── supabase/         # Supabase client
├── public/               # Static assets
└── styles/               # Global styles
```

## Features in Detail

### Islamic Financing
- Personal financing
- Business financing
- Home financing
- Vehicle financing
- Education financing

### Halal Investments
- ASB investment tracking
- Sukuk investments
- Islamic unit trusts
- Gold investments
- Investment calculators

### Zakat Management
- Automated calculations
- Multiple asset types support
- Distribution tracking
- Annual reminders

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Tailwind CSS for the utility-first CSS framework
- All contributors who have helped shape this project
