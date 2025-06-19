import type React from "react";
import type { Contact } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MessageSquare, Calendar } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onStatusChange: (id: string, status: "unattended" | "sorted") => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onStatusChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header with name and status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                {contact.name}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  contact.status === "sorted" ? "secondary" : "destructive"
                }
                className="text-xs"
              >
                {contact.status === "sorted" ? "Sorted" : "Unattended"}
              </Badge>
              <Select
                value={contact.status}
                onValueChange={(value: Contact["status"]) =>
                  onStatusChange(String(contact.id), value)
                }
              >
                <SelectTrigger className="w-24 sm:w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unattended">Unattended</SelectItem>
                  <SelectItem value="sorted">Sorted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all">
              {contact.email}
            </span>
          </div>

          {/* Subject */}
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900 break-words">
                {contact.subject}
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="pl-6">
            <p className="text-sm text-gray-600 leading-relaxed break-words">
              {contact.message}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500">
              {formatDate(contact.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
