import { useRouter } from "next/router";
import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

import { api } from "~/utils/api";

function RedirectPage() {
  const router = useRouter();
  const { data } = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });
  const { mutate } = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    if (data) {
      if (data.banned) {
        void router.push("/link-banned");
        return;
      }

      const phoneNumber = data.phones.at(Number(data.nextPhone))?.number;
      let url = `https://wa.me/${phoneNumber}`;

      if (data?.message) {
        url = url + `?text=${encodeURI(String(data.message))}`;
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

      mutate({ id: data.id, metadata });

      void router.push(url);
    }
  }, [data, mutate, router]);

  return null;
}

export default RedirectPage;
