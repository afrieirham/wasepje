import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { useUser } from "@clerk/nextjs";
import axios from "axios";

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
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Button loading={loading} className={className} asChild>
        <Link href="/dashboard">{children}</Link>
      </Button>
    );
  }

  const onSubscribe = async () => {
    setLoading(true);
    try {
      const { data }: { data: { redirect: string } } = await axios.post(
        "/api/stripe/checkout",
        {
          email: user.primaryEmailAddress?.emailAddress,
          billing,
        },
      );

      void router.push(data.redirect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      loading={loading}
      onClick={() => void onSubscribe()}
      className={className}
    >
      {children}
    </Button>
  );
}

export default SubscribeButton;
