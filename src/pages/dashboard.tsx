import { UserButton } from "@clerk/nextjs";
import copy from "copy-to-clipboard";
import { Pencil, Plus, Trash } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/use-toast";

import { api } from "~/utils/api";

type Link = {
  id: string;
  name: string;
  slug: string;
};

export default function Dashboard() {
  const ctx = api.useContext();

  const { data } = api.link.getAll.useQuery();
  const { mutate } = api.link.create.useMutation({
    onSuccess: () => {
      void ctx.link.getAll.invalidate();
    },
  });

  const [open, setOpen] = useState(false);
  const [host, setHost] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phones, setPhones] = useState([{ value: "" }]);

  const resetFormFields = () => {
    setName("");
    setSlug("");
    setPhones([{ value: "" }]);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, slug } = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Link;

    mutate({ name, slug, phones });
    setOpen(false);
    resetFormFields();
    toast({
      title: "Link successfully created!",
      description: `${host}/${slug}`,
    });
  };

  // to make sure it'll only run in client
  useEffect(() => {
    if (window) {
      setHost(window.location.host);
    }
  }, []);

  const onAddPhoneNumber = () => {
    setPhones([...phones, { value: "" }]);
  };

  const onDeletePhone = (index: number) => {
    const newPhones = phones.filter((_phone, i) => i !== index);
    setPhones(newPhones);
  };

  const setPhoneValue = (value: string, index: number) => {
    const updatedPhones = phones.map((phone, i) => {
      if (i === index) {
        return {
          ...phone,
          value,
        };
      }
      return phone;
    });

    setPhones(updatedPhones);
  };

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
                    <div className="flex flex-col gap-2">
                      <Label>Phone Number</Label>
                      <p className="text-xs text-muted-foreground">
                        Include country code.
                      </p>
                      {phones?.map((phone, i) => (
                        <div key={i} className="flex space-x-1">
                          <Input
                            required
                            type="tel"
                            name={`phone-${i}`}
                            placeholder="60131231234"
                            value={phone.value}
                            onChange={(e) =>
                              setPhoneValue(e.target.value.trim(), i)
                            }
                          />
                          {phones.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => onDeletePhone(i)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onAddPhoneNumber}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add phone number
                      </Button>
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
        <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-between px-2 sm:px-6">
          {data?.map((link) => (
            <LinkItem link={link} host={host} key={link.id} />
          ))}
        </div>
      </main>
    </>
  );
}

function LinkItem({ link, host }: { link: Link; host: string }) {
  const ctx = api.useContext();
  const url = `${host}/${link.slug}`;

  const { mutate } = api.link.delete.useMutation({
    onSuccess: () => {
      void ctx.link.getAll.invalidate();
    },
  });

  const onClickCopy = () => {
    copy(url);
    toast({ title: "Link copied!", description: url });
  };

  const onDeleteLink = () => {
    mutate({ id: link.id });
    toast({ title: "Link successfully deleted!", description: url });
  };

  return (
    <div className="mt-2 flex items-center justify-between rounded border bg-white p-4 hover:border-zinc-400">
      <div className="flex flex-col justify-center space-y-1">
        <p className="font-semibold">{link.name}</p>
        <p className="text-xs text-zinc-500">{url}</p>
      </div>
      <div className="flex">
        <a
          target="_blank"
          href={url}
          className="flex h-9 items-center justify-center whitespace-nowrap rounded-s border border-e-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" x2="21" y1="14" y2="3"></line>
          </svg>
        </a>
        <button
          onClick={onClickCopy}
          className="flex h-9 min-h-[36px] min-w-[36px] items-center justify-center whitespace-nowrap rounded-none border p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-9 min-h-[36px] min-w-[36px] items-center justify-center whitespace-nowrap rounded-e border border-s-0 p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-muted disabled:hover:bg-opacity-30 disabled:hover:text-muted"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                Warning: This action cannot be undone. Are you sure you want to
                permanently delete this link?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="destructive" onClick={onDeleteLink}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
