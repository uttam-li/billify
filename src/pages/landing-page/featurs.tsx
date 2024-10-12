const Features = () => {
  return (
      <div className="container mx-auto px-5 max-w-4xl flex flex-col items-center justify-center text-center">
        <div className="md:w-2/3 lg:w-1/2">
          <h2 className="my-8 text-2xl font-bold text-gray-700 dark:text-white md:text-4xl">
            Key Features of Billify
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Billify offers a range of features to help you manage your business
            efficiently.
          </p>
        </div>
        <div className="mt-16 flex flex-col w-full space-y-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 rounded-lg"
            >
              <div className="relative space-y-8 py-12 p-8">
                <img
                  src={feature.imgSrc}
                  className="w-12 mx-auto"
                  width="512"
                  height="512"
                  alt={feature.alt}
                />
                <div className="space-y-2">
                  <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-secondary">
                    {feature.title}
                  </h5>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

const features = [
  {
    imgSrc: "https://cdn-icons-png.flaticon.com/512/4341/4341139.png",
    alt: "Easy Invoicing",
    title: "Easy Invoicing",
    description: "Create and send professional invoices in minutes.",
  },
  {
    imgSrc: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    alt: "Customer Management",
    title: "Customer Management",
    description: "Keep track of your customers and their purchase history.",
  },
  {
    imgSrc: "https://cdn-icons-png.flaticon.com/512/4341/4341160.png",
    alt: "Product Tracking",
    title: "Product Tracking",
    description: "Manage your products and inventory with ease.",
  },
  {
    imgSrc: "https://cdn-icons-png.flaticon.com/512/4341/4341025.png",
    alt: "Payment Tracking",
    title: "Payment Tracking",
    description: "Track payments and send reminders for overdue invoices.",
  },
];

export default Features;
