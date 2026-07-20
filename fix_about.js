const fs = require('fs');

// 1. Update i18n.js
let i18nContent = fs.readFileSync('d:/companies/sudia/muasalat/i18n.js', 'utf8');

const arAboutOld = /about: \{\s*title: 'من نحن',[\s\S]*?tags: \['خيارات مرنة', 'دعم 24\/7', 'تجربة آمنة'\]\s*\}/;
const arAboutNew = `about: {
            badge: 'من نحن',
            title1: 'نبني جسراً',
            title2: 'بينك وبين',
            title3: 'المدينة',
            sub: 'مواصلات هي أكثر من مجرد تطبيق نقل؛ إنها شريكك اليومي في التنقل الذكي.',
            p1: 'مواصلات هو تطبيق نقل ذكي يربط الركاب بسائقين موثوقين لتوفير رحلات سريعة وآمنة داخل المدينة. نحن نقدم تجربة عصرية تجمع بين سهولة حجز الرحلات وخيارات الاشتراك الشهري المرنة.',
            p2: 'هدفنا هو جعل التنقل اليومي أسهل وأكثر موثوقية باستخدام التكنولوجيا الحديثة وتقديم خدمة عالية الجودة للجميع. نحن نؤمن بأن كل رحلة يجب أن تكون تجربة ممتعة وآمنة.',
            tag1: 'سائقون موثوقون',
            tag2: 'دعم 24/7',
            tag3: 'أسعار شفافة'
        }`;

const enAboutOld = /about: \{\s*title: 'About Us',[\s\S]*?tags: \['Flexible Options', '24\/7 Support', 'Safe Experience'\]\s*\}/;
const enAboutNew = `about: {
            badge: 'About Us',
            title1: 'Building a bridge',
            title2: 'between you and',
            title3: 'the city',
            sub: 'Mowasalat is more than just a transport app; it\\'s your daily partner in smart mobility.',
            p1: 'Mowasalat is a smart transport app that connects passengers with verified drivers to provide fast and safe city travel. We offer a modern experience that combines easy ride booking with flexible monthly subscription options.',
            p2: 'Our goal is to make daily mobility easier and more reliable using modern technology and providing high-quality service for everyone. We believe every ride should be an enjoyable and safe experience.',
            tag1: 'Verified drivers',
            tag2: '24/7 Support',
            tag3: 'Transparent pricing'
        }`;

i18nContent = i18nContent.replace(arAboutOld, arAboutNew);
i18nContent = i18nContent.replace(enAboutOld, enAboutNew);

fs.writeFileSync('d:/companies/sudia/muasalat/i18n.js', i18nContent, 'utf8');

// 2. Update index.html
let indexContent = fs.readFileSync('d:/companies/sudia/muasalat/index.html', 'utf8');

const map = [
    ['about-badge">About Us</span>', 'about-badge" data-i18n="about.badge">About Us</span>'],
    ['Building a bridge', '<span data-i18n="about.title1">Building a bridge</span>'],
    ['between you and', '<span data-i18n="about.title2">between you and</span>'],
    ['>the city</span>', ' data-i18n="about.title3">the city</span>'],
    ['about-sub">\n                    Mowasalat is more than just a transport app; it\'s your daily partner in smart mobility.\n                </p>', 'about-sub" data-i18n="about.sub">Mowasalat is more than just a transport app; it\'s your daily partner in smart mobility.</p>'],
    ['about-p1">\n                    <strong class="text-blue-400">Mowasalat</strong> is a smart transport app that connects passengers with verified drivers to provide fast and safe city travel. We offer a modern experience that combines easy ride booking with flexible monthly subscription options.\n                </p>', 'about-p1" data-i18n="about.p1">Mowasalat is a smart transport app that connects passengers with verified drivers to provide fast and safe city travel. We offer a modern experience that combines easy ride booking with flexible monthly subscription options.</p>'],
    ['about-p2">\n                    Our goal is to make daily mobility easier and more reliable using modern technology and providing high-quality service for everyone. We believe every ride should be an enjoyable and safe experience.\n                </p>', 'about-p2" data-i18n="about.p2">Our goal is to make daily mobility easier and more reliable using modern technology and providing high-quality service for everyone. We believe every ride should be an enjoyable and safe experience.</p>'],
    ['tag1">Verified drivers</span>', 'tag1" data-i18n="about.tag1">Verified drivers</span>'],
    ['tag2">24/7 Support</span>', 'tag2" data-i18n="about.tag2">24/7 Support</span>'],
    ['tag3">Transparent pricing</span>', 'tag3" data-i18n="about.tag3">Transparent pricing</span>']
];

for (const [search, replace] of map) {
    indexContent = indexContent.replace(search, replace);
}

fs.writeFileSync('d:/companies/sudia/muasalat/index.html', indexContent, 'utf8');
console.log('About section translated');
