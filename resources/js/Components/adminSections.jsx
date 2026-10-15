export const adminSections = {
    area: {
        key: "area",
        title: "Protected Areas",
        route: "/area-category",
        description:
            "Core area records, descriptions, video links, and image references.",
    },
    about: {
        key: "about",
        title: "About",
        route: "/about-category",
        description:
            "Introductory content and image references used in the public About tab.",
    },
    sights: {
        key: "sights",
        title: "Sights To See",
        route: "/sights-category",
        description:
            "Sight entries and supporting content mapped to each protected area.",
    },
    wildlife: {
        key: "wildlife",
        title: "Wildlife & Habitat",
        route: "/wildlife-category",
        description:
            "Wildlife tabs and their nested item content for habitat storytelling.",
    },
    ecotourism: {
        key: "ecotourism",
        title: "Ecotourism",
        route: "/ecotourism-category",
        description: "Ecotourism articles, imagery, and section-level content.",
    },
    conservation: {
        key: "conservation",
        title: "Conservation",
        route: "/conservation-category",
        description:
            "Conservation narratives and image assets shown on the client site.",
    },
    people: {
        key: "people",
        title: "People",
        route: "/people-category",
        description:
            "Community stories and people-focused articles per protected area.",
    },
    threats: {
        key: "threats",
        title: "Threats",
        route: "/threats-category",
        description:
            "Threat summaries and issue notes tied to each protected area.",
    },
    researches: {
        key: "researches",
        title: "Researches",
        route: "/researches-category",
        description:
            "Research file links, preview assets, and supporting references.",
    },
    management: {
        key: "management",
        title: "Management",
        route: "/management-category",
        description:
            "Management content blocks and supporting images across the site.",
    },
    dosanddonts: {
        key: "dosanddonts",
        title: "Do's and Don'ts",
        route: "/dos-and-donts-category",
        description:
            "Guidance content for visitor do's, don'ts, reminders, and responsible behavior messaging.",
    },
    quiz: {
        key: "quiz",
        title: "Quiz CMS",
        route: "/quiz-category",
        description:
            "Quiz question management, answer setup, and quiz-specific content administration.",
    },
};

export const adminSectionList = Object.values(adminSections);
