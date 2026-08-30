(() => {
  "use strict";
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];

  const pages=[
    ["Home","index.html","next meeting member tools speaking leadership confidence Friendship Speaker's Circle"],
    ["About the Club","about.html","mission vision values community demographics campuses roles why members joined"],
    ["Start Here","start-here.html","new member onboarding first role first speech mentor Ice Breaker"],
    ["Meetings","meetings.html","meeting flow agenda handoff Toastmaster General Evaluator Table Topics"],
    ["Club Calendar","calendar.html","meeting dates board meetings learning labs calendar"],
    ["Meeting Roles & Scripts","roles.html","Timer Grammarian Ah-Counter evaluator Sergeant at Arms Toastmaster Table Topics scripts"],
    ["Pathways & Find Your Path","pathways.html","Pathways quiz assessment Dynamic Leadership Engaging Humor Motivational Strategies Persuasive Influence Presentation Mastery Visionary Communication"],
    ["Mentorship","mentorship.html","mentor mentee coaching onboarding support"],
    ["Member Hub","member-hub.html","role signup speech submission feedback resources tools"],
    ["Recognition","recognition.html","Golden Buzzer Member of the Month awards speech spotlight service growth"],
    ["Leadership","leadership.html","officers president vice president education membership public relations treasurer sergeant at arms"],
    ["Resources","resources.html","resource library flyers media Toastmasters links Pathways roles"],
    ["Join Us","join.html","interest form join membership guest"],
    ["Officer Hub","officer-hub.html","board agendas minutes success plan leadership tracker membership administration"]
  ];

  function ensureSearch(){
    if(qs('.fsc-search-overlay')) return;
    const wrap=document.createElement('div');
    wrap.className='fsc-search-overlay'; wrap.setAttribute('aria-hidden','true');
    wrap.innerHTML=`<div class="fsc-search-dialog" role="dialog" aria-modal="true" aria-label="Search Friendship Speaker’s Circle"><div class="fsc-search-head"><input type="search" placeholder="Search roles, Pathways, meetings, mentoring…" aria-label="Search the website"><button class="fsc-search-close" type="button" aria-label="Close search">×</button></div><div class="fsc-search-results"></div></div>`;
    document.body.appendChild(wrap);
    const input=qs('input',wrap), results=qs('.fsc-search-results',wrap);
    const render=(term='')=>{
      const t=term.trim().toLowerCase();
      const hits=!t?pages.slice(0,8):pages.filter(p=>(p.join(' ')).toLowerCase().includes(t));
      results.innerHTML=hits.length?hits.map(p=>`<a class="fsc-search-result" href="${p[1]}"><strong>${p[0]}</strong><span>${p[2]}</span></a>`).join(''):`<div class="fsc-search-empty">No matching club page yet. Try “Timer,” “Pathways,” “mentor,” or “meeting.”</div>`;
    };
    input.addEventListener('input',()=>render(input.value)); render();
    const close=()=>{wrap.classList.remove('is-open');wrap.setAttribute('aria-hidden','true');};
    qs('.fsc-search-close',wrap).addEventListener('click',close);
    wrap.addEventListener('click',e=>{if(e.target===wrap) close();});
    wrap._open=()=>{wrap.classList.add('is-open');wrap.setAttribute('aria-hidden','false');render(input.value='');setTimeout(()=>input.focus(),20);};
    wrap._close=close;
  }
  function openSearch(){ensureSearch(); qs('.fsc-search-overlay')._open();}
  qsa('.site-search-open').forEach(b=>b.addEventListener('click',openSearch));
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}
    if(e.key==='Escape'){const s=qs('.fsc-search-overlay.is-open'); if(s) s._close(); closeAI();}
  });

  const panel=qs('.club-ai-panel');
  function openAI(){if(!panel)return;panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');setTimeout(()=>qs('#club-ai-input',panel)?.focus(),20);}
  function closeAI(){if(!panel)return;panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');}
  qsa('.club-ai-launch').forEach(b=>b.addEventListener('click',openAI));
  qs('[data-ai-close]')?.addEventListener('click',closeAI);

  function appendAI(text,who='assistant'){
    const box=qs('.club-ai-messages'); if(!box)return null;
    const d=document.createElement('div'); d.className=`ai-message ${who}`; d.textContent=text; box.appendChild(d); box.scrollTop=box.scrollHeight; return d;
  }
  function fallbackAnswer(q){
    const K=window.FSC_CLUB_KNOWLEDGE||{}; const s=q.toLowerCase();
    if(/next.*meeting|when.*meeting|meeting date/.test(s)) return K.nextMeeting||K.meeting;
    if(/timer/.test(s)) return K.timer;
    if(/grammar|word of the day/.test(s)) return K.grammarian;
    if(/ah.?counter|filler/.test(s)) return K.ahcounter;
    if(/general evaluator/.test(s)) return K.generalevaluator;
    if(/speech evaluator|evaluate a speech|evaluator/.test(s)) return K.evaluator;
    if(/table topic/.test(s)) return K.tabletopics;
    if(/toastmaster of the day|tmod|meeting host/.test(s)) return K.toastmaster;
    if(/role|script/.test(s)) return K.roles;
    if(/pathway|find.*path/.test(s)) return K.pathways;
    if(/mentor/.test(s)) return K.mentor;
    if(/golden buzzer|recognition|award/.test(s)) return K.recognition;
    if(/submit.*speech|speech form/.test(s)) return K.speech;
    if(/feedback/.test(s)) return K.feedback;
    if(/join|interest|become.*member/.test(s)) return K.join;
    if(/officer|president|leadership/.test(s)) return K.officer;
    if(/privacy|confidential|student/.test(s)) return K.privacy;
    if(/meeting/.test(s)) return K.meeting;
    return "I can help with club meetings, meeting roles and scripts, Pathways, mentoring, recognition, joining, leadership, and member resources. Try asking a specific club question, such as “What does the Timer say when the GE introduces them?”";
  }
  qs('.club-ai-form')?.addEventListener('submit',async e=>{
    e.preventDefault(); const input=qs('#club-ai-input'); const q=(input?.value||'').trim(); if(!q)return;
    appendAI(q,'user'); input.value=''; const status=appendAI('Checking club guidance…','status');
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})});
      if(!r.ok) throw new Error('offline'); const data=await r.json(); status?.remove(); appendAI(data.answer||data.output||fallbackAnswer(q));
    }catch(err){status?.remove();appendAI(fallbackAnswer(q));}
  });

  qsa('.copy-script').forEach(btn=>btn.addEventListener('click',async()=>{
    const id=btn.getAttribute('data-copy-script'), node=id&&document.getElementById(id); if(!node)return;
    const text=node.innerText.trim();
    try{await navigator.clipboard.writeText(text);}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();}
    const old=btn.textContent;btn.textContent='Copied';btn.classList.add('copied');setTimeout(()=>{btn.textContent=old;btn.classList.remove('copied');},1400);
  }));

  const pathInfo={
    DL:["Dynamic Leadership","A strong fit if you want to become more effective in conflict, change, decision-making, and challenging leadership situations."],
    EH:["Engaging Humor","A strong fit if you want to develop humor, audience connection, storytelling, and a more engaging speaking personality."],
    MS:["Motivational Strategies","A strong fit if you want to motivate others, strengthen teams, build relationships, and grow as a people-centered leader."],
    PI:["Persuasive Influence","A strong fit if you want to influence decisions, negotiate effectively, persuade stakeholders, and lead through complex situations."],
    PM:["Presentation Mastery","A strong fit if your priority is becoming a polished, confident, structured, audience-centered public speaker."],
    VC:["Visionary Communication","A strong fit if you want to communicate strategy, inspire people around a future direction, and lead through vision." ]
  };
  const form=qs('#pathfinder-form');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault(); const fd=new FormData(form); const scores={DL:0,EH:0,MS:0,PI:0,PM:0,VC:0}; let answered=0;
      for(let i=1;i<=10;i++){const v=fd.get('q'+i);if(v){answered++;String(v).split('+').forEach(k=>{if(scores[k]!==undefined)scores[k]++;});}}
      const out=qs('#pathfinder-result'); if(!out)return;
      if(answered<10){out.hidden=false;out.innerHTML=`<h3>Almost there</h3><p>Please answer all 10 questions. You’ve completed ${answered} of 10.</p>`;out.scrollIntoView({behavior:'smooth',block:'center'});return;}
      const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]); const [p,ps]=ranked[0], [s,ss]=ranked[1];
      out.hidden=false; out.innerHTML=`<div class="eyebrow" style="color:#f3c74f">Your primary recommendation</div><h3>${pathInfo[p][0]}</h3><p>${pathInfo[p][1]}</p><div class="secondary"><strong>Also explore: ${pathInfo[s][0]}</strong><p>${pathInfo[s][1]}</p></div><p class="score-note">Friendship Speaker’s Circle recommendation tool — not an official Toastmasters assessment. Verify current program details with Toastmasters International.</p>`;
      out.scrollIntoView({behavior:'smooth',block:'center'});
    });
    form.addEventListener('reset',()=>setTimeout(()=>{const out=qs('#pathfinder-result');if(out){out.hidden=true;out.innerHTML='';}},0));
  }
})();
