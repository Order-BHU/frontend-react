import type React from "react";
import { useState, useEffect } from "react";
import type { Contact } from "./types";
import ContactCard from "./components/ContactCard";
import Pagination from "./components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useContacts from "./hooks/useContactPage";
import { setContactStatus } from "@/api/adminRoutes";
import { useToast } from "@/hooks/use-toast";

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: contactList, status: contactStatus } = useContacts(
    String(currentPage)
  );

  const { mutateAsync } = useMutation({
    mutationFn: setContactStatus,
    onSuccess: (data) => {
      toast({ title: "Success", description: data.data.message });
    },
    onError: () => {
      toast({ title: "Error", description: "Something went wrong" });
    },
  });
  //   const mockData: ContactsResponse = {
  //     contacts: {
  //       current_page: 1,
  //       data: [
  //         {
  //           id: 26,
  //           user_id: "382",
  //           name: "Just_Simeon",
  //           email: "simeon9787@gmail.com",
  //           subject: "Time wastage",
  //           message: "I've been waiting for close to an hour now for my order",
  //           status: "unattended",
  //           created_at: "2025-06-13T11:56:31.000000Z",
  //           updated_at: "2025-06-13T11:56:31.000000Z",
  //         },
  //         {
  //           id: 25,
  //           user_id: "376",
  //           name: "Holimie",
  //           email: "sesughdanboki5@gmail.com",
  //           subject: "Food",
  //           message: "My order is not processing",
  //           status: "unattended",
  //           created_at: "2025-06-11T12:57:19.000000Z",
  //           updated_at: "2025-06-11T12:57:19.000000Z",
  //         },
  //         {
  //           id: 24,
  //           user_id: "366",
  //           name: "Nwachukwu Miracle",
  //           email: "nwachukwumiracle42@gmail.com",
  //           subject: "I paid for food and it's not reflecting",
  //           message: "I have paid for my food but it's not confirming",
  //           status: "sorted",
  //           created_at: "2025-06-09T15:19:08.000000Z",
  //           updated_at: "2025-06-09T15:19:08.000000Z",
  //         },
  //         {
  //           id: 23,
  //           user_id: "344",
  //           name: "Victory",
  //           email: "vickida629@gmail.com",
  //           subject: "My payment",
  //           message:
  //             "Please I paid to the account just now and my order isn't showing on the dashboard, the name of the account is Solomon Osikhena and I sent 2300",
  //           status: "sorted",
  //           created_at: "2025-06-09T13:45:01.000000Z",
  //           updated_at: "2025-06-09T13:45:01.000000Z",
  //         },
  //       ],
  //       first_page_url: "http://bhuorder.com.ng/api/contacts?page=1",
  //       from: 1,
  //       last_page: 1,
  //       last_page_url: "http://bhuorder.com.ng/api/contacts?page=1",
  //       links: [
  //         {
  //           url: null,
  //           label: "&laquo; Previous",
  //           active: false,
  //         },
  //         {
  //           url: "http://bhuorder.com.ng/api/contacts?page=1",
  //           label: "1",
  //           active: true,
  //         },
  //         {
  //           url: null,
  //           label: "Next &raquo;",
  //           active: false,
  //         },
  //       ],
  //       next_page_url: null,
  //       path: "http://bhuorder.com.ng/api/contacts",
  //       per_page: 10,
  //       prev_page_url: null,
  //       to: 4,
  //       total: 4,
  //     },
  //     message: "Contact list retrieved successfully",
  //   };

  //   useEffect(() => {
  //     // Simulate API call
  //     setTimeout(() => {
  //       setContacts(mockData.contacts.data);
  //       setFilteredContacts(mockData.contacts.data);
  //       setCurrentPage(mockData.contacts.current_page);
  //       setTotalPages(mockData.contacts.last_page);
  //       setIsLoading(false);
  //     }, 1000);
  //   }, []);

  useEffect(() => {
    if (contactList) {
      setContacts(contactList.data.contacts.data);
      setTotalPages(contactList.data.contacts.last_page);
    }
  }, [contactList]);

  useEffect(() => {
    let filtered = contacts;
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusCount = (status: Contact["status"]) => {
    return contacts.filter((contact) => contact.status === status).length;
  };

  const handleSetStatus = async (id: string, status: Contact["status"]) => {
    try {
      const res = await mutateAsync({ contactId: id, status: status });
      if (res) {
        setContacts((prev) =>
          prev.map((cont) =>
            String(cont.id) === id ? { ...cont, status: status } : cont
          )
        );
      }
    } catch {
      return;
    }
  };

  if (contactStatus === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            Contact Management
          </h1>
        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">
                    Unattended
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {getStatusCount("unattended")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Pending</p>
                </div>
                <div className="text-red-500">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">
                    Sorted
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {getStatusCount("sorted")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Completed</p>
                </div>
                <div className="text-green-500">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-0 shadow-sm mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 "
                />
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 ">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unattended">Unattended</SelectItem>
                    <SelectItem value="sorted">Sorted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Section */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center mb-6">
              <div className="text-orange-500 mr-3">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Contacts
              </h2>
            </div>

            {/* Contact List */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
            />
            <div className="space-y-4 mt-3">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onStatusChange={handleSetStatus}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-base sm:text-lg">
                    No contacts found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredContacts.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={currentPage < totalPages}
                  hasPrevPage={currentPage > 1}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactList;
