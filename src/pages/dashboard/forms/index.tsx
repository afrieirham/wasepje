import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function FormIndex() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Forms</h1>
        <Button>
          <Link href="/dashboard/forms/create">Create Form</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

export default FormIndex;
