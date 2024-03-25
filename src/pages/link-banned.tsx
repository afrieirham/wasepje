import Header from "~/components/molecule/Header";

function LinkBanned() {
  return (
    <div>
      <Header />
      <main className="flex h-[80vh] w-full flex-col items-center justify-center">
        <h1 className="text-lg font-bold">Link has been banned!</h1>
        <p className="text-sm">
          We&apos;ve identified that the link was used for illegal activities.
        </p>
      </main>
    </div>
  );
}

export default LinkBanned;
