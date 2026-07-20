const translations = {
    ar: {
        nav: {
            home: 'الرئيسية',
            about: 'من نحن',
            team: 'فريق العمل',
            services: 'خدماتنا',
            howToRide: 'كيف تستخدم',
            privacy: 'السياسات',
            contact: 'تواصل معنا',
            login: 'تسجيل الدخول'
        },
        hero: {
            badge: 'متوفر في 15+ مدينة',
            title: 'تنقل ذكي',
            subtitle: 'بلمسة عصرية',
            desc: 'مواصلات — تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.',
            appstore: 'Download on',
            googleplay: 'GET IT ON',
            googleplay2: 'Google Play',
            slide1: 'مواصلات...',
            slide1b: 'أسهل وأسرع.',
            slide2: 'زِد رحلاتك',
            slide2b: 'ووصل إلى عملاء أكثر.',
            slide3: 'إدارة رحلاتك',
            slide3b: 'بكل سهولة.',
            slide4: 'حلول نقل',
            slide4b: 'ذكية وآمنة.',
            slide5: 'كل ما تحتاجه لإدارة وتنمية',
            slide5b: 'نشاطك في مكان واحد.'
        },
        stats: {
            users: 'مستخدم',
            rides: 'رحلة/يوم',
            rating: 'تقييم',
            cities: 'مدينة مغطاة'
        },
        about: {
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
        },
        team: {
            title: 'فريق العمل',
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

            subtitle: 'تعرف على قادتنا',
            desc: 'نخبة من الكفاءات تعمل بشغف لتقديم أفضل تجربة نقل ذكي.'
        },
        partners: {
            badge: 'شركاء النجاح',
            title: 'من يثق بنا',
            desc: 'نفخر بشراكاتنا مع نخبة من الجهات التي تشاركنا رؤيتنا لتقديم أفضل تجربة للمستخدم.'
        },
        services: {
            title: 'خدماتنا',
            subtitle: 'باقات مصممة لتناسب تطلعاتك',
            desc: 'اختر الباقة التي تناسبك',
            srv1_title: 'نقل الأفراد',
            srv1_desc: 'خدمة يومية موثوقة إلى أعمالكم بأسعار في متناول الجميع.',
            srv1_points: ['سيارات حديثة ومجهزة', 'دعم فني متواجد', 'سائقون محترفون', 'مرونة في الجدولة', 'تتبع للرحلة', 'رحلات مباشرة مريحة', 'اشتراكات مرنة'],
            srv2_title: 'الاشتراك الشهري',
            srv2_desc: 'راحة بال مع خطط نقل مرنة ومستدامة.',
            srv2_points: ['أسعار مخفضة ومناسبة', 'خدمة "مواصلات كير"', 'دعم فني مخصص', 'رحلات يومية ثابتة', 'توفير للوقت والجهد', 'مركبات مريحة', 'تغطية شاملة', 'خدمات إضافية', 'تحديثات مستمرة', 'التزام بالموعد (SLA) مع تعويضات'],
            srv3_title: 'الاشتراك السنوي',
            srv3_desc: 'للمؤسسات والشركات، تجربة متميزة ومستدامة طوال العام.',
            srv3_points: ['سيارات حديثة ومجهزة', 'خدمة "مواصلات كير"', 'دعم فني مخصص', 'رحلات يومية ثابتة', 'توفير للوقت والجهد', 'تتبع للرحلة', 'عقود مرنة ومخصصة', 'تقارير دورية للاستخدام', 'مدير حساب مخصص', 'أولوية الحجز', 'خدمات لكبار الشخصيات (VIP)', 'تعويضات في حال التأخير عن 10 دقائق']
        },
        how: {
            title: 'كيف تعمل مواصلات',
            step1_title: 'اختر باقتك من التطبيق',
            step1_desc: 'حمل التطبيق واختر الباقة التي تناسب جدولك اليومي.',
            step2_title: 'حدد موقعك وتوقيتك',
            step2_desc: 'اختر الموقع والوقت وسيتولى كابتن مواصلات الباقي.',
            step3_title: 'رحلة آمنة',
            step3_desc: 'تمتع برحلتك بأمان، وشارك مسارك مع من تحب.',
            step4_title: 'دعم فوري',
            step4_desc: 'خدمة "مواصلات كير" متاحة لمساعدتك طوال الرحلة.'
        },
        privacy: {
            title: 'سياسة الخصوصية',
            date: 'آخر تحديث: يوليو 2026',
            p1: 'نحن في مواصلات نلتزم بحماية خصوصية بياناتك. يتم جمع البيانات (مثل الموقع الجغرافي ومعلومات الحساب) لتحسين جودة الخدمة وتقديم تجربة سلسة وآمنة. لا نقوم بمشاركة معلوماتك الشخصية مع أي أطراف خارجية إلا بموجب القانون أو بموافقتك الصريحة.',
            p2: 'يتم تشفير جميع البيانات الحساسة باستخدام أحدث التقنيات. لك الحق في مراجعة بياناتك أو طلب حذفها في أي وقت عبر إعدادات الحساب.'
        },
        terms: {
            title: 'الشروط والأحكام',
            date: 'مقدمة عن شروط الاستخدام',
            p1: 'من خلال استخدامك لتطبيق مواصلات، فإنك توافق على الالتزام بجميع الشروط والأحكام الموضحة. يجب استخدام الخدمة في الأغراض المشروعة فقط ووفقاً للأنظمة المعمول بها في المملكة.',
            p2: 'تحتفظ مواصلات بالحق في تعديل هذه الشروط',
            p3: 'المسؤولية القانونية محصورة في النطاق الموضح',
            p4: 'النزاعات تخضع للأنظمة المعمول بها في المملكة'
        },
        contact: {
            title: 'تواصل معنا',
            subtitle: 'نحن هنا',
            subtitle2: 'لخدمتك',
            desc: 'لديك استفسار؟ فريق الدعم لدينا مستعد للإجابة على تساؤلاتك طوال اليوم.',
            form_name: 'الاسم الكامل',
            form_email: 'البريد الإلكتروني',
            form_phone: 'رقم الهاتف المعتمد',
            form_msg: 'رسالتك',
            form_btn: 'إرسال الرسالة'
        },
        footer: {
            brand: 'Mowasalat',
            desc: 'تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.',
            quick_title: 'روابط سريعة',
            srv_title: 'الخدمات',
            contact_title: 'معلومات التواصل',
            location: 'الرياض، المملكة العربية السعودية',
            support: 'دعم 24/7',
            rights: 'جميع الحقوق محفوظة',
            made: 'صُنع في السعودية'
        },
        modal: {
            title: 'تسجيل اهتمام',
            subtitle: 'انضم لقائمة الانتظار',
            org: 'اسم المؤسسة',
            manager: 'اسم المسؤول',
            phone: 'رقم الجوال',
            email: 'البريد الإلكتروني',
            btn: 'سجل اهتمامك الآن'
        },
        toast: {
            success: 'تم الإرسال بنجاح! سنتواصل معك قريباً.',
            lang_switched: 'تم التبديل إلى العربية'
        }
    },
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            team: 'Team',
            services: 'Services',
            howToRide: 'How to use',
            privacy: 'Privacy',
            contact: 'Contact',
            login: 'Login'
        },
        hero: {
            badge: 'Available in 15+ cities',
            title: 'Smart Mobility',
            subtitle: 'With a Modern Touch',
            desc: 'Mowasalat - The smart transport app designed to give you fast, safe rides with flexible subscription options.',
            appstore: 'Download on',
            googleplay: 'GET IT ON',
            googleplay2: 'Google Play',
            slide1: 'Mowasalat...',
            slide1b: 'Easier and faster.',
            slide2: 'Increase your rides',
            slide2b: 'And reach more customers.',
            slide3: 'Manage your rides',
            slide3b: 'With ease.',
            slide4: 'Mobility solutions',
            slide4b: 'Smart and safe.',
            slide5: 'Everything you need to manage and grow',
            slide5b: 'your business in one place.'
        },
        stats: {
            users: 'Users',
            rides: 'Rides/Day',
            rating: 'Rating',
            cities: 'Cities'
        },
        about: {
            badge: 'About Us',
            title1: 'Building a bridge',
            title2: 'between you and',
            title3: 'the city',
            sub: 'Mowasalat is more than just a transport app; it\'s your daily partner in smart mobility.',
            p1: 'Mowasalat is a smart transport app that connects passengers with verified drivers to provide fast and safe city travel. We offer a modern experience that combines easy ride booking with flexible monthly subscription options.',
            p2: 'Our goal is to make daily mobility easier and more reliable using modern technology and providing high-quality service for everyone. We believe every ride should be an enjoyable and safe experience.',
            tag1: 'Verified drivers',
            tag2: '24/7 Support',
            tag3: 'Transparent pricing'
        },
        team: {
            title: 'Our Team',
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

            subtitle: 'Meet Our Leaders',
            desc: 'Elite professionals working passionately to provide the best smart mobility experience.'
        },
        partners: {
            badge: 'Success Partners',
            title: 'Who Trusts Us',
            desc: 'We are proud of our partnerships with elite entities that share our vision of providing the best user experience.'
        },
        services: {
            title: 'Our Services',
            subtitle: 'Packages designed for your aspirations',
            desc: 'Choose the package that suits you',
            srv1_title: 'Individual Transport',
            srv1_desc: 'Reliable daily service to your work at affordable prices.',
            srv1_points: ['Modern vehicles', 'Technical support', 'Professional drivers', 'Flexible scheduling', 'Ride tracking', 'Direct comfortable rides', 'Flexible subscriptions'],
            srv2_title: 'Monthly Subscription',
            srv2_desc: 'Peace of mind with flexible and sustainable mobility plans.',
            srv2_points: ['Discounted prices', 'Mowasalat Care', 'Dedicated support', 'Fixed daily rides', 'Time saving', 'Comfortable vehicles', 'Comprehensive coverage', 'Additional services', 'Continuous updates', 'SLA commitment with compensations'],
            srv3_title: 'Annual Subscription',
            srv3_desc: 'For institutions and companies, a premium sustainable experience all year round.',
            srv3_points: ['Modern vehicles', 'Mowasalat Care', 'Dedicated support', 'Fixed daily rides', 'Time saving', 'Ride tracking', 'Customized contracts', 'Usage reports', 'Account manager', 'Priority booking', 'VIP services', 'Compensations for delays over 10 mins']
        },
        how: {
            title: 'How Mowasalat Works',
            step1_title: 'Choose your package',
            step1_desc: 'Download the app and choose the package that fits your schedule.',
            step2_title: 'Set your location',
            step2_desc: 'Choose location and time, our captain will handle the rest.',
            step3_title: 'Safe Ride',
            step3_desc: 'Enjoy your ride safely and share your route with loved ones.',
            step4_title: 'Instant Support',
            step4_desc: 'Mowasalat Care is available to assist you throughout the ride.'
        },
        privacy: {
            title: 'Privacy Policy',
            date: 'Last updated: July 2026',
            p1: 'At Mowasalat, we are committed to protecting your data privacy. Data is collected to improve service quality and provide a seamless, secure experience. We do not share your personal information with external parties except as required by law or with your explicit consent.',
            p2: 'All sensitive data is encrypted using the latest technologies. You have the right to review or request deletion of your data at any time via account settings.'
        },
        terms: {
            title: 'Terms & Conditions',
            date: 'Introduction to Terms of Use',
            p1: 'By using the Mowasalat application, you agree to comply with all outlined terms and conditions. The service must be used for lawful purposes only and in accordance with the applicable laws in the Kingdom.',
            p2: 'Mowasalat reserves the right to modify these terms',
            p3: 'Legal liability is limited to the stated scope',
            p4: 'Disputes are subject to the applicable laws in the Kingdom'
        },
        contact: {
            title: 'Contact Us',
            subtitle: 'We are here',
            subtitle2: 'to serve you',
            desc: 'Have an inquiry? Our support team is ready to answer your questions all day long.',
            form_name: 'Full Name',
            form_email: 'Email Address',
            form_phone: 'Phone Number',
            form_msg: 'Your Message',
            form_btn: 'Send Message'
        },
        footer: {
            brand: 'Mowasalat',
            desc: 'The smart transport app designed to give you fast, safe rides with flexible subscription options.',
            quick_title: 'Quick Links',
            srv_title: 'Services',
            contact_title: 'Contact Info',
            location: 'Riyadh, Saudi Arabia',
            support: '24/7 Support',
            rights: 'All rights reserved',
            made: 'Made in Saudi Arabia'
        },
        modal: {
            title: 'Register Interest',
            subtitle: 'Join the waiting list',
            org: 'Organization Name',
            manager: 'Manager Name',
            phone: 'Mobile Number',
            email: 'Email Address',
            btn: 'Register Now'
        },
        toast: {
            success: 'Message sent successfully! We will contact you soon.',
            lang_switched: 'Switched to English'
        }
    }
};

let currentLang = localStorage.getItem('lang') || 'ar';

function translateElement(el, lang) {
    const keyPath = el.getAttribute('data-i18n');
    if (!keyPath) return;

    const keys = keyPath.split('.');
    let value = translations[lang];
    
    for (const key of keys) {
        if (value && value[key] !== undefined) {
            value = value[key];
        } else {
            value = null;
            break;
        }
    }

    if (value) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.type === 'submit' || el.type === 'button') {
                el.value = value;
            } else {
                el.placeholder = value;
            }
        } else {
            el.textContent = value;
        }
    }
}

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    // Set Document Direction and Lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        translateElement(el, lang);
    });

    // Update active state of language toggle buttons
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update mobile lang buttons
    const mobileAr = document.getElementById('mobile-lang-ar');
    const mobileEn = document.getElementById('mobile-lang-en');
    if (mobileAr && mobileEn) {
        mobileAr.style.color = lang === 'ar' ? '#fff' : '#6b7280';
        mobileAr.style.fontWeight = lang === 'ar' ? '700' : '400';
        mobileEn.style.color = lang === 'en' ? '#fff' : '#6b7280';
        mobileEn.style.fontWeight = lang === 'en' ? '700' : '400';
    }

    // Optional: Show Toast
    showToast(translations[lang].toast.lang_switched);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Language
    setLang(currentLang);

    // Attach Event Listeners to language buttons
    const langBtns = document.querySelectorAll('[id^="lang-"], [id^="mobile-lang-"]');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const langId = e.target.id;
            if (langId.endsWith('ar')) setLang('ar');
            if (langId.endsWith('en')) setLang('en');
        });
    });
});

// We need showToast globally available if it's called here, or we safely call it if it exists.
function showToast(msg) {
    const toast = document.getElementById('success-toast');
    if (!toast) return;
    const span = toast.querySelector('span');
    if (span) span.textContent = msg;
    
    toast.classList.remove('translate-x-[120%]', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-x-[120%]', 'opacity-0');
    }, 3000);
}

// Make setLang globally accessible
window.setLang = setLang;
window.currentLang = currentLang;
