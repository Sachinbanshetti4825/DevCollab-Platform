import { createContext, useState } from "react";
import {
  getMyOrganizationServices,
  createOrganizationServices,
  updateOrganizationServices,
  deleteOrganizationServices,
} from "../services/organization.services.js";
export const organizationContext = createContext(null);

const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);

  const [organizationLoading, setOrganizationLoading] = useState(false);
  const [fetchError, setError] = useState("");

  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [updateError, setUpdateError] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getMyOrganization = async () => {
    try {
      setError("");

      setOrganizationLoading(true);

      const data = await getMyOrganizationServices();

      setOrganizations(data.organizations);
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Failed to fetch organization");
    } finally {
      setOrganizationLoading(false);
    }
  };

  const createOrganization = async (name) => {
    try {
      setCreateError("");

      setCreateLoading(true);

      const data = await createOrganizationServices(name);

      //   setOrganizations((prev) => [...prev, data.organization]);

      await getMyOrganization();

      return true;
    } catch (error) {
      console.log(error);
      setCreateError(
        error.response?.data?.message || "Failed to create organization",
      );

      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateOrganization = async (organizationId, name) => {
    try {
      setUpdateError("");

      setUpdateLoading(true);

      const data = await updateOrganizationServices(organizationId, name);

      setOrganizations((prev) =>
        prev.map((org) =>
          org.organization._id === organizationId
            ? {
                ...org,
                organization: data.updatedOrganization,
              }
            : org,
        ),
      );

      return true;
    } catch (error) {
      console.log(error);
      setUpdateError(
        error.response?.data?.message || "Failed to Update organization",
      );
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteOrganization = async (organizationId) => {
    try {
      setDeleteError("");

      setDeleteLoading(true);

      const data = await deleteOrganizationServices(organizationId);

      await getMyOrganization();
    } catch (error) {
      console.log(error);
      setDeleteError(
        error.response?.data?.message || "Failed to Delete organization",
      );
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <organizationContext.Provider
      value={{
        organizations,
        organizationLoading,
        fetchError,
        getMyOrganization,
        createOrganization,
        createError,
        createLoading,
        deleteOrganization,
        deleteError,
        deleteLoading,
        updateOrganization,
        updateError,
        updateLoading,
      }}
    >
      {children}
    </organizationContext.Provider>
  );
};

export default OrganizationProvider;
