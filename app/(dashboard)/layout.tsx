import Header from "@/components/layout/header";
import Providers from "@/components/providers";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full  min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        <Header />
        <main className="mt-3">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  );
}
