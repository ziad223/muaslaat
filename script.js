// i18n.js - ملف الترجمة الكامل لموقع مواصلات

const translations = {
    ar: {
        // ===== NAVBAR =====
        "nav.home": "الرئيسية",
        "nav.about": "من نحن",
        "nav.team": "فريق العمل",
        "nav.services": "خدماتنا",
        "nav.howToRide": "كيف تستخدم",
        "nav.register": "تسجيل المؤسسة",
        "nav.privacy": "الخصوصية",
        "nav.privacyPolicy": "سياسة الخصوصية",
        "nav.contact": "اتصل بنا",

        // ===== HERO SLIDES =====
        "hero.slide1": "مواصلات...",
        "hero.slide1b": "أسهل وأسرع.",
        "hero.slide2": "زد رحلاتك",
        "hero.slide2b": "وتواصل مع المزيد من العملاء.",
        "hero.slide3": "أدر رحلاتك",
        "hero.slide3b": "بكل سهولة.",
        "hero.slide4": "حلول التنقل",
        "hero.slide4b": "ذكية وآمنة.",
        "hero.slide5": "كل ما تحتاجه لإدارة وتنمية",
        "hero.slide5b": "عملك في مكان واحد.",
        "hero.title": "تنقل ذكي",

        // ===== SMART MOBILITY =====
        "smart.badge": "متوفر في 15+ مدينة",
        "smart.desc": "مواصلات — تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.",

        // ===== ABOUT =====
        "about.badge": "من نحن",
        "about.title1": "نبني جسراً",
        "about.title2": "بينك وبين",
        "about.title3": "المدينة",
        "about.sub": "مواصلات ليست مجرد تطبيق نقل؛ بل شريكك اليومي في التنقل الذكي.",
        "about.p1": "مواصلات هو تطبيق نقل ذكي يربط الركاب بسائقين معتمدين لتوفير رحلات سريعة وآمنة داخل المدينة. نقدم تجربة حديثة تجمع بين حجز الرحلات السهل وخيارات الاشتراك الشهري المرنة.",
        "about.p2": "هدفنا هو جعل التنقل اليومي أسهل وأكثر موثوقية باستخدام التكنولوجيا الحديثة وتقديم خدمة عالية الجودة للجميع. نؤمن بأن كل رحلة يجب أن تكون تجربة ممتعة وآمنة.",
        "about.tag1": "سائقون معتمدون",
        "about.tag2": "دعم 24/7",
        "about.tag3": "أسعار شفافة",

        // ===== PARTNERS =====
        "partners.badge": "شركاء النجاح",
        "partners.title": "ثقة نعتز بها",
        "partners.desc": "نفخر بالتعاون مع نخبة من الشركاء لتحقيق رؤيتنا المشتركة وتقديم أفضل الخدمات بتميز واحترافية.",

        // ===== SERVICES =====
        "services.badge": "خدماتنا",
        "services.title": "خدمات النقل والتوصيل",
        "services.sub": "نحو تنقل أسهل",

        // Service 1 - Ride Hailing
        "srv.title1": "طلب رحلة",
        "srv.desc1": "احجز رحلتك بسهولة مع سائقين موثوقين ووصول سريع.",
        "srv.step1.1": "افتح تطبيق مواصلات",
        "srv.step1.2": "حدد موقع الاستلام",
        "srv.step1.3": "اختر وجهتك",
        "srv.step1.4": "راجع تفاصيل الرحلة",
        "srv.step1.5": "أكد الرحلة",
        "srv.step1.6": "تتبع رحلتك مباشرة",
        "srv.step1.7": "وصل بأمان",
        "srv.tag1.1": "سريع وسهل",
        "srv.tag1.2": "تتبع مباشر",

        // Service 2 - Delivery
        "srv.title2": "خدمة التوصيل",
        "srv.desc2": "أرسل طلبك بسهولة مع مندوبين مؤهلين.",
        "srv.step2.1": "افتح تطبيق مواصلات",
        "srv.step2.2": "اختر 'توصيل'",
        "srv.step2.3": "حدد موقع الاستلام",
        "srv.step2.4": "أدخل تفاصيل الطلب",
        "srv.step2.5": "حدد موقع التسليم",
        "srv.step2.6": "راجع التفاصيل",
        "srv.step2.7": "أكد الطلب",
        "srv.step2.8": "تتبع المندوب",
        "srv.step2.9": "استلم طلبك",
        "srv.tag2.1": "توصيل سريع",
        "srv.tag2.2": "تغطية شاملة للمدينة",
        "srv.payment": "الدفع عند الاستلام",

        // Service 3 - Shuttle
        "srv.title3": "النقل الترددي",
        "srv.desc3": "رحلات مجدولة مسبقاً بمسارات ثابتة ونقاط استلام محددة.",
        "srv.step3.1": "افتح تطبيق مواصلات",
        "srv.step3.2": "اختر 'النقل الترددي'",
        "srv.step3.3": "حدد موقعك الحالي",
        "srv.step3.4": "تصفح الرحلات المتاحة",
        "srv.step3.5": "اختر الرحلة المناسبة",
        "srv.step3.6": "اختر نوع الحجز",
        "srv.step3.7": "عرض تفاصيل الرحلة",
        "srv.step3.8": "أكمل الدفع",
        "srv.step3.9": "احصل على تذكرتك",
        "srv.tag3.1": "جداول منتظمة",
        "srv.tag3.2": "تذاكر إلكترونية",
        "srv.shuttle.note": "احضر قبل المغادرة بـ 10 دقائق",

        // ===== HOW TO USE =====
        "how.badge": "كيف تستخدم",
        "how.title": "احجز رحلتك بسهولة",
        "how.sub": "خطوات بسيطة للحصول على رحلتك",
        "how.step1.title": "افتح تطبيق مواصلات",
        "how.step1.desc": "سجل الدخول أو أنشئ حساباً جديداً.",
        "how.step2.title": "حدد موقع الاستلام",
        "how.step2.desc": "سيتم تحديد موقعك تلقائياً أو يدوياً.",
        "how.step3.title": "اختر وجهتك",
        "how.step3.desc": "حدد المكان الذي تريد الوصول إليه.",
        "how.step4.title": "أكد الرحلة",
        "how.step4.desc": "اضغط 'طلب رحلة' وسيتم إرسال الطلب إلى أقرب سائق.",
        "how.note": "تتبع رحلتك مباشرة واستمتع برحلة آمنة",

        // ===== PRIVACY =====
        "privacy.title": "سياسة الخصوصية",
        "privacy.date": "آخر تحديث: يناير 2026",
        "privacy.p1": "باستخدام تطبيق مواصلات، فإنك توافق على استخدام الخدمة بطريقة قانونية ومسؤولة. يتيح التطبيق للمستخدمين حجز الرحلات أو الاشتراك في الخطط المتاحة وفقاً للباقة المختارة.",
        "privacy.p2": "نستخدم أحدث تقنيات التشفير لحماية بياناتك الشخصية ومعلومات رحلاتك. لا نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة.",

        // ===== TERMS =====
        "terms.title": "الأحكام والشروط",
        "terms.date": "سارية من تاريخ التسجيل",
        "terms.p1": "قد تختلف الأسعار وتوفر السائقين حسب الموقع والوقت، وتحتفظ إدارة التطبيق بحق تحديث الخدمات أو الشروط لتحسين الجودة وتجربة المستخدم.",
        "terms.li1": "تقديم معلومات دقيقة ومحدثة عند التسجيل",
        "terms.li2": "اتباع قواعد السلامة أثناء الرحلة",
        "terms.li3": "عدم استخدام التطبيق لأغراض غير قانونية",

        // ===== CONTACT =====
        "contact.badge": "اتصل بنا",
        "contact.title": "نحن هنا من أجلك",
        "contact.sub": "فريق الدعم لدينا جاهز للرد على استفساراتك في غضون دقائق.",
        "contact.phone": "0501716663",
        "contact.email": "info@muasalat.net",
        "contact.location": "الرياض، المملكة العربية السعودية",
        "contact.label.name": "الاسم الكامل",
        "contact.label.phone": "رقم الجوال",
        "contact.label.email": "البريد الإلكتروني",
        "contact.label.msg": "الرسالة",
        "contact.placeholder.name": "أدخل اسمك",
        "contact.placeholder.phone": "05xxxxxxxx",
        "contact.placeholder.email": "example@email.com",
        "contact.placeholder.msg": "اكتب رسالتك هنا...",
        "contact.btn": "إرسال الرسالة",

        // ===== FOOTER =====
        "footer.brand.desc": "تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.",
        "footer.quick.title": "روابط سريعة",
        "footer.quick.home": "الرئيسية",
        "footer.quick.about": "من نحن",
        "footer.quick.services": "خدماتنا",
        "footer.quick.how": "كيف تستخدم",
        "footer.quick.contact": "اتصل بنا",
        "footer.services.title": "خدماتنا",
        "footer.services.ride": "طلب رحلة",
        "footer.services.delivery": "توصيل الطلبات",
        "footer.services.shuttle": "النقل الترددي",
        "footer.services.subscription": "اشتراكات شهرية",
        "footer.contact.title": "معلومات الاتصال",
        "footer.location": "الرياض، المملكة العربية السعودية",
        "footer.phone": "0501716663",
        "footer.email": "info@muasalat.net",
        "footer.support": "دعم 24/7",
        "footer.copy": "جميع الحقوق محفوظة",
        "footer.privacy": "سياسة الخصوصية",
        "footer.terms": "الأحكام والشروط",
        "footer.made": "صنع في السعودية",

        // ===== MODAL =====
        "modal.title": "تسجيل المؤسسة",
        "modal.sub": "انضم كشريك أعمال",
        "modal.org": "اسم المؤسسة",
        "modal.org.placeholder": "مثال: شركة النقل الحديث",
        "modal.manager": "اسم المسؤول",
        "modal.manager.placeholder": "أحمد محمد",
        "modal.phone": "رقم الجوال",
        "modal.phone.placeholder": "05xxxxxxxx",
        "modal.email": "البريد الإلكتروني",
        "modal.email.placeholder": "info@company.com",
        "modal.btn": "إرسال طلب التسجيل",
        "modal.footer": "سيتم مراجعة طلبك خلال 48 ساعة",

        // ===== TOAST =====
        "toast.success": "تم إرسال الرسالة بنجاح! سوف نتصل بك قريباً."
    },

    en: {
        // ===== NAVBAR =====
        "nav.home": "Home",
        "nav.about": "About Us",
        "nav.team": "Team",
        "nav.services": "Services",
        "nav.howToRide": "How to Ride",
        "nav.register": "Register Institution",
        "nav.privacy": "Privacy",
        "nav.privacyPolicy": "Privacy Policy",
        "nav.contact": "Contact Us",

        // ===== HERO SLIDES =====
        "hero.slide1": "Mowasalat...",
        "hero.slide1b": "Easier and faster.",
        "hero.slide2": "Increase your rides",
        "hero.slide2b": "And reach more customers.",
        "hero.slide3": "Manage your rides",
        "hero.slide3b": "With ease.",
        "hero.slide4": "Mobility solutions",
        "hero.slide4b": "Smart and safe.",
        "hero.slide5": "Everything you need to manage and grow",
        "hero.slide5b": "your business in one place.",
        "hero.title": "Smart Mobility",

        // ===== SMART MOBILITY =====
        "smart.badge": "Available in 15+ Cities",
        "smart.desc": "Mowasalat — the smart transport app designed to give you fast and safe rides with flexible subscription options.",

        // ===== ABOUT =====
        "about.badge": "About Us",
        "about.title1": "Building a bridge",
        "about.title2": "between you and",
        "about.title3": "the city",
        "about.sub": "Mowasalat is more than just a transport app; it's your daily partner in smart mobility.",
        "about.p1": "Mowasalat is a smart transport app that connects passengers with verified drivers to provide fast and safe city travel. We offer a modern experience that combines easy ride booking with flexible monthly subscription options.",
        "about.p2": "Our goal is to make daily mobility easier and more reliable using modern technology and providing high-quality service for everyone. We believe every ride should be an enjoyable and safe experience.",
        "about.tag1": "Verified drivers",
        "about.tag2": "24/7 Support",
        "about.tag3": "Transparent pricing",

        // ===== PARTNERS =====
        "partners.badge": "Success Partners",
        "partners.title": "Trust We Cherish",
        "partners.desc": "We are proud to collaborate with a select group of partners to achieve our shared vision and deliver the best services with excellence and professionalism.",

        // ===== SERVICES =====
        "services.badge": "Our Services",
        "services.title": "Transport & Delivery Services",
        "services.sub": "Towards easier mobility",

        // Service 1 - Ride Hailing
        "srv.title1": "Ride Hailing",
        "srv.desc1": "Book your ride easily with trusted drivers and fast arrival.",
        "srv.step1.1": "Open Mowasalat app",
        "srv.step1.2": "Set your pickup location",
        "srv.step1.3": "Choose your destination",
        "srv.step1.4": "Review ride details",
        "srv.step1.5": "Confirm the ride",
        "srv.step1.6": "Track your ride live",
        "srv.step1.7": "Arrive safely",
        "srv.tag1.1": "Fast & easy",
        "srv.tag1.2": "Live tracking",

        // Service 2 - Delivery
        "srv.title2": "Delivery Service",
        "srv.desc2": "Send your order easily with qualified couriers.",
        "srv.step2.1": "Open Mowasalat app",
        "srv.step2.2": "Select 'Delivery'",
        "srv.step2.3": "Set pickup location",
        "srv.step2.4": "Enter order details",
        "srv.step2.5": "Set delivery location",
        "srv.step2.6": "Review details",
        "srv.step2.7": "Confirm order",
        "srv.step2.8": "Track courier",
        "srv.step2.9": "Receive order",
        "srv.tag2.1": "Fast delivery",
        "srv.tag2.2": "City-wide coverage",
        "srv.payment": "Cash on delivery",

        // Service 3 - Shuttle
        "srv.title3": "Shuttle Service",
        "srv.desc3": "Pre-scheduled rides with fixed routes and designated pickup points.",
        "srv.step3.1": "Open Mowasalat app",
        "srv.step3.2": "Select 'Shuttle'",
        "srv.step3.3": "Set your current location",
        "srv.step3.4": "Browse available rides",
        "srv.step3.5": "Choose the right ride",
        "srv.step3.6": "Select booking type",
        "srv.step3.7": "View ride details",
        "srv.step3.8": "Complete payment",
        "srv.step3.9": "Get your ticket",
        "srv.tag3.1": "Regular schedules",
        "srv.tag3.2": "E-tickets",
        "srv.shuttle.note": "Be there 10 min before departure",

        // ===== HOW TO USE =====
        "how.badge": "How to use",
        "how.title": "Book your ride easily",
        "how.sub": "Simple steps to get your ride",
        "how.step1.title": "Open Mowasalat app",
        "how.step1.desc": "Login or create a new account.",
        "how.step2.title": "Set your pickup location",
        "how.step2.desc": "Your location will be detected automatically or manually.",
        "how.step3.title": "Choose your destination",
        "how.step3.desc": "Select the location you want to reach.",
        "how.step4.title": "Confirm the ride",
        "how.step4.desc": "Press 'Request Ride' and the request will be sent to the nearest driver.",
        "how.note": "Track your ride live and enjoy a safe ride",

        // ===== PRIVACY =====
        "privacy.title": "Privacy Policy",
        "privacy.date": "Last updated: January 2026",
        "privacy.p1": "By using the Mowasalat app, you agree to use the service in a legal and responsible manner. The app allows users to book rides or subscribe to available plans according to the chosen package.",
        "privacy.p2": "We use the latest encryption technologies to protect your personal data and ride information. We do not share your data with any third party without your explicit consent.",

        // ===== TERMS =====
        "terms.title": "Terms & Conditions",
        "terms.date": "Effective from registration date",
        "terms.p1": "Prices and driver availability may vary based on location and time, and the app management reserves the right to update services or terms to improve quality and user experience.",
        "terms.li1": "Provide accurate and updated information when registering",
        "terms.li2": "Follow safety rules during the ride",
        "terms.li3": "Do not use the app for illegal purposes",

        // ===== CONTACT =====
        "contact.badge": "Contact Us",
        "contact.title": "We are here for you",
        "contact.sub": "Our support team is ready to respond to your inquiries within minutes.",
        "contact.phone": "0501716663",
        "contact.email": "info@muasalat.net",
        "contact.location": "Riyadh, Saudi Arabia",
        "contact.label.name": "Full Name",
        "contact.label.phone": "Phone Number",
        "contact.label.email": "Email Address",
        "contact.label.msg": "Message",
        "contact.placeholder.name": "Enter your name",
        "contact.placeholder.phone": "05xxxxxxxx",
        "contact.placeholder.email": "example@email.com",
        "contact.placeholder.msg": "Write your message here...",
        "contact.btn": "Send Message",

        // ===== FOOTER =====
        "footer.brand.desc": "The smart transport app designed to give you fast and safe rides with flexible subscription options.",
        "footer.quick.title": "Quick Links",
        "footer.quick.home": "Home",
        "footer.quick.about": "About Us",
        "footer.quick.services": "Services",
        "footer.quick.how": "How to Ride",
        "footer.quick.contact": "Contact",
        "footer.services.title": "Our Services",
        "footer.services.ride": "Ride Hailing",
        "footer.services.delivery": "Delivery Service",
        "footer.services.shuttle": "Shuttle Service",
        "footer.services.subscription": "Monthly Subscriptions",
        "footer.contact.title": "Contact Info",
        "footer.location": "Riyadh, Saudi Arabia",
        "footer.phone": "0501716663",
        "footer.email": "info@muasalat.net",
        "footer.support": "24/7 Support",
        "footer.copy": "All Rights Reserved",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms & Conditions",
        "footer.made": "Made in Saudi Arabia",

        // ===== MODAL =====
        "modal.title": "Register Institution",
        "modal.sub": "Join as a Business Partner",
        "modal.org": "Institution Name",
        "modal.org.placeholder": "Example: Modern Transport Co.",
        "modal.manager": "Manager Name",
        "modal.manager.placeholder": "Ahmed Mohammed",
        "modal.phone": "Phone Number",
        "modal.phone.placeholder": "05xxxxxxxx",
        "modal.email": "Email Address",
        "modal.email.placeholder": "info@company.com",
        "modal.btn": "Submit Registration Request",
        "modal.footer": "Your request will be reviewed within 48 hours",

        // ===== TOAST =====
        "toast.success": "Message sent successfully! We will contact you soon."
    }
};

// ============================================================
// CORE FUNCTIONS
// ============================================================

let currentLang = localStorage.getItem('mowasalat_lang') || 'ar';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('mowasalat_lang', lang);

    // Set HTML dir and lang
    const html = document.documentElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);

    // Update body class for text alignment if needed
    document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
    // Override for elements that should stay centered
    document.querySelectorAll('.text-center, .mx-auto, .justify-center').forEach(el => {
        // Keep centered elements centered
    });

    // Update active language buttons
    document.querySelectorAll('.lang-toggle button, #mobile-lang-ar, #mobile-lang-en').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang || (btn.id === 'mobile-lang-ar' && lang === 'ar') ||
            (btn.id === 'mobile-lang-en' && lang === 'en')) {
            btn.classList.add('active');
        }
        // Style for mobile buttons
        if (btn.id === 'mobile-lang-ar') {
            btn.className = lang === 'ar' ? 'text-sm font-semibold text-white' : 'text-sm text-gray-400';
        }
        if (btn.id === 'mobile-lang-en') {
            btn.className = lang === 'en' ? 'text-sm font-semibold text-white' : 'text-sm text-gray-400';
        }
    });

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang]?.[key];
        if (translation) {
            // Handle inner HTML with potential child elements
            if (el.children.length === 0) {
                el.textContent = translation;
            } else {
                // For elements with children, we need to be careful
                // Only replace text nodes
                const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
                const textNodes = [];
                let node;
                while (node = walker.nextNode()) {
                    textNodes.push(node);
                }
                // Only replace if there's one text node or we want to replace all
                if (textNodes.length === 1) {
                    textNodes[0].textContent = translation;
                } else {
                    // For complex elements with multiple text nodes, use innerHTML but preserve children?
                    // For simplicity, if there are children, we replace the entire content
                    // but we need to keep child elements if they exist
                    const childElements = el.querySelectorAll('*');
                    if (childElements.length === 0) {
                        el.textContent = translation;
                    } else {
                        // For elements with child elements (like the about title with spans)
                        // We'll handle specially by targeting specific children
                        // Skip complex elements, they're handled individually
                    }
                }
            }
        }
    });

    // Also translate any elements that have inline data-ar and data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'submit' || el.type === 'button') {
                    el.value = text;
                } else {
                    el.placeholder = text;
                }
            } else {
                el.textContent = text;
            }
        }
    });

    // ===== SPECIAL HANDLING FOR COMPLEX ELEMENTS =====

    // Hero title (special handling for gradient text)
    const heroLine1 = document.querySelector('.hero-line1');
    const heroLine2 = document.querySelector('.hero-line2');
    if (heroLine1 && heroLine2) {
        const titleParts = translations[lang]['hero.title'].split(' ');
        if (titleParts.length > 1) {
            heroLine1.textContent = titleParts[0] || 'تنقل';
            heroLine2.textContent = titleParts.slice(1).join(' ') || 'ذكي';
            heroLine2.classList.remove('hidden');
        } else {
            heroLine1.textContent = translations[lang]['hero.title'];
            heroLine2.textContent = '';
            heroLine2.classList.add('hidden');
        }
    }

    // ===== SERVICE STEPS - Special handling =====
    // Service 1 steps
    for (let i = 1; i <= 7; i++) {
        const step = document.querySelector(`.srv-step1-${i}`);
        if (step) {
            const key = `srv.step1.${i}`;
            step.textContent = translations[lang]?.[key] || step.textContent;
        }
    }

    // Service 2 steps
    for (let i = 1; i <= 9; i++) {
        const step = document.querySelector(`.srv-step2-${i}`);
        if (step) {
            const key = `srv.step2.${i}`;
            step.textContent = translations[lang]?.[key] || step.textContent;
        }
    }

    // Service 3 steps
    for (let i = 1; i <= 9; i++) {
        const step = document.querySelector(`.srv-step3-${i}`);
        if (step) {
            const key = `srv.step3.${i}`;
            step.textContent = translations[lang]?.[key] || step.textContent;
        }
    }

    // ===== SPECIAL ELEMENTS =====

    // Service titles
    const srvTitle1 = document.querySelector('.srv-title1');
    if (srvTitle1) srvTitle1.textContent = translations[lang]['srv.title1'];

    const srvTitle2 = document.querySelector('.srv-title2');
    if (srvTitle2) srvTitle2.textContent = translations[lang]['srv.title2'];

    const srvTitle3 = document.querySelector('.srv-title3');
    if (srvTitle3) srvTitle3.textContent = translations[lang]['srv.title3'];

    // Service descriptions
    const srvDesc1 = document.querySelector('.srv-desc1');
    if (srvDesc1) srvDesc1.textContent = translations[lang]['srv.desc1'];

    const srvDesc2 = document.querySelector('.srv-desc2');
    if (srvDesc2) srvDesc2.textContent = translations[lang]['srv.desc2'];

    const srvDesc3 = document.querySelector('.srv-desc3');
    if (srvDesc3) srvDesc3.textContent = translations[lang]['srv.desc3'];

    // Service tags
    const tag1_1 = document.querySelector('.srv-tag1-1');
    if (tag1_1) tag1_1.textContent = translations[lang]['srv.tag1.1'];

    const tag1_2 = document.querySelector('.srv-tag1-2');
    if (tag1_2) tag1_2.textContent = translations[lang]['srv.tag1.2'];

    const tag2_1 = document.querySelector('.srv-tag2-1');
    if (tag2_1) tag2_1.textContent = translations[lang]['srv.tag2.1'];

    const tag2_2 = document.querySelector('.srv-tag2-2');
    if (tag2_2) tag2_2.textContent = translations[lang]['srv.tag2.2'];

    const tag3_1 = document.querySelector('.srv-tag3-1');
    if (tag3_1) tag3_1.textContent = translations[lang]['srv.tag3.1'];

    const tag3_2 = document.querySelector('.srv-tag3-2');
    if (tag3_2) tag3_2.textContent = translations[lang]['srv.tag3.2'];

    // Payment method & shuttle note
    const paymentMethod = document.querySelector('.payment-method');
    if (paymentMethod) paymentMethod.textContent = translations[lang]['srv.payment'];

    const shuttleNote = document.querySelector('.shuttle-note');
    if (shuttleNote) shuttleNote.textContent = translations[lang]['srv.shuttle.note'];

    // How to use steps
    const howStep1Title = document.querySelector('.how-step1-title');
    if (howStep1Title) howStep1Title.textContent = translations[lang]['how.step1.title'];

    const howStep1Desc = document.querySelector('.how-step1-desc');
    if (howStep1Desc) howStep1Desc.textContent = translations[lang]['how.step1.desc'];

    const howStep2Title = document.querySelector('.how-step2-title');
    if (howStep2Title) howStep2Title.textContent = translations[lang]['how.step2.title'];

    const howStep2Desc = document.querySelector('.how-step2-desc');
    if (howStep2Desc) howStep2Desc.textContent = translations[lang]['how.step2.desc'];

    const howStep3Title = document.querySelector('.how-step3-title');
    if (howStep3Title) howStep3Title.textContent = translations[lang]['how.step3.title'];

    const howStep3Desc = document.querySelector('.how-step3-desc');
    if (howStep3Desc) howStep3Desc.textContent = translations[lang]['how.step3.desc'];

    const howStep4Title = document.querySelector('.how-step4-title');
    if (howStep4Title) howStep4Title.textContent = translations[lang]['how.step4.title'];

    const howStep4Desc = document.querySelector('.how-step4-desc');
    if (howStep4Desc) howStep4Desc.textContent = translations[lang]['how.step4.desc'];

    const howNote = document.querySelector('.how-note');
    if (howNote) howNote.textContent = translations[lang]['how.note'];

    // Badges
    const aboutBadge = document.querySelector('.about-badge');
    if (aboutBadge) aboutBadge.textContent = translations[lang]['about.badge'];

    const servicesBadge = document.querySelector('.services-badge');
    if (servicesBadge) servicesBadge.textContent = translations[lang]['services.badge'];

    const howBadge = document.querySelector('.how-badge');
    if (howBadge) howBadge.textContent = translations[lang]['how.badge'];

    const partnersBadge = document.querySelector('.partners-badge');
    if (partnersBadge) partnersBadge.textContent = translations[lang]['partners.badge'];

    // Partners section
    const partnersTitle = document.querySelector('.partners-title');
    if (partnersTitle) partnersTitle.textContent = translations[lang]['partners.title'];

    const partnersDesc = document.querySelector('.partners-desc');
    if (partnersDesc) partnersDesc.textContent = translations[lang]['partners.desc'];

    // About section
    const aboutTitle1 = document.querySelector('.about-title span:first-child');
    if (aboutTitle1) aboutTitle1.textContent = translations[lang]['about.title1'];

    const aboutTitle2 = document.querySelector('.about-title span:last-child span:first-child');
    if (aboutTitle2) aboutTitle2.textContent = translations[lang]['about.title2'];

    const aboutTitle3 = document.querySelector('.about-title .text-blue-400');
    if (aboutTitle3) aboutTitle3.textContent = translations[lang]['about.title3'];

    const aboutSub = document.querySelector('.about-sub');
    if (aboutSub) aboutSub.textContent = translations[lang]['about.sub'];

    const aboutP1 = document.querySelector('.about-p1');
    if (aboutP1) aboutP1.textContent = translations[lang]['about.p1'];

    const aboutP2 = document.querySelector('.about-p2');
    if (aboutP2) aboutP2.textContent = translations[lang]['about.p2'];

    // About tags
    const tag1 = document.querySelector('.tag1');
    if (tag1) tag1.textContent = translations[lang]['about.tag1'];

    const tag2 = document.querySelector('.tag2');
    if (tag2) tag2.textContent = translations[lang]['about.tag2'];

    const tag3 = document.querySelector('.tag3');
    if (tag3) tag3.textContent = translations[lang]['about.tag3'];

    // Services section
    const servicesTitle = document.querySelector('.services-title');
    if (servicesTitle) servicesTitle.textContent = translations[lang]['services.title'];

    const servicesSub = document.querySelector('.services-sub');
    if (servicesSub) servicesSub.textContent = translations[lang]['services.sub'];

    // How to use section
    const howTitle = document.querySelector('.how-title');
    if (howTitle) howTitle.textContent = translations[lang]['how.title'];

    const howSub = document.querySelector('.how-sub');
    if (howSub) howSub.textContent = translations[lang]['how.sub'];

    // Privacy section
    const privacyTitle = document.querySelector('.privacy-title');
    if (privacyTitle) privacyTitle.textContent = translations[lang]['privacy.title'];

    const privacyDate = document.querySelector('.privacy-date');
    if (privacyDate) privacyDate.textContent = translations[lang]['privacy.date'];

    const privacyP1 = document.querySelector('.privacy-p1');
    if (privacyP1) privacyP1.textContent = translations[lang]['privacy.p1'];

    const privacyP2 = document.querySelector('.privacy-p2');
    if (privacyP2) privacyP2.textContent = translations[lang]['privacy.p2'];

    // Terms section
    const termsTitle = document.querySelector('.terms-title');
    if (termsTitle) termsTitle.textContent = translations[lang]['terms.title'];

    const termsDate = document.querySelector('.terms-date');
    if (termsDate) termsDate.textContent = translations[lang]['terms.date'];

    const termsP1 = document.querySelector('.terms-p1');
    if (termsP1) termsP1.textContent = translations[lang]['terms.p1'];

    const termsLi1 = document.querySelector('.terms-li1');
    if (termsLi1) termsLi1.textContent = translations[lang]['terms.li1'];

    const termsLi2 = document.querySelector('.terms-li2');
    if (termsLi2) termsLi2.textContent = translations[lang]['terms.li2'];

    const termsLi3 = document.querySelector('.terms-li3');
    if (termsLi3) termsLi3.textContent = translations[lang]['terms.li3'];

    // Contact section
    const contactBadge = document.querySelector('.contact-badge');
    if (contactBadge) contactBadge.textContent = translations[lang]['contact.badge'];

    const contactTitle = document.querySelector('.contact-title');
    if (contactTitle) {
        const titleParts = translations[lang]['contact.title'].split(' ');
        if (titleParts.length > 1) {
            contactTitle.innerHTML = `${titleParts[0]} ${titleParts[1]} <br class="hidden lg:block" />${titleParts.slice(2).join(' ')}`;
        } else {
            contactTitle.innerHTML = translations[lang]['contact.title'];
        }
    }

    const contactSub = document.querySelector('.contact-sub');
    if (contactSub) contactSub.textContent = translations[lang]['contact.sub'];

    const contactPhone = document.querySelector('.contact-phone');
    if (contactPhone) contactPhone.textContent = translations[lang]['contact.phone'];

    const contactEmail = document.querySelector('.contact-email');
    if (contactEmail) contactEmail.textContent = translations[lang]['contact.email'];

    const contactLocation = document.querySelector('.contact-location');
    if (contactLocation) contactLocation.textContent = translations[lang]['contact.location'];

    const contactLabelName = document.querySelector('.contact-label-name');
    if (contactLabelName) contactLabelName.textContent = translations[lang]['contact.label.name'];

    const contactLabelPhone = document.querySelector('.contact-label-phone');
    if (contactLabelPhone) contactLabelPhone.textContent = translations[lang]['contact.label.phone'];

    const contactLabelEmail = document.querySelector('.contact-label-email');
    if (contactLabelEmail) contactLabelEmail.textContent = translations[lang]['contact.label.email'];

    const contactLabelMsg = document.querySelector('.contact-label-msg');
    if (contactLabelMsg) contactLabelMsg.textContent = translations[lang]['contact.label.msg'];

    const contactBtn = document.querySelector('.contact-btn-text');
    if (contactBtn) contactBtn.textContent = translations[lang]['contact.btn'];

    // Contact placeholders
    const nameInput = document.querySelector('#name');
    if (nameInput) nameInput.placeholder = translations[lang]['contact.placeholder.name'];

    const phoneInput = document.querySelector('#phone');
    if (phoneInput) phoneInput.placeholder = translations[lang]['contact.placeholder.phone'];

    const emailInput = document.querySelector('#email');
    if (emailInput) emailInput.placeholder = translations[lang]['contact.placeholder.email'];

    const msgInput = document.querySelector('#message');
    if (msgInput) msgInput.placeholder = translations[lang]['contact.placeholder.msg'];

    // ===== FOOTER =====
    const footerBrandDesc = document.querySelector('.footer-brand-desc');
    if (footerBrandDesc) footerBrandDesc.textContent = translations[lang]['footer.brand.desc'];

    const footerQuickTitle = document.querySelector('.footer-quick-title');
    if (footerQuickTitle) footerQuickTitle.textContent = translations[lang]['footer.quick.title'];

    const footerLinkHome = document.querySelector('.footer-link-home');
    if (footerLinkHome) footerLinkHome.textContent = translations[lang]['footer.quick.home'];

    const footerLinkAbout = document.querySelector('.footer-link-about');
    if (footerLinkAbout) footerLinkAbout.textContent = translations[lang]['footer.quick.about'];

    const footerLinkServices = document.querySelector('.footer-link-services');
    if (footerLinkServices) footerLinkServices.textContent = translations[lang]['footer.quick.services'];

    const footerLinkHow = document.querySelector('.footer-link-how');
    if (footerLinkHow) footerLinkHow.textContent = translations[lang]['footer.quick.how'];

    const footerLinkContact = document.querySelector('.footer-link-contact');
    if (footerLinkContact) footerLinkContact.textContent = translations[lang]['footer.quick.contact'];

    const footerServicesTitle = document.querySelector('.footer-services-title');
    if (footerServicesTitle) footerServicesTitle.textContent = translations[lang]['footer.services.title'];

    const footerServiceRide = document.querySelector('.footer-service-ride');
    if (footerServiceRide) footerServiceRide.textContent = translations[lang]['footer.services.ride'];

    const footerServiceDelivery = document.querySelector('.footer-service-delivery');
    if (footerServiceDelivery) footerServiceDelivery.textContent = translations[lang]['footer.services.delivery'];

    const footerServiceShuttle = document.querySelector('.footer-service-shuttle');
    if (footerServiceShuttle) footerServiceShuttle.textContent = translations[lang]['footer.services.shuttle'];

    const footerServiceSubscription = document.querySelector('.footer-service-subscription');
    if (footerServiceSubscription) footerServiceSubscription.textContent = translations[lang]['footer.services.subscription'];

    const footerContactTitle = document.querySelector('.footer-contact-title');
    if (footerContactTitle) footerContactTitle.textContent = translations[lang]['footer.contact.title'];

    const footerLocation = document.querySelector('.footer-location');
    if (footerLocation) footerLocation.textContent = translations[lang]['footer.location'];

    const footerPhone = document.querySelector('.footer-phone');
    if (footerPhone) footerPhone.textContent = translations[lang]['footer.phone'];

    const footerEmail = document.querySelector('.footer-email');
    if (footerEmail) footerEmail.textContent = translations[lang]['footer.email'];

    const footerSupport = document.querySelector('.footer-support');
    if (footerSupport) footerSupport.textContent = translations[lang]['footer.support'];

    const footerCopy = document.querySelector('.footer-copy');
    if (footerCopy) footerCopy.textContent = `© 2026 Mowasalat`;

    const footerRights = document.querySelector('.footer-rights');
    if (footerRights) footerRights.textContent = translations[lang]['footer.copy'];

    const footerPrivacy = document.querySelector('.footer-privacy');
    if (footerPrivacy) footerPrivacy.textContent = translations[lang]['footer.privacy'];

    const footerTerms = document.querySelector('.footer-terms');
    if (footerTerms) footerTerms.textContent = translations[lang]['footer.terms'];

    const footerMade = document.querySelector('.footer-made');
    if (footerMade) footerMade.textContent = translations[lang]['footer.made'];

    // ===== REGISTER MODAL =====
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = translations[lang]['modal.title'];

    const modalSub = document.querySelector('.modal-sub');
    if (modalSub) modalSub.textContent = translations[lang]['modal.sub'];

    const modalLabelOrg = document.querySelector('.modal-label-org');
    if (modalLabelOrg) modalLabelOrg.textContent = translations[lang]['modal.org'];

    const modalOrgInput = document.querySelector('.modal-label-org + input');
    if (modalOrgInput) modalOrgInput.placeholder = translations[lang]['modal.org.placeholder'];

    const modalLabelManager = document.querySelector('.modal-label-manager');
    if (modalLabelManager) modalLabelManager.textContent = translations[lang]['modal.manager'];

    const modalManagerInput = document.querySelector('.modal-label-manager + input');
    if (modalManagerInput) modalManagerInput.placeholder = translations[lang]['modal.manager.placeholder'];

    const modalLabelPhone = document.querySelector('.modal-label-phone');
    if (modalLabelPhone) modalLabelPhone.textContent = translations[lang]['modal.phone'];

    const modalPhoneInput = document.querySelector('.modal-label-phone + input');
    if (modalPhoneInput) modalPhoneInput.placeholder = translations[lang]['modal.phone.placeholder'];

    const modalLabelEmail = document.querySelector('.modal-label-email');
    if (modalLabelEmail) modalLabelEmail.textContent = translations[lang]['modal.email'];

    const modalEmailInput = document.querySelector('.modal-label-email + input');
    if (modalEmailInput) modalEmailInput.placeholder = translations[lang]['modal.email.placeholder'];

    const modalBtn = document.querySelector('.modal-btn-text');
    if (modalBtn) modalBtn.textContent = translations[lang]['modal.btn'];

    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter) modalFooter.textContent = translations[lang]['modal.footer'];

    // ===== NAVBAR REGISTER BUTTON =====
    const navRegisterBtns = document.querySelectorAll('.nav-register-btn');
    navRegisterBtns.forEach(btn => {
        btn.textContent = translations[lang]['nav.register'];
    });

    // ===== TOAST =====
    const toastMsg = document.querySelector('.toast-msg');
    if (toastMsg) toastMsg.textContent = translations[lang]['toast.success'];

    // ===== CITY BADGE =====
    const cityBadge = document.querySelector('.city-badge');
    if (cityBadge) cityBadge.textContent = translations[lang]['smart.badge'];

    // ===== HERO DESCRIPTION =====
    const heroDesc = document.querySelector('.hero-desc');
    if (heroDesc) heroDesc.textContent = translations[lang]['smart.desc'];

    // ===== CONTACT FORM PLACEHOLDERS =====
    document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(el => {
        if (el.id === 'name') el.placeholder = translations[lang]['contact.placeholder.name'];
        else if (el.id === 'phone') el.placeholder = translations[lang]['contact.placeholder.phone'];
        else if (el.id === 'email') el.placeholder = translations[lang]['contact.placeholder.email'];
        else if (el.id === 'message') el.placeholder = translations[lang]['contact.placeholder.msg'];
    });

    console.log(`%c[Mowasalat] Language switched to: ${lang} (${lang === 'ar' ? 'RTL' : 'LTR'})`, 'color:#4a8af4; font-weight:bold;');
}

// ============================================================
// LANGUAGE TOGGLE EVENTS
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // Set initial language
    setLanguage(currentLang);

    // Desktop language buttons
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
        btn.addEventListener('click', function () {
            const lang = this.dataset.lang;
            setLanguage(lang);
        });
    });

    // Mobile language buttons
    const mobileLangAr = document.getElementById('mobile-lang-ar');
    const mobileLangEn = document.getElementById('mobile-lang-en');

    if (mobileLangAr) {
        mobileLangAr.addEventListener('click', function () {
            setLanguage('ar');
        });
    }

    if (mobileLangEn) {
        mobileLangEn.addEventListener('click', function () {
            setLanguage('en');
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', function () {
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // ===== REGISTER MODAL FUNCTIONS =====
    window.showRegisterModal = function () {
        const modal = document.getElementById('register-modal');
        if (modal) modal.classList.remove('hidden');
    };

    window.hideRegisterModal = function () {
        const modal = document.getElementById('register-modal');
        if (modal) modal.classList.add('hidden');
    };

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Show toast
            const toast = document.getElementById('success-toast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 5000);
            }
            // Reset form
            this.reset();
        });
    }

    // ===== REGISTER FORM =====
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const modal = document.getElementById('register-modal');
            if (modal) modal.classList.add('hidden');
            // Show toast
            const toast = document.getElementById('success-toast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 5000);
            }
            this.reset();
        });
    }

    console.log('%c[Mowasalat] i18n system initialized successfully ✅', 'color:#22c55e; font-weight:bold; font-size:14px;');
});
    

// ===== HERO SLIDER =====
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    let current = 0;
    if(slides.length > 1) {
        setInterval(() => {
            slides[current].classList.remove('opacity-100', 'z-10');
            slides[current].classList.add('opacity-0', 'z-0');
            current = (current + 1) % slides.length;
            slides[current].classList.remove('opacity-0', 'z-0');
            slides[current].classList.add('opacity-100', 'z-10');
        }, 3500);
    }
})();
