import Image from "next/image";
import { features } from "@/lib/constant";
import TestimonialCard from "../../components/testimonial-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <>
      <section className="h-full w-full mt-12 my-12 relative flex items-center justify-center flex-col ">
        {/* grid */}

        {/* <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to top left,#000C40,#607D8B)] -z-10" /> */}

        <p className="text-center">Simple billing solution for you business</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px] h-[150px] md:h-[320px]">
            Billify
          </h1>
        </div>
        <div className="flex justify-center items-center relative mt-[-39px] md:mt-[-60px] -z-20 px-5">
          <Image
            src={"/dashboard.png"}
            quality={100}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-t-lg border-4 border-primary dark:border-secondary-foreground"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-50"></div>
        </div>
      </section>
      <Separator className="my-5 w-1/2 m-auto" />
      <section className="w-full flex flex-col items-center gap-8 my-10">
        <p className="text-2xl md:text-4xl font-bold">Testimonials from your users</p>
        <TestimonialCard />
      </section>
      <Separator className="my-5 w-1/2 m-auto" />
      <section className="container mx-auto max-w-[900px] my-5">
        <h1 className="text-3xl font-bold text-center my-8">Unlock the Power of Streamlined Business Management</h1>
        <div className="flex flex-col gap-4 items-center">
          {features.map((item) => (
            <Card key={item.title} className="flex even:justify-start items-center w-full py-2 max-w-[600px] gap-4 odd:flex-row even:flex-row-reverse px-4">
              <CardHeader className="w-2/3">
                <CardTitle className="text-xl font-bold text-blue-600">{item.title}</CardTitle>
                <Separator />
                <CardDescription className="text-xs md:text-sm">{item.description}</CardDescription>
              </CardHeader>
                <CardContent className="bg-secondary p-2 rounded-2xl m-auto">
                  {item.icon}
                </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
