import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <section className="flex items-center justify-center w-full h-screen bg-white dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto text-center max-w-screen-xl lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.
          </p>
          <div className="mt-8">
            <Button className="w-full md:w-auto" onClick={() => navigate("/")}>
              Back To Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
