import '@/app/ui/global.css';
import { lusitana } from '@/app/ui/fonts';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}