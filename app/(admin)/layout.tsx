import { Sidebar } from "@/components/layout/sidebar";
import { StoreProvider } from "@/components/providers/store-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
