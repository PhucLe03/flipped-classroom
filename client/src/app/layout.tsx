import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'Học Liệu Số - Nền Tảng Lớp Học Đảo Ngược (Flipped Classroom)',
  description:
    'Hệ thống quản lý, xuất bản và học tập tài liệu đa phương tiện (Video bài giảng, Tài liệu đọc, Google Drive) dành cho học sinh và giáo viên.',
  keywords: ['e-learning', 'lớp học đảo ngược', 'tài liệu học tập', 'toán học', 'vật lý', 'giáo dục'],
  openGraph: {
    title: 'Học Liệu Số - Flipped Classroom',
    description: 'Nền tảng học tập chủ động với bài giảng đa phương tiện',
    type: 'website',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
