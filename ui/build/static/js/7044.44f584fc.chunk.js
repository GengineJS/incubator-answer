"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[7044],{37044:(e,a,t)=>{t.r(a),t.d(a,{default:()=>k});var i=t(28915),l=t(47760),n=t(98329),s=t(46261),r=t(53799),o=t(51588),m=t(31574),c=t(18596),d=t(65200),u=t(81801),v=t(47185),x=t(24978),g=t(48058),p=t(1868),_=t(76812),b=t(4440),h=t(68179);const f=()=>{const{t:e}=(0,o.B)("translation",{keyPrefix:"oauth_bind_email"}),a=(0,c.Zp)(),[t,f]=(0,d.ok)(),k=(0,x.bb)((e=>e.update)),j=t.get("binding_key")||"",[y,A]=(0,i.useState)(!1);(0,v.M4)({title:e("confirm_email",{keyPrefix:"page_title"})});const[C,I]=(0,i.useState)({email:{value:"",isInvalid:!1,errorMsg:""}}),M=e=>{p.A.set(_.Xs,e),(0,g.aV)().then((e=>{k(e),setTimeout((()=>{a("/users/login?status=inactive",{replace:!0})}),0)}))};return(0,i.useEffect)((()=>{j||a("/",{replace:!0})}),[]),(0,h.jsxs)(l.A,{style:{paddingTop:"4rem",paddingBottom:"6rem"},children:[(0,h.jsx)(u.vU,{}),y?(0,h.jsxs)(n.A,{md:6,className:"mx-auto text-center",children:[(0,h.jsx)("p",{children:(0,h.jsx)(m.x,{i18nKey:"inactive.first",values:{mail:C.email.value},components:{bold:(0,h.jsx)("strong",{})}})}),(0,h.jsx)("p",{children:e("info",{keyPrefix:"inactive"})})]}):(0,h.jsxs)(n.A,{className:"mx-auto",md:6,lg:4,xl:3,children:[(0,h.jsx)("div",{className:"text-center mb-5",children:e("subtitle")}),(0,h.jsxs)(s.A,{noValidate:!0,onSubmit:a=>{a.preventDefault(),a.stopPropagation(),(()=>{let a=!0;if(C.email.value||(a=!1,C.email={value:"",isInvalid:!0,errorMsg:e("email.msg.empty")}),I({...C}),!a){const e=document.getElementById("email");(0,b.qt)(e)}return a})()&&j&&(0,g.LH)({binding_key:j,email:C.email.value,must:!1}).then((a=>{a.email_exist_and_must_be_confirmed&&u.aF.confirm({title:e("modal_title"),content:e("modal_content"),cancelText:e("modal_cancel"),confirmText:e("modal_confirm"),onConfirm:()=>{(0,g.LH)({binding_key:j,email:C.email.value,must:!0}).then((e=>{e.access_token?M(e.access_token):(t.delete("binding_key"),f(""),A(!0))}))},onCancel:()=>{I({email:{value:"",isInvalid:!1,errorMsg:""}})}}),a.access_token&&M(a.access_token)})).catch((e=>{if(e.isError){const a=(0,b.NC)(e,C);I({...a});const t=document.getElementById(e.list[0].error_field);(0,b.qt)(t)}}))},autoComplete:"off",children:[(0,h.jsxs)(s.A.Group,{controlId:"email",className:"mb-3",children:[(0,h.jsx)(s.A.Label,{children:e("email.label")}),(0,h.jsx)(s.A.Control,{required:!0,type:"email",value:C.email.value,isInvalid:C.email.isInvalid,onChange:e=>{var a;a={email:{value:e.target.value,isInvalid:!1,errorMsg:""}},I({...C,...a})}}),(0,h.jsx)(s.A.Control.Feedback,{type:"invalid",children:C.email.errorMsg})]}),(0,h.jsx)("div",{className:"d-grid mb-3",children:(0,h.jsx)(r.A,{variant:"primary",type:"submit",children:e("btn_update")})})]})]})]})},k=(0,i.memo)(f)}}]);
//# sourceMappingURL=7044.44f584fc.chunk.js.map