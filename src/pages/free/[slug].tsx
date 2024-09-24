import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { UAParser } from "ua-parser-js";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

function RedirectPage() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const updateNextPhone = api.link.updateNextPhone.useMutation();
  const getLinkBySlug = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });

  const [countdown, setCountdown] = useState(2);
  const hasEnded = countdown === 0;

  const onClick = () => {
    if (getLinkBySlug.data) {
      if (getLinkBySlug.data.banned) {
        void router.push("/link-banned");
        return;
      }

      const phoneNumber = getLinkBySlug.data.phones.at(
        Number(getLinkBySlug.data.nextPhone),
      )?.number;
      let url = `https://wa.me/${phoneNumber}`;

      if (getLinkBySlug.data?.message) {
        url = url + `?text=${encodeURI(String(getLinkBySlug.data.message))}`;
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

      updateNextPhone.mutate({ id: getLinkBySlug.data.id, metadata });

      void router.push(url);
      const popUnder = window.open("https://go.wasepje.com/shopee", "_blank");
      if (popUnder) window.focus();
    }
  };

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

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full items-center justify-center">
      <Button
        ref={buttonRef}
        onClick={onClick}
        disabled={!hasEnded}
        className="transition-all"
      >
        {hasEnded ? "click to continue" : `redirecting in ${countdown} seconds`}
      </Button>
    </div>
  );
}

export default RedirectPage;
