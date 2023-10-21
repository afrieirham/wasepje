import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

function RedirectPage() {
  const router = useRouter();
  const { data } = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });
  const { mutate } = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    if (data) {
      const phoneNumber = data.phones.at(Number(data.nextPhone))?.number;
      const url = `https://wa.me/${phoneNumber}`;
      void router.push(url);
      mutate({ id: data.id });
    }
  }, [data, mutate, router]);

  return null;
}

export default RedirectPage;
