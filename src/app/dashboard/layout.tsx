import Sidebar from "@/components/big/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex gap-5 lg:gap-10 py-5 px-5 lg:px-10 bg-text justify-center h-screen">
      <Sidebar />
      <div className="bg-offWhite rounded-xl w-full p-8 max-w-screen-lg h-full overflow-y-auto">
        {children}
      </div>
    </main>
  );
}
