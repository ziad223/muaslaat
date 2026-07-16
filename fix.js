const fs = require('fs');

const indexFile = 'd:\\companies\\sudia\\muasalat\\index.html';
const teamFile = 'd:\\companies\\sudia\\muasalat\\team.html';

let content = fs.readFileSync(indexFile, 'utf8');

// Use regex or split to extract before HERO and after FOOTER
let beforeHero = content.split('<!-- ============================================================ -->\r\n<!-- HERO -->')[0];
if (!beforeHero || beforeHero.length === content.length) {
    beforeHero = content.split('<!-- ============================================================ -->\n<!-- HERO -->')[0];
}

const afterContactStr = '<!-- ============================================================ -->\r\n<!-- FOOTER - FULLY TRANSLATED -->';
let afterContactParts = content.split(afterContactStr);
let afterContact = '';
if (afterContactParts.length > 1) {
    afterContact = afterContactStr + afterContactParts[1];
} else {
    const afterContactStr2 = '<!-- ============================================================ -->\n<!-- FOOTER - FULLY TRANSLATED -->';
    afterContactParts = content.split(afterContactStr2);
    if (afterContactParts.length > 1) {
        afterContact = afterContactStr2 + afterContactParts[1];
    }
}

const teamSection = `
<!-- ============================================================ -->
<!-- TEAM SECTION -->
<!-- ============================================================ -->
<section id="team" class="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-black/10">
    <div class="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div class="text-center mb-16">
            <span class="section-badge team-badge">فريق العمل</span>
            <h2 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mt-2 team-title">تعرف على قادتنا</h2>
            <p class="mt-3 text-gray-400 max-w-2xl mx-auto team-sub">نخبة من الكفاءات تعمل بشغف لتقديم أفضل تجربة نقل ذكي</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Team Member 1 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-1.jpeg" alt="مهندس عبدالله مبره الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">م. عبدالله مبره الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">رئيس مجلس الإدارة والرئيس التنفيذي</p>
            </div>
            <!-- Team Member 2 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-5.jpeg" alt="أ. عبدالله يحيى الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. عبدالله يحيى الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">المدير الإقليمي بمنطقة جازان</p>
            </div>

            <!-- Team Member 4 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-4.jpeg" alt="أ. يحيى سليمان الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. يحيى سليمان الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">الشؤون الإدارية</p>
            </div>

            <!-- Team Member 5 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-3.jpeg" alt="استاذ علي حسين الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. علي حسين الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">إدارة التشغيل</p>
            </div>

            <!-- Team Member 6 -->
            <div class="service-card rounded-3xl p-6 text-center group">
                <div class="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/10 mb-5 relative group-hover:border-blue-400 transition-all">
                    <img src="team-2.jpeg" alt="استاذ محمد حسن الفيفي" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 class="text-xl font-bold text-white mb-1 team-member-name">أ. محمد حسن الفيفي</h3>
                <p class="text-blue-400 text-sm font-semibold mb-3 team-member-role">إدارة التشغيل</p>
            </div>
        </div>
    </div>
</section>
`;

let newContent = beforeHero + teamSection + '\n' + afterContact;

newContent = newContent.replace(/href="#home"/g, 'href="index.html#home"');
newContent = newContent.replace(/href="#about"/g, 'href="index.html#about"');
newContent = newContent.replace(/href="#services"/g, 'href="index.html#services"');
newContent = newContent.replace(/href="#how-to-ride"/g, 'href="index.html#how-to-ride"');
newContent = newContent.replace(/href="#privacy"/g, 'href="index.html#privacy"');
newContent = newContent.replace(/href="#contact"/g, 'href="index.html#contact"');

fs.writeFileSync(teamFile, newContent, 'utf8');
