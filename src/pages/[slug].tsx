import { useRouter } from "next/router";
import { useEffect } from "react";
import { UAParser } from "ua-parser-js";

import { countries } from "~/constants/countries";
import { api } from "~/utils/api";

function RedirectPage() {
  const router = useRouter();
  const { data } = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });
  const { mutate } = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    fetch("https://api.country.is")
      .then((res) => res.json())
      .then(({ country }: { ip: string; country: string }) => {
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

          const userCountry = countries.get(country.toUpperCase());

          const ua = UAParser(window.navigator.userAgent);
          const metadata = {
            browser: ua?.browser.name ?? "(unknown)",
            country: userCountry ? userCountry.name : "(unknown)",
            continent: userCountry ? userCountry.continent : "(unknown)",
            device: ua?.device.type ?? "Desktop",
            os: ua?.os.name ?? "(unknown)",
            referrer: document.referrer || "(direct)",
          };
          mutate({ id: data.id, metadata });

          void router.push(url);
        }
      })
      .catch((error) => console.log(error));
  }, [data, mutate, router]);

  return null;
}

export default RedirectPage;
