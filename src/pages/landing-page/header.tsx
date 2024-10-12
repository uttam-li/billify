import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header>
      <nav className="z-10 w-full absolute">
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
            <input
              aria-hidden="true"
              type="checkbox"
              name="toggle_nav"
              id="toggle_nav"
              className="hidden peer"
              checked={isNavOpen}
              onChange={() => setIsNavOpen(!isNavOpen)}
            />
            <div className="relative z-20 w-full flex justify-between lg:w-max md:px-0">
              <a
                href="#home"
                aria-label="logo"
                className="flex space-x-2 items-center"
              >
                <img src="./images/bill.webp" alt="logo" className="w-8 h-8" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary dark:to-white to-black">
                  Billify
                </span>
              </a>
              <div className="relative flex items-center lg:hidden max-h-10">
                <button
                  aria-label="hamburger"
                  id="hamburger"
                  className="relative p-6 -mr-6"
                  onClick={() => setIsNavOpen(!isNavOpen)}
                >
                  <div
                    aria-hidden="true"
                    className={`m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300 ${
                      isNavOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></div>
                  <div
                    aria-hidden="true"
                    className={`m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300 ${
                      isNavOpen ? "-rotate-45 -translate-y-1" : ""
                    }`}
                  ></div>
                </button>
              </div>
            </div>
            <div
              aria-hidden="true"
              className={`fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 lg:hidden dark:bg-gray-900/70 ${
                isNavOpen ? "origin-top scale-y-100" : ""
              }`}
            ></div>
            <div
              className={`flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1 absolute top-full left-0 transition-all duration-300 scale-95 origin-top lg:relative lg:scale-100 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none  dark:border-gray-700 dark:shadow-none ${
                isNavOpen ? "scale-100 opacity-100 visible space-y-4 dark:bg-secondary" : ""
              }`}
            >
              <div className="text-gray-600 dark:text-gray-300 lg:pr-2 lg:w-auto w-full lg:pt-0">
                <ul className="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                  <li>
                    <a
                      href="#features"
                      className="block md:px-4 transition hover:text-primary dark:hover:text-primary-light"
                    >
                      <span>Features</span>
                    </a>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => navigate("/login")}
                variant="secondary"
                className={`${isNavOpen ? "w-full" : "ml-2"}`}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
