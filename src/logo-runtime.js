const DEFAULT_LOGO='/logo.svg?v=4';
const getLogo=()=>{try{return localStorage.getItem('petmaster-logo')||DEFAULT_LOGO}catch{return DEFAULT_LOGO}};
const applyLogo=()=>document.querySelectorAll('.logo img').forEach(img=>{const src=getLogo();if(img.getAttribute('src')!==src)img.setAttribute('src',src)});
new MutationObserver(applyLogo).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('petmaster-logo-changed',applyLogo);
window.addEventListener('storage',e=>{if(e.key==='petmaster-logo')applyLogo()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyLogo);else applyLogo();
