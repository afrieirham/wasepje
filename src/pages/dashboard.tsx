import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export default function Dashboard() {
  const response = api.link.getAll.useQuery();
  const user = useUser();
  const router = useRouter();

  console.log(response.data, user);

  return (
    <>
      <main>
        <p>Hello World</p>
        <SignOutButton signOutCallback={() => router.push("/")}>
          <Button>Logout</Button>
        </SignOutButton>
      </main>
    </>
  );
}
