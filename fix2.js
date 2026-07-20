const fs = require('fs');

function processFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove the aggressive `i` rule
    content = content.replace(/body\.light-theme i \{\s*color: #1a4a8a !important;\s*\}/g, '');

    // Replace the aggressive `.text-white` rule with one that excludes the hero section and footer
    // Let's use a specific wrapper for hero and footer to avoid affecting them.
    content = content.replace(
        /body\.light-theme \.text-white \{\s*color: #0a1a3a !important;\s*\}/g,
        `body.light-theme :not(#hero-slider, #hero-slider *, .hero-section-wrap, .hero-section-wrap *, footer, footer *) > .text-white {
            color: #0a1a3a !important;
        }
        body.light-theme i:not(#hero-slider *, .hero-section-wrap *, footer *) {
            color: #1a4a8a;
        }
        /* Specific fix for hero buttons */
        .hero-btn-appstore {
            color: #ffffff !important;
        }
        .hero-btn-appstore i {
            color: #ffffff !important;
        }
        /* Keep Google Play icon blue but text dark */
        .hero-btn-google i {
            color: #1a4a8a !important;
        }`
    );

    // Let's also wrap the hero's STATIC ELEMENTS in a class .hero-section-wrap so the CSS above works.
    // The static elements div is: `<div class="relative z-20 w-full mt-auto pb-10 flex flex-col items-center">`
    content = content.replace(
        /<div class="relative z-20 w-full mt-auto pb-10 flex flex-col items-center">/g,
        '<div class="relative z-20 w-full mt-auto pb-10 flex flex-col items-center hero-section-wrap">'
    );

    // Add classes to buttons for specific targeting
    content = content.replace(
        /class="([^"]*?)shimmer-btn([^"]*?)"/g,
        'class="$1shimmer-btn hero-btn-google$2"'
    );
    content = content.replace(
        /class="([^"]*?)bg-black\/40 hover:bg-black\/60([^"]*?text-white[^"]*?)"/g,
        'class="$1bg-black/40 hover:bg-black/60$2 hero-btn-appstore"'
    );

    fs.writeFileSync(file, content, 'utf8');
}

processFile('d:/companies/sudia/muasalat/index.html');
processFile('d:/companies/sudia/muasalat/team.html');
console.log('Done fix2');
