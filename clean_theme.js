const fs = require('fs');

function processFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Force tailwind into light mode by adding script
    if (!content.includes('tailwind.config = {')) {
        content = content.replace(
            '<script src="https://cdn.tailwindcss.com"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>\n    <script>\n        tailwind.config = {\n            darkMode: "class"\n        }\n    </script>'
        );
    }

    // 2. Remove all my hacky body.light-theme CSS for .text-white and i
    content = content.replace(/body\.light-theme :not\([^)]*\) > \.text-white \{\s*color: #0a1a3a !important;\s*\}/g, '');
    content = content.replace(/body\.light-theme i:not\([^)]*\) \{\s*color: #1a4a8a;\s*\}/g, '');
    content = content.replace(/\/\* Specific fix for hero buttons \*\/[\s\S]*?\.hero-btn-google i \{\s*color: #1a4a8a !important;\s*\}/g, '');

    // Also remove the old global ones just in case they are still there
    content = content.replace(/body\.light-theme \.text-white \{\s*color: #0a1a3a !important;\s*\}/g, '');
    content = content.replace(/body\.light-theme i \{\s*color: #1a4a8a !important;\s*\}/g, '');

    // But we still need the original body.light-theme basic setup
    // Ensure body.light-theme { background: #ffffff; color: #0a1a3a; } is there.

    // 3. Remove `text-white` class from elements that should inherit dark blue in light mode.
    // The ones that should STAY white are: 
    // - Hero slide text
    // - Hero "MOWASALAT" logo text
    // - App Store button
    // - Floating badge text
    // - Toast
    // - Buttons like "Get it on Google Play" in navbar and sticky footer
    // Let's explicitly remove `text-white` from section titles and inputs using regex replacements
    
    // Replace `text-white` with nothing in specific contexts:
    
    // Navbar menu icon (needs to be dark)
    content = content.replace(/fa-bars text-xl text-white/g, 'fa-bars text-xl');
    
    // Mobile lang toggle
    content = content.replace(/id="mobile-lang-ar" class="text-sm font-semibold text-white"/g, 'id="mobile-lang-ar" class="text-sm font-semibold"');

    // Smart mobility title
    content = content.replace(/leading-\[1\.2\] tracking-tight text-white/g, 'leading-[1.2] tracking-tight');
    
    // Partners title
    content = content.replace(/tracking-tight text-white mt-2 partners-title/g, 'tracking-tight mt-2 partners-title');
    
    // Services titles
    content = content.replace(/tracking-tight text-white services-title/g, 'tracking-tight services-title');
    content = content.replace(/font-bold text-white mb-3 srv-title/g, 'font-bold mb-3 srv-title');
    
    // How it works
    content = content.replace(/tracking-tight text-white how-title/g, 'tracking-tight how-title');
    content = content.replace(/font-bold text-white text-lg mb-2 how-step/g, 'font-bold text-lg mb-2 how-step');
    
    // Privacy / Terms
    content = content.replace(/font-bold text-white privacy-title/g, 'font-bold privacy-title');
    content = content.replace(/font-bold text-white terms-title/g, 'font-bold terms-title');
    
    // Contact title
    content = content.replace(/leading-\[1\.1\] text-white contact-title/g, 'leading-[1.1] contact-title');
    
    // Social icons in contact
    content = content.replace(/hover:text-white transition-colors/g, 'hover:text-[#1a4a8a] transition-colors');
    
    // Inputs (remove text-white)
    content = content.replace(/text-sm text-white placeholder:text-gray-500/g, 'text-sm text-[#0a1a3a] placeholder:text-gray-500');

    // Footer quick titles
    // Wait, the footer is dark! `footer-gradient` has no light-theme override that turns it white.
    // Let's check: `bg-black/20`, etc. turn light. But `footer-gradient` is a class defined in css.
    // Let's leave footer titles as text-white/70, which is white.

    // Register modal
    // Background of modal turns light (`bg-[#0a1a3a]` turns `#ffffff` in `.light-theme`).
    // So modal title must be dark.
    content = content.replace(/font-extrabold text-white modal-title/g, 'font-extrabold modal-title');
    
    // Team member names
    // Team section bg is `bg-black/10` which turns light.
    content = content.replace(/font-bold text-white mb-1 team-member-name/g, 'font-bold mb-1 team-member-name');
    content = content.replace(/tracking-tight text-white mt-2 team-title/g, 'tracking-tight mt-2 team-title');

    // Google Play button in Navbar needs to KEEP text-white. 
    // It is `bg-[#1a4a8a] !text-white`.

    // Floating badge text needs to KEEP text-white. It's `<div class="font-bold text-white text-[15px]">Your ride in 2 min</div>`.

    // Clean up hero buttons (remove hero-btn-appstore, hero-section-wrap, hero-btn-google)
    content = content.replace(/hero-section-wrap/g, '');
    content = content.replace(/hero-btn-google/g, '');
    content = content.replace(/hero-btn-appstore/g, '');

    // Make sure we have the correct base CSS
    // Check if the original bad rule is there: `body.light-theme .text-white { color: #1a1a2e !important; }`
    content = content.replace(/body\.light-theme \.text-white \{\s*color: #1a1a2e !important;\s*\}/g, '');

    fs.writeFileSync(file, content, 'utf8');
}

processFile('d:/companies/sudia/muasalat/index.html');
processFile('d:/companies/sudia/muasalat/team.html');
console.log('Clean theme applied');
