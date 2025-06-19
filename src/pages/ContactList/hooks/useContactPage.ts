import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/api/adminRoutes";

const useContacts = (page: string) => {
  return useQuery({
    queryKey: ["contacts", page],
    queryFn: () => getContacts(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
export default useContacts;
