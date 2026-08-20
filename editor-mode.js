(()=>{
  'use strict';
  const TEXT_SELECTORS='h1,h2,h3,p,.eyebrow,.heroButton,.categoryCard b,.categoryCard span,.product>span,.product small,.featureStrip a,.contactInfo b,.contactInfo span,nav a,.allCategories,.cartButton span,.account b,.account small';
  const textStore=()=>{try{return JSON.parse(localStorage.getItem('petmaster-text-overrides')||'{}')}catch{return{}}};
  const imageStore=()=>{try{return JSON.parse(localStorage.getItem('petmaster-image-overrides')||'{}')}catch{return{}}};
  const path=(el)=>{let out=[];let n=el;while(n&&n.nodeType===1&&n!==document.body){let i=1,s=n.previousElementSibling;while(s){if(s.tagName===n.tagName)i++;s=s.previousElementSibling}out.unshift(n.tagName.toLowerCase()+':'+i);n=n.parentElement}return out.join('/')};
  const apply=()=>{
    const ts=textStore(),is=imageStore();
    document.querySelectorAll(TEXT_SELECTORS).forEach(el=>{const k=path(el);if(ts[k]!=null&&!el.closest('#pm-editor'))el.textContent=ts[k]});
    document.querySelectorAll('img').forEach(el=>{const k=path(el);if(is[k])el.src=is[k]});
    const b=document.querySelector('.heroPets');
    if(b){b.style.backgroundSize='contain';b.style.backgroundRepeat='no-repeat';b.style.backgroundPosition='center';}
  };
  const css=document.createElement('style');css.textContent=`
    .heroPets{background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important}
    #pm-editor{position:fixed;right:18px;bottom:18px;z-index:2147483647;font-family:Arial,sans-serif}
    #pm-editor .pm-bar{display:flex;gap:8px;align-items:center;padding:10px 12px;background:#10243f;color:#fff;border-radius:14px;box-shadow:0 12px 40px #0003}
    #pm-editor button{border:0;border-radius:9px;padding:9px 12px;font-weight:700;cursor:pointer}
    #pm-editor .pm-main{background:#d9aa45;color:#10243f}.pm-cancel{background:#fff;color:#10243f}.pm-save{background:#38a169;color:#fff}.pm-image{background:#fff;color:#10243f}
    body.pm-editing [data-pm-editable],body.pm-editing h1,body.pm-editing h2,body.pm-editing h3,body.pm-editing p,body.pm-editing .eyebrow,body.pm-editing .heroButton,body.pm-editing .categoryCard b,body.pm-editing .categoryCard span,body.pm-editing .product>span,body.pm-editing .product small,body.pm-editing .featureStrip a,body.pm-editing .contactInfo b,body.pm-editing .contactInfo span{outline:2px dashed #d9aa45;outline-offset:4px;cursor:text}
    body.pm-editing img.pm-selected{outline:3px solid #d9aa45;outline-offset:4px;cursor:pointer}
    #pm-image-input{display:none}
  `;document.head.appendChild(css);
  let active=false,dirty=false,currentImage=null;
  const ui=document.createElement('div');ui.id='pm-editor';ui.innerHTML=`<div class="pm-bar"><b>✦ Editor protegido</b><button class="pm-main" data-act="start">Editar</button><button class="pm-image" data-act="image" style="display:none">Trocar foto</button><button class="pm-save" data-act="save" style="display:none">Salvar alterações</button><button class="pm-cancel" data-act="cancel" style="display:none">Sair</button></div>`;document.body.appendChild(ui);
  const imageInput=document.createElement('input');imageInput.id='pm-image-input';imageInput.type='file';imageInput.accept='image/png,image/jpeg,image/webp';document.body.appendChild(imageInput);
  const oldEditor=()=>{document.querySelectorAll('.heroEditorButton,.editorFloating,footer button').forEach(b=>{if(/editar banner/i.test(b.textContent||''))b.style.display='none'})};
  const refresh=()=>{oldEditor();apply()};
  const start=()=>{active=true;dirty=false;document.body.classList.add('pm-editing');ui.querySelector('[data-act="start"]').style.display='none';ui.querySelector('[data-act="save"]').style.display='inline-block';ui.querySelector('[data-act="cancel"]').style.display='inline-block';ui.querySelector('[data-act="image"]').style.display='inline-block';refresh()};
  const stop=()=>{active=false;dirty=false;currentImage=null;document.body.classList.remove('pm-editing');ui.querySelector('[data-act="start"]').style.display='inline-block';ui.querySelector('[data-act="save"]').style.display='none';ui.querySelector('[data-act="cancel"]').style.display='none';ui.querySelector('[data-act="image"]').style.display='none';document.querySelectorAll('.pm-selected').forEach(x=>x.classList.remove('pm-selected'));refresh()};
  ui.addEventListener('click',e=>{const a=e.target.closest('[data-act]')?.dataset.act;if(a==='start')start();if(a==='save'){apply();dirty=false;alert('Alterações salvas com segurança.');}if(a==='cancel'){if(dirty&&!confirm('Sair sem salvar as alterações?'))return;stop()}if(a==='image'){currentImage=currentImage||document.querySelector('.heroPets');imageInput.click()}});
  document.addEventListener('click',e=>{if(!active)return;if(e.target.closest('#pm-editor')||e.target.closest('.modal'))return;const img=e.target.closest('img');if(img&&img.closest('.heroPets')){e.preventDefault();e.stopPropagation();currentImage=img;img.classList.add('pm-selected');imageInput.click();return}const el=e.target.closest(TEXT_SELECTORS);if(el&&!el.closest('#pm-editor')){e.preventDefault();el.contentEditable='true';el.focus();el.dataset.pmEditable='true';el.addEventListener('input',()=>{const ts=textStore();ts[path(el)]=el.textContent;localStorage.setItem('petmaster-text-overrides',JSON.stringify(ts));dirty=true},{once:false});}} ,true);
  imageInput.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{const data=String(r.result);const hero=document.querySelector('.heroPets');if(hero){const banner=(()=>{try{return{...JSON.parse(localStorage.getItem('petmaster-banner')||'{}'),image:data}}catch{return{image:data}}})();localStorage.setItem('petmaster-banner',JSON.stringify(banner));hero.style.backgroundImage=`url(${data})`;hero.style.backgroundSize='contain';hero.style.backgroundPosition='center';}else if(currentImage){const is=imageStore();is[path(currentImage)]=data;localStorage.setItem('petmaster-image-overrides',JSON.stringify(is));currentImage.src=data}dirty=true;imageInput.value='';};r.readAsDataURL(f)});
  new MutationObserver(()=>{if(!active)refresh()}).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('load',()=>setTimeout(refresh,300));
})();
