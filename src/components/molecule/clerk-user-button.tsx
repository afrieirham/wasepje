import React from "react";

import { UserButton, useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { env } from "@/env.mjs";
import { usePlan } from "@/hooks/use-plan";

function ClerkUserButton() {
  const plan = usePlan();
  const { user } = useUser();

  if (plan === "free") {
    return (
      <UserButton
        showName
        appearance={{
          elements: {
            userButtonTrigger: "bg-white py-1.5 px-2 border-2 border-zinc-200",
          },
        }}
      />
    );
  }

  return (
    <UserButton
      showName
      appearance={{
        elements: {
          userButtonTrigger: "bg-white py-1.5 px-2 border-2 border-gray-200",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="Manage Billing"
          labelIcon={<CreditCard className="h-4 w-4" />}
          href={`${env.NEXT_PUBLIC_BILLING_PORTAL_URL}?prefilled_email=${user?.primaryEmailAddress?.emailAddress}`}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

export default ClerkUserButton;
