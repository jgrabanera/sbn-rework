import { usePage } from "@inertiajs/react";

/**
 * Admin section metadata, sourced from config/admin.php and shared to the
 * client through Inertia. Replaces the duplicated JS config object and the
 * hardcoded link list that used to live in the sidebar.
 */
export const useAdminSections = () => {
    const sections = usePage().props.adminSections;

    return Array.isArray(sections) ? sections : [];
};

export const useAdminSection = (key) =>
    useAdminSections().find((section) => section.key === key) ?? null;