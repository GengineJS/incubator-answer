"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[9402],{39402:(e,t,n)=>{n.r(t),n.d(t,{default:()=>d});var i=n(99205),r=n(51588),s=n(65200),l=n(81801),o=n(48058),a=n(47185),c=n(68179);const d=({itemData:e,refreshList:t,curFilter:n,show:d,pin:f})=>{const{t:k}=(0,r.B)("translation",{keyPrefix:"delete"}),x=(0,a.TS)(t),m=(0,a.dj)(),u=n=>{if("delete"===n&&l.aF.confirm({title:k("title",{keyPrefix:"delete"}),content:e.answer_count>0?k("question",{keyPrefix:"delete"}):k("other",{keyPrefix:"delete"}),cancelBtnVariant:"link",confirmBtnVariant:"danger",confirmText:k("delete",{keyPrefix:"btns"}),onConfirm:()=>{(0,o.bM)(e.id,"deleted").then((()=>{t()}))}}),"undelete"===n&&l.aF.confirm({title:k("undelete_title"),content:k("undelete_desc"),cancelBtnVariant:"link",confirmBtnVariant:"danger",confirmText:k("undelete",{keyPrefix:"btns"}),onConfirm:()=>{(0,o.bM)(e.id,"available").then((()=>{t()}))}}),"close"===n&&x.onShow({type:"question",id:e.id,action:"close"}),"reopen"===n&&l.aF.confirm({title:k("title",{keyPrefix:"question_detail.reopen"}),content:k("content",{keyPrefix:"question_detail.reopen"}),cancelBtnVariant:"link",confirmText:k("confirm_btn",{keyPrefix:"question_detail.reopen"}),onConfirm:()=>{(0,o.aA)({question_id:e.id}).then((()=>{m.onShow({msg:k("post_reopen",{keyPrefix:"messages"}),variant:"success"}),t()}))}}),"list"===n||"unlist"===n){const i="list"===n?"question_detail.list":"question_detail.unlist";l.aF.confirm({title:k("title",{keyPrefix:i}),content:k("content",{keyPrefix:i}),cancelBtnVariant:"link",confirmText:k("confirm_btn",{keyPrefix:i}),onConfirm:()=>{(0,o.W7)({id:e.id,operation:"list"===n?"show":"hide"}).then((()=>{m.onShow({msg:k(`post_${n}`,{keyPrefix:"messages"}),variant:"success"}),t()}))}})}};return"pending"===n?(0,c.jsx)(s.N_,{to:`/review?type=queued_post&objectId=${e.id}`,className:"btn btn-link p-0",title:k("review",{keyPrefix:"header.nav"}),children:(0,c.jsx)(l.In,{name:"three-dots-vertical"})}):(0,c.jsxs)(i.A,{children:[(0,c.jsx)(i.A.Toggle,{variant:"link",className:"no-toggle p-0",children:(0,c.jsx)(l.In,{name:"three-dots-vertical",title:k("action",{keyPrefix:"admin.answers"})})}),(0,c.jsxs)(i.A.Menu,{children:["normal"===n&&(0,c.jsx)(i.A.Item,{onClick:()=>u("close"),children:k("close",{keyPrefix:"btns"})}),"closed"===n&&(0,c.jsx)(i.A.Item,{onClick:()=>u("reopen"),children:k("reopen",{keyPrefix:"btns"})}),"deleted"!==n?(0,c.jsx)(i.A.Item,{onClick:()=>u("delete"),children:k("delete",{keyPrefix:"btns"})}):(0,c.jsx)(i.A.Item,{onClick:()=>u("undelete"),children:k("undelete",{keyPrefix:"btns"})}),2===d?(0,c.jsx)(i.A.Item,{onClick:()=>u("list"),children:k("list",{keyPrefix:"btns"})}):2!==f&&(0,c.jsx)(i.A.Item,{onClick:()=>u("unlist"),children:k("unlist",{keyPrefix:"btns"})})]})]})}}}]);
//# sourceMappingURL=9402.4482d554.chunk.js.map