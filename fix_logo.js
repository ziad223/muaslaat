const fs = require('fs');

function processFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove `dark:block hidden` from all new-logo.jpeg img tags
    content = content.replace(/class="([^"]*)dark:block hidden([^"]*)"/g, 'class="$1$2"');
    
    // Also remove `display: none;` and `hidden` from the alternative logo if needed, 
    // or better, just rely on new-logo.jpeg being visible. We just removed `dark:block hidden` 
    // which had `hidden` in it, so the image will now show by default.

    fs.writeFileSync(file, content, 'utf8');
}

processFile('d:/companies/sudia/muasalat/index.html');
processFile('d:/companies/sudia/muasalat/team.html');
console.log('Logos fixed');
