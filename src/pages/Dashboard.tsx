import { Plane, Ship, Truck, Warehouse, FileCheck } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const services = [
  {
    icon: Plane,
    title: "Air Freight",
    description: "International air freight services",
    path: "/air-freight",
  },
  {
    icon: Ship,
    title: "Sea Freight",
    description: "Global sea freight solutions",
    path: "/sea-freight",
  },
  {
    icon: Truck,
    title: "Land Freight",
    description: "Domestic and cross-border transportation",
    path: "/land-freight",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    description: "Secure storage solutions",
    path: "/warehousing",
  },
  {
    icon: FileCheck,
    title: "Customs",
    description: "Customs clearance services",
    path: "/customs",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleServiceClick = (path: string) => {
    // For now, show a toast since these routes aren't implemented yet
    toast({
      title: "Coming Soon",
      description: "This service will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">What service do you need?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              onClick={() => handleServiceClick(service.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;