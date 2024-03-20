import { Check, CheckCheckIcon, CheckCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { features } from "@/lib/constant";
import TestimonialCard from "../../components/testimonial-card";

export default function Home() {
  return (
    <>
      <section className="h-full w-full mt-12 my-12 relative flex items-center justify-center flex-col ">
        {/* grid */}

        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to top left,#000C40,#607D8B)] -z-10" /> */}

        <p className="text-center">Simple billing solution for you business</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">
            Billify
          </h1>
        </div>
        <div className="flex justify-center items-centerrelative md:mt-[-100px]">
          <Image
            src={"/dashboard-examples-hero.png"}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <hr className="my-5" />
      <section className="w-full flex flex-col items-center gap-8 my-10">
        <p className="text-2xl md:text-4xl font-bold">A word from your users :&#41;</p>
        <TestimonialCard />
      </section>
      <hr className="my-5" />
      <section className="flex flex-col items-center justify-center gap-8 my-10">
        <h6 className="font-bold text-4xl">Features</h6>
        <ul className="flex flex-col gap-y-3">
          {features.map((item) => (
            <li
              className="inline-flex text-muted-foreground text-xl items-center gap-4"
              key={item}
            >
              <CheckCircle />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
