"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[5190,5026],{75190:(e,s,a)=>{a.r(s),a.d(s,{default:()=>u});var t=a(28915),n=a(99205),l=a(46261),c=a(51588),r=a(24978),o=a(48058),i=a(81801),d=(a(55026),a(68179));const u=({selectedPeople:e=[],visible:s=!1,onSelect:a,saveInviteUsers:u})=>{const{user:h}=(0,r.bb)(),{t:p}=(0,c.B)("translation",{keyPrefix:"invite_to_answer"}),[m,x]=(0,t.useState)([]),[v,f]=(0,t.useState)(-1),[g,j]=(0,t.useState)(""),k=s=>{s?(0,o.c5)(s).then((s=>{(s=>{const a=[];s.forEach((s=>{h&&1===h.role_id&&h.username===s.username||null!==e&&void 0!==e&&e.find((e=>e.username===s.username))||a.push(s)})),x([...e,...a])})(s)})):x([...e])},b=e=>{if(e<0||e>=m.length)return;const s=m[e];s&&a(s)};return(0,t.useEffect)((()=>{s&&e.length>0&&x(e),s||(f(-1),j(""),x([]))}),[s]),s?(0,d.jsx)(n.A,{autoClose:"outside",show:!0,className:"people-dropdown",onSelect:b,onKeyDown:e=>{if(e.stopPropagation(),null===m||void 0===m||!m.length)return;const{keyCode:s}=e;38===s&&v>0&&f(v-1),40===s&&v<m.length-1&&f(v+1),13===s&&v>-1&&(e.preventDefault(),b(v))},onToggle:e=>{e||u()},children:(0,d.jsxs)(n.A.Menu,{renderOnMount:!0,show:!0,className:"w-100 py-0 position-relative",children:[(0,d.jsx)("div",{className:"p-3",children:(0,d.jsx)(l.A.Control,{type:"search",autoFocus:!0,placeholder:p("search"),value:g,onChange:e=>{const s=e.target.value;j(s),k(s)}})}),(0,d.jsx)("div",{className:""+(m.length>0?"py-2 border-top":""),children:m.map(((s,a)=>(0,d.jsx)(n.A.Item,{eventKey:a,onFocus:()=>{f(a)},active:a===v,children:(0,d.jsxs)(l.A.Check,{type:"checkbox",id:s.username,className:"position-relative",children:[(0,d.jsx)(l.A.Check.Input,{type:"checkbox",tabIndex:-1,checked:Boolean(null===e||void 0===e?void 0:e.find((e=>e.id===s.id))),onChange:()=>{}}),(0,d.jsx)("div",{className:"check-cover"}),(0,d.jsxs)(l.A.Check.Label,{className:"d-flex align-items-center text-nowrap",children:[(0,d.jsx)(i.eu,{avatar:s.avatar,size:"24",alt:s.display_name,className:"rounded-1"}),(0,d.jsxs)("div",{className:"d-flex flex-wrap text-truncate",children:[(0,d.jsx)("span",{className:"ms-2 text-truncate",children:s.display_name}),(0,d.jsxs)("small",{className:"text-secondary text-truncate ms-2",children:["@",s.username]})]})]})]})},s.username)))})]})}):null}},55026:(e,s,a)=>{a.r(s),a.d(s,{default:()=>t});const t={}}}]);
//# sourceMappingURL=5190.2870914d.chunk.js.map