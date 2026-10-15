import AboutTab from "./tabs/AboutTab";
import ApoSights from "./tabs/ApoSights";
import ConservationTab from "./tabs/ConservationTab";
import EcotourismTab from "./tabs/EcotourismTab";
import ManagementTab from "./tabs/ManagementTab";
import PeopleTab from "./tabs/PeopleTab";
import ResearchesTab from "./tabs/ResearchesTab";
import SightsTab from "./tabs/SightsTab";
import ThreatTab from "./tabs/ThreatTab";
import WildlifeTab from "./tabs/WildlifeTab";
import CategoryLayout from "@/Layouts/CategoryLayout";
import { Head } from "@inertiajs/react";

const AreaCategorySections = ({ area, sectionId, section }) => {
    const id = area?.id;
    const currentSection =
        sectionId ?? section?.area_category_id ?? section ?? null;

    const renderSection = () => {
        switch (String(currentSection)) {
            case "1":
                return <AboutTab area={id} />;
            case "2":
                // Area 1 (APO Island) has its own dive-site map.
                return id == 1 ? (
                    <ApoSights id={id} />
                ) : (
                    <SightsTab id={id} />
                );
            case "3":
                return <WildlifeTab id={id} />;
            case "4":
                return <EcotourismTab id={id} />;
            case "5":
                return <ConservationTab id={id} />;
            case "6":
                return <PeopleTab id={id} />;
            case "7":
                return <ThreatTab id={id} />;
            case "8":
                return <ManagementTab id={id} />;
            case "9":
                return <ResearchesTab id={id} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={area?.areaName} />
            {renderSection()}
        </>
    );
};

export default AreaCategorySections;
AreaCategorySections.layout = (page) => (
    <CategoryLayout
        section={page.props.sectionId ?? page.props.section}
        area={page.props.area}
        user={page.props.auth.user}
        children={page}
    />
);