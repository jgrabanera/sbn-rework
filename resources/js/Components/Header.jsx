import SBNLogo from "../../assets/images/starbooks-nature-logo.png";

const Header = () => {
    return (
        <div className="w-full flex flex-row justify-between items-center h-full md:max-h-[10%] mb-2">
            <img
                src={SBNLogo}
                alt="STARBOOKS Nature"
                className="md:h-16 h-14 object-contain "
            />
            {/* User */}
            <div className="flex flex-row md:max-w-60 gap-2">
                <div className="flex flex-col text-xs text-right text-white gap-1">
                    <p className="font-semibold">Guest</p>
                    <hr />
                    <p>User</p>
                </div>
                <div className=" w-10 h-10 border border-white rounded-3xl relative">
                    <div className="absolute right-2 top-2">🤵</div>
                </div>
            </div>
        </div>
    );
};

export default Header;
