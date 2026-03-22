<div align="center">
  <h1 style="font-size: 80px; margin-bottom: 0;">READHIVE</h1>
  
  <p style="font-size: 24px; font-weight: bold; text-transform: uppercase; margin-top: 0; color: #00FF00; background: #000; display: inline-block; padding: 4px 12px; border: 4px solid #000; box-shadow: 4px 4px 0px 0px #000;">Collect articles. Read freely.</p>
</div>

## ⚡️ WHAT IS READHIVE?

**Readhive** is a local-first, distraction-free article reader designed for the modern web. It strips away the clutter, ads, and trackers, leaving you with nothing but the content you care about.

> [!TIP]
> **"Save them to your local library for ad-free offline-ready reading."**

Whether you're commuting, traveling, or just want a cleaner reading experience, Readhive is your personal sanctuary for written content.

---

## 🚀 CORE FEATURES

- **Instant Extraction**: Powered by Mozilla's Readability engine.
- **Local-First Storage**: Your articles stay on *your* device. No accounts, no tracking.
- **Offline-Ready**: Once saved, read anytime, anywhere.
- **Neo-Brutalist UI**: A bold, high-contrast interface designed for clarity and impact.
- **Ad-Free Experience**: Automatic clutter removal for a pure reading focus.

---

## 🧠 CORE LOGICS

### 1. Web Scraping & Content Extraction
Readhive uses a robust backend extraction pipeline utilizing `jsdom` and `@mozilla/readability`. It fetches the raw HTML of any URL, identifies the core content, and strips out boilerplate (navbars, ads, footers) to provide a semantic, clean version of the article.

### 2. Neo-brutalist Design System
The UI is built with a custom design system characterized by:
- **Heavy Borders**: 4px black borders for sharp definition.
- **Brash Colors**: Use of vibrant highlights (e.g., `#00FF00`) against stark whites and grays.
- **Typography**: High-impact display fonts for headers and clear mono-fonts for maximum readability.

### 3. Privacy-Centric Persistence
Storage is handled entirely via `localStorage`. This ensures zero server-side storage of user data, providing a truly private and local experience. The logic is encapsulated in a custom React hook `useArticles` for seamless state management across the app.

---

## 🏗️ TECH STACK

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Neo-brutalist theme)
- **Extraction**: [@mozilla/readability](https://github.com/mozilla/readability)
- **Icons**: [Lucide React](https://lucide.dev/)

---

<div align="center">
  <p>Built with ⚡️ by [Your Name/Handle]</p>
</div>
