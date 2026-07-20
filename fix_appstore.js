const fs = require('fs');
function fixAppStoreBtn(file) {
    if(!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the App Store button in the smart-mobility section
    // It's the one with `bg-transparent border border-white/20 text-white hover:bg-white/10`
    content = content.replace(
        /bg-transparent border border-white\/20 text-white hover:bg-white\/10 font-bold px-8 h-14 rounded-full/g,
        'bg-transparent border border-[#0a1a3a]/20 text-[#0a1a3a] hover:bg-[#0a1a3a]/10 font-bold px-8 h-14 rounded-full'
    );
    
    fs.writeFileSync(file, content, 'utf8');
}
fixAppStoreBtn('d:/companies/sudia/muasalat/index.html');
console.log('App store button fixed');
