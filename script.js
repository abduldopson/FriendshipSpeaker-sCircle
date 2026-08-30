(function(){
  const cfg = window.SITE_CONFIG || {};
  const knowledge = window.FSC_CLUB_KNOWLEDGE || {};
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

    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click", closeNav));
    document.addEventListener("click",e=>{ if(nav && !nav.contains(e.target)) closeDropdowns(); });
    document.addEventListener("keydown",e=>{ if(e.key === "Escape") closeNav(); });
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

  document.querySelectorAll("[data-year]").forEach(el=>{ el.textContent = new Date().getFullYear(); });

  // ---------- Site Search ----------
  const SEARCH_INDEX = [
    {title:"Home", url:"index.html", text:"Friendship Speaker’s Circle conversations that matter speak connect grow lead next meeting club community"},
    {title:"About the Club", url:"about.html", text:"mission vision values community demographics campuses roles reasons joining public speaking leadership confidence networking"},
    {title:"Leadership", url:"leadership.html", text:"president vice president education membership public relations treasurer sergeant at arms club mentor board officers"},
    {title:"Meetings", url:"meetings.html", text:"meeting flow agenda toastmaster president prepared speeches table topics evaluation handoff etiquette virtual in person"},
    {title:"Calendar", url:"calendar.html", text:"calendar dates meetings board learning labs schedule september october november december january february march april may june"},
    {title:"Meeting Roles & Scripts", url:"roles.html", text:"role scripts toastmaster table topics general evaluator speech evaluator timer grammarian ah-counter sergeant at arms introduction report timing word of the day filler words"},
    {title:"Member Hub", url:"member-hub.html", text:"member dashboard role signup speech submission feedback progress tracker resources tools"},
    {title:"Start Here", url:"start-here.html", text:"new member onboarding mentor first role first speech ice breaker track growth four week roadmap"},
    {title:"Pathways & Find Your Path", url:"pathways.html#pathfinder", text:"pathways quiz identifier assessment dynamic leadership engaging humor motivational strategies persuasive influence presentation mastery visionary communication speech projects"},
    {title:"Mentorship", url:"mentorship.html", text:"mentor mentee coaching onboarding check-ins board member mentors club mentor pathways support"},
    {title:"Recognition", url:"recognition.html", text:"member of month speech spotlight pathways achievement service recognition golden buzzer growth award"},
    {title:"Resources", url:"resources.html", text:"resource library flyers club media google drive official toastmasters forms trackers"},
    {title:"Join Us", url:"join.html", text:"join interest form membership guest club friendship speaker circle"}
  ];

  function installSearch(){
    if(!nav) return;
    let btn = document.querySelector(".site-search-open");
    if(!btn){
      const join = nav.querySelector(".nav-cta");
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "site-search-open";
      btn.setAttribute("aria-label","Search this site");
      btn.innerHTML = '<span aria-hidden="true">⌕</span><span class="search-label">Search</span>';
      nav.insertBefore(btn, join || null);
    }

    let dialog = document.querySelector(".search-modal");
    if(!dialog){
      dialog = document.createElement("div");
      dialog.className = "search-modal";
      dialog.setAttribute("aria-hidden","true");
      dialog.innerHTML = `
        <div class="search-backdrop" data-search-close></div>
        <section class="search-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">
          <div class="search-panel-head"><div><div class="eyebrow">Find it fast</div><h2 id="site-search-title">Search Friendship Speaker’s Circle</h2></div><button class="icon-button" type="button" data-search-close aria-label="Close search">×</button></div>
          <label class="search-box"><span aria-hidden="true">⌕</span><input id="site-search-input" type="search" autocomplete="off" placeholder="Try ‘Timer’, ‘next meeting’, ‘Pathways’…"></label>
          <div class="search-results" id="site-search-results"><p class="search-hint">Type a word or phrase to search the club website.</p></div>
        </section>`;
      document.body.appendChild(dialog);
    }
    const input = dialog.querySelector("#site-search-input");
    const results = dialog.querySelector("#site-search-results");
    if(!input || !results) return;

    function openSearch(){ dialog.classList.add("open"); dialog.setAttribute("aria-hidden","false"); document.body.classList.add("modal-open"); setTimeout(()=>input.focus(),30); }
    function closeSearch(){ dialog.classList.remove("open"); dialog.setAttribute("aria-hidden","true"); document.body.classList.remove("modal-open"); }
    if(!btn.dataset.searchBound){ btn.addEventListener("click", openSearch); btn.dataset.searchBound="1"; }
    dialog.querySelectorAll("[data-search-close]").forEach(x=>{ if(!x.dataset.searchBound){x.addEventListener("click",closeSearch);x.dataset.searchBound="1";} });
    document.addEventListener("keydown",e=>{ if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){e.preventDefault();openSearch();} if(e.key==="Escape"&&dialog.classList.contains("open"))closeSearch(); });
    input.addEventListener("input",()=>{
      const q=input.value.trim().toLowerCase();
      if(!q){results.innerHTML='<p class="search-hint">Type a word or phrase to search the club website.</p>';return;}
      const terms=q.split(/\s+/).filter(Boolean);
      const ranked=SEARCH_INDEX.map(item=>{
        const hay=(item.title+" "+item.text).toLowerCase();
        let score=0; terms.forEach(t=>{ if(item.title.toLowerCase().includes(t))score+=5; if(hay.includes(t))score+=2; });
        return {...item,score};
      }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
      results.innerHTML=ranked.length?ranked.map(r=>`<a class="search-result" href="${r.url}"><strong>${r.title}</strong><span>Open page →</span></a>`).join(""):'<p class="search-hint">No direct match. Try a broader term, or ask the Club Assistant.</p>';
    });
  }

  // ---------- Club Assistant ----------
  function localClubAnswer(question){
    const q = question.toLowerCase();
    const roleMap = knowledge.roles || {};
    for(const [name,desc] of Object.entries(roleMap)){
      if(q.includes(name.toLowerCase()) || (name==="Ah-Counter" && /ah.?counter|filler/.test(q))){
        return `${name}: ${desc} You can find the full preparation guide and sample scripts on the Meeting Roles page.`;
      }
    }
    if(/next meeting|when.*meeting|meeting date/.test(q)) return `${knowledge.meeting?.nextPlanned || "Check the Calendar page for the next meeting."} See the Calendar page for the full schedule.`;
    if(/meeting flow|agenda|order of.*meeting|how.*meeting/.test(q)) return `${knowledge.meeting?.flow || "See the Meetings page for the club meeting flow."}`;
    if(/pathway|which path|find.*path|pathways/.test(q)) return `The club’s Find Your Path assessment compares the six currently offered core paths: Dynamic Leadership, Engaging Humor, Motivational Strategies, Persuasive Influence, Presentation Mastery, and Visionary Communication. Open Pathways & Speeches and take the identifier.`;
    if(/mentor|mentoring|mentorship/.test(q)) return knowledge.mentoring || "Visit the Mentorship page for club mentoring support.";
    if(/golden buzzer|recognition|award|member of the month/.test(q)) return `Club recognition includes ${(knowledge.recognition||[]).join(", ")}. Visit the Recognition page for the criteria and process.`;
    if(/join|membership|become.*member/.test(q)) return "Open the Join Us page and complete the club interest form. A club leader can then follow up with next steps.";
    if(/speech submission|submit.*speech|speech form/.test(q)) return "Use the Speech Submission link in the Member Hub or Pathways page. Protected club resources may require your Friendship Google login.";
    if(/role sign|sign.*role|volunteer.*role/.test(q)) return "Use the Role Sign-Up link on the Meeting Roles or Member Hub page. The sign-up sheet may require your Friendship Google login.";
    return "I can help with club meetings, roles, scripts, Pathways, mentoring, recognition, onboarding, resources, and common member questions. Try asking something like “What do I say when I introduce the Timer role?” or “Which Pathways path fits me?”";
  }

  function installAssistant(){
    let launch=document.querySelector(".club-ai-launch");
    if(!launch){
      launch=document.createElement("button");
      launch.type="button"; launch.className="club-ai-launch"; launch.innerHTML='<span aria-hidden="true">✦</span><span>Ask the Club</span>';
      launch.setAttribute("aria-label","Open Friendship Speaker’s Circle assistant");
      document.body.appendChild(launch);
    }

    let panel=document.querySelector(".club-ai-panel");
    if(!panel){
      panel=document.createElement("aside");
      panel.className="club-ai-panel"; panel.setAttribute("aria-hidden","true");
      panel.innerHTML=`<div class="club-ai-head"><div><strong>Ask Friendship Speaker’s Circle</strong><span>Member question assistant</span></div><button class="icon-button" type="button" data-ai-close aria-label="Close assistant">×</button></div>
        <div class="club-ai-messages" aria-live="polite"><div class="ai-message assistant">Hi! Ask me about meetings, roles, scripts, Pathways, mentoring, recognition, or club resources.</div></div>
        <form class="club-ai-form"><label class="sr-only" for="club-ai-input">Ask a club question</label><textarea id="club-ai-input" rows="2" placeholder="Ask a member question…" required></textarea><button type="submit">Ask</button></form>
        <div class="club-ai-note">Club guidance only. Verify official Pathways requirements with Toastmasters International. Do not enter confidential member information.</div>`;
      document.body.appendChild(panel);
    }
    const messages=panel.querySelector(".club-ai-messages"), form=panel.querySelector("form"), input=panel.querySelector("textarea");
    const closeBtn=panel.querySelector("[data-ai-close]");
    if(!messages || !form || !input || !closeBtn) return;
    function open(){panel.classList.add("open");panel.setAttribute("aria-hidden","false");setTimeout(()=>input.focus(),30)}
    function close(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true")}
    function add(text,who){const d=document.createElement("div");d.className=`ai-message ${who}`;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight;return d}
    if(!launch.dataset.aiBound){launch.addEventListener("click",open);launch.dataset.aiBound="1";}
    if(!closeBtn.dataset.aiBound){closeBtn.addEventListener("click",close);closeBtn.dataset.aiBound="1";}
    if(!form.dataset.aiBound){
      form.addEventListener("submit",async e=>{
        e.preventDefault(); const question=input.value.trim(); if(!question)return; add(question,"user"); input.value=""; const waiting=add("Thinking…","assistant waiting");
        try{
          const resp=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question})});
          if(!resp.ok) throw new Error("AI endpoint unavailable");
          const data=await resp.json(); waiting.textContent=data.answer || localClubAnswer(question); waiting.classList.remove("waiting");
        }catch(err){ waiting.textContent=localClubAnswer(question); waiting.classList.remove("waiting"); }
      });
      form.dataset.aiBound="1";
    }
  }

  // ---------- Copy sample scripts ----------
  document.addEventListener("click",async e=>{
    const btn=e.target.closest("[data-copy-script]"); if(!btn)return;
    const target=document.getElementById(btn.getAttribute("data-copy-script")); if(!target)return;
    try{await navigator.clipboard.writeText(target.innerText.trim()); const old=btn.textContent; btn.textContent="Copied"; setTimeout(()=>btn.textContent=old,1400);}catch(_){ }
  });

  // ---------- Pathways Identifier ----------
  function installPathfinder(){
    const form=document.getElementById("pathfinder-form"); if(!form)return;
    const result=document.getElementById("pathfinder-result");
    const descriptions={
      DL:"Dynamic Leadership — a strong fit if you want to strengthen strategic leadership, conflict navigation, and leading through complex situations.",
      EH:"Engaging Humor — a strong fit if you want to use humor more effectively and build an entertaining, audience-aware speaking style.",
      MS:"Motivational Strategies — a strong fit if you want to motivate people, build connections, and lead teams toward shared goals.",
      PI:"Persuasive Influence — a strong fit if you want to improve persuasion, negotiation, interpersonal communication, and leadership in challenging situations.",
      PM:"Presentation Mastery — a strong fit if your priority is becoming a more polished, confident, audience-connected public speaker.",
      VC:"Visionary Communication — a strong fit if you want to communicate a vision, inspire others, plan strategically, and lead change."
    };
    form.addEventListener("submit",e=>{
      e.preventDefault(); const fd=new FormData(form); const scores={DL:0,EH:0,MS:0,PI:0,PM:0,VC:0}; let answered=0;
      for(const [key,val] of fd.entries()){ if(key.startsWith("q")){answered++; String(val).split("+").forEach(code=>{ if(scores[code]!==undefined)scores[code]++; });} }
      if(answered<10){ result.hidden=false; result.innerHTML=`<h3>Almost there</h3><p>Please answer all 10 questions so the recommendation reflects your full set of goals.</p>`; result.scrollIntoView({behavior:"smooth",block:"center"}); return; }
      const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]); const first=ranked[0][0], second=ranked[1][0];
      result.hidden=false; result.innerHTML=`<div class="eyebrow">Your Friendship Speaker’s Circle recommendation</div><h3>${descriptions[first].split(" — ")[0]}</h3><p>${descriptions[first].split(" — ")[1]}</p><div class="path-secondary"><strong>Also explore:</strong> ${descriptions[second]}</div><p class="path-disclaimer">This is a club-built reflection tool, not an official Toastmasters assessment. Use Toastmasters International as the source of truth before enrolling in a path.</p>`;
      result.scrollIntoView({behavior:"smooth",block:"center"});
    });
    const reset=form.querySelector("[type=reset]"); if(reset)reset.addEventListener("click",()=>{result.hidden=true;result.innerHTML="";});
  }

  installSearch();
  installAssistant();
  installPathfinder();
})();
