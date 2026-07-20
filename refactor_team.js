const fs = require('fs');

let i18nContent = fs.readFileSync('d:/companies/sudia/muasalat/i18n.js', 'utf8');

const arMembers = `
        teamMembers: [
            { name: 'م. عبدالرحمن أحمد الفيفي', role: 'رئيس مجلس الإدارة والرئيس التنفيذي' },
            { name: 'أ. عبدالإله أحمد الفيفي', role: 'مستشار الموارد البشرية والعمل' },
            { name: 'د. يحيى عبدالله الفيفي', role: 'مستشار استراتيجي' },
            { name: 'م. فهد جابر الفيفي', role: 'المدير التنفيذي' },
            { name: 'م. جابر علي الفيفي', role: 'المدير التنفيذي' },
            { name: 'م.أبرار عبدالله البدور', role: 'عضو فريق العمل' },
            { name: 'أ.أيمن موسى الفيفي', role: 'عضو فريق العمل' },
            { name: 'أ.فاطمة جابر الفيفي', role: 'عضو فريق العمل' }
        ],
`;

const enMembers = `
        teamMembers: [
            { name: 'Eng. Abdulrahman Ahmed Al-Fifi', role: 'Chairman & CEO' },
            { name: 'Mr. Abdulilah Ahmed Al-Fifi', role: 'HR & Labor Advisor' },
            { name: 'Dr. Yahya Abdullah Al-Fifi', role: 'Strategic Advisor' },
            { name: 'Eng. Fahad Jaber Al-Fifi', role: 'Executive Director' },
            { name: 'Eng. Jaber Ali Al-Fifi', role: 'Executive Director' },
            { name: 'Eng. Abrar Abdullah Al-Budour', role: 'Team Member' },
            { name: 'Mr. Ayman Musa Al-Fifi', role: 'Team Member' },
            { name: 'Ms. Fatima Jaber Al-Fifi', role: 'Team Member' }
        ],
`;

i18nContent = i18nContent.replace('team: {\n            title: \'فريق العمل\',', 'team: {\n            title: \'فريق العمل\',' + arMembers);
i18nContent = i18nContent.replace('team: {\n            title: \'Our Team\',', 'team: {\n            title: \'Our Team\',' + enMembers);

fs.writeFileSync('d:/companies/sudia/muasalat/i18n.js', i18nContent, 'utf8');

// Now update team.html to use data-i18n tags for members
let teamHtml = fs.readFileSync('d:/companies/sudia/muasalat/team.html', 'utf8');
const teamMap = [
    ['team-member-name">م. عبدالرحمن أحمد الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.0.name">م. عبدالرحمن أحمد الفيفي</h3>'],
    ['team-member-role">رئيس مجلس الإدارة والرئيس التنفيذي</p>', 'team-member-role" data-i18n="team.teamMembers.0.role">رئيس مجلس الإدارة والرئيس التنفيذي</p>'],
    ['team-member-name">أ. عبدالإله أحمد الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.1.name">أ. عبدالإله أحمد الفيفي</h3>'],
    ['team-member-role">مستشار الموارد البشرية والعمل</p>', 'team-member-role" data-i18n="team.teamMembers.1.role">مستشار الموارد البشرية والعمل</p>'],
    ['team-member-name">د. يحيى عبدالله الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.2.name">د. يحيى عبدالله الفيفي</h3>'],
    ['team-member-role">مستشار استراتيجي</p>', 'team-member-role" data-i18n="team.teamMembers.2.role">مستشار استراتيجي</p>'],
    ['team-member-name">م. فهد جابر الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.3.name">م. فهد جابر الفيفي</h3>'],
    ['team-member-role">المدير التنفيذي</p>', 'team-member-role" data-i18n="team.teamMembers.3.role">المدير التنفيذي</p>'],
    ['team-member-name">م. جابر علي الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.4.name">م. جابر علي الفيفي</h3>'],
    // 5 is Abrar
    ['team-member-name">م.أبرار عبدالله البدور</h3>', 'team-member-name" data-i18n="team.teamMembers.5.name">م.أبرار عبدالله البدور</h3>'],
    ['team-member-role">عضو فريق العمل</p>', 'team-member-role" data-i18n="team.teamMembers.5.role">عضو فريق العمل</p>'],
    // 6 is Ayman
    ['team-member-name">أ.أيمن موسى الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.6.name">أ.أيمن موسى الفيفي</h3>'],
    // 7 is Fatima
    ['team-member-name">أ.فاطمة جابر الفيفي</h3>', 'team-member-name" data-i18n="team.teamMembers.7.name">أ.فاطمة جابر الفيفي</h3>'],
    
    // Some titles
    ['team-title">تعرف على قادتنا</h2>', 'team-title" data-i18n="team.subtitle">تعرف على قادتنا</h2>'],
    ['>نخبة من الكفاءات تعمل بشغف لتقديم أفضل تجربة نقل ذكي.</p>', ' data-i18n="team.desc">نخبة من الكفاءات تعمل بشغف لتقديم أفضل تجربة نقل ذكي.</p>']
];

for (const [search, replace] of teamMap) {
    teamHtml = teamHtml.replace(new RegExp(search, 'g'), replace);
}
fs.writeFileSync('d:/companies/sudia/muasalat/team.html', teamHtml, 'utf8');

// There's a duplicate "المدير التنفيذي" for members 3 and 4
teamHtml = teamHtml.replace(/team-member-role">المدير التنفيذي<\/p>/g, 'team-member-role" data-i18n="team.teamMembers.4.role">المدير التنفيذي</p>');
// Fix member 3 role mapping to 3 since it might have been replaced with 4
teamHtml = teamHtml.replace(/team-member-role" data-i18n="team\.teamMembers\.4\.role">المدير التنفيذي<\/p>/, 'team-member-role" data-i18n="team.teamMembers.3.role">المدير التنفيذي</p>');

fs.writeFileSync('d:/companies/sudia/muasalat/team.html', teamHtml, 'utf8');
console.log('Team members updated');
