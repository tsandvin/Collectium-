import './globals.css';
import type { Metadata } from 'next';
import { CollectiumTemplate } from '@/components/template/CollectiumTemplate';

export const metadata: Metadata = {
  title: 'Collectium App',
  description: 'Collectium Next.js app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="no"><body><CollectiumTemplate>{children}</CollectiumTemplate></body></html>;
}
