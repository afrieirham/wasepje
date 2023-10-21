import { Loader2, MoveLeft } from "lucide-react";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import slugify from "slugify";
import Header from "~/components/molecule/Header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";
import { useHostname } from "~/hooks/useHostname";
import { db } from "~/server/db";
import { api } from "~/utils/api";

export const getStaticProps: GetStaticProps<{ id: string }> = (context) => {
  const id = context?.params?.id as string;
  return { props: { id } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const links = await db.link.findMany();
  const paths = links.map((link) => ({ params: { id: link.id } }));

  return {
    paths,
    fallback: false,
  };
};

function EditLink({ id }: InferGetStaticPropsType<typeof getStaticProps>) {
  const host = useHostname();
  const { data } = api.link.getOne.useQuery({ id });
  const { mutate, isLoading } = api.link.update.useMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name);
      setSlug(data.slug);
    }
  }, [data]);

  if (!data) return <p>404</p>;

  const onSubmitGeneral = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ id: data.id, name, slug });
    toast({
      title: `${name} successfully updated!`,
      description: `${host}/${slug}`,
    });
  };

  return (
    <main>
      <Header />
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" asChild className="p-1">
              <Link href="/dashboard">
                <MoveLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl">Edit {name}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl px-6 py-10">
        <p className="font-bold">General</p>
        <form
          onSubmit={onSubmitGeneral}
          className="mt-4 flex flex-col rounded-lg border bg-white p-10"
        >
          <div className="flex flex-col">
            <Label htmlFor="name" className="">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              className="mt-2 w-full max-w-md"
              onChange={(e) => {
                setName(e.target.value);
                setSlug(
                  slugify(e.target.value, {
                    lower: true,
                    strict: true,
                  }),
                );
              }}
            />
          </div>
          <div className="mt-4 flex flex-col">
            <Label htmlFor="slug" className="">
              Slug
            </Label>
            <p className="mt-2 text-xs text-muted-foreground">
              {host}/{slug}
            </p>
            <Input
              id="slug"
              name="slug"
              className="mt-2 w-full max-w-md"
              value={slug}
              onChange={(e) => setSlug(e.target.value.trim())}
            />
          </div>
          <div className="mt-6">
            <Button type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditLink;
