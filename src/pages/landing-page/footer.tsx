const AppFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
        <div className="flex flex-col justify-between items-center max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
          <div className="text-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white ">
                  Billify
                </span>
            <p className="mt-2 text-gray-400">Simplifying your billing process.</p>
          </div>
          {/* <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">About</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="mt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Billify. All rights reserved.
        </div>
    </footer>
  );
};

export default AppFooter;