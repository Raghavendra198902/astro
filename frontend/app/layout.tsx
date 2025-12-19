import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AstroAI - Advanced Vedic & Western Astrology Platform',
  description: 'Experience the future of astrology with AI-powered predictions, chart analysis, and personalized insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>{`
          :root {
            --background: #0a0a0a;
            --foreground: #ededed;
          }
          body {
            color: var(--foreground);
            background: var(--background);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow-x: hidden;
          }
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          html {
            scroll-behavior: smooth;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideInFromBottom {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes slideInFromLeft {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInFromRight {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes rotateIn {
            from { transform: rotate(-180deg) scale(0); opacity: 0; }
            to { transform: rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes slideInFromTop {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
            50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.4); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-slideInFromBottom {
            animation: slideInFromBottom 0.8s ease-out forwards;
          }
          .animate-slideInFromLeft {
            animation: slideInFromLeft 0.8s ease-out forwards;
          }
          .animate-slideInFromRight {
            animation: slideInFromRight 0.8s ease-out forwards;
          }
          .animate-slideInFromTop {
            animation: slideInFromTop 0.8s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.6s ease-out forwards;
          }
          .animate-rotateIn {
            animation: rotateIn 0.8s ease-out forwards;
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            background-size: 1000px 100%;
            animation: shimmer 3s infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          .animate-spin-reverse {
            animation: spin-reverse 6s linear infinite;
          }
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease infinite;
          }
          .perspective-1000 {
            perspective: 1000px;
          }
          .transform-3d {
            transform-style: preserve-3d;
          }
          .backface-hidden {
            backface-visibility: hidden;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
