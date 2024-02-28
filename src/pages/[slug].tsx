import { compile } from "handlebars";
import { useRouter } from "next/router";
import { useEffect, type FormEvent } from "react";

import { api } from "~/utils/api";

function RedirectPage() {
  const router = useRouter();
  const { data } = api.link.getLinkBySlug.useQuery({
    slug: String(router.query.slug),
  });
  const { mutate } = api.link.updateNextPhone.useMutation();

  useEffect(() => {
    if (data && !data.variables) {
      const phoneNumber = data.phones.at(Number(data.nextPhone))?.number;
      let url = `https://wa.me/${phoneNumber}`;

      if (data?.message) {
        url = url + `?text=${encodeURI(String(data.message))}`;
      }

      void router.push(url);
      mutate({ id: data.id });
    }
  }, [data, mutate, router]);

  if (!data) return "loading";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const phoneNumber = data.phones.at(Number(data.nextPhone))?.number;

    const template = compile(data.message);
    const message = template(Object.fromEntries(new FormData(e.currentTarget)));
    const url = `https://wa.me/${phoneNumber}?text=${encodeURI(message)}`;
    void router.push(url);
    mutate({ id: data.id });
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="name" />
      <input name="age" placeholder="age" />
      <button type="submit">submit</button>
    </form>
  );
}

export default RedirectPage;
