(function(){"use strict";window.__pan=window.__pan||{csrfToken:"%_PAN_CSRF_TOKEN_%",routePrefix:"%_PAN_ROUTE_PREFIX_%",observer:null,clickListener:null,mouseoverListener:null,inertiaStartListener:null},window.__pan.observer&&(window.__pan.observer.disconnect(),window.__pan.observer=null),window.__pan.clickListener&&(document.removeEventListener("click",window.__pan.clickListener),window.__pan.clickListener=null),window.__pan.mouseoverListener&&(document.removeEventListener("mouseover",window.__pan.mouseoverListener),window.__pan.mouseoverListener=null),window.__pan.inertiaStartListener&&(document.removeEventListener("inertia:start",window.__pan.inertiaStartListener),window.__pan.inertiaStartListener=null),function(){const p=e=>{const n=new MutationObserver(e);n.observe(document.body,{childList:!0,subtree:!0,attributes:!0}),window.__pan.observer=n};let i=[],a=null,r=[],s=[],u=[];const c=()=>{if(i.length===0)return;const e=i.slice();i=[],navigator.sendBeacon(`/${window.__pan.routePrefix}/events`,new Blob([JSON.stringify({events:e,_token:window.__pan.csrfToken})],{type:"application/json"}))},l=function(){a&&clearTimeout(a),a=setTimeout(c,1e3)},d=function(e,n){const w=e.target.closest("[data-pan]");if(w===null)return;const o=w.getAttribute("data-pan");if(o!==null){if(n==="hover"){if(s.includes(o))return;s.push(o)}if(n==="click"){if(u.includes(o))return;u.push(o)}i.push({type:n,name:o}),l()}},_=function(){document.querySelectorAll("[data-pan]").forEach(n=>{if(n.checkVisibility!==void 0&&!n.checkVisibility())return;const t=n.getAttribute("data-pan");t!==null&&(r.includes(t)||(r.push(t),i.push({type:"impression",name:t})))}),l()};p(function(){r.forEach(e=>{document.querySelector(`[data-pan='${e}']`)===null&&(r=r.filter(t=>t!==e),s=s.filter(t=>t!==e),u=u.filter(t=>t!==e))}),_()}),window.__pan.clickListener=e=>d(e,"click"),document.addEventListener("click",window.__pan.clickListener),window.__pan.mouseoverListener=e=>d(e,"hover"),document.addEventListener("mouseover",window.__pan.mouseoverListener),window.__pan.inertiaStartListener=e=>{r=[],s=[],u=[],_()},document.addEventListener("inertia:start",window.__pan.inertiaStartListener),window.__pan.beforeUnloadListener=function(e){i.length!==0&&c()},window.addEventListener("beforeunload",window.__pan.beforeUnloadListener)}()})();
