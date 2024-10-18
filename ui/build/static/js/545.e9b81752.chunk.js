"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[545,1936],{80545:(e,s,t)=>{t.r(s),t.d(s,{default:()=>p});var i=t(28915),n=t(16413),a=t(83556),l=t(10808),r=t(53799),d=t(51588),o=t(65200),c=t(14577),m=t.n(c),u=t(48058),x=t(81801),v=t(4440),j=t(76812),_=t(41936),h=t(68179);const p=({refreshCount:e})=>{var s,t,c;const[p,b]=(0,o.ok)(),f=p.get("objectId")||"",{t:g}=(0,d.B)("translation",{keyPrefix:"page_review"}),k=(0,i.useRef)(null),[y,N]=(0,i.useState)(!1),[w,I]=(0,i.useState)(!1),[A,S]=(0,i.useState)(1),[P,q]=(0,i.useState)(),T=null===P||void 0===P?void 0:P.list[0],L=(e,s)=>{(0,u.IX)(e,s).then((s=>{((e,s)=>{const{count:t,list:i=[]}=e;if(!i.length&&t&&1!==A)return S(s=1),void L(s,"");s!==A&&S(s),q(e),i.length||N(!0),setTimeout((()=>{(0,v.Mv)()}),150)})(s,e)}))};(0,i.useEffect)((()=>{k.current&&setTimeout((()=>{(0,x._A)(k.current)}),70)}),[k.current]),(0,i.useEffect)((()=>{L(A,f)}),[]);const C=s=>{T&&(I(!0),(0,u.j6)({status:s,review_id:null===T||void 0===T?void 0:T.review_id}).then((()=>{e(),L(A,""),f&&(p.delete("objectId"),b(p))})).finally((()=>{I(!1)})))},{object_type:z,author_user_info:F,object_status:H,reason:$}=T||{object_type:"",author_user_info:null,reason:null,object_status:0},{itemLink:E,itemId:B,itemTimePrefix:M}=(0,_.default)(T);return y?null:(0,h.jsxs)(n.A,{children:[(0,h.jsx)(n.A.Header,{children:g("user"!==z?"queued_post":"queued_post_user")}),(0,h.jsxs)(n.A.Body,{className:"p-0",children:[(0,h.jsxs)(a.A,{variant:"info",className:"border-0 rounded-0 mb-0",children:[(0,h.jsxs)(l.A,{direction:"horizontal",gap:1,className:"align-items-center mb-2",children:[(0,h.jsxs)("div",{className:"small d-flex align-items-center",children:[(0,h.jsx)(x.In,{type:"bi",name:"plugin",size:"24px",className:"me-2 lh-1"}),(0,h.jsx)("span",{children:null===T||void 0===T?void 0:T.submitter_display_name})]}),(null===T||void 0===T?void 0:T.submit_at)&&(0,h.jsx)(x.H0,{time:T.submit_at,className:"small text-secondary",preFix:g("proposed")})]}),(0,h.jsx)(l.A,{className:"align-items-start",children:(0,h.jsx)("p",{className:"mb-0",children:$})})]}),(0,h.jsxs)("div",{className:"p-3",children:[(0,h.jsxs)("small",{className:"d-block text-secondary mb-4",children:[(0,h.jsxs)("span",{children:[g(z,{keyPrefix:"btns"})," "]}),(0,h.jsxs)(o.N_,{to:E,target:"_blank",className:"link-secondary",children:["#",B]})]}),"question"===z&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("h5",{className:"mb-3",children:null===T||void 0===T?void 0:T.title}),(0,h.jsx)("div",{className:"mb-4",children:null===T||void 0===T||null===(s=T.tags)||void 0===s?void 0:s.map((e=>(0,h.jsx)(x.vw,{className:"me-1",data:e},e.slug_name)))})]}),(0,h.jsx)("div",{className:"small font-monospace",children:(0,h.jsx)(x.EQ,{children:(0,h.jsx)("article",{ref:k,className:"fmt text-break text-wrap",dangerouslySetInnerHTML:{__html:null===T||void 0===T?void 0:T.parsed_text}})})}),(0,h.jsxs)("div",{className:"d-flex flex-wrap align-items-center justify-content-between mt-4",children:[(0,h.jsxs)("div",{children:[(0,h.jsx)("span",{className:m()("badge",null===(t=j.__[H])||void 0===t?void 0:t.variant),children:g(null===(c=j.__[H])||void 0===c?void 0:c.name,{keyPrefix:"btns"})}),2===(null===T||void 0===T?void 0:T.object_show_status)&&(0,h.jsx)("span",{className:m()("ms-1 badge",j.__.unlisted.variant),children:g(j.__.unlisted.name,{keyPrefix:"btns"})})]}),(0,h.jsxs)("div",{className:"d-flex align-items-center small",children:[(0,h.jsx)(x.fZ,{data:F,avatarSize:"24",avatarClass:"me-2"}),(0,h.jsx)(x.H0,{time:Number(null===T||void 0===T?void 0:T.created_at),className:"text-secondary ms-1 flex-shrink-0",preFix:g(M,{keyPrefix:"question_detail"})})]})]})]})]}),(0,h.jsxs)(n.A.Footer,{className:"p-3",children:[(0,h.jsx)("p",{children:g("user"!==z?"approve_post_tip":"approve_user_tip")}),(0,h.jsxs)(l.A,{direction:"horizontal",gap:2,children:[(0,h.jsx)(r.A,{variant:"outline-primary",disabled:w,onClick:()=>C("approve"),children:g("approve",{keyPrefix:"btns"})}),(0,h.jsx)(r.A,{variant:"outline-primary",disabled:w,onClick:()=>C("reject"),children:g("reject",{keyPrefix:"btns"})}),(0,h.jsx)(r.A,{variant:"outline-primary",disabled:w,onClick:()=>{L(A+1,""),f&&(p.delete("objectId"),b(p))},children:g("skip",{keyPrefix:"btns"})})]})]})]})}},41936:(e,s,t)=>{t.r(s),t.d(s,{default:()=>n});var i=t(34202);const n=e=>{if(null===e||void 0===e||!e.object_id)return{itemLink:"",itemId:"",itemTimePrefix:""};const{object_type:s="",object_id:t="",question_id:n="",answer_id:a="",comment_id:l="",url_title:r=""}=e;let d="",o="",c="";return"question"===s?(d=i.w.questionLanding(String(t),r),o=String(n),c="asked"):"answer"===s?(d=i.w.answerLanding({questionId:n,slugTitle:r,answerId:String(t)}),o=String(t),c="answered"):"comment"===s&&(d=n&&a?`${i.w.answerLanding({questionId:n,slugTitle:r,answerId:a})}?commentId=${l}`:`${i.w.questionLanding(String(n),r)}?commentId=${l}`,o=String(l),c="commented"),{itemLink:d,itemId:o,itemTimePrefix:c}}}}]);
//# sourceMappingURL=545.e9b81752.chunk.js.map