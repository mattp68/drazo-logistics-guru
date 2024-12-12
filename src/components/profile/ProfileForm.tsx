import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, Phone } from "lucide-react";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export const ProfileForm = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  onFirstNameChange,
  onLastNameChange,
  onPhoneNumberChange,
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Enter your first name"
              className="pl-10"
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          <div className="relative">
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
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
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="Enter your phone number"
            className="pl-10"
          />
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};