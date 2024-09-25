import { useRouter } from "next/router";
import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

import { api } from "@/utils/api";

function RedirectPage() {
  const router = useRouter();
  const getLinkBySlug = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });
  const updateNextPhone = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    if (getLinkBySlug.data) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLinkBySlug.data, router]);

  return null;
}

export default RedirectPage;
