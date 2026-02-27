import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { UAParser } from "ua-parser-js";

import ClickableLogo from "@/components/molecule/clickable-logo";
import { Button } from "@/components/ui/button";
import { db } from "@/server/db";
import { api } from "@/utils/api";

const GATEKEEPER_ACTIVATION_DATE = new Date("2026-03-26T00:00:00.000Z");

export const getServerSideProps = (async (ctx) => {
  const slug = String(ctx.params?.slug);
  const now = new Date();

  // Before activation date: preserve existing behavior
  if (now < GATEKEEPER_ACTIVATION_DATE) {
    const link = await db.link.findFirst({
      where: {
        OR: [
          { slug: slug }, // Checks the system slug (shoes-abc12)
          { customSlug: slug }, // Checks the premium slug (shoes)
        ],
      },
      include: { user: true, phones: true },
    });

    if (!link) {
      return { props: { plan: "free" } };
    }

    return {
      props: {
        plan: link.user.plan,
        link: { id: link.id, message: link.message },
        nextPhone: link.phones.at(link.nextPhone)?.number,
      },
    };
  }

  // On/after activation date: apply gatekeeper logic
  const link = await db.link.findFirst({
    where: {
      OR: [
        { slug: slug }, // Checks the system slug (shoes-abc12)
        { customSlug: slug }, // Checks the premium slug (shoes)
      ],
    },
    include: { user: true, phones: true },
  });

  if (!link) {
    // Scenario C — No match
    return { props: { plan: "free" } };
  }

  const matchesSystemSlug = link.slug === slug;
  const matchesCustomSlug = link.customSlug === slug;

  if (!matchesSystemSlug && !matchesCustomSlug) {
    // Scenario C — No match
    return { props: { plan: "free" } };
  }

  if (matchesSystemSlug) {
    // Scenario A — Match in slug (system slug)
    return {
      props: {
        plan: link.user.plan,
        link: { id: link.id, message: link.message },
        nextPhone: link.phones.at(link.nextPhone)?.number,
      },
    };
  }

  // At this point, !matchesSystemSlug && matchesCustomSlug must be true
  if (link.user.plan === "pro") {
    // Scenario B — customSlug match for pro user
    return {
      props: {
        plan: "pro",
        link: { id: link.id, message: link.message },
        nextPhone: link.phones.at(link.nextPhone)?.number,
      },
    };
  }

  // Scenario B — customSlug match for free user: treat as no match
  return { props: { plan: "free" } };

  //
}) satisfies GetServerSideProps<{
  plan: "free" | "pro";
  link?: { id: string; message: string | null };
  nextPhone?: string;
}>;

function RedirectPage({
  plan,
  link,
  nextPhone,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [countdown, setCountdown] = useState(2);
  const hasEnded = countdown === 0;

  const updateNextPhone = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      if (countdown > 0) setCountdown(countdown - 1);
    }, 1000);

    // Set timeout to click the button after 3 seconds
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }, countdown * 1000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(timer);
    };
  }, [countdown]);

  // pro redirect
  useEffect(() => {
    if (link && plan === "pro") {
      redirect({ link, plan: "pro" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link, plan]);

  const redirect = ({
    plan,
    link,
  }: {
    plan: "free" | "pro";
    link: { id: string; message: string | null };
  }) => {
    let url = `https://wa.me/${nextPhone}`;

    if (link?.message) {
      url = `${url}?text=${encodeURI(String(link.message))}`;
    }

    const ua = UAParser(window.navigator.userAgent);
    const metadata = {
      browser: ua?.browser.name ?? "(unknown)",
      country: "(unknown)",
      continent: "(unknown)",
      device: ua?.device.type ?? "Desktop",
      os: ua?.os.name ?? "(unknown)",
      referrer: document.referrer || "(direct)",
    };

    updateNextPhone.mutate({ id: link.id, metadata });

    void router.push(url);
    if (plan === "free") {
      const popUnder = window.open("https://go.wasepje.com/shopee", "_blank");
      if (popUnder) window.focus();
    }
  };

  if (!link && !nextPhone) {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl">404</h1>
        <p className="">
          Link not found. Go{" "}
          <Link
            href="/"
            className="font-medium text-gray-700 underline hover:text-black"
          >
            back home
          </Link>
          .
        </p>
        <div className="fixed bottom-0 mx-auto p-8">
          <ClickableLogo />
        </div>
      </main>
    );
  }

  if (plan === "free") {
    return (
      <div className="flex h-[100dvh] max-h-[100dvh] w-full items-center justify-center">
        <Button
          ref={buttonRef}
          onClick={() => redirect({ link, plan: "free" })}
          disabled={!hasEnded}
          className="transition-all"
        >
          {hasEnded
            ? "click to continue"
            : `redirecting in ${countdown} seconds`}
        </Button>
      </div>
    );
  }

  return null;
}

export default RedirectPage;
