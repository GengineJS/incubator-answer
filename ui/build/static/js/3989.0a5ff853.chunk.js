"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[3989],{13989:(e,a,l)=>{l.r(a),l.d(a,{default:()=>u});var i=l(28915),t=l(46261),r=l(53799),n=l(51588),o=l(48058),s=l(4440),c=l(25831),d=l(68179);const m=({callback:e})=>{const{t:a}=(0,n.B)("translation",{keyPrefix:"account_forgot"}),[l,m]=(0,i.useState)({e_mail:{value:"",isInvalid:!1,errorMsg:""}}),u=(0,c.T5)("email"),v=a=>{a&&a.preventDefault();const i={e_mail:l.e_mail.value},t=null===u||void 0===u?void 0:u.getCaptcha();null!==t&&void 0!==t&&t.verify&&(i.captcha_code=t.captcha_code,i.captcha_id=t.captcha_id),(0,o.xw)(i).then((async()=>{await(null===u||void 0===u?void 0:u.close()),null===e||void 0===e||e(2,l.e_mail.value)})).catch((e=>{if(e.isError){null===u||void 0===u||u.handleCaptchaError(e.list);const a=(0,s.NC)(e,l);m({...a});const i=document.getElementById(e.list[0].error_field);(0,s.qt)(i)}}))};return(0,d.jsxs)(t.A,{noValidate:!0,onSubmit:async e=>{e.preventDefault(),e.stopPropagation(),(()=>{let e=!0;if(l.e_mail.value||(e=!1,l.e_mail={value:"",isInvalid:!0,errorMsg:a("email.msg.empty")}),m({...l}),!e){const e=document.getElementById("email");(0,s.qt)(e)}return e})()&&(u?u.check((()=>{v()})):v())},autoComplete:"off",children:[(0,d.jsxs)(t.A.Group,{controlId:"email",className:"mb-3",children:[(0,d.jsx)(t.A.Label,{children:a("email.label")}),(0,d.jsx)(t.A.Control,{required:!0,type:"email",value:l.e_mail.value,isInvalid:l.e_mail.isInvalid,onChange:e=>{var a;a={e_mail:{value:e.target.value,isInvalid:!1,errorMsg:""}},m({...l,...a})}}),(0,d.jsx)(t.A.Control.Feedback,{type:"invalid",children:l.e_mail.errorMsg})]}),(0,d.jsx)("div",{className:"d-grid mb-3",children:(0,d.jsx)(r.A,{variant:"primary",type:"submit",children:a("btn_name")})})]})},u=(0,i.memo)(m)}}]);
//# sourceMappingURL=3989.0a5ff853.chunk.js.map