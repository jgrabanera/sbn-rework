import Header from "@/Components/Header";
import BackgroundImage from "../../assets/images/animated-apo-island.jpg";
import SidebarNav from "@/Components/SidebarNav";
import BottomHNav from "@/Components/BottomHNav";
import CategoryNav from "@/Components/CategoryNav";
import IdleAttractScreen from "@/Components/IdleAttractScreen";
import { useEffect, useState } from "react";

const CategoryLayout = ({ area, section, areaCategory, children }) => {
    const [data, setData] = useState([]);

    const getData = async () => {
        const params = `area=${area?.id}`;
        const res = await axios.get(`/get-protected-area-section?${params}`);
        setData(res.data);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div
            style={{ backgroundImage: `url('${BackgroundImage}')` }}
            className="min-h-screen bg-cover bg-center bg-no-repeat"
        >
            <div className="min-h-screen bg-gradient-to-br from-sky-400/70 via-teal-300/70 to-lime-300/70">
                <div className="min-h-screen w-full p-2 flex flex-col justify-between">
                    {/* Header */}
                    <Header />
                    {area && (
                        <div className=" h-full mb-2 max-h-[10vh] ">
                            <h1
                                className=" md:text-4xl text-2xl font-bold text-center mb-2 text-white playpenSans text-shadow-lg/50"
                                style={{
                                    textShadow: `-1px -1px 0 #000,1px -1px 0 #000,-1px  1px 0 #000,1px  1px 0 #000`,
                                }}
                            >
                                {area.areaName}
                            </h1>
                        </div>
                    )}
                    {/* Content */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3 w-full h-full md:max-h-[68vh]">
                        {/* Left Navigation */}
                        <div className="md:w-18 md:flex hidden flex-col items-center justify-center h-full">
                            <SidebarNav id={area?.id} />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-4 w-full">
                            {children}
                        </div>
                    </div>

                    <div className="w-full  h-full ">
                        {/* Bottom nav (mobile) */}
                        <div className="block md:hidden w-full">
                            <BottomHNav id={area?.id} />
                        </div>

                        {/* Category nav (Desktop) */}
                        <CategoryNav
                            id={area?.id}
                            section={section}
                            areaCategory={data}
                        />
                    </div>
                </div>
            </div>
            <IdleAttractScreen />
        </div>
    );
};

export default CategoryLayout;
