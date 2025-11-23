import React from "react";
import UserProfilePage from "./UserProfilePage";
import AdminLayout from "../../layouts/AdminLayout";
import DealerLayout from "../../layouts/DealerLayout";
import DealerManagerLayout from "../../layouts/DealerManagerLayout";
import EvmLayout from "../../layouts/EvmLayout";

/**
 * Component Wrapper để tự động wrap UserProfilePage vào layout phù hợp dựa trên role
 */
const ProfileWrapper = () => {
    // eslint-disable-next-line no-undef
    const role = localStorage.getItem("role") || "ROLE_USER";

    // Render UserProfilePage bên trong layout tương ứng
    const renderWithLayout = () => {
        const profileContent = <UserProfilePage />;

        switch (role) {
            case "ROLE_ADMIN":
                return <AdminLayout>{profileContent}</AdminLayout>;
            case "ROLE_EVM_STAFF":
                return <EvmLayout>{profileContent}</EvmLayout>;
            case "ROLE_DEALER_STAFF":
                return <DealerLayout>{profileContent}</DealerLayout>;
            case "ROLE_DEALER_MANAGER":
                return <DealerManagerLayout>{profileContent}</DealerManagerLayout>;
            default:
                return profileContent;
        }
    };

    return renderWithLayout();
};

export default ProfileWrapper;
