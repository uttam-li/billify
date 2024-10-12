import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BusinessForm from "../components/business-form";





interface PageProps {
  goToNextPage: () => void;
}

const StartupPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const goToNextPage = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (currentPage === 3) {
      const timer = setTimeout(() => {
        navigate("/buss", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {currentPage === 1 && <Welcome goToNextPage={goToNextPage} />}

      {currentPage === 2 && <FormPage goToNextPage={goToNextPage} />}

      {currentPage === 3 && <ThankYou />}
    </div>
  );
};

const Welcome = ({ goToNextPage }: PageProps) => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-6xl font-bold">Welcome to Billify</h1>
      <Button size="lg" onClick={goToNextPage}>
        Next
      </Button>
    </div>
  );
};

const FormPage = ({ goToNextPage }: PageProps) => {

  return (
    <Card className="mx-auto w-full max-w-4xl my-20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl text-primary">
          Bussiness Details
        </CardTitle>
        <CardDescription>Enter your bussiness details below</CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessForm isNew goToNextPage={goToNextPage}/>
      </CardContent>
    </Card>
  );
};

const ThankYou = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl">Thank You for Submitting!</h2>
      <p>Redirecting in 3 seconds...</p>
    </div>
  );
};

export default StartupPage;
