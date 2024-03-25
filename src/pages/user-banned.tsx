import Header from "~/components/molecule/Header";

function UserBanned() {
  return (
    <div>
      <Header />
      <main className="flex h-[80vh] w-full flex-col items-center justify-center">
        <h1 className="text-lg font-bold">You are banned!</h1>
        <p className="text-sm">
          We&apos;ve identified that you&apos;ve used WasepJe.com for illegal
          activities.
        </p>
      </main>
    </div>
  );
}

export default UserBanned;
