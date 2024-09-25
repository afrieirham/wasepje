import { env } from "@/env.mjs";
import { usePlan } from "@/hooks/usePlan";
import { UserButton, useUser } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import React from "react";

function ClerkUserButton() {
  const plan = usePlan();
  const { user } = useUser();

  if (plan === "free") {
    return (
      <UserButton
        showName
        appearance={{
          elements: {
            userButtonTrigger: "bg-zinc-100 py-1.5 px-2 border border-zinc-300",
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
          userButtonTrigger: "bg-gray-100 py-1.5 px-2 border border-gray-300",
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
