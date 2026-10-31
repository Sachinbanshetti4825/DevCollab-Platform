import { organizationContext } from "../context/organization.context";
import { useContext } from "react";

function useOrganization(){

    const context=useContext(organizationContext);

    if(context===null){
        throw new error("useOrganization must be used in with useOrganization")
    }

    return context;

}

export default useOrganization;