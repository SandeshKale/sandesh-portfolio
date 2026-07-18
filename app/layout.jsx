import './globals.css';

export const metadata = {
  title: 'Sandesh Kale — Systems that stay up',
  description:
    'Lead Backend Engineer at Prudential Singapore. Enterprise AI that actually works in BFSI — distributed systems, event-driven architecture, LLM integration, cloud-native platforms.',
  openGraph: {
    title: 'Sandesh Kale — Systems that stay up',
    description:
      'Enterprise backend architecture. Event-driven platforms. AI as a force multiplier.',
    type: 'website',
  },
};

export const viewport = { themeColor: '#0B0E15' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
