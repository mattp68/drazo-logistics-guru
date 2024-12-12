import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const ServiceCard = ({ icon: Icon, title, description, onClick, className }: ServiceCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-6 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer",
        "hover:shadow-md transition-all duration-200 ease-in-out",
        "animate-fade-in",
        className
      )}
    >
      <Icon className="w-8 h-8 text-primary mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;