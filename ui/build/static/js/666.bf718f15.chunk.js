"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[666,8881,5304],{38881:(e,t,i)=>{i.r(t),i.d(t,{default:()=>u});var n=i(28915),o=i(53799),d=i(13015),l=i(98329),s=i(65200),a=i(51588),c=i(81801),r=i(76812),v=i(48058),_=i(68179);const u=({data:e,isAdmin:t,objectInfo:i,revisionList:u})=>{const{t:j}=(0,a.B)("translation",{keyPrefix:"timeline"}),[h,y]=(0,n.useState)(!1),[b,m]=(0,n.useState)({new_revision:{},old_revision:{}});return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)("tr",{children:[(0,_.jsxs)("td",{children:[(0,_.jsx)(c.H0,{time:e.created_at}),(0,_.jsx)("br",{}),e.cancelled_at>0&&(0,_.jsx)(c.H0,{time:e.cancelled_at})]}),(0,_.jsxs)("td",{className:"text-nowrap",children:[("rollback"===e.activity_type||"edited"===e.activity_type||"asked"===e.activity_type||"created"===e.activity_type||"answer"===i.object_type&&"answered"===e.activity_type)&&(0,_.jsxs)(o.A,{onClick:()=>(async e=>{if(!h){const t=null===u||void 0===u?void 0:u.find((t=>t.revision_id===e));let i;if((null===u||void 0===u?void 0:u.length)>0&&t){const e=u.indexOf(t)||0;i=e===u.length-1?0:u[e+1].revision_id}const n=await(0,v.Dh)({new_revision_id:e,old_revision_id:i});m(n)}y(!h)})(e.revision_id),variant:"link",className:"text-body p-0 btn-no-border",children:[(0,_.jsx)(c.In,{name:"caret-right-fill",className:"me-1 "+(h?"rotate-90-deg":"rotate-0-deg")}),j(e.activity_type)]}),"accept"===e.activity_type&&(0,_.jsx)(s.N_,{to:`/questions/${i.question_id}/${null===e||void 0===e?void 0:e.object_id}`,children:j(e.activity_type)}),"question"===i.object_type&&"answered"===e.activity_type&&(0,_.jsx)(s.N_,{to:`/questions/${i.question_id}/${e.object_id}`,children:j(e.activity_type)}),"commented"===e.activity_type&&(0,_.jsx)(s.N_,{to:"answer"===i.object_type?`/questions/${i.question_id}/${i.answer_id}?commentId=${e.object_id}`:`/questions/${i.question_id}?commentId=${e.object_id}`,children:j(e.activity_type)}),r.Hn.includes(e.activity_type)&&(0,_.jsx)("div",{children:j(e.activity_type)}),e.cancelled&&(0,_.jsx)("div",{className:"text-danger",children:j("cancelled")})]}),(0,_.jsx)("td",{children:"downvote"!==e.activity_type||t?(0,_.jsx)(c.fZ,{className:"fs-normal",data:null===e||void 0===e?void 0:e.user_info,showAvatar:!1,showReputation:!1}):(0,_.jsx)("div",{children:j("n_or_a")})}),(0,_.jsx)("td",{children:(0,_.jsx)("div",{dangerouslySetInnerHTML:{__html:e.comment}})})]}),(0,_.jsx)("tr",{className:h?"":"d-none",children:(0,_.jsx)("td",{colSpan:5,className:"p-0 py-5",children:(0,_.jsx)(d.A,{className:"justify-content-center",children:(0,_.jsx)(l.A,{xxl:8,children:(0,_.jsx)(c.V$,{objectType:i.object_type,newData:null===b||void 0===b?void 0:b.new_revision,oldData:null===b||void 0===b?void 0:b.old_revision})})})})})]})}},80666:(e,t,i)=>{i.r(t),i.d(t,{default:()=>y});var n=i(28915),o=i(46261),d=i(22807),l=i(18596),s=i(65200),a=i(51588),c=i(47185),r=i(34202),v=i(24978),_=i(48058),u=i(81801),j=i(38881),h=(i(25304),i(68179));const y=()=>{var e,t,i,y;const{t:b}=(0,a.B)("translation",{keyPrefix:"timeline"}),{qid:m="",aid:x="",tid:f=""}=(0,l.g)(),{role_id:p}=(0,v.bb)((e=>e.user)),[w,g]=(0,n.useState)(!1),[N,q]=(0,n.useState)(!1),[$,k]=(0,n.useState)(),I=e=>{q(!0),(0,_.Cy)({object_id:f||x||m,show_vote:e}).then((e=>{k(e)})).finally((()=>{q(!1)}))};(0,n.useEffect)((()=>{I(!1)}),[]);let A="",C="";"question"===(null===$||void 0===$?void 0:$.object_info.object_type)&&(A=r.w.questionLanding(null===$||void 0===$?void 0:$.object_info.question_id,null===$||void 0===$?void 0:$.object_info.url_title),C=`${b("title_for_question")} ${null===$||void 0===$?void 0:$.object_info.title}`),"answer"===(null===$||void 0===$?void 0:$.object_info.object_type)&&(A=r.w.answerLanding({questionId:null===$||void 0===$?void 0:$.object_info.question_id,slugTitle:null===$||void 0===$?void 0:$.object_info.url_title,answerId:null===$||void 0===$?void 0:$.object_info.answer_id}),C=`${b("title_for_answer",{title:null===$||void 0===$?void 0:$.object_info.title,author:null===$||void 0===$?void 0:$.object_info.display_name})}`),"tag"===(null===$||void 0===$?void 0:$.object_info.object_type)&&(A=`/tags/${null!==$&&void 0!==$&&$.object_info.main_tag_slug_name?encodeURIComponent(null===$||void 0===$?void 0:$.object_info.main_tag_slug_name):encodeURIComponent(null===$||void 0===$?void 0:$.object_info.title)}`,C=`${b("title_for_tag")} '${null===$||void 0===$?void 0:$.object_info.title}'`);const S=(null===$||void 0===$||null===(e=$.timeline)||void 0===e?void 0:e.filter((e=>e.revision_id>0)))||[];return(0,c.M4)({title:C}),(0,h.jsxs)("div",{className:"py-4 mb-5",children:[(0,h.jsxs)("h5",{className:"mb-4",children:["tag"===(null===$||void 0===$?void 0:$.object_info.object_type)?b("tag_title"):b("title")," ",(0,h.jsx)(s.N_,{to:A,children:null===$||void 0===$||null===(t=$.object_info)||void 0===t?void 0:t.title})]}),"tag"!==(null===$||void 0===$?void 0:$.object_info.object_type)&&(0,h.jsx)(o.A.Check,{className:"mb-4",type:"switch",id:"custom-switch",label:b("show_votes"),checked:w,onChange:e=>{return t=e.target.checked,g(t),void I(t);var t}}),(0,h.jsxs)(d.A,{hover:!0,responsive:!0,children:[(0,h.jsx)("thead",{children:(0,h.jsxs)("tr",{children:[(0,h.jsx)("th",{style:{width:"20%"},children:b("datetime")}),(0,h.jsx)("th",{style:{width:"15%"},children:b("type")}),(0,h.jsx)("th",{style:{width:"19%"},children:b("by")}),(0,h.jsx)("th",{className:"min-w-15",children:b("comment")})]})}),(0,h.jsx)("tbody",{children:null===$||void 0===$||null===(i=$.timeline)||void 0===i?void 0:i.map((e=>(0,h.jsx)(j.default,{data:e,objectInfo:null===$||void 0===$?void 0:$.object_info,isAdmin:2===p,revisionList:S},e.activity_id)))})]}),!N&&Number(null===$||void 0===$||null===(y=$.timeline)||void 0===y?void 0:y.length)<=0&&(0,h.jsx)(u.Sv,{children:b("no_data")})]})}},25304:(e,t,i)=>{i.r(t),i.d(t,{default:()=>n});const n={}}}]);
//# sourceMappingURL=666.bf718f15.chunk.js.map