import BackgroundImage from "../../assets/images/animated-apo-island.jpg";
import IdleAttractScreen from "@/Components/IdleAttractScreen";

const MainLayout = ({ children }) => {
    return (
        <div
            style={{ backgroundImage: `url(${BackgroundImage})` }} // no quotes needed
            className="min-h-screen bg-cover bg-center bg-no-repeat"
        >
            <div className="min-h-screen bg-gradient-to-br from-sky-400/70 via-teal-300/70 to-lime-300/70">
                {children}
            </div>
            <IdleAttractScreen />
        </div>
    );
};

export default MainLayout;
