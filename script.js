(function(){
  const cfg = window.SITE_CONFIG || {};
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  function closeNav(){
    if(!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }

  if(toggle && nav){
    toggle.addEventListener("click",()=>{
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach(link=>{
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown",e=>{
      if(e.key === "Escape") closeNav();
    });
  }

  document.querySelectorAll("[data-config]").forEach(el=>{
    const path = el.getAttribute("data-config").split(".");
    let value = cfg;
    for(const key of path){ value = value && value[key]; }
    if(typeof value === "string" && value.trim()) el.textContent = value;
  });

  document.querySelectorAll("[data-link]").forEach(el=>{
    const key = el.getAttribute("data-link");
    const value = cfg.links && cfg.links[key];

    if(value){
      el.setAttribute("href", value);
      el.classList.remove("btn-disabled");
      el.removeAttribute("aria-disabled");
      el.removeAttribute("title");

      if(/^https?:\/\//i.test(value)){
        el.setAttribute("target","_blank");
        el.setAttribute("rel","noopener noreferrer");
      }else{
        el.removeAttribute("target");
        el.removeAttribute("rel");
      }
    }else{
      el.setAttribute("href","#");
      el.classList.add("btn-disabled");
      el.setAttribute("aria-disabled","true");
      el.setAttribute("title","This resource is not connected yet.");
      el.removeAttribute("target");
      el.removeAttribute("rel");
      el.addEventListener("click",e=>e.preventDefault());
    }
  });

  document.querySelectorAll("[data-year]").forEach(el=>{
    el.textContent = new Date().getFullYear();
  });
})();