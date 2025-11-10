# Root Inside - MFDS AI MVP

AI-Powered Health Functional Food Ingredient & Formulation Compliance Checker

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Deployment**: Vercel (recommended)

## 🔑 Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to `.env.local`

## 📂 Project Structure

```
root-inside-mfds-mvp/
├── app/
│   ├── api/
│   │   └── formulation/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── Cozymom-Bio-MVP/
│   ├── ingredients_seed.csv      # Ingredient database
│   └── mixture_rules.csv         # Formulation rules
├── .env.local                    # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🧪 Test Cases

### Case A: Albumin Complex
```
알부민 300mg
비타민C 150mg
아연 10mg
```

### Case B: Bone & Circulation Complex
```
칼슘 600mg
마그네슘 200mg
비타민D 20µg
오메가3지방산 1.5g
```

### Case C: Ginseng Upper Limit Check
```
홍삼농축액 5%
비타민C 200mg
엽산 400µg
```

## ⚠️ Important Notice

This is a **demo/educational MVP system**. For actual product development:

- ✅ Verify against the latest MFDS guidelines
- ✅ Consult with licensed professionals (pharmacists, food scientists)
- ✅ Follow MFDS registration and approval procedures
- ✅ Conduct clinical trials and safety assessments as required

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Sign in to [Vercel](https://vercel.com/)
3. Click "Import Project" and select your repository
4. Add environment variable: `GEMINI_API_KEY`
5. Click "Deploy"

## 📄 License

MIT License

## 👥 Author

**Root Inside Co., Ltd.**

Made with ❤️ for Healthcare Innovation
