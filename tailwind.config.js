import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{js,jsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },

            /*
            |------------------------------------------------------------------
            | Brand palette
            |------------------------------------------------------------------
            |
            | The CMS previously had no tokens at all: every page hardcoded
            | its own shade of teal/blue/green, which is why six different
            | visual languages accumulated. These are the only accent colours
            | the admin UI should reference.
            |
            */
            colors: {
                brand: {
                    50: "#f0fdfa",
                    100: "#ccfbf1",
                    200: "#99f6e4",
                    300: "#5eead4",
                    400: "#2dd4bf",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                    800: "#115e59",
                    900: "#134e4a",
                },
                accent: {
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                },
            },

            /*
            | Consistent surfaces + radii so cards, tables and modals stop
            | mixing rounded-md / rounded-lg / rounded-xl at random.
            */
            borderRadius: {
                card: "0.75rem",
                control: "0.5rem",
            },

            boxShadow: {
                card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                "card-hover":
                    "0 12px 24px -8px rgb(0 0 0 / 0.15), 0 4px 8px -4px rgb(0 0 0 / 0.08)",
            },
        },
    },

    plugins: [forms],
};