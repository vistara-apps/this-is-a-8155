# RightGuard AI

**Know your rights, anytime, anywhere.**

RightGuard AI is a mobile-first web application that provides instant, state-specific legal guidance and documentation tools during police interactions. Built with React, Tailwind CSS, and powered by AI.

![RightGuard AI Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=RightGuard+AI+Dashboard)

## 🚀 Features

### Core Features
- **State-Specific Rights & Scripts**: Mobile-optimized guides with 'do's and don'ts' during police interactions
- **Real-time Interaction Tools**: Quick audio/video recording and location-based emergency alerts
- **Secure Incident Logging**: Private, organized history of police interactions
- **Automated Shareable Summaries**: AI-generated summaries for legal counsel or support networks

### Premium Features
- **Real-time Emergency Alerts**: Automatic notifications to trusted contacts
- **Unlimited Incident Logging**: Store unlimited interaction records
- **Multi-language Support**: Rights information in multiple languages
- **AI-Powered Analysis**: Incident analysis and legal concern identification
- **Advanced Recording Features**: Enhanced audio/video capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend Services**: Supabase (Database, Auth, Storage)
- **AI Integration**: OpenAI GPT-3.5/4 for content generation
- **Payments**: Stripe for subscription management
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-8155.git
cd this-is-a-8155
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment template and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

### 4. Database Setup

Create the following tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY,
  subscription_status TEXT DEFAULT 'free',
  preferred_languages TEXT[] DEFAULT ARRAY['en'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Incidents Table
```sql
CREATE TABLE incidents (
  incident_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  timestamp TIMESTAMP WITH TIME ZONE,
  location TEXT,
  officer_details JSONB DEFAULT '{}',
  user_account TEXT,
  interaction_summary TEXT,
  recording_url TEXT,
  alert_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### State Guidelines Table
```sql
CREATE TABLE state_guidelines (
  state_code TEXT PRIMARY KEY,
  guideline_title TEXT,
  do_not_say TEXT,
  what_to_say TEXT,
  key_rights TEXT[],
  languages JSONB DEFAULT '{}'
);
```

#### Emergency Contacts Table
```sql
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── RightsGuide.jsx # State-specific rights display
│   ├── RecordingInterface.jsx # Recording functionality
│   ├── IncidentLog.jsx # Incident history
│   ├── EmergencyContacts.jsx # Contact management
│   └── ShareSheet.jsx  # Sharing functionality
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication logic
│   ├── useIncidents.js # Incident management
│   ├── useLocation.js  # Geolocation handling
│   └── useEmergencyContacts.js # Contact management
├── services/           # API and external services
│   ├── supabase.js     # Database operations
│   ├── openai.js       # AI content generation
│   ├── stripe.js       # Payment processing
│   └── alerts.js       # Emergency notifications
├── data/               # Static data and configurations
│   └── stateGuidelines.js # Default state guidelines
└── config/             # App configuration
    └── env.js          # Environment variables
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands above to create tables
3. Enable Row Level Security (RLS) on all tables
4. Set up authentication policies as needed

### OpenAI Integration

The app uses OpenAI for:
- Generating state-specific rights scripts
- Creating incident summaries
- Translating content to different languages
- Analyzing incidents for legal concerns

### Stripe Configuration

Set up Stripe products for:
- Premium monthly subscription ($5/month)
- Premium yearly subscription ($50/year)
- One-time state guide purchases ($2.99)

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Row Level Security**: Enable RLS on all Supabase tables
- **Input Validation**: All user inputs are validated client and server-side
- **Data Encryption**: Sensitive data is encrypted at rest
- **HTTPS Only**: All communications use HTTPS

## 📱 Mobile Optimization

The app is designed mobile-first with:
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Offline capability for core features
- Progressive Web App (PWA) support

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📈 Analytics & Monitoring

- **Error Tracking**: Integrated with Sentry
- **Analytics**: Google Analytics 4
- **Performance**: Web Vitals monitoring
- **Uptime**: Status page monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.rightguard.ai](https://docs.rightguard.ai)
- **Email Support**: support@rightguard.ai
- **Community**: [Discord Server](https://discord.gg/rightguard)

## 🗺️ Roadmap

- [ ] iOS/Android native apps
- [ ] Real-time video streaming
- [ ] Legal counsel integration
- [ ] Community-driven content
- [ ] Advanced analytics dashboard
- [ ] Multi-language expansion

## ⚖️ Legal Disclaimer

RightGuard AI provides educational information about legal rights and is not a substitute for professional legal advice. Always consult with a qualified attorney for specific legal situations.

---

**Built with ❤️ for civil rights and community safety**
