import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function TestimonialCard() {
  return (
    <Carousel className="max-w-[250px] md:max-w-[300px]">
      <CarouselContent>
        <CarouselItem>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex flex-col gap-2 items-center">
                <Image
                  src={"https://api.multiavatar.com/Starcrasher.png"}
                  height={40}
                  width={40}
                  alt=""
                />
                <p className="font-semibold text-xl">Melody Sunshine</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center">
              <span className="text-muted-foreground">
                I would recommend Billify for anyone trying to get the word out
                about their business. It has saved me so much time!
              </span>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex flex-col gap-2 items-center">
                <Image
                  src={"https://api.multiavatar.com/stefan.svg"}
                  height={40}
                  width={40}
                  alt=""
                />
                <p className="font-semibold text-xl">Dustin Trailblazer</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center">
              <span className="text-muted-foreground">
                I can&apos;t say enough about Billify. Billify has really helped our
                business.
              </span>
            </CardContent>
          </Card>
        </CarouselItem>
        <CarouselItem>
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex flex-col gap-2 items-center">
                <Image
                  src={"https://api.multiavatar.com/zoe.svg"}
                  height={40}
                  width={40}
                  alt=""
                />
                <p className="font-semibold text-xl">Donald Canard</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center">
              <span className="text-muted-foreground">
                Billify makes me more productive and gets the job done in a
                fraction of the time. I&apos;m glad I found Billify.
              </span>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
