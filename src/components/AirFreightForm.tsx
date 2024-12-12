import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { UploadSection } from "./air-freight/UploadSection";
import type { Database } from "@/integrations/supabase/types";

interface AirFreightFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type AirFreightShipment = Database['public']['Tables']['air_freight_shipments']['Insert'];

const AirFreightForm = ({ isOpen, onClose }: AirFreightFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AirFreightShipment>({
    terms_of_shipment: "",
    shipper_details: "",
    consignee_details: "",
    cargo_description: "",
    cargo_weight: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = async (file: File, type: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('shipment-documents')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('shipment-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('air_freight_shipments')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shipment details saved successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shipment details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <Button 
            variant="ghost" 
            className="absolute left-2 top-2 p-2 h-auto"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center pt-2">Air Freight</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Fill in Information</h3>
            <p className="text-sm text-gray-500 mb-4">
              We handle both Air imports & exports to and from Uganda.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-500 font-medium">Terms of shipment</label>
              <Select
                value={formData.terms_of_shipment}
                onValueChange={(value) => setFormData({ ...formData, terms_of_shipment: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXW">EXW</SelectItem>
                  <SelectItem value="FOB">FOB</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Shipper Details</label>
              <Textarea
                placeholder="Name, Tel. No., e-mail and address"
                value={formData.shipper_details}
                onChange={(e) => setFormData({ ...formData, shipper_details: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Consignee Details</label>
              <Textarea
                value={formData.consignee_details}
                onChange={(e) => setFormData({ ...formData, consignee_details: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Cargo description</label>
              <Textarea
                value={formData.cargo_description}
                onChange={(e) => setFormData({ ...formData, cargo_description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Cargo weight</label>
              <Textarea
                value={formData.cargo_weight}
                onChange={(e) => setFormData({ ...formData, cargo_weight: e.target.value })}
              />
            </div>
          </div>

          <UploadSection onFileUpload={handleFileUpload} />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AirFreightForm;