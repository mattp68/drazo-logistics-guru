import { useState } from "react";
import { Plane, Ship, Truck, Warehouse, FileCheck } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AirFreightForm from "@/components/AirFreightForm";

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
  const { toast } = useToast();
  const [isAirFreightOpen, setIsAirFreightOpen] = useState(false);

  const handleServiceClick = (path: string) => {
    if (path === "/air-freight") {
      setIsAirFreightOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: "This service will be available soon!",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">What service do you need?</p>
              </div>
            </div>
          </div>

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

          <AirFreightForm 
            isOpen={isAirFreightOpen}
            onClose={() => setIsAirFreightOpen(false)}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;