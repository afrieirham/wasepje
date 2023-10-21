import type { Phone } from "@prisma/client";
import { Loader2, MoveLeft, Pencil, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type FormEvent } from "react";
import slugify from "slugify";
import Header from "~/components/molecule/Header";
import SEOHead from "~/components/molecule/SEOHead";
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
import { toast } from "~/components/ui/use-toast";
import { useHostname } from "~/hooks/useHostname";
import { api } from "~/utils/api";

function EditLink() {
  const host = useHostname();
  const ctx = api.useContext();

  const router = useRouter();

  const { data } = api.link.getOne.useQuery({ id: String(router.query.id) });
  const { mutate, isLoading } = api.link.update.useMutation({
    onError: (error) => {
      toast({
        title: "Please use different slug.",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const addOnePhone = api.phone.addOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const [addPhoneDialog, setAddPhoneDialog] = useState(false);
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
      title: "Link successfully updated!",
      description: `${host}/${slug}`,
    });
  };

  const onAddPhone = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { phone } = Object.fromEntries(new FormData(e.currentTarget)) as {
      phone: string;
    };

    addOnePhone.mutate({ linkId: data.id, number: phone });
    toast({ title: "Phone successfully added!", description: phone });
    setAddPhoneDialog(false);
  };

  return (
    <main>
      <SEOHead
        title="Edit Link | WhatsappJe.com"
        description="Open-Source WhatsApp Link Rotator built with Next.js, TailwindCSS, tRPC, shadcn/ui."
        path="/"
      />
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
        <p className="text-lg font-bold">General</p>
        <form
          onSubmit={onSubmitGeneral}
          className="mt-4 flex flex-col rounded-lg border bg-white"
        >
          <div className="p-4 sm:p-10">
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
          </div>
          <div className="border-t bg-zinc-100 p-4 sm:px-10 sm:py-6">
            <Button type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
        <p className="mt-8 text-lg font-bold">Manage Phone Numbers</p>
        <div className="mt-4 flex flex-col rounded-lg border bg-white">
          <div className="p-4 sm:p-10">
            <Label>Phone Numbers</Label>
            <p className="text-xs text-muted-foreground">
              Must have at least 1 active number.
            </p>
            {data.phones?.map((phone) => (
              <PhoneItem key={phone.id} phone={phone} phones={data.phones} />
            ))}

            <div className="mt-4">
              <Dialog onOpenChange={setAddPhoneDialog} open={addPhoneDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost">
                    <Plus className="mr-2 h-4 w-4" /> Add phone
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={onAddPhone}>
                    <DialogHeader>
                      <DialogTitle>Add phone</DialogTitle>
                      <DialogDescription>
                        Please include country code without the plus (+) sign.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" name="phone" required />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PhoneItem({ phone, phones }: { phone: Phone; phones: Phone[] }) {
  const ctx = api.useContext();

  const [open, setOpen] = useState(false);
  const [phoneInput, setPhone] = useState(phone.number);

  const deleteOnePhone = api.phone.deleteOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const updateOnePhone = api.phone.updateOne.useMutation({
    onSuccess: () => {
      void ctx.link.getOne.invalidate();
    },
  });

  const onEditPhone = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateOnePhone.mutate({ id: phone.id, number: phoneInput });
    toast({ title: "Phone successfully updated!" });
    setOpen(false);
  };

  const onDeletePhone = () => {
    deleteOnePhone.mutate({ id: phone.id });
    toast({
      title: "Phone successfully deleted!",
      description: phone.number,
    });
  };

  return (
    <div className="mt-2 flex space-x-1 ">
      <Input
        required
        value={phone.number}
        onChange={() => null}
        className="w-full max-w-md"
        readOnly
        disabled
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onEditPhone}>
            <DialogHeader>
              <DialogTitle>Edit phone</DialogTitle>
              <DialogDescription>
                Please include country code without the plus (+) sign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                required
                value={phoneInput}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {phones.length > 1 && (
        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={onDeletePhone}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default EditLink;
