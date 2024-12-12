import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AirFreightFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AirFreightForm = ({ isOpen, onClose }: AirFreightFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    termsOfShipment: "",
    shipperDetails: "",
    consigneeDetails: "",
    cargoDescription: "",
    cargoWeight: "",
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
        .insert([
          {
            terms_of_shipment: formData.termsOfShipment,
            shipper_details: formData.shipperDetails,
            consignee_details: formData.consigneeDetails,
            cargo_description: formData.cargoDescription,
            cargo_weight: formData.cargoWeight,
          }
        ]);

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
      <DialogContent className="bg-white max-w-md w-full">
        <DialogHeader>
          <Button 
            variant="ghost" 
            className="absolute left-4 top-4"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center">Air Freight</DialogTitle>
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
                value={formData.termsOfShipment}
                onValueChange={(value) => setFormData({ ...formData, termsOfShipment: value })}
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
                value={formData.shipperDetails}
                onChange={(e) => setFormData({ ...formData, shipperDetails: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Consignee Details</label>
              <Textarea
                value={formData.consigneeDetails}
                onChange={(e) => setFormData({ ...formData, consigneeDetails: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Cargo description</label>
              <Textarea
                value={formData.cargoDescription}
                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm text-blue-500 font-medium">Cargo weight</label>
              <Textarea
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-600 font-medium">Uploads</h3>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('packing-list')?.click()}>
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-blue-500">Packing list</span>
              </Button>
              <input
                type="file"
                id="packing-list"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file, 'packing-list');
                  }
                }}
              />
              
              <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('commercial-list')?.click()}>
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-blue-500">Commercial List</span>
              </Button>
              <input
                type="file"
                id="commercial-list"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file, 'commercial-list');
                  }
                }}
              />
              
              <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('cargo-photo')?.click()}>
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-blue-500">Cargo photo</span>
              </Button>
              <input
                type="file"
                id="cargo-photo"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file, 'cargo-photo');
                  }
                }}
              />
            </div>
          </div>

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
