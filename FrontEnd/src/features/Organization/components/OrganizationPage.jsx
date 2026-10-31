import { useEffect } from "react";
import CreateOrganization from "./CreateOrganization";
import OrganizationList from "./OrganizationList";
import useOrganization from "../hooks/useOrganization";

function OrganizationPage() {
  const { getMyOrganization } = useOrganization();

  useEffect(() => {
    getMyOrganization();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <OrganizationList />
        <CreateOrganization />
      </div>
    </div>
  );
}

export default OrganizationPage;