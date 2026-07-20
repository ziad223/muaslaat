const fs = require('fs');

function processFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Force body to have light-theme class
    if (!content.includes('<body class="light-theme">')) {
        content = content.replace(/<body([^>]*)>/, (match, p1) => {
            if (p1.includes('class=')) {
                return `<body${p1.replace(/class="/, 'class="light-theme ')}>`;
            }
            return `<body${p1} class="light-theme">`;
        });
    }

    // 2. Change saved theme logic to always be light
    content = content.replace(/const savedTheme = localStorage\.theme \|\| 'dark';/g, "const savedTheme = 'light';");

    // 3. Update light-theme CSS variables
    content = content.replace(
        /body\.light-theme \{\s*background: #f0f4fa;\s*color: #1a1a2e;\s*\}/g,
        `body.light-theme {\n            background: #ffffff;\n            color: #0a1a3a;\n        }\n        body.light-theme i {\n            color: #1a4a8a !important;\n        }`
    );
    
    // Change white text in light theme to very dark blue
    content = content.replace(
        /body\.light-theme \.text-white \{\s*color: #1a1a2e !important;\s*\}/g,
        `body.light-theme .text-white {\n            color: #0a1a3a !important;\n        }`
    );

    // 4. Replace logo
    content = content.replace(/logo2\.png/g, 'new-logo.jpeg');

    // 5. Add team members
    if (file.includes('team.html') && !content.includes('أ. ايمن موسى الفيفي')) {
        const teamMemberHTML = `
            <!-- Team Member New 1 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all flex items-center justify-center bg-gray-100">
                    <i class="fa-solid fa-user text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">م. أبرار عبدالله البدور</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">عضو فريق العمل</p>
            </div>
            <!-- Team Member New 2 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-6.jpeg" alt="أ. ايمن موسى الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. ايمن موسى الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">عضو فريق العمل</p>
            </div>
            <!-- Team Member New 3 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all flex items-center justify-center bg-gray-100">
                    <i class="fa-solid fa-user text-4xl text-gray-400"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. فاطمة جابر الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">عضو فريق العمل</p>
            </div>
        `;
        
        content = content.replace(/(<h3[^>]*>أ\. محمد حسن الفيفي<\/h3>\s*<p[^>]*>.*?<\/p>\s*<\/div>)/, "$1" + teamMemberHTML);
    }

    fs.writeFileSync(file, content, 'utf8');
}

processFile('d:/companies/sudia/muasalat/index.html');
processFile('d:/companies/sudia/muasalat/team.html');
console.log('Done');
