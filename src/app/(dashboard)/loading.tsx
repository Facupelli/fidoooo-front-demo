export default function Loading() {
  return (
    <div className="grid h-screen grid-cols-12">
      <section className="col-span-4 bg-[#FFFFFF] ">
        <div className="flex h-[60px] items-center justify-between bg-secondary-purple px-5"></div>

        <div className="flex items-center gap-[14px] px-5 py-4"></div>

        <div className="px-5"></div>
      </section>

      <section className="relative col-span-8 bg-pale-gray">
        <div className="flex h-[60px] items-center bg-[#FFFFFF] px-6 text-f-black"></div>

        <div className="flex h-[calc(100vh_-_140px)] flex-col gap-2 bg-wp-chat-wallpaper"></div>

        <form className="absolute bottom-0 right-0 z-10 flex h-[80px] w-full items-center gap-4 bg-pale-gray px-8"></form>
      </section>
    </div>
  );
}
