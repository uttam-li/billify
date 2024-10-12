import React from 'react';
import Container from './container';

const Testimonials = () => {
  return (
    <div className="text-gray-600 dark:text-gray-300" id="testimonials">
      <Container>
        <div className="mb-20 space-y-4 px-6 md:px-0">
          <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Testimonials coming soon! Stay tuned to hear what our customers have to say about Billify.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Testimonials;