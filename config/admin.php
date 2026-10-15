<?php

return [

    /*
    |----------------------------------------------------------------------
    | Admin CMS Sections
    |----------------------------------------------------------------------
    |
    | Single source of truth for the admin sidebar and dashboard cards.
    | Previously this list existed three times: a JS config object, a
    | hardcoded <Link> list in SidebarNavigation, and the dashboard card
    | grid. Adding a section required editing all three.
    |
    | `count_table` is optional. When present the dashboard shows a live
    | record count for the section; omit it and the card shows a dash.
    |
    */

    'sections' => [
        [
            'key' => 'area',
            'title' => 'Protected Areas',
            'route' => '/area-category',
            'sidebar_label' => 'Area Category',
            'icon' => 'category',
            'description' => 'Core area records, descriptions, video links, and image references.',
            'count_table' => 'tblmainarea',
        ],
        [
            'key' => 'about',
            'title' => 'About',
            'route' => '/about-category',
            'sidebar_label' => 'About',
            'icon' => 'help',
            'description' => 'Introductory content and image references used in the public About tab.',
            'count_table' => 'tbl_content_about',
        ],
        [
            'key' => 'sights',
            'title' => 'Sights To See',
            'route' => '/sights-category',
            'sidebar_label' => 'Sights To See',
            'icon' => 'flag',
            'description' => 'Sight entries and supporting content mapped to each protected area.',
            'count_table' => 'tbl_site_to_see_content',
        ],
        [
            'key' => 'wildlife',
            'title' => 'Wildlife & Habitat',
            'route' => '/wildlife-category',
            'sidebar_label' => 'Wildlife',
            'icon' => 'animals',
            'description' => 'Wildlife tabs and their nested item content for habitat storytelling.',
            'count_table' => 'tbl_wildlife_item',
        ],
        [
            'key' => 'ecotourism',
            'title' => 'Ecotourism',
            'route' => '/ecotourism-category',
            'sidebar_label' => 'Ecotourism',
            'icon' => 'compost',
            'description' => 'Ecotourism articles, imagery, and section-level content.',
            'count_table' => 'tbl_ecotourism',
        ],
        [
            'key' => 'conservation',
            'title' => 'Conservation',
            'route' => '/conservation-category',
            'sidebar_label' => 'Conservation',
            'icon' => 'forest',
            'description' => 'Conservation narratives and image assets shown on the client site.',
            'count_table' => 'tbl_conservation',
        ],
        [
            'key' => 'people',
            'title' => 'People',
            'route' => '/people-category',
            'sidebar_label' => 'People',
            'icon' => 'people',
            'description' => 'Community stories and people-focused articles per protected area.',
            'count_table' => 'tbl_people',
        ],
        [
            'key' => 'threats',
            'title' => 'Threats',
            'route' => '/threats-category',
            'sidebar_label' => 'Threats',
            'icon' => 'warning',
            'description' => 'Threat summaries and issue notes tied to each protected area.',
            'count_table' => 'tbl_threats',
        ],
        [
            'key' => 'researches',
            'title' => 'Researches',
            'route' => '/researches-category',
            'sidebar_label' => 'Researches',
            'icon' => 'research',
            'description' => 'Research file links, preview assets, and supporting references.',
            'count_table' => 'tbl_researches',
        ],
        [
            'key' => 'management',
            'title' => 'Management',
            'route' => '/management-category',
            'sidebar_label' => 'Management',
            'icon' => 'accounts',
            'description' => 'Management content blocks and supporting images across the site.',
            'count_table' => 'tbl_management',
        ],
        [
            'key' => 'dosanddonts',
            'title' => "Do's and Don'ts",
            'route' => '/dos-and-donts-category',
            'sidebar_label' => "Do's and Don'ts",
            'icon' => 'checklist',
            'description' => 'Guidance content for visitor do\'s, don\'ts, reminders, and responsible behavior messaging.',
            'count_table' => null,
        ],
        [
            'key' => 'quiz',
            'title' => 'Quiz CMS',
            'route' => '/quiz-category',
            'sidebar_label' => 'Quiz CMS',
            'icon' => 'quiz',
            'description' => 'Quiz question management, answer setup, and quiz-specific content administration.',
            'count_table' => 'table_choices',
        ],
    ],

];