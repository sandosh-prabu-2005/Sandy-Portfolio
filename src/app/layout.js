import { Space_Grotesk, Orbitron } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata = {
  title: "Sandosh Prabu — Web & App Developer",
  description: "Portfolio of Sandosh Prabu — Web, App Developer crafting modern digital experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${orbitron.variable} scroll-smooth`}>
      <body className="bg-slate-950 text-white antialiased min-h-screen overflow-x-hidden font-space">
        {children}
      </body>
    </html>
  );
}
