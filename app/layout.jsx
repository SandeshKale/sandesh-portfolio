import './globals.css';

export const metadata = {
  title: 'Sandesh Kale — GenAI Solutions Architect',
  description:
    'Architecting frontier GenAI ecosystems — LLM orchestration, multi-agent workflows, real-time RAG, and production-grade guardrails, on a decade of BFSI core-systems engineering.',
  openGraph: {
    title: 'Sandesh Kale — GenAI Solutions Architect',
    description:
      'LLM orchestration layers to production-grade guardrails. Enterprise intelligence at scale.',
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
