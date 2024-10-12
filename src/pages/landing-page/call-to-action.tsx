import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <div className='max-w-7xl mx-auto px-6 md:px-12 xl:px-6'>
      <div className="relative pt-36 ml-auto text-center">
        <h2 className="text-gray-900 dark:text-white font-bold text-3xl md:text-4xl xl:text-5xl">
          Ready to Get Started?
        </h2>
        <p className="mt-8 text-gray-700 dark:text-gray-300">
          Join our serivces, using Billify to streamline their invoicing and customer management.
        </p>
        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
          <Button size="lg" onClick={() => navigate("/signup")}>
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;