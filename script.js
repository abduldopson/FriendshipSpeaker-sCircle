(function(){
  const cfg = window.SITE_CONFIG || {};
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  const dropdownGroups = nav ? Array.from(nav.querySelectorAll(".nav-group")) : [];

  function closeDropdowns(except){
    dropdownGroups.forEach(group=>{
      if(group === except) return;
      group.classList.remove("open");
      const btn = group.querySelector(".nav-dropdown-toggle");
      if(btn) btn.setAttribute("aria-expanded","false");
    });
  }

  function closeNav(){
    if(nav && toggle){
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
    }
    closeDropdowns();
  }

  if(toggle && nav){
    toggle.addEventListener("click",()=>{
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      if(!open) closeDropdowns();
    });

    dropdownGroups.forEach(group=>{
      const btn = group.querySelector(".nav-dropdown-toggle");
      if(!btn) return;
      btn.addEventListener("click",e=>{
        e.stopPropagation();
        const willOpen = !group.classList.contains("open");
        closeDropdowns(group);
        group.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", String(willOpen));
      });
    });

    nav.querySelectorAll("a").forEach(link=>{
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click",e=>{
      if(nav && !nav.contains(e.target)) closeDropdowns();
    });

    document.addEventListener("keydown",e=>{
      if(e.key === "Escape") closeNav();
    });

    window.addEventListener("resize",()=>{
      if(window.innerWidth > 1000){
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded","false");
      }
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
