import React from "react";

import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";

import { usePlan } from "@/hooks/use-plan";
import { useManageBilling } from "@/hooks/use-manage-billing";

function ClerkUserButton() {
  const plan = usePlan();
  const manageBilling = useManageBilling();

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
        <UserButton.Action
          label="Manage Billing"
          labelIcon={<CreditCard className="h-4 w-4" />}
          onClick={manageBilling}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

export default ClerkUserButton;
