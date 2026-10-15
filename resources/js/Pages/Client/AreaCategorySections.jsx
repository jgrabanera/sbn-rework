import { useEffect, useState } from "react";
import WildlifeTab from "./tabs/WildlifeTab";

import Header from "@/Components/Header";
import SightsTab from "./tabs/SightsTab";
import AboutTab from "./tabs/AboutTab";
import ApoSights from "./tabs/ApoSights";
import SidebarNav from "@/Components/SidebarNav";
import BottomHNav from "@/Components/BottomHNav";
import CategoryNav from "@/Components/CategoryNav";
import CategoryLayout from "@/Layouts/CategoryLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import WildlifePage from "./tabs/WildlifeTab";
import EcotourismTab from "./tabs/EcotourismTab";
import ConservationTab from "./tabs/ConservationTab";
import PeopleTab from "./tabs/PeopleTab";
import axios from "axios";
import ThreatTab from "./tabs/ThreatTab";
import ManagementTab from "./tabs/ManagementTab";
import ResearchesTab from "./tabs/ResearchesTab";

const AreaCategorySections = ({ area, sectionId, section }) => {
    const [data, setData] = useState([]);
    const currentSection =
        sectionId ?? section?.area_category_id ?? section ?? null;

    const id = area?.id;

    // const getData = async () => {
    //     const params = `area=${area?.id}`;
    //     const res = await axios.get(`/get-protected-area-section?${params}`);
    //     setData(res.data);
    // };

    // useEffect(() => {
    //     getData();
    // }, []);

    const validSections = data
        .filter((item) => String(item.areaID) === String(id))
        .map((item) => String(item.area_category_id));

    useEffect(() => {
        if (id) return;
        if (!validSections.length) return;

        const current = String(currentSection);

        console.log(current);
    }, [currentSection, area?.id]);

    const renderSection = () => {
        switch (String(currentSection)) {
            case "1":
                return <AboutTab area={id} section={currentSection} />;
            case "2":
                return id == 1 ? (
                    <ApoSights id={id} section={currentSection} />
                ) : (
                    <SightsTab id={id} section={currentSection} />
                );
            case "3":
                return <WildlifeTab id={id} section={currentSection} />;
            case "4":
                return <EcotourismTab id={id} section={currentSection} />;
            case "5":
                return <ConservationTab id={id} section={currentSection} />;
            case "6":
                return <PeopleTab id={id} section={currentSection} />;
            case "7":
                return <ThreatTab id={id} section={currentSection} />;
            case "8":
                return <ManagementTab id={id} section={currentSection} />;
            case "9":
                return <ResearchesTab id={id} section={currentSection} />;
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
