import Sidebar from "@/app/ui/dashboard/sidenav";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex grow flex-col p-6">{children}</main>
    </div>
  );
}
