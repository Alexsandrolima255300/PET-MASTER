/* Canonical banner asset: never store the banner image as a device-local data URL. */
(()=>{
  try{
    const raw=localStorage.getItem('petmaster-banner');
    const current=raw?JSON.parse(raw):{};
    const safe={
      title:current.title||'Tudo para o seu pet, em um só lugar!',
      description:current.description||'Os melhores produtos com qualidade, preço justo e muito carinho para seu melhor amigo.',
      button:current.button||'VER PRODUTOS',
      image:'/petmaster-banner.jpg'
    };
    localStorage.setItem('petmaster-banner',JSON.stringify(safe));
    // The official logo is a repository asset, so it must be identical on every device.
    localStorage.removeItem('petmaster-logo');
  }catch{}
})();
