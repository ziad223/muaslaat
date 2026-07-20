const fs = require('fs');

function removeDarkMode(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove the theme toggle button HTML
    content = content.replace(/<!-- Theme Toggle -->[\s\S]*?<\/button>/, '');
    
    // 2. Remove the THEME JS block completely
    content = content.replace(/\/\/ ========== THEME ==========[\s\S]*?const savedTheme = 'light';\s*setTheme\(savedTheme\);/g, '');

    // 3. Remove the updateLogos / override setTheme block completely
    content = content.replace(/function updateLogos\(theme\) \{[\s\S]*?\}\s*\}[\s\n]*<\/script>/, '</script>');

    // Optional: There is an extra closing brace sometimes from the overridden setTheme script block. Let's fix that block exactly.
    // The previous regex might leave an orphaned closing brace or function. Let's be precise:
    content = content.replace(/function updateLogos\(theme\) \{[\s\S]*?\}\s*<\/script>/, '</script>');

    fs.writeFileSync(file, content, 'utf8');
}

removeDarkMode('d:/companies/sudia/muasalat/index.html');
removeDarkMode('d:/companies/sudia/muasalat/team.html');
console.log('Dark mode UI and JS removed');
