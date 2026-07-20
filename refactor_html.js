const fs = require('fs');

function processHtml(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Inject script tag at the end before </body>
    if (!content.includes('src="i18n.js"')) {
        content = content.replace('</body>', '    <script src="i18n.js"></script>\n</body>');
    }

    // 2. Remove old logic in index.html and team.html
    content = content.replace(/\/\/ ========== TRANSLATION ==========[\s\S]*?\/\/ ========== INIT ==========/g, '// ========== INIT ==========');
    content = content.replace(/function translatePage\(lang\) \{[\s\S]*?\}/g, '');
    content = content.replace(/const translations = \{[\s\S]*?\};/g, '');
    content = content.replace(/let currentLang = 'ar';/g, '');
    content = content.replace(/function setLang\(lang\) \{[\s\S]*?\}/g, '');
    // Remove the old setLang event listeners
    content = content.replace(/document\.getElementById\('lang-ar'\)\?\.addEventListener\('click', \(\) => setLang\('ar'\)\);/g, '');
    content = content.replace(/document\.getElementById\('lang-en'\)\?\.addEventListener\('click', \(\) => setLang\('en'\)\);/g, '');
    content = content.replace(/document\.getElementById\('mobile-lang-ar'\)\?\.addEventListener\('click', \(\) => setLang\('ar'\)\);/g, '');
    content = content.replace(/document\.getElementById\('mobile-lang-en'\)\?\.addEventListener\('click', \(\) => setLang\('en'\)\);/g, '');
    
    // Also remove the old init call
    content = content.replace(/const savedLang = localStorage\.lang \|\| 'ar';/g, '');
    content = content.replace(/setLang\(savedLang\);/g, '');

    // Add data-i18n to nav
    const map = [
        ['nav-link active">الرئيسية', 'nav-link active" data-i18n="nav.home">الرئيسية'],
        ['nav-link">الرئيسية', 'nav-link" data-i18n="nav.home">الرئيسية'],
        ['nav-link">من نحن', 'nav-link" data-i18n="nav.about">من نحن'],
        ['nav-link">فريق العمل', 'nav-link" data-i18n="nav.team">فريق العمل'],
        ['nav-link">خدماتنا', 'nav-link" data-i18n="nav.services">خدماتنا'],
        ['nav-link">كيف تستخدم', 'nav-link" data-i18n="nav.howToRide">كيف تستخدم'],
        ['nav-link">السياسات', 'nav-link" data-i18n="nav.privacy">السياسات'],
        ['nav-link">تواصل معنا', 'nav-link" data-i18n="nav.contact">تواصل معنا'],
        ['mobile-link">الرئيسية', 'mobile-link" data-i18n="nav.home">الرئيسية'],
        ['mobile-link">من نحن', 'mobile-link" data-i18n="nav.about">من نحن'],
        ['mobile-link">فريق العمل', 'mobile-link" data-i18n="nav.team">فريق العمل'],
        ['mobile-link">خدماتنا', 'mobile-link" data-i18n="nav.services">خدماتنا'],
        ['mobile-link">كيف تستخدم', 'mobile-link" data-i18n="nav.howToRide">كيف تستخدم'],
        ['mobile-link">السياسات', 'mobile-link" data-i18n="nav.privacy">السياسات'],
        ['mobile-link">تواصل معنا', 'mobile-link" data-i18n="nav.contact">تواصل معنا'],
        ['class="brand-text">مواصلات', 'class="brand-text" data-i18n="footer.brand">مواصلات'],
        ['class="nav-register-btn">تسجيل اهتمام', 'class="nav-register-btn" data-i18n="modal.title">تسجيل اهتمام'],
        
        // Hero
        ['city-badge">متوفر في 15+ مدينة', 'city-badge" data-i18n="hero.badge">متوفر في 15+ مدينة'],
        ['hero-line1 block">تنقل ذكي', 'hero-line1 block" data-i18n="hero.title">تنقل ذكي'],
        ['hero-line2 hidden">بلمسة عصرية', 'hero-line2 hidden" data-i18n="hero.subtitle">بلمسة عصرية'],
        ['hero-desc">مواصلات — تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.', 'hero-desc" data-i18n="hero.desc">مواصلات — تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.'],
        
        // App store / Google play buttons
        ['<div class="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5">Download on</div>', '<div class="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5" data-i18n="hero.appstore">Download on</div>'],
        ['<div class="text-lg font-bold">App Store</div>', '<div class="text-lg font-bold">App Store</div>'],
        ['<div class="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5">GET IT ON</div>', '<div class="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5" data-i18n="hero.googleplay">GET IT ON</div>'],
        ['<div class="text-lg font-bold">Google Play</div>', '<div class="text-lg font-bold">Google Play</div>'],
        
        // Hero Slide
        ['drop-shadow-lg">Mowasalat...</span>', 'drop-shadow-lg" data-i18n="hero.slide1">Mowasalat...</span>'],
        ['drop-shadow-lg">Easier and faster.</span>', 'drop-shadow-lg" data-i18n="hero.slide1b">Easier and faster.</span>'],
        ['drop-shadow-lg">Increase your rides</span>', 'drop-shadow-lg" data-i18n="hero.slide2">Increase your rides</span>'],
        ['drop-shadow-lg">And reach more customers.</span>', 'drop-shadow-lg" data-i18n="hero.slide2b">And reach more customers.</span>'],
        ['drop-shadow-lg">Manage your rides</span>', 'drop-shadow-lg" data-i18n="hero.slide3">Manage your rides</span>'],
        ['drop-shadow-lg">With ease.</span>', 'drop-shadow-lg" data-i18n="hero.slide3b">With ease.</span>'],
        ['drop-shadow-lg">Mobility solutions</span>', 'drop-shadow-lg" data-i18n="hero.slide4">Mobility solutions</span>'],
        ['drop-shadow-lg">Smart and safe.</span>', 'drop-shadow-lg" data-i18n="hero.slide4b">Smart and safe.</span>'],
        ['drop-shadow-lg">Everything you need to manage and grow</span>', 'drop-shadow-lg" data-i18n="hero.slide5">Everything you need to manage and grow</span>'],
        ['drop-shadow-lg">your business in one place.</span>', 'drop-shadow-lg" data-i18n="hero.slide5b">your business in one place.</span>'],
        
        // Stats
        ['>مستخدم</div>', ' data-i18n="stats.users">مستخدم</div>'],
        ['>رحلة/يوم</div>', ' data-i18n="stats.rides">رحلة/يوم</div>'],
        ['>تقييم</div>', ' data-i18n="stats.rating">تقييم</div>'],
        ['>مدينة مغطاة</div>', ' data-i18n="stats.cities">مدينة مغطاة</div>'],
        
        // About
        ['>رؤية جديدة</span>', ' data-i18n="about.subtitle">رؤية جديدة</span>'],
        ['about-title">من نحن</h2>', 'about-title" data-i18n="about.title">من نحن</h2>'],
        ['>لمستقبل</span>', ' data-i18n="about.highlight">لمستقبل</span>'],
        ['>مواصلات هي منصة رائدة في المملكة لتقديم حلول النقل الذكي والآمن.</p>', ' data-i18n="about.desc1">مواصلات هي منصة رائدة في المملكة لتقديم حلول النقل الذكي والآمن.</p>'],
        ['>انطلقنا من الحاجة إلى نقل آمن، مريح، وموثوق للموظفات والطالبات. هدفنا تغيير مفهوم النقل ليكون تجربة يومية مميزة تلبي طموحات المجتمع.</p>', ' data-i18n="about.desc2">انطلقنا من الحاجة إلى نقل آمن، مريح، وموثوق للموظفات والطالبات. هدفنا تغيير مفهوم النقل ليكون تجربة يومية مميزة تلبي طموحات المجتمع.</p>'],
        ['>نعتمد في عملنا على أحدث التقنيات لتقديم خدماتنا بأسلوب عصري ومبتكر. انضم إلينا اليوم لتكن جزءاً من ثورة النقل الذكي.</p>', ' data-i18n="about.desc3">نعتمد في عملنا على أحدث التقنيات لتقديم خدماتنا بأسلوب عصري ومبتكر. انضم إلينا اليوم لتكن جزءاً من ثورة النقل الذكي.</p>'],
        ['>خيارات مرنة</span>', ' data-i18n="about.tags.0">خيارات مرنة</span>'],
        ['>دعم 24/7</span>', ' data-i18n="about.tags.1">دعم 24/7</span>'],
        ['>تجربة آمنة</span>', ' data-i18n="about.tags.2">تجربة آمنة</span>'],
        
        // Partners
        ['partners-badge">شركاء النجاح</span>', 'partners-badge" data-i18n="partners.badge">شركاء النجاح</span>'],
        ['partners-title">من يثق بنا</h2>', 'partners-title" data-i18n="partners.title">من يثق بنا</h2>'],
        ['partners-desc">نفخر بشراكاتنا مع نخبة من الجهات التي تشاركنا رؤيتنا لتقديم أفضل تجربة للمستخدم.</p>', 'partners-desc" data-i18n="partners.desc">نفخر بشراكاتنا مع نخبة من الجهات التي تشاركنا رؤيتنا لتقديم أفضل تجربة للمستخدم.</p>'],
        
        // Services
        ['services-badge">خدماتنا</span>', 'services-badge" data-i18n="services.title">خدماتنا</span>'],
        ['services-title">باقات مصممة لتناسب تطلعاتك</h2>', 'services-title" data-i18n="services.subtitle">باقات مصممة لتناسب تطلعاتك</h2>'],
        ['services-desc">اختر الباقة التي تناسبك</p>', 'services-desc" data-i18n="services.desc">اختر الباقة التي تناسبك</p>'],
        ['srv-title">نقل الأفراد</h3>', 'srv-title" data-i18n="services.srv1_title">نقل الأفراد</h3>'],
        ['>خدمة يومية موثوقة إلى أعمالكم بأسعار في متناول الجميع.</p>', ' data-i18n="services.srv1_desc">خدمة يومية موثوقة إلى أعمالكم بأسعار في متناول الجميع.</p>'],
        ['srv-title">الاشتراك الشهري</h3>', 'srv-title" data-i18n="services.srv2_title">الاشتراك الشهري</h3>'],
        ['>راحة بال مع خطط نقل مرنة ومستدامة.</p>', ' data-i18n="services.srv2_desc">راحة بال مع خطط نقل مرنة ومستدامة.</p>'],
        ['srv-title">الاشتراك السنوي</h3>', 'srv-title" data-i18n="services.srv3_title">الاشتراك السنوي</h3>'],
        ['>للمؤسسات والشركات، تجربة متميزة ومستدامة طوال العام.</p>', ' data-i18n="services.srv3_desc">للمؤسسات والشركات، تجربة متميزة ومستدامة طوال العام.</p>'],
        
        // Add more service points manually later or map them if needed
        ['>سيارات حديثة ومجهزة</span>', ' data-i18n="services.srv1_points.0">سيارات حديثة ومجهزة</span>'],
        ['>دعم فني متواجد</span>', ' data-i18n="services.srv1_points.1">دعم فني متواجد</span>'],
        ['>سائقون محترفون</span>', ' data-i18n="services.srv1_points.2">سائقون محترفون</span>'],
        ['>مرونة في الجدولة</span>', ' data-i18n="services.srv1_points.3">مرونة في الجدولة</span>'],
        ['>تتبع للرحلة</span>', ' data-i18n="services.srv1_points.4">تتبع للرحلة</span>'],
        ['>رحلات مباشرة مريحة</span>', ' data-i18n="services.srv1_points.5">رحلات مباشرة مريحة</span>'],
        ['>اشتراكات مرنة</span>', ' data-i18n="services.srv1_points.6">اشتراكات مرنة</span>'],
        ['>أسعار مخفضة ومناسبة</span>', ' data-i18n="services.srv2_points.0">أسعار مخفضة ومناسبة</span>'],
        ['>خدمة "مواصلات كير"</span>', ' data-i18n="services.srv2_points.1">خدمة "مواصلات كير"</span>'],
        ['>دعم فني مخصص</span>', ' data-i18n="services.srv2_points.2">دعم فني مخصص</span>'],
        ['>رحلات يومية ثابتة</span>', ' data-i18n="services.srv2_points.3">رحلات يومية ثابتة</span>'],
        ['>توفير للوقت والجهد</span>', ' data-i18n="services.srv2_points.4">توفير للوقت والجهد</span>'],
        ['>مركبات مريحة</span>', ' data-i18n="services.srv2_points.5">مركبات مريحة</span>'],
        ['>تغطية شاملة</span>', ' data-i18n="services.srv2_points.6">تغطية شاملة</span>'],
        ['>خدمات إضافية</span>', ' data-i18n="services.srv2_points.7">خدمات إضافية</span>'],
        ['>تحديثات مستمرة</span>', ' data-i18n="services.srv2_points.8">تحديثات مستمرة</span>'],
        ['>التزام بالموعد (SLA) مع تعويضات</span>', ' data-i18n="services.srv2_points.9">التزام بالموعد (SLA) مع تعويضات</span>'],
        ['>عقود مرنة ومخصصة</span>', ' data-i18n="services.srv3_points.6">عقود مرنة ومخصصة</span>'],
        ['>تقارير دورية للاستخدام</span>', ' data-i18n="services.srv3_points.7">تقارير دورية للاستخدام</span>'],
        ['>مدير حساب مخصص</span>', ' data-i18n="services.srv3_points.8">مدير حساب مخصص</span>'],
        ['>أولوية الحجز</span>', ' data-i18n="services.srv3_points.9">أولوية الحجز</span>'],
        ['>خدمات لكبار الشخصيات (VIP)</span>', ' data-i18n="services.srv3_points.10">خدمات لكبار الشخصيات (VIP)</span>'],
        ['>تعويضات في حال التأخير عن 10 دقائق</span>', ' data-i18n="services.srv3_points.11">تعويضات في حال التأخير عن 10 دقائق</span>'],
        
        // How it works
        ['how-title">كيف تعمل مواصلات</h2>', 'how-title" data-i18n="how.title">كيف تعمل مواصلات</h2>'],
        ['how-step">اختر باقتك من التطبيق</h4>', 'how-step" data-i18n="how.step1_title">اختر باقتك من التطبيق</h4>'],
        ['how-desc">حمل التطبيق واختر الباقة التي تناسب جدولك اليومي.</p>', 'how-desc" data-i18n="how.step1_desc">حمل التطبيق واختر الباقة التي تناسب جدولك اليومي.</p>'],
        ['how-step">حدد موقعك وتوقيتك</h4>', 'how-step" data-i18n="how.step2_title">حدد موقعك وتوقيتك</h4>'],
        ['how-desc">اختر الموقع والوقت وسيتولى كابتن مواصلات الباقي.</p>', 'how-desc" data-i18n="how.step2_desc">اختر الموقع والوقت وسيتولى كابتن مواصلات الباقي.</p>'],
        ['how-step">رحلة آمنة</h4>', 'how-step" data-i18n="how.step3_title">رحلة آمنة</h4>'],
        ['how-desc">تمتع برحلتك بأمان، وشارك مسارك مع من تحب.</p>', 'how-desc" data-i18n="how.step3_desc">تمتع برحلتك بأمان، وشارك مسارك مع من تحب.</p>'],
        ['how-step">دعم فوري</h4>', 'how-step" data-i18n="how.step4_title">دعم فوري</h4>'],
        ['how-desc">خدمة "مواصلات كير" متاحة لمساعدتك طوال الرحلة.</p>', 'how-desc" data-i18n="how.step4_desc">خدمة "مواصلات كير" متاحة لمساعدتك طوال الرحلة.</p>'],
        
        // Privacy
        ['privacy-title">سياسة الخصوصية</h3>', 'privacy-title" data-i18n="privacy.title">سياسة الخصوصية</h3>'],
        ['privacy-date">آخر تحديث: يوليو 2026</p>', 'privacy-date" data-i18n="privacy.date">آخر تحديث: يوليو 2026</p>'],
        ['privacy-p1">نحن في مواصلات نلتزم بحماية خصوصية بياناتك. يتم جمع البيانات (مثل الموقع الجغرافي ومعلومات الحساب) لتحسين جودة الخدمة وتقديم تجربة سلسة وآمنة. لا نقوم بمشاركة معلوماتك الشخصية مع أي أطراف خارجية إلا بموجب القانون أو بموافقتك الصريحة.</p>', 'privacy-p1" data-i18n="privacy.p1">نحن في مواصلات نلتزم بحماية خصوصية بياناتك. يتم جمع البيانات (مثل الموقع الجغرافي ومعلومات الحساب) لتحسين جودة الخدمة وتقديم تجربة سلسة وآمنة. لا نقوم بمشاركة معلوماتك الشخصية مع أي أطراف خارجية إلا بموجب القانون أو بموافقتك الصريحة.</p>'],
        ['privacy-p2">يتم تشفير جميع البيانات الحساسة باستخدام أحدث التقنيات. لك الحق في مراجعة بياناتك أو طلب حذفها في أي وقت عبر إعدادات الحساب.</p>', 'privacy-p2" data-i18n="privacy.p2">يتم تشفير جميع البيانات الحساسة باستخدام أحدث التقنيات. لك الحق في مراجعة بياناتك أو طلب حذفها في أي وقت عبر إعدادات الحساب.</p>'],
        
        // Terms
        ['terms-title">الشروط والأحكام</h3>', 'terms-title" data-i18n="terms.title">الشروط والأحكام</h3>'],
        ['terms-date">مقدمة عن شروط الاستخدام</p>', 'terms-date" data-i18n="terms.date">مقدمة عن شروط الاستخدام</p>'],
        ['terms-p1">من خلال استخدامك لتطبيق مواصلات، فإنك توافق على الالتزام بجميع الشروط والأحكام الموضحة. يجب استخدام الخدمة في الأغراض المشروعة فقط ووفقاً للأنظمة المعمول بها في المملكة.</p>', 'terms-p1" data-i18n="terms.p1">من خلال استخدامك لتطبيق مواصلات، فإنك توافق على الالتزام بجميع الشروط والأحكام الموضحة. يجب استخدام الخدمة في الأغراض المشروعة فقط ووفقاً للأنظمة المعمول بها في المملكة.</p>'],
        ['terms-p2">تحتفظ مواصلات بالحق في تعديل هذه الشروط</p>', 'terms-p2" data-i18n="terms.p2">تحتفظ مواصلات بالحق في تعديل هذه الشروط</p>'],
        ['terms-p3">المسؤولية القانونية محصورة في النطاق الموضح</p>', 'terms-p3" data-i18n="terms.p3">المسؤولية القانونية محصورة في النطاق الموضح</p>'],
        ['terms-p4">النزاعات تخضع للأنظمة المعمول بها في المملكة</p>', 'terms-p4" data-i18n="terms.p4">النزاعات تخضع للأنظمة المعمول بها في المملكة</p>'],
        
        // Contact
        ['contact-badge">تواصل معنا</span>', 'contact-badge" data-i18n="contact.title">تواصل معنا</span>'],
        ['contact-title">نحن هنا <br /> <span class="text-emerald-400">لخدمتك</span></h2>', 'contact-title"><span data-i18n="contact.subtitle">نحن هنا</span> <br /> <span class="text-emerald-400" data-i18n="contact.subtitle2">لخدمتك</span></h2>'],
        ['contact-desc">لديك استفسار؟ فريق الدعم لدينا مستعد للإجابة على تساؤلاتك طوال اليوم.</p>', 'contact-desc" data-i18n="contact.desc">لديك استفسار؟ فريق الدعم لدينا مستعد للإجابة على تساؤلاتك طوال اليوم.</p>'],
        ['placeholder="الاسم الكامل"', 'placeholder="الاسم الكامل" data-i18n="contact.form_name"'],
        ['placeholder="البريد الإلكتروني"', 'placeholder="البريد الإلكتروني" data-i18n="contact.form_email"'],
        ['placeholder="رقم الهاتف المعتمد"', 'placeholder="رقم الهاتف المعتمد" data-i18n="contact.form_phone"'],
        ['placeholder="رسالتك..."', 'placeholder="رسالتك..." data-i18n="contact.form_msg"'],
        ['>إرسال الرسالة</span>', ' data-i18n="contact.form_btn">إرسال الرسالة</span>'],
        
        // Footer
        ['footer-brand-desc">تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.</p>', 'footer-brand-desc" data-i18n="footer.desc">تطبيق النقل الذكي المصمم ليمنحك رحلات سريعة وآمنة مع خيارات اشتراك مرنة.</p>'],
        ['>روابط سريعة</h3>', ' data-i18n="footer.quick_title">روابط سريعة</h3>'],
        ['>الخدمات</h3>', ' data-i18n="footer.srv_title">الخدمات</h3>'],
        ['>معلومات التواصل</h3>', ' data-i18n="footer.contact_title">معلومات التواصل</h3>'],
        ['>الرياض، المملكة العربية السعودية</span>', ' data-i18n="footer.location">الرياض، المملكة العربية السعودية</span>'],
        ['>دعم 24/7</span>', ' data-i18n="footer.support">دعم 24/7</span>'],
        ['>جميع الحقوق محفوظة</span>', ' data-i18n="footer.rights">جميع الحقوق محفوظة</span>'],
        ['>صُنع في السعودية</span>', ' data-i18n="footer.made">صُنع في السعودية</span>'],
        
        // Modal
        ['modal-title">تسجيل اهتمام</h3>', 'modal-title" data-i18n="modal.title">تسجيل اهتمام</h3>'],
        ['modal-sub">انضم لقائمة الانتظار</p>', 'modal-sub" data-i18n="modal.subtitle">انضم لقائمة الانتظار</p>'],
        ['modal-label-org">اسم المؤسسة</label>', 'modal-label-org" data-i18n="modal.org">اسم المؤسسة</label>'],
        ['modal-label-manager">اسم المسؤول</label>', 'modal-label-manager" data-i18n="modal.manager">اسم المسؤول</label>'],
        ['modal-label-phone">رقم الجوال</label>', 'modal-label-phone" data-i18n="modal.phone">رقم الجوال</label>'],
        ['modal-label-email">البريد الإلكتروني</label>', 'modal-label-email" data-i18n="modal.email">البريد الإلكتروني</label>'],
        ['modal-btn-text">سجل اهتمامك الآن</span>', 'modal-btn-text" data-i18n="modal.btn">سجل اهتمامك الآن</span>'],
        
        // Toast
        ['>تم الإرسال بنجاح! سنتواصل معك قريباً.</span>', ' data-i18n="toast.success">تم الإرسال بنجاح! سنتواصل معك قريباً.</span>'],
    ];

    for (const [search, replace] of map) {
        content = content.replace(new RegExp(search, 'g'), replace);
    }
    
    fs.writeFileSync(file, content, 'utf8');
}

processHtml('d:/companies/sudia/muasalat/index.html');
processHtml('d:/companies/sudia/muasalat/team.html');
console.log('HTML files refactored');
