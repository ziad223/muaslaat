const fs = require('fs');

function processFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Remove the JS that hides new-logo.jpeg in light theme
    content = content.replace(
        /const darkLogo = document\.querySelector\('img\[src="new-logo\.jpeg"\]'\);[\s\S]*?lightLogo\.style\.display = 'none';\s*\}\s*\}/g,
        '// Logo toggle logic removed because we only use new-logo.jpeg in light mode'
    );

    // Some versions might have different spacing. Let's just remove the specific lines.
    content = content.replace(/darkLogo\.style\.display = 'none';/g, "darkLogo.style.display = 'block';");
    content = content.replace(/lightLogo\.style\.display = 'block';/g, "lightLogo.style.display = 'none';");

    fs.writeFileSync(file, content, 'utf8');
}

processFile('d:/companies/sudia/muasalat/index.html');
processFile('d:/companies/sudia/muasalat/team.html');
console.log('JS logo logic fixed');
