import React from "react";
import Header from "~/components/molecule/Header";

function EditLink() {
  return (
    <main>
      <Header />
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-screen-xl justify-between px-6 py-10">
          <h1 className="text-2xl">Edit Link</h1>
        </div>
      </div>
      <p>slug</p>
    </main>
  );
}

export default EditLink;
