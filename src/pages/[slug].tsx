import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { db } from "~/server/db";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps<{ slug: string }> = (context) => {
  const slug = context?.params?.slug as string;
  return { props: { slug } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await db.link.findMany();
  const paths = links.map((link) => ({ params: { slug: link.slug } }));

  return {
    paths,
    fallback: false,
  };
};

function RedirectPage({
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { data } = api.link.getLinkBySlug.useQuery({ slug });
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
