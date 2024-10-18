"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[9800,4277,5083,4706,5164,8624,5952,6419],{45083:(e,l,a)=>{a.r(l),a.d(l,{default:()=>d});var s=a(53799),i=a(51588),n=a(31574),r=a(96243),t=a(68179);const d=({visible:e,siteUrl:l=""})=>{const{t:a}=(0,i.B)("translation",{keyPrefix:"install"});return e?(0,t.jsxs)("div",{children:[(0,t.jsx)("h5",{children:a("ready_title")}),(0,t.jsx)("p",{children:(0,t.jsxs)(n.x,{i18nKey:"install.ready_description",children:["If you ever feel like changing more settings, visit",(0,t.jsx)("a",{href:`${l}/users/login`,children:" admin section"}),"; find it in the site menu."]})}),(0,t.jsx)("p",{children:a("good_luck")}),(0,t.jsxs)("div",{className:"d-flex align-items-center justify-content-between",children:[(0,t.jsx)(r.default,{step:5}),(0,t.jsx)(s.A,{href:l,children:a("done")})]})]}):null}},54706:(e,l,a)=>{a.r(l),a.d(l,{default:()=>c});var s=a(28915),i=a(46261),n=a(53799),r=a(51588),t=a(96243),d=a(48058),o=a(68179);const c=({visible:e,data:l,changeCallback:a,nextCallback:c})=>{const{t:u}=(0,r.B)("translation",{keyPrefix:"install"}),[v,m]=(0,s.useState)();return(0,s.useEffect)((()=>{(async()=>{const e=await(0,d.KO)();m(e),a({lang:{value:e[0].value,isInvalid:!1,errorMsg:""}})})()}),[]),e?(0,o.jsxs)(i.A,{noValidate:!0,onSubmit:()=>{c()},children:[(0,o.jsxs)(i.A.Group,{controlId:"lang",className:"mb-3",children:[(0,o.jsx)(i.A.Label,{children:u("lang.label")}),(0,o.jsx)(i.A.Select,{value:l.value,isInvalid:l.isInvalid,onChange:e=>{a({lang:{value:e.target.value,isInvalid:!1,errorMsg:""}})},children:null===v||void 0===v?void 0:v.map((e=>(0,o.jsx)("option",{value:e.value,children:e.label},e.value)))})]}),(0,o.jsxs)("div",{className:"d-flex align-items-center justify-content-between",children:[(0,o.jsx)(t.default,{step:1}),(0,o.jsx)(n.A,{type:"submit",children:u("next")})]})]}):null}},75164:(e,l,a)=>{a.r(l),a.d(l,{default:()=>o});var s=a(46261),i=a(53799),n=a(51588),r=a(97251),t=a(96243),d=a(68179);const o=({visible:e,data:l,changeCallback:a,nextCallback:o})=>{const{t:c}=(0,n.B)("translation",{keyPrefix:"install"});return e?(0,d.jsxs)(s.A,{noValidate:!0,onSubmit:e=>{e.preventDefault(),e.stopPropagation(),(()=>{let e=!0;const{site_name:s,site_url:i,contact_email:n,name:t,password:d,email:o}=l;return s.value||(e=!1,l.site_name={value:"",isInvalid:!0,errorMsg:c("site_name.msg")}),s.value&&s.value.length>30&&(e=!1,l.site_url={value:s.value,isInvalid:!0,errorMsg:c("site_name.msg_max_length")}),i.value||(e=!1,l.site_url={value:"",isInvalid:!0,errorMsg:c("site_name.msg.empty")}),i.value&&!i.value.match(/^(http|https):\/\//g)?(e=!1,l.site_url={value:i.value,isInvalid:!0,errorMsg:c("site_url.msg.incorrect")}):i.value.length>512&&(e=!1,l.site_url={value:i.value,isInvalid:!0,errorMsg:c("site_url.msg.max_length")}),n.value||(e=!1,l.contact_email={value:"",isInvalid:!0,errorMsg:c("contact_email.msg.empty")}),n.value&&!r.A.email.test(n.value)&&(e=!1,l.contact_email={value:n.value,isInvalid:!0,errorMsg:c("contact_email.msg.incorrect")}),t.value?/[^a-z0-9\-._]/.test(t.value)?(e=!1,l.name={value:t.value,isInvalid:!0,errorMsg:c("admin_name.character")}):l.name.value.length>30&&(e=!1,l.name={value:l.name.value,isInvalid:!0,errorMsg:c("admin_name.msg_max_length")}):(e=!1,l.name={value:"",isInvalid:!0,errorMsg:c("admin_name.msg")}),d.value||(e=!1,l.password={value:"",isInvalid:!0,errorMsg:c("admin_password.msg")}),d.value&&d.value.length<4&&(e=!1,l.password={value:l.password.value,isInvalid:!0,errorMsg:c("admin_password.msg_min_length")}),d.value&&d.value.length>32&&(e=!1,l.password={value:l.password.value,isInvalid:!0,errorMsg:c("admin_password.msg_max_length")}),o.value||(e=!1,l.email={value:"",isInvalid:!0,errorMsg:c("admin_email.msg.empty")}),o.value&&!r.A.email.test(o.value)&&(e=!1,l.email={value:o.value,isInvalid:!0,errorMsg:c("admin_email.msg.incorrect")}),a({...l}),e})()&&o()},children:[(0,d.jsx)("h5",{children:c("site_information")}),(0,d.jsxs)(s.A.Group,{controlId:"site_name",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("site_name.label")}),(0,d.jsx)(s.A.Control,{required:!0,value:l.site_name.value,isInvalid:l.site_name.isInvalid,onChange:e=>{a({site_name:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.site_name.errorMsg})]}),(0,d.jsxs)(s.A.Group,{controlId:"site_url",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("site_url.label")}),(0,d.jsx)(s.A.Control,{required:!0,value:l.site_url.value,isInvalid:l.site_url.isInvalid,onChange:e=>{a({site_url:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Text,{children:c("site_url.text")}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.site_url.errorMsg})]}),(0,d.jsxs)(s.A.Group,{controlId:"contact_email",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("contact_email.label")}),(0,d.jsx)(s.A.Control,{required:!0,type:"email",value:l.contact_email.value,isInvalid:l.contact_email.isInvalid,onChange:e=>{a({contact_email:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Text,{children:c("contact_email.text")}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.contact_email.errorMsg})]}),(0,d.jsxs)(s.A.Group,{controlId:"login_required",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("login_required.label")}),(0,d.jsx)(s.A.Check,{type:"switch",id:"login_required",label:c("login_required.switch"),checked:l.login_required.value,onChange:e=>{a({login_required:{value:e.target.checked,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Text,{children:c("login_required.text")})]}),(0,d.jsx)("h5",{children:c("admin_account")}),(0,d.jsxs)(s.A.Group,{controlId:"name",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("admin_name.label")}),(0,d.jsx)(s.A.Control,{required:!0,value:l.name.value,isInvalid:l.name.isInvalid,onChange:e=>{a({name:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.name.errorMsg})]}),(0,d.jsxs)(s.A.Group,{controlId:"password",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("admin_password.label")}),(0,d.jsx)(s.A.Control,{required:!0,type:"password",value:l.password.value,isInvalid:l.password.isInvalid,onChange:e=>{a({password:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Text,{children:c("admin_password.text")}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.password.errorMsg})]}),(0,d.jsxs)(s.A.Group,{controlId:"email",className:"mb-3",children:[(0,d.jsx)(s.A.Label,{children:c("admin_email.label")}),(0,d.jsx)(s.A.Control,{required:!0,value:l.email.value,isInvalid:l.email.isInvalid,onChange:e=>{a({email:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,d.jsx)(s.A.Text,{children:c("admin_email.text")}),(0,d.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.email.errorMsg})]}),(0,d.jsxs)("div",{className:"d-flex align-items-center justify-content-between",children:[(0,d.jsx)(t.default,{step:4}),(0,d.jsx)(i.A,{type:"submit",children:c("next")})]})]}):null}},96243:(e,l,a)=>{a.r(l),a.d(l,{default:()=>t});var s=a(28915),i=a(77919),n=a(68179);const r=({step:e})=>(0,n.jsxs)("div",{className:"d-flex align-items-center small text-secondary",children:[(0,n.jsx)(i.A,{now:e/5*100,variant:"success",style:{width:"200px"},className:"me-2"}),(0,n.jsxs)("span",{children:[e,"/5"]})]}),t=(0,s.memo)(r)},5952:(e,l,a)=>{a.r(l),a.d(l,{default:()=>o});var s=a(46261),i=a(53799),n=a(51588),r=a(96243),t=a(68179);const d=[{value:"mysql",label:"MariaDB/MySQL"},{value:"sqlite3",label:"SQLite"},{value:"postgres",label:"PostgreSQL"}],o=({visible:e,data:l,changeCallback:a,nextCallback:o})=>{const{t:c}=(0,n.B)("translation",{keyPrefix:"install"});return e?(0,t.jsxs)(s.A,{noValidate:!0,onSubmit:e=>{e.preventDefault(),e.stopPropagation(),(()=>{let e=!0;const{db_type:s,db_username:i,db_password:n,db_host:r,db_name:t,db_file:d}=l;return"sqlite3"!==s.value?(i.value||(e=!1,l.db_username={value:"",isInvalid:!0,errorMsg:c("db_username.msg")}),n.value||(e=!1,l.db_password={value:"",isInvalid:!0,errorMsg:c("db_password.msg")}),r.value||(e=!1,l.db_host={value:"",isInvalid:!0,errorMsg:c("db_host.msg")}),t.value||(e=!1,l.db_name={value:"",isInvalid:!0,errorMsg:c("db_name.msg")})):d.value||(e=!1,l.db_file={value:"",isInvalid:!0,errorMsg:c("db_file.msg")}),a({...l}),e})()&&o()},children:[(0,t.jsxs)(s.A.Group,{controlId:"database_engine",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_type.label")}),(0,t.jsx)(s.A.Select,{value:l.db_type.value,isInvalid:l.db_type.isInvalid,onChange:e=>{a({db_type:{value:e.target.value,isInvalid:!1,errorMsg:""}})},children:d.map((e=>(0,t.jsx)("option",{value:e.value,children:e.label},e.value)))})]}),"sqlite3"!==l.db_type.value?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(s.A.Group,{controlId:"username",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_username.label")}),(0,t.jsx)(s.A.Control,{required:!0,placeholder:c("db_username.placeholder"),value:l.db_username.value,isInvalid:l.db_username.isInvalid,onChange:e=>{a({db_username:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,t.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.db_username.errorMsg})]}),(0,t.jsxs)(s.A.Group,{controlId:"db_password",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_password.label")}),(0,t.jsx)(s.A.Control,{required:!0,value:l.db_password.value,isInvalid:l.db_password.isInvalid,onChange:e=>{a({db_password:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,t.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.db_password.errorMsg})]}),(0,t.jsxs)(s.A.Group,{controlId:"db_host",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_host.label")}),(0,t.jsx)(s.A.Control,{required:!0,placeholder:c("db_host.placeholder"),value:l.db_host.value,isInvalid:l.db_host.isInvalid,onChange:e=>{a({db_host:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,t.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.db_host.errorMsg})]}),(0,t.jsxs)(s.A.Group,{controlId:"name",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_name.label")}),(0,t.jsx)(s.A.Control,{required:!0,placeholder:c("db_name.placeholder"),value:l.db_name.value,isInvalid:l.db_name.isInvalid,onChange:e=>{a({db_name:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,t.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.db_name.errorMsg})]})]}):(0,t.jsxs)(s.A.Group,{controlId:"file",className:"mb-3",children:[(0,t.jsx)(s.A.Label,{children:c("db_file.label")}),(0,t.jsx)(s.A.Control,{required:!0,placeholder:c("db_file.placeholder"),value:l.db_file.value,isInvalid:l.db_file.isInvalid,onChange:e=>{a({db_file:{value:e.target.value,isInvalid:!1,errorMsg:""}})}}),(0,t.jsx)(s.A.Control.Feedback,{type:"invalid",children:l.db_file.errorMsg})]}),(0,t.jsxs)("div",{className:"d-flex align-items-center justify-content-between",children:[(0,t.jsx)(r.default,{step:2}),(0,t.jsx)(i.A,{type:"submit",children:c("next")})]})]}):null}},66419:(e,l,a)=>{a.r(l),a.d(l,{default:()=>c});var s=a(81534),i=a(46261),n=a(53799),r=a(51588),t=a(31574),d=a(96243),o=a(68179);const c=({visible:e,errorMsg:l,nextCallback:a})=>{var c;const{t:u}=(0,r.B)("translation",{keyPrefix:"install"});return e?(0,o.jsxs)("div",{children:[(0,o.jsx)("h5",{children:u("config_yaml.title")}),(null===l||void 0===l||null===(c=l.msg)||void 0===c?void 0:c.length)>0?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("div",{className:"fmt",children:(0,o.jsx)("p",{children:(0,o.jsx)(t.x,{i18nKey:"install.config_yaml.desc",components:{1:(0,o.jsx)("code",{})}})})}),(0,o.jsx)(s.A,{className:"mb-3",children:(0,o.jsx)(i.A.Control,{type:"text",as:"textarea",rows:8,className:"small",value:null===l||void 0===l?void 0:l.default_config})}),(0,o.jsx)("div",{className:"mb-3",children:u("config_yaml.info")})]}):(0,o.jsx)("div",{className:"mb-3",children:u("config_yaml.label")}),(0,o.jsxs)("div",{className:"d-flex align-items-center justify-content-between",children:[(0,o.jsx)(d.default,{step:3}),(0,o.jsx)(n.A,{onClick:a,children:u("next")})]})]}):null}},24277:(e,l,a)=>{a.r(l),a.d(l,{Fifth:()=>t.default,FirstStep:()=>s.default,FourthStep:()=>r.default,SecondStep:()=>i.default,ThirdStep:()=>n.default});var s=a(54706),i=a(5952),n=a(66419),r=a(75164),t=a(45083)},39800:(e,l,a)=>{a.r(l),a.d(l,{default:()=>g});var s=a(28915),i=a(47760),n=a(13015),r=a(98329),t=a(16413),d=a(83556),o=a(51588),c=a(31574),u=a(51273),v=a(48058),m=a(4440),b=a(76812),_=a(24277),h=a(68179);const g=()=>{const{t:e}=(0,o.B)("translation",{keyPrefix:"install"}),[l,a]=(0,s.useState)(1),[g,x]=(0,s.useState)(!0),[j,p]=(0,s.useState)({msg:""}),[I,f]=(0,s.useState)({db_table_exist:!1,db_connection_success:!1}),[A,y]=(0,s.useState)({lang:{value:"en_US",isInvalid:!1,errorMsg:""},db_type:{value:"mysql",isInvalid:!1,errorMsg:""},db_username:{value:"root",isInvalid:!1,errorMsg:""},db_password:{value:"root",isInvalid:!1,errorMsg:""},db_host:{value:"db:3306",isInvalid:!1,errorMsg:""},db_name:{value:"answer",isInvalid:!1,errorMsg:""},db_file:{value:"/data/answer.db",isInvalid:!1,errorMsg:""},site_name:{value:"",isInvalid:!1,errorMsg:""},site_url:{value:window.location.origin,isInvalid:!1,errorMsg:""},contact_email:{value:"",isInvalid:!1,errorMsg:""},login_required:{value:!1,isInvalid:!1,errorMsg:""},name:{value:"",isInvalid:!1,errorMsg:""},password:{value:"",isInvalid:!1,errorMsg:""},email:{value:"",isInvalid:!1,errorMsg:""}}),M=e=>{p({msg:""}),y({...A,...e})},w=e=>{(0,m.Mv)(),p(e)},C=async()=>{p({msg:""}),a((e=>e+1))},k=()=>{const e={lang:A.lang.value,db_type:A.db_type.value,db_username:A.db_username.value,db_password:A.db_password.value,db_host:A.db_host.value,db_name:A.db_name.value,db_file:A.db_file.value};(0,v.O1)(e).then((()=>{C()})).catch((e=>{w(e)}))},N=()=>{1===l&&(m.wc.set(b.rZ,A.lang.value),C()),2===l&&(()=>{const e={lang:A.lang.value,db_type:A.db_type.value,db_username:A.db_username.value,db_password:A.db_password.value,db_host:A.db_host.value,db_name:A.db_name.value,db_file:A.db_file.value};(0,v.Td)(e).then((()=>{k()})).catch((e=>{w(e)}))})(),3===l&&(j.msg?k():C()),4===l&&(()=>{const e={lang:A.lang.value,site_name:A.site_name.value,site_url:A.site_url.value,contact_email:A.contact_email.value,login_required:A.login_required.value,name:A.name.value,password:A.password.value,email:A.email.value};(0,v.D7)(e).then((()=>{C()})).catch((e=>{if(e.isError){const l=(0,m.NC)(e,A);y({...l});const a=document.getElementById(e.list[0].error_field);(0,m.qt)(a)}else w(e)}))})(),l>4&&C()};return(0,s.useEffect)((()=>{(0,v.$M)().then((e=>{f({db_table_exist:e.db_table_exist,db_connection_success:e.db_connection_success}),e&&e.config_file_exist&&(e.db_connection_success?a(6):a(7))})).finally((()=>{x(!1)}))}),[]),g?(0,h.jsx)("div",{}):(0,h.jsxs)(u.vd,{children:[(0,h.jsx)(u.mg,{children:(0,h.jsx)("title",{children:e("install",{keyPrefix:"page_title"})})}),(0,h.jsx)("div",{className:"bg-f5 py-5 flex-grow-1",children:(0,h.jsx)(i.A,{className:"py-3",children:(0,h.jsx)(n.A,{className:"justify-content-center",children:(0,h.jsxs)(r.A,{lg:6,children:[(0,h.jsx)("h2",{className:"mb-4 text-center",children:e("title")}),(0,h.jsx)(t.A,{children:(0,h.jsxs)(t.A.Body,{children:[(null===j||void 0===j?void 0:j.msg)&&(0,h.jsx)(d.A,{variant:"danger",children:null===j||void 0===j?void 0:j.msg}),(0,h.jsx)(_.FirstStep,{visible:1===l,data:A.lang,changeCallback:M,nextCallback:N}),(0,h.jsx)(_.SecondStep,{visible:2===l,data:A,changeCallback:M,nextCallback:N}),(0,h.jsx)(_.ThirdStep,{visible:3===l,nextCallback:N,errorMsg:j}),(0,h.jsx)(_.FourthStep,{visible:4===l,data:A,changeCallback:M,nextCallback:N}),(0,h.jsx)(_.Fifth,{visible:5===l,siteUrl:A.site_url.value}),6===l&&(0,h.jsxs)("div",{children:[(0,h.jsx)("h5",{children:e("warn_title")}),(0,h.jsxs)("p",{children:[(0,h.jsx)(c.x,{i18nKey:"install.warn_desc",components:{1:(0,h.jsx)("code",{})}})," ",(0,h.jsxs)(c.x,{i18nKey:"install.install_now",children:["You may try"," ",(0,h.jsx)("a",{href:"###",onClick:e=>(e=>{e.preventDefault(),I.db_table_exist?a(8):a(4)})(e),children:"installing now"}),"."]})]})]}),7===l&&(0,h.jsxs)("div",{children:[(0,h.jsx)("h5",{children:e("db_failed")}),(0,h.jsx)("p",{children:(0,h.jsx)(c.x,{i18nKey:"install.db_failed_desc",components:{1:(0,h.jsx)("code",{})}})})]}),8===l&&(0,h.jsxs)("div",{children:[(0,h.jsx)("h5",{children:e("installed")}),(0,h.jsx)("p",{children:e("installed_desc")})]})]})})]})})})})]})}}}]);
//# sourceMappingURL=9800.a1cd5789.chunk.js.map