# Culinary AI: Smart Fridge Assistant 🍳

A sleek, AI-powered cooking assistant that turns your fridge photos into gourmet recipes.

## 📱 Mobile App Release Guide

This project is built as a **Progressive Web App (PWA)**. You have two ways to "release" it as a mobile app:

### Option 1: The PWA Way (Recommended)
This is the fastest way to get your app on phones without dealing with the Play Store.

1.  **Host the App**: Deploy this code to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2.  **Set Environment Variables**: Add your `GEMINI_API_KEY` in the hosting provider's dashboard.
3.  **Install**: Open the URL in Chrome (Android) or Safari (iOS).
4.  **Add to Home Screen**: Tap the "Install App" button in the sidebar (or use the browser's "Add to Home Screen" menu).

### Option 2: The Native Android App (APK)
If you want a real `.apk` file to upload to the Google Play Store, you should use **Capacitor**.

#### Steps to convert to Native:
1.  **Install Capacitor** in your local project:
    ```bash
    npm install @capacitor/core @capacitor/cli
    npx cap init
    ```
2.  **Add Android Platform**:
    ```bash
    npm install @capacitor/android
    npx cap add android
    ```
3.  **Build and Sync**:
    ```bash
    npm run build
    npx cap copy
    npx cap open android
    ```
4.  **Generate APK**: This will open **Android Studio**, where you can click `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## 🛠️ Local Development

1.  Clone the repo.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file and add `VITE_GEMINI_API_KEY=your_key_here`.
4.  Run the dev server: `npm run dev`.

## 🚀 Features
- **Fridge Scanning**: Identify ingredients from photos.
- **AI Recipes**: Personalized suggestions based on what you have.
- **Voice Mode**: Step-by-step instructions read aloud.
- **Shopping List**: Track missing items.
