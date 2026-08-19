(function(){
  const KEY='petmaster-banner';
  const POS='petmaster-banner-position';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const getPos=()=>{try{return JSON.parse(localStorage.getItem(POS)||'{}')}catch{return{}}};
  const setPos=(v)=>localStorage.setItem(POS,JSON.stringify(v));
  let cfg={x:0,y:0,scale:1};
  function loadCfg(){const b=getPos();cfg={x:Number(b.x)||0,y:Number(b.y)||0,scale:Number(b.scale)||1};}
  function apply(){loadCfg();const el=document.querySelector('.heroPets');const b=get();if(!el||!b.image)return;el.style.setProperty('background-size',`${100*cfg.scale}% auto`,'important');el.style.setProperty('background-position',`calc(50% + ${cfg.x}px) calc(50% + ${cfg.y}px)`,'important');}
  function inject(){
    const modal=document.querySelector('.bannerEditor'); if(!modal||modal.dataset.positionReady==='1')return;
    modal.dataset.positionReady='1';
    const input=modal.querySelector('input[type=file]');
    const controls=document.createElement('div'); controls.className='positionControls';
    controls.innerHTML='<div class="positionTitle">POSIÇÃO E TAMANHO DA IMAGEM</div><div class="bannerStage"><div class="stageHint">Arraste a imagem para posicionar</div><img class="stageImage" draggable="false"></div><div class="rangeRow"><label>Tamanho <input class="sizeRange" type="range" min="0.5" max="2" step="0.01" value="1"></label><output class="sizeValue">100%</output></div><button type="button" class="resetPosition">↺ Centralizar imagem</button>';
    if(input) input.parentNode?.insertAdjacentElement('afterend',controls); else modal.appendChild(controls);
    const img=controls.querySelector('.stageImage'), range=controls.querySelector('.sizeRange'), out=controls.querySelector('.sizeValue');
    loadCfg(); range.value=cfg.scale; out.textContent=Math.round(cfg.scale*100)+'%';
    function sync(){const b=get();if(!b.image)return;img.src=b.image;img.style.transform=`translate(${cfg.x}px,${cfg.y}px) scale(${cfg.scale})`;}
    function drag(e){if(!img.src)return;const p=e.touches?e.touches[0]:e;const sx=p.clientX,sy=p.clientY,ox=cfg.x,oy=cfg.y;const move=q=>{const z=q.touches?q.touches[0]:q;cfg.x=ox+z.clientX-sx;cfg.y=oy+z.clientY-sy;img.style.transform=`translate(${cfg.x}px,${cfg.y}px) scale(${cfg.scale})`};const up=()=>{document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',up);document.removeEventListener('touchmove',move);document.removeEventListener('touchend',up)};document.addEventListener('mousemove',move);document.addEventListener('mouseup',up);document.addEventListener('touchmove',move,{passive:false});document.addEventListener('touchend',up);e.preventDefault()}
    img.addEventListener('mousedown',drag);img.addEventListener('touchstart',drag,{passive:false});
    range.addEventListener('input',e=>{cfg.scale=Number(e.target.value);out.textContent=Math.round(cfg.scale*100)+'%';img.style.transform=`translate(${cfg.x}px,${cfg.y}px) scale(${cfg.scale})`});
    controls.querySelector('.resetPosition').addEventListener('click',()=>{cfg={x:0,y:0,scale:1};range.value=1;out.textContent='100%';img.style.transform='translate(0px,0px) scale(1)'});
    sync();
    if(input) input.addEventListener('change',()=>setTimeout(()=>{loadCfg();sync()},100));
    const save=Array.from(modal.querySelectorAll('button')).find(b=>/Salvar banner/i.test(b.textContent||''));
    if(save)save.addEventListener('click',()=>{setPos({x:Math.round(cfg.x),y:Math.round(cfg.y),scale:Number(cfg.scale.toFixed(2))});setTimeout(()=>location.reload(),700)});
  }
  const style=document.createElement('style');style.textContent=`.heroEditorButton{z-index:8}.positionControls{margin-top:18px;padding:14px;border:1px solid #e8edf4;border-radius:14px;background:#f8fafc}.positionTitle{font-size:11px;font-weight:800;letter-spacing:1.2px;color:#d09a00;margin-bottom:10px}.bannerStage{height:210px;border-radius:12px;overflow:hidden;position:relative;background:#eef2f7;display:grid;place-items:center;cursor:grab}.bannerStage:active{cursor:grabbing}.stageImage{max-width:none;max-height:none;width:100%;height:100%;object-fit:cover;transform-origin:center;user-select:none;touch-action:none}.stageHint{position:absolute;z-index:2;top:8px;left:10px;padding:5px 8px;border-radius:8px;background:rgba(16,43,89,.8);color:#fff;font-size:10px;font-weight:700;pointer-events:none}.rangeRow{display:flex;align-items:center;gap:12px;margin-top:12px}.rangeRow label{flex:1;margin:0!important;font-size:12px!important}.sizeRange{width:100%!important;margin-top:7px!important}.sizeValue{min-width:48px;text-align:right;font-weight:800;color:#102b59}.resetPosition{margin-top:10px;padding:8px 11px;border-radius:9px;background:#fff;border:1px solid #e8edf4;font-size:12px;font-weight:700}`;document.head.appendChild(style);
  const obs=new MutationObserver(()=>{inject();apply()});obs.observe(document.body,{childList:true,subtree:true});setInterval(()=>{inject();apply()},700);
})();