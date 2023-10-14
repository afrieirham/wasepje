import { UserButton } from "@clerk/nextjs";
import { useEffect, useState, type FormEvent } from "react";
import slugify from "slugify";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";

type Link = {
  name: string;
  slug: string;
};

export default function Dashboard() {
  const { data } = api.link.getAll.useQuery();
  const { mutate } = api.link.create.useMutation();
  const [host, setHost] = useState("");

  const [links, setLinks] = useState<Link[] | undefined>(data);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const resetFormFields = () => {
    setName("");
    setSlug("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget)) as Link;

    if (links) {
      setLinks([...links, formData]);
    } else {
      setLinks([formData]);
    }

    mutate(formData);
    setOpen(false);
    resetFormFields();
  };

  // to make sure it'll only run in client
  useEffect(() => {
    if (window) {
      setHost(window.location.host);
    }
  }, []);

  return (
    <>
      <main>
        <nav className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-6">
            <p className="font-bold">MesejKami.com</p>
            <UserButton showName afterSignOutUrl="/" />
          </div>
        </nav>
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
            <h1 className="text-2xl">My Links</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Create Link</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create a new link</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Syarikat Saya"
                        value={name}
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
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="slug" className="">
                        Slug
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="syarikat-saya"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.trim())}
                      />
                      <p className="text-xs text-muted-foreground">
                        {host}/{slug}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Link</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-6 ">
          {links?.map((link, i) => (
            <div key={i}>
              <p>{link.name}</p>
              <p>{link.slug}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
