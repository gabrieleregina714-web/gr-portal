import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-5 sm:pt-6 md:pt-8 pb-4 sm:pb-6 lg:pb-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
