'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Keyboard, X } from 'lucide-react';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd/Ctrl + K to open search (future feature)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Future: Open search modal
        console.log('Search shortcut triggered');
      }

      // Cmd/Ctrl + / to show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }

      // Only trigger navigation shortcuts if not in an input
      if (e.altKey) {
        e.preventDefault();
        
        switch (e.key) {
          case 'd':
            router.push('/dashboard');
            break;
          case 'c':
            router.push('/dashboard/charts');
            break;
          case 'p':
            router.push('/dashboard/predictions');
            break;
          case 'n':
            router.push('/dashboard/numerology');
            break;
          case 'l':
            router.push('/dashboard/life-events');
            break;
          case 'k':
            router.push('/dashboard/compatibility');
            break;
          case 'f':
            router.push('/dashboard/face-reading');
            break;
          case 'h':
            router.push('/dashboard/palmistry');
            break;
          case 'a':
            router.push('/dashboard/panchang');
            break;
          case 's':
            router.push('/dashboard/settings');
            break;
        }
      }

      // ESC to close modals/panels
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, showHelp]);

  const shortcuts = [
    { key: 'Alt + D', description: 'Dashboard Home' },
    { key: 'Alt + C', description: 'Birth Charts' },
    { key: 'Alt + P', description: 'Predictions' },
    { key: 'Alt + N', description: 'Numerology' },
    { key: 'Alt + L', description: 'Life Events' },
    { key: 'Alt + K', description: 'Compatibility' },
    { key: 'Alt + F', description: 'Face Reading' },
    { key: 'Alt + H', description: 'Palmistry' },
    { key: 'Alt + A', description: 'Panchang' },
    { key: 'Alt + S', description: 'Settings' },
    { key: 'Cmd/Ctrl + /', description: 'Show shortcuts' },
    { key: 'ESC', description: 'Close panels' },
  ];

  return (
    <>
      {/* Floating shortcut button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        title="Keyboard Shortcuts (Cmd/Ctrl + /)"
      >
        <Keyboard className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
      </button>

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-700 animate-slideInFromBottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Keyboard className="w-8 h-8 text-purple-400" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-slate-300">{shortcut.description}</span>
                  <kbd className="px-3 py-1.5 bg-slate-900 text-purple-400 rounded-lg text-sm font-mono font-semibold border border-slate-700 shadow-inner">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
              <p className="text-sm text-purple-300 text-center">
                💡 <strong>Pro Tip:</strong> Use these shortcuts to navigate quickly without touching your mouse!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
