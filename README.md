# AAT Automator

AI-Powered Assignment Assistant that generates professional slides and comprehensive reports using Google's Gemini AI.

## Features

- **Slide Generation**: Creates 20 professional PowerPoint slides with detailed bullet points
- **Report Generation**: Generates comprehensive academic reports in Word format
- **Thank You Slide**: Automatic thank you slide with student details
- **Dark/Light Theme**: Toggle between dark and light modes
- **API Key Privacy**: Keys are used locally and never saved

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Framer Motion
- PptxGenJS
- Lucide React Icons

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Rahul-14507/AAT.git
cd AAT
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Usage

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Enter your API key, subject, and problem statement
3. Fill in your student details (optional, for PPT)
4. Select what to generate (Slides, Report, or both)
5. Click "Generate Content"
6. Download your PPT and/or Report

## Deployment

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Deploy (no configuration needed)

## License

MIT
