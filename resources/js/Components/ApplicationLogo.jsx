import Logo from "../../assets/images/Starbooks-Nature-1000x381.png";

export default function ApplicationLogo({ className = "", ...props }) {
    return (
        <img
            src={Logo}
            className={`max-w-80 ${className}`}
            alt="Starbooks Nature"
            {...props}
        />
    );
}
