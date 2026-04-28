import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { AppApolloProvider } from "../providers/ApolloProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400","500","600","700","800"],
});

export const metadata = {
  title: "AI Event Management",
  description: "AI-powered event planning and management assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('app-theme');
                  var theme = (saved === 'light' || saved === 'dark')
                    ? saved
                    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}>
        <ThemeProvider>
          <AppApolloProvider>
            <div style={{ position:'relative', zIndex:1 }}>
              {children}
            </div>
          </AppApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
