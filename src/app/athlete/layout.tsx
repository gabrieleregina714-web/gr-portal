import AthleteNavbar from '@/components/AthleteNavbar';

export default function AthleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <AthleteNavbar />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-5 sm:pt-6 md:pt-8 pb-10 sm:pb-14 lg:pb-20">
        {children}
      </main>
    </div>
  );
}
