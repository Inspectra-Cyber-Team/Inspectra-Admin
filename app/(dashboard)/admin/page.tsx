import { AdminTable } from "@/components/admin/AdminTable";
import { Suspense } from "react";


export default async function Page() {
  return (
    <div>
      {/* Main Content */}
      <main className="flex-1 space-y-4 px-8 ">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        </div>

        <div className="flex-1 ">
          
          <Suspense fallback={<div>Loading users...</div>}>
            <AdminTable />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
