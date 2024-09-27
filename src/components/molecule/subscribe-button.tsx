import Link from "next/link";
import React, { useState } from "react";

import { useUser } from "@clerk/nextjs";

import { env } from "@/env.mjs";
import { Button } from "../ui/button";

function SubscribeButton({
  children,
  className,
  billing,
}: {
  className?: string;
  billing: "monthly" | "annually";
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  if (!user) {
    return (
      <Button className={className} asChild>
        <Link href="/dashboard/links">{children}</Link>
      </Button>
    );
  }

  const href =
    billing === "annually"
      ? env.NEXT_PUBLIC_PRO_ANNUALLY_URL
      : env.NEXT_PUBLIC_PRO_MONTHLY_URL;

  return (
    <Button
      className={className}
      loading={loading}
      onClick={() => setLoading(true)}
      asChild
    >
      <Link href={`${href}/?email=${user.primaryEmailAddress?.emailAddress}`}>
        {children}
      </Link>
    </Button>
  );
}

export default SubscribeButton;
