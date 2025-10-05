import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

function SubscribeButton({
  children,
  className,
  billing,
}: {
  className?: string;
  billing: "monthly" | "annually";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const session = api.stripe.createCheckoutSession.useMutation({
    onSuccess: ({ redirectUrl }) => {
      void router.push(redirectUrl);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  if (!user) {
    return (
      <Button className={className} asChild>
        <Link href="/dashboard/links">{children}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={className}
      loading={loading}
      onClick={() => {
        setLoading(true);
        session.mutate({ billing });
      }}
    >
      {children}
    </Button>
  );
}

export default SubscribeButton;
