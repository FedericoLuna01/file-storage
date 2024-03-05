import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center">
      <section className="relative">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-28 md:px-8">
          <div className="space-y-5 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mx-auto md:text-5xl">
              Guarda tus archivos en la nube y accede a ellos desde cualquier
              lugar del mundo.
            </h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              tincidunt, risus eget rutrum congue, leo justo ultricies nunc, nec
              bibendum turpis justo eu enim.
            </p>
            <Link href="/dashboard/archivos">
              <Button className="mt-4">
                Empieza ahora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex justify-center items-center gap-x-4 text-gray-700 text-sm">
              <div className="flex">
                <Star className="fill-zinc-700 w-4 h-4" />
                <Star className="fill-zinc-700 w-4 h-4" />
                <Star className="fill-zinc-700 w-4 h-4" />
                <Star className="fill-zinc-700 w-4 h-4" />
                <Star className="fill-zinc-700 w-4 h-4" />
              </div>
              <p>
                <span className="text-gray-500">5.0</span> más de 10000
                usuarios.
              </p>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 m-auto max-w-xs h-[357px] blur-[118px] sm:max-w-md md:max-w-lg"
          style={{
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
      </section>
    </div>
  );
}
