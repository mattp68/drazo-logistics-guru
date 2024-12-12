import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setEmail(user.email || "");

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone_number, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhoneNumber(data.phone_number || "");
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl || ""} />
                    <AvatarFallback>
                      {firstName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 p-1 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
                  >
                    <User className="h-4 w-4" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      value={email}
                      readOnly
                      className="pl-10 bg-gray-50"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <Button
                onClick={updateProfile}
                className="w-full"
                disabled={loading}
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;