"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[2842,1936],{12455:(e,t,i)=>{i.r(t),i.d(t,{default:()=>m});var n=i(28915),s=i(99205),l=i(53799),a=i(51588),r=i(81801),o=i(48058),d=i(47185),c=i(25831),u=i(44790),v=i(68179);const m=({itemData:e,objectType:t,curFilter:i,approveCallback:m})=>{const{t:x}=(0,a.B)("translation",{keyPrefix:"page_review"}),[f,h]=(0,n.useState)(!1),[g,_]=(0,n.useState)(!1),p=(0,d.TS)(m),j=(0,d.dj)(),y=(0,c.T5)("delete"),b=()=>{_(!g)},k=()=>{const i={operation_type:"delete_post",flag_id:String(null===e||void 0===e?void 0:e.flag_id),captcha_code:void 0,captcha_id:void 0};null===y||void 0===y||y.resolveCaptchaReq(i),delete i.captcha_code,delete i.captcha_id,(0,o.gI)(i).then((async()=>{await(null===y||void 0===y?void 0:y.close());let e="";"question"===t&&(e=x("post_deleted",{keyPrefix:"messages"})),"answer"===t&&(e=x("tip_answer_deleted")),"answer"!==t&&"question"!==t||j.onShow({msg:e,variant:"success"}),m()})).catch((e=>{e.isError&&(null===y||void 0===y||y.handleCaptchaError(e.list))})).finally((()=>{h(!1)}))},w=i=>{if("delete"===i&&(()=>{let i="";h(!0),"question"===t&&(i=Number(null===e||void 0===e?void 0:e.answer_count)>0?x("question",{keyPrefix:"delete"}):x("other",{keyPrefix:"delete"})),"answer"===t&&(i=null!==e&&void 0!==e&&e.answer_accepted?x("answer_accepted",{keyPrefix:"delete"}):x("other",{keyPrefix:"delete"})),"comment"===t&&(i=x("other",{keyPrefix:"delete"})),r.aF.confirm({title:x("title",{keyPrefix:"delete"}),content:i,cancelBtnVariant:"link",confirmBtnVariant:"danger",confirmText:x("delete",{keyPrefix:"btns"}),onConfirm:()=>{y?y.check((()=>k())):k()},onCancel:()=>{h(!1)}})})(),"close"===i&&p.onShow({type:"question",id:(null===e||void 0===e?void 0:e.flag_id)||"",action:"close",source:"review",content:null===e||void 0===e?void 0:e.reason_content,reportType:(null===e||void 0===e?void 0:e.reason.reason_type)||-1}),"unlist"===i){const t="question_detail.unlist";r.aF.confirm({title:x("title",{keyPrefix:t}),content:x("content",{keyPrefix:t}),cancelBtnVariant:"link",confirmText:x("confirm_btn",{keyPrefix:t}),onConfirm:()=>{(0,o.gI)({operation_type:"unlist_post",flag_id:(null===e||void 0===e?void 0:e.flag_id)||""}).then((()=>{j.onShow({msg:x(`post_${i}`,{keyPrefix:"messages"}),variant:"success"}),m()}))}})}};return(0,v.jsxs)("div",{children:[(0,v.jsxs)(s.A,{children:[(0,v.jsx)(s.A.Toggle,{as:l.A,disabled:f,variant:"outline-primary",id:"dropdown-basic",children:x("approve",{keyPrefix:"btns"})}),(0,v.jsxs)(s.A.Menu,{children:[(0,v.jsx)(s.A.Item,{onClick:()=>{b()},children:x("edit_post")}),"normal"===i&&"question"===t&&(0,v.jsx)(s.A.Item,{onClick:()=>w("close"),children:x("close",{keyPrefix:"btns"})}),"deleted"!==i&&(0,v.jsx)(s.A.Item,{onClick:()=>w("delete"),children:x("delete",{keyPrefix:"btns"})}),"question"===t&&(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(s.A.Divider,{}),2!==(null===e||void 0===e?void 0:e.object_show_status)&&(0,v.jsx)(s.A.Item,{onClick:()=>w("unlist"),children:x("unlist_post")})]})]})]}),(0,v.jsx)(u.default,{visible:g,handleClose:b,objectType:t,originalData:{flag_id:(null===e||void 0===e?void 0:e.flag_id)||"",id:(null===e||void 0===e?void 0:e.object_id)||"",title:(null===e||void 0===e?void 0:e.title)||"",content:(null===e||void 0===e?void 0:e.original_text)||"",tags:(null===e||void 0===e?void 0:e.tags)||[],question_id:(null===e||void 0===e?void 0:e.question_id)||"",answer_id:(null===e||void 0===e?void 0:e.answer_id)||""},callback:m})]})}},44790:(e,t,i)=>{i.r(t),i.d(t,{default:()=>g});var n=i(28915),s=i(97095),l=i(46261),a=i(53799),r=i(51588),o=i(14577),d=i.n(o),c=i(48058),u=i(47185),v=i(25831),m=i(81801),x=i(4440),f=(i(36990),i(68179));const h={title:{value:"",isInvalid:!1,errorMsg:""},tags:{value:[],isInvalid:!1,errorMsg:""},content:{value:"",isInvalid:!1,errorMsg:""}},g=({originalData:e,visible:t=!1,objectType:i,handleClose:o,callback:g})=>{const{t:_}=(0,r.B)("translation",{keyPrefix:"ask"}),[p,j]=(0,n.useState)(h),[y,b]=(0,n.useState)(!1),[k,w]=(0,n.useState)(!1),A=(0,u.L7)(),I=(0,v.T5)("edit"),C=e=>{e&&(null===g||void 0===g||g()),j(h),o(),w(!1)},P=e=>{k&&j({...p,...e})},N=()=>{const t={title:p.title.value,content:p.content.value,tags:p.tags.value,operation_type:"edit_post",flag_id:e.flag_id};if("answer"===i&&(delete t.title,delete t.tags),"comment"===i){const{value:e}=p.content,i=(0,x.by)(e);t.content=i,delete t.title,delete t.tags}if("question"===i){const e=null===I||void 0===I?void 0:I.getCaptcha();null!==e&&void 0!==e&&e.verify&&(t.captcha_code=e.captcha_code,t.captcha_id=e.captcha_id)}(0,c.gI)(t).then((async()=>{await(null===I||void 0===I?void 0:I.close()),C(!0)})).catch((e=>{if(e.isError){null===I||void 0===I||I.handleCaptchaError(e.list);const t=(0,x.NC)(e,p);j({...t});const i=document.getElementById(e.list[0].error_field);(0,x.qt)(i)}}))};return(0,n.useEffect)((()=>{t&&(p.title.value=e.title,p.content.value=e.content,p.tags.value=e.tags.map((e=>({...e,parsed_text:"",original_text:""}))),j({...p}),w(!0))}),[t]),(0,f.jsxs)(s.A,{show:t,onHide:()=>C(!1),className:"w-100",dialogClassName:"edit-post-modal",children:[(0,f.jsx)(s.A.Header,{closeButton:!0,children:(0,f.jsx)(s.A.Title,{children:_("edit_post",{keyPrefix:"page_review"})})}),(0,f.jsxs)(l.A,{noValidate:!0,onSubmit:e=>{e.preventDefault(),e.stopPropagation(),(()=>{let e=!0;const{title:t,tags:n,content:s}=p;if("question"===i&&(t.value||(e=!1,p.title={value:t.value,isInvalid:!0,errorMsg:_("form.fields.title.msg.empty",{keyPrefix:"ask"})}),n.value.length||(e=!1,p.tags={value:n.value,isInvalid:!0,errorMsg:_("form.fields.tags.msg.empty",{keyPrefix:"ask"})})),!s.value||Array.from(s.value.trim()).length<6?(e=!1,p.content={value:s.value,isInvalid:!0,errorMsg:_("form.fields.answer.feedback.characters",{keyPrefix:"edit_answer"})}):p.content={value:s.value,isInvalid:!1,errorMsg:""},j({...p}),!e){const e=Object.keys(p).filter((e=>p[e].isInvalid)),t=document.getElementById(e[0]);(0,x.qt)(t)}return e})()&&(I?I.check((()=>N())):N())},children:[(0,f.jsxs)(s.A.Body,{children:["question"===i&&(0,f.jsxs)(l.A.Group,{controlId:"title",className:"mb-3",children:[(0,f.jsx)(l.A.Label,{children:_("form.fields.title.label")}),(0,f.jsx)(l.A.Control,{type:"text",value:p.title.value,isInvalid:p.title.isInvalid,onChange:e=>{P({title:{value:e.target.value,isInvalid:!1,errorMsg:""}})},placeholder:_("form.fields.title.placeholder"),autoFocus:!0,contentEditable:!0}),(0,f.jsx)(l.A.Control.Feedback,{type:"invalid",children:p.title.errorMsg})]}),"comment"!==i&&(0,f.jsxs)(l.A.Group,{controlId:"body",children:[(0,f.jsx)(l.A.Label,{children:_("question"===i?"form.fields.body.label":"form.fields.answer.label")}),(0,f.jsx)(l.A.Control,{defaultValue:p.content.value,isInvalid:p.content.isInvalid,hidden:!0}),(0,f.jsx)(m.KE,{value:p.content.value,onChange:e=>{P({content:{value:e,errorMsg:"",isInvalid:!1}})},className:d()("form-control p-0",y?"focus":""),onFocus:()=>{b(!0)},onBlur:()=>{b(!1)}}),(0,f.jsx)(l.A.Control.Feedback,{type:"invalid",children:p.content.errorMsg})]}),"question"===i&&(0,f.jsxs)(l.A.Group,{controlId:"tags",className:"my-3",children:[(0,f.jsx)(l.A.Label,{children:_("form.fields.tags.label")}),(0,f.jsx)(l.A.Control,{defaultValue:JSON.stringify(p.tags.value),isInvalid:p.tags.isInvalid,hidden:!0}),(0,f.jsx)(m.Cx,{value:p.tags.value,onChange:e=>{P({tags:{value:e,errorMsg:"",isInvalid:!1}})},showRequiredTag:!0,maxTagLength:5}),(0,f.jsx)(l.A.Control.Feedback,{type:"invalid",children:p.tags.errorMsg})]}),"comment"===i&&(0,f.jsxs)("div",{className:"w-100",children:[(0,f.jsxs)("div",{className:d()("custom-form-control",{"is-invalid":p.content.isInvalid}),children:[(0,f.jsx)(l.A.Label,{children:"Comment"}),(0,f.jsx)(m.MW,{pageUsers:A.getUsers(),onSelected:e=>{k&&j({...p,content:{value:e,errorMsg:"",isInvalid:!1}})},children:(0,f.jsx)(m.fs,{size:"sm",rows:4,value:(0,x.$t)(p.content.value),onChange:e=>{P({content:{value:e.target.value,errorMsg:"",isInvalid:!1}})}})})]}),(0,f.jsx)(l.A.Control.Feedback,{type:"invalid",children:p.content.errorMsg})]})]}),(0,f.jsxs)(s.A.Footer,{children:[(0,f.jsx)(a.A,{variant:"secondary",onClick:()=>C(!1),children:_("close",{keyPrefix:"btns"})}),(0,f.jsx)(a.A,{variant:"primary",type:"submit",children:_("submit",{keyPrefix:"btns"})})]})]})]})}},12842:(e,t,i)=>{i.r(t),i.d(t,{default:()=>p});var n=i(28915),s=i(16413),l=i(83556),a=i(10808),r=i(53799),o=i(51588),d=i(65200),c=i(14577),u=i.n(c),v=i(48058),m=i(81801),x=i(4440),f=i(76812),h=i(12455),g=i(41936),_=i(68179);const p=({refreshCount:e})=>{var t,i,c,p,j;const{t:y}=(0,o.B)("translation",{keyPrefix:"page_review"}),b=(0,n.useRef)(null),[k,w]=(0,n.useState)(!1),[A,I]=(0,n.useState)(!1),[C,P]=(0,n.useState)(1),[N,q]=(0,n.useState)(),S=null===N||void 0===N?void 0:N.list[0],T=e=>{(0,v.Vf)(e).then((t=>{((e,t)=>{const{count:i,list:n=[]}=e;if(!n.length&&i&&1!==C)return P(t=1),void T(t);t!==C&&P(t),q(e),n.length||w(!0),setTimeout((()=>{(0,x.Mv)()}),150)})(t,e)})).catch((e=>{console.error("review next error: ",e)}))};(0,n.useEffect)((()=>{T(C)}),[]);(0,n.useEffect)((()=>{b.current&&setTimeout((()=>{(0,m._A)(b.current)}),70)}),[b.current]);const{object_type:M,submitter_user:F,author_user_info:L,object_status:B,reason:E}=S||{object_type:"",submitter_user:null,author_user_info:null,reason:null,object_status:0},{itemLink:V,itemId:D,itemTimePrefix:H}=(0,g.default)(S);return k?null:(0,_.jsxs)(s.A,{children:[(0,_.jsx)(s.A.Header,{children:y("user"!==M?"flag_post":"flag_user")}),(0,_.jsxs)(s.A.Body,{className:"p-0",children:[(0,_.jsxs)(l.A,{variant:"info",className:"border-0 rounded-0 mb-0",children:[(0,_.jsxs)(a.A,{direction:"horizontal",gap:1,className:"align-items-center mb-2",children:[(0,_.jsx)(m.fZ,{data:F,avatarSize:"24px",avatarClass:"me-2"}),(null===S||void 0===S?void 0:S.submit_at)&&(0,_.jsx)(m.H0,{time:S.submit_at,className:"small text-secondary",preFix:y("proposed")})]}),(0,_.jsx)(a.A,{className:"align-items-start",children:(0,_.jsxs)("p",{className:"mb-0",children:[y("user"!==M?"flag_post_type":"flag_user_type",{type:null===E||void 0===E?void 0:E.name}),(null===S||void 0===S?void 0:S.reason_content)&&(null===E||void 0===E?void 0:E.content_type)&&(60!==(null===E||void 0===E?void 0:E.reason_type)?(0,_.jsxs)("span",{children:[" ",null===S||void 0===S?void 0:S.reason_content]}):null!==(t=S.reason_content)&&void 0!==t&&t.startsWith("http")?(0,_.jsx)("a",{href:S.reason_content,target:"_blank",className:"alert-exist",rel:"noreferrer",children:(0,_.jsxs)("strong",{children:[" ",y("show_exist",{keyPrefix:"question_detail"})]})}):(0,_.jsxs)("strong",{children:[" ",null===S||void 0===S?void 0:S.reason_content]}))]})})]}),(0,_.jsxs)("div",{className:"p-3",children:[(0,_.jsxs)("small",{className:"d-block text-secondary mb-4",children:[(0,_.jsxs)("span",{children:[y(M,{keyPrefix:"btns"})," "]}),(0,_.jsxs)(d.N_,{to:V,target:"_blank",className:"link-secondary",children:["#",D]})]}),"question"===M&&(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("h5",{className:"mb-3",children:null===S||void 0===S?void 0:S.title}),(0,_.jsx)("div",{className:"mb-4",children:null===S||void 0===S||null===(i=S.tags)||void 0===i?void 0:i.map((e=>(0,_.jsx)(m.vw,{className:"me-1",data:e},e.slug_name)))})]}),(0,_.jsx)("div",{className:"small font-monospace",children:(0,_.jsx)(m.EQ,{children:(0,_.jsx)("article",{ref:b,className:"fmt text-break text-wrap",dangerouslySetInnerHTML:{__html:null===S||void 0===S?void 0:S.parsed_text}})})}),(0,_.jsxs)("div",{className:"d-flex flex-wrap align-items-center justify-content-between mt-4",children:[(0,_.jsxs)("div",{children:[(0,_.jsx)("span",{className:u()("badge",null===(c=f.__[B])||void 0===c?void 0:c.variant),children:y(null===(p=f.__[B])||void 0===p?void 0:p.name,{keyPrefix:"btns"})}),2===(null===S||void 0===S?void 0:S.object_show_status)&&(0,_.jsx)("span",{className:u()("ms-1 badge",f.__.unlisted.variant),children:y(f.__.unlisted.name,{keyPrefix:"btns"})})]}),(0,_.jsxs)("div",{className:"d-flex align-items-center small",children:[(0,_.jsx)(m.fZ,{data:L,avatarSize:"24px",avatarClass:"me-2"}),(0,_.jsx)(m.H0,{time:Number(null===S||void 0===S?void 0:S.created_at),className:"text-secondary ms-1 flex-shrink-0",preFix:y(H,{keyPrefix:"question_detail"})})]})]})]})]}),(0,_.jsxs)(s.A.Footer,{className:"p-3",children:[(0,_.jsx)("p",{children:y("approve_flag_tip")}),(0,_.jsxs)(a.A,{direction:"horizontal",gap:2,children:[(0,_.jsx)(h.default,{objectType:M,itemData:S,curFilter:null===(j=f.__[B])||void 0===j?void 0:j.name,approveCallback:()=>{S&&(e(),T(C))}}),(0,_.jsx)(r.A,{variant:"outline-primary",disabled:A,onClick:()=>{I(!0),(0,v.gI)({operation_type:"ignore_report",flag_id:String(null===S||void 0===S?void 0:S.flag_id)}).then((()=>{e(),T(C)})).finally((()=>{I(!1)}))},children:y("ignore",{keyPrefix:"btns"})}),(0,_.jsx)(r.A,{variant:"outline-primary",disabled:A,onClick:()=>{T(C+1)},children:y("skip",{keyPrefix:"btns"})})]})]})]})}},41936:(e,t,i)=>{i.r(t),i.d(t,{default:()=>s});var n=i(34202);const s=e=>{if(null===e||void 0===e||!e.object_id)return{itemLink:"",itemId:"",itemTimePrefix:""};const{object_type:t="",object_id:i="",question_id:s="",answer_id:l="",comment_id:a="",url_title:r=""}=e;let o="",d="",c="";return"question"===t?(o=n.w.questionLanding(String(i),r),d=String(s),c="asked"):"answer"===t?(o=n.w.answerLanding({questionId:s,slugTitle:r,answerId:String(i)}),d=String(i),c="answered"):"comment"===t&&(o=s&&l?`${n.w.answerLanding({questionId:s,slugTitle:r,answerId:l})}?commentId=${a}`:`${n.w.questionLanding(String(s),r)}?commentId=${a}`,d=String(a),c="commented"),{itemLink:o,itemId:d,itemTimePrefix:c}}},36990:(e,t,i)=>{i.r(t),i.d(t,{default:()=>n});const n={}}}]);
//# sourceMappingURL=2842.7480e9b2.chunk.js.map