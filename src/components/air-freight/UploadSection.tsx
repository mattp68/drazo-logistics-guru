import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UploadSectionProps {
  onFileUpload: (file: File, type: string) => Promise<string | null>;
}

export const UploadSection = ({ onFileUpload }: UploadSectionProps) => {
  return (
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
              await onFileUpload(file, 'packing-list');
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
              await onFileUpload(file, 'commercial-list');
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
              await onFileUpload(file, 'cargo-photo');
            }
          }}
        />
      </div>
    </div>
  );
};