/*! For license information please see 7893.d73b5dd3.chunk.js.LICENSE.txt */
(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[7893],{77893:(a,e,r)=>{"use strict";r.r(e),r.d(e,{default:()=>y});var t=r(28915),n=r(46261),s=r(10808),l=r(93168),i=r(53799),o=r(51588),u=r(31574),d=r(59883),v=r.n(d),c=r(81801),g=r(24978),m=r(47185),p=r(48058),h=r(4440),b=r(68179);const f=()=>{const{t:a}=(0,o.B)("translation",{keyPrefix:"settings.profile"}),e=(0,m.dj)(),{user:r,update:d}=(0,g.bb)(),{agent:f}=(0,g.ym)(),{users:y}=(0,g.Ty)(),[x,_]=(0,t.useState)(""),[j]=(0,t.useState)(0),[I,A]=(0,t.useState)(),[w,M]=(0,t.useState)({display_name:{value:"",isInvalid:!1,errorMsg:""},username:{value:"",isInvalid:!1,errorMsg:""},avatar:{type:"default",gravatar:"",custom:"",value:"",isInvalid:!1,errorMsg:""},bio:{value:"",isInvalid:!1,errorMsg:""},website:{value:"",isInvalid:!1,errorMsg:""},location:{value:"",isInvalid:!1,errorMsg:""}}),C=a=>{M({...w,...a})},T=()=>{(0,p.aV)().then((a=>{if(w.display_name.value=a.display_name,w.username.value=a.username,w.bio.value=a.bio,w.avatar.type=a.avatar.type||"default",w.avatar.gravatar=a.avatar.gravatar,w.avatar.custom=a.avatar.custom,w.location.value=a.location,w.website.value=a.website,M({...w}),a.e_mail){const e=a.e_mail.toLowerCase().trim(),r=v()(e);_(r)}}))};return(0,t.useEffect)((()=>{null!==f&&void 0!==f&&f.enabled?(0,p.yv)().then((a=>{var e;A(a.profile_setting_agent),!1===(null===(e=a.profile_setting_agent)||void 0===e?void 0:e.enabled)&&T()})):T()}),[]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("h3",{className:"mb-4",children:a("heading")}),null!==I&&void 0!==I&&I.enabled&&null!==I&&void 0!==I&&I.redirect_url?(0,b.jsx)("a",{href:I.redirect_url,children:a("goto_modify",{keyPrefix:"settings"})}):null,null!==f&&void 0!==f&&f.enabled&&!1!==(null===I||void 0===I?void 0:I.enabled)?null:(0,b.jsxs)(n.A,{noValidate:!0,onSubmit:t=>{if(t.preventDefault(),t.stopPropagation(),!(()=>{let e=!0;const{display_name:r,website:t,username:n}=w;if(r.value?[...r.value].length>30&&(e=!1,w.display_name={value:r.value,isInvalid:!0,errorMsg:a("display_name.msg_range")}):(e=!1,w.display_name={value:"",isInvalid:!0,errorMsg:a("display_name.msg")}),n.value?[...n.value].length>30?(e=!1,w.username={value:n.value,isInvalid:!0,errorMsg:a("username.msg_range")}):/[^a-z0-9\-._]/.test(n.value)&&(e=!1,w.username={value:n.value,isInvalid:!0,errorMsg:a("username.character")}):(e=!1,w.username={value:"",isInvalid:!0,errorMsg:a("username.msg")}),"custom"!==w.avatar.type||w.avatar.custom||(e=!1,w.avatar={...w.avatar,custom:"",value:"",isInvalid:!0,errorMsg:a("avatar.msg")}),t.value&&!t.value.match(/^(http|https):\/\//g)&&(e=!1,w.website={value:w.website.value,isInvalid:!0,errorMsg:a("website.msg")}),M({...w}),!e){const a=Object.keys(w).filter((a=>w[a].isInvalid)),e=document.getElementById(a[0]);(0,h.qt)(e)}return e})())return;const n={display_name:w.display_name.value,username:w.username.value,avatar:{type:w.avatar.type,gravatar:w.avatar.gravatar,custom:w.avatar.custom},bio:w.bio.value,website:w.website.value,location:w.location.value};(0,p.UX)(n).then((()=>{d({...r,...n}),e.onShow({msg:a("update",{keyPrefix:"toast"}),variant:"success"})})).catch((a=>{if(a.isError){const e=(0,h.NC)(a,w);M({...e});const r=document.getElementById(a.list[0].error_field);(0,h.qt)(r)}}))},children:[(0,b.jsxs)(n.A.Group,{controlId:"display_name",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:a("display_name.label")}),(0,b.jsx)(n.A.Control,{required:!0,type:"text",disabled:!y.allow_update_display_name,value:w.display_name.value,isInvalid:w.display_name.isInvalid,onChange:a=>C({display_name:{value:a.target.value,isInvalid:!1,errorMsg:""}})}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.display_name.errorMsg})]}),(0,b.jsxs)(n.A.Group,{controlId:"username",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:a("username.label")}),(0,b.jsx)(n.A.Control,{required:!0,type:"text",disabled:!y.allow_update_username,value:w.username.value,isInvalid:w.username.isInvalid,onChange:a=>C({username:{value:a.target.value,isInvalid:!1,errorMsg:""}})}),(0,b.jsx)(n.A.Text,{as:"div",children:a("username.caption")}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.username.errorMsg})]}),(0,b.jsxs)(n.A.Group,{controlId:"avatar",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:a("avatar.label")}),(0,b.jsx)("div",{className:"mb-3",children:(0,b.jsxs)(n.A.Select,{name:"avatar.type",disabled:!y.allow_update_avatar,value:w.avatar.type,onChange:a=>{const{value:e}=a.currentTarget;"gravatar"===e&&C({avatar:{...w.avatar,type:"gravatar",gravatar:`https://cravatar.cn/avatar/${x}`,isInvalid:!1,errorMsg:""}}),"custom"===e&&C({avatar:{...w.avatar,type:"custom",isInvalid:!1,errorMsg:""}}),"default"===e&&C({avatar:{...w.avatar,type:"default",isInvalid:!1,errorMsg:""}})},children:[(0,b.jsx)("option",{value:"gravatar",children:a("avatar.gravatar")},"gravatar"),(0,b.jsx)("option",{value:"default",children:a("avatar.default")},"default"),(0,b.jsx)("option",{value:"custom",children:a("avatar.custom")},"custom")]})}),(0,b.jsx)(c.EQ,{children:(0,b.jsxs)("div",{className:"d-flex",children:["gravatar"===w.avatar.type&&(0,b.jsxs)(s.A,{children:[(0,b.jsx)(c.eu,{size:"160px",avatar:w.avatar.gravatar,searchStr:"s=256&d=identicon"+(j>0?`&t=${(new Date).valueOf()}`:""),className:"me-3 rounded",alt:w.display_name.value}),(0,b.jsxs)(n.A.Text,{className:"mt-1",children:[(0,b.jsx)("span",{children:a("avatar.gravatar_text")}),(0,b.jsx)("a",{href:(y.gravatar_base_url.includes("gravatar.cn"),"https://cravatar.cn"),className:"ms-1",target:"_blank",rel:"noreferrer",children:(y.gravatar_base_url.includes("gravatar.cn"),"cravatar.cn")})]})]}),"custom"===w.avatar.type&&(0,b.jsxs)(s.A,{children:[(0,b.jsxs)(s.A,{direction:"horizontal",className:"align-items-start",children:[(0,b.jsx)(c.eu,{size:"160px",searchStr:"s=256",avatar:w.avatar.custom,className:"me-2 bg-gray-300 ",alt:w.display_name.value}),(0,b.jsxs)(l.A,{vertical:!0,className:"fit-content",children:[(0,b.jsx)(c.NB,{type:"avatar",disabled:!y.allow_update_avatar,uploadCallback:a=>{M({...w,avatar:{...w.avatar,type:"custom",custom:a,isInvalid:!1,errorMsg:""}})},children:(0,b.jsx)(c.In,{name:"cloud-upload"})}),(0,b.jsx)(i.A,{variant:"outline-secondary",disabled:!y.allow_update_avatar,onClick:()=>{M({...w,avatar:{...w.avatar,custom:"",isInvalid:!1,errorMsg:""}})},children:(0,b.jsx)(c.In,{name:"trash"})})]})]}),(0,b.jsx)(n.A.Text,{className:"mt-1",children:(0,b.jsx)(u.x,{i18nKey:"settings.profile.avatar.text",children:"You can upload your image."})})]}),"default"===w.avatar.type&&(0,b.jsx)(c.eu,{size:"160px",avatar:"",alt:w.display_name.value})]})}),(0,b.jsx)(n.A.Control,{isInvalid:w.avatar.isInvalid,className:"d-none"}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.avatar.errorMsg})]}),(0,b.jsxs)(n.A.Group,{controlId:"bio",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:`${a("bio.label")} ${a("optional",{keyPrefix:"form"})}`}),(0,b.jsx)(n.A.Control,{className:"font-monospace",required:!0,as:"textarea",rows:5,disabled:!y.allow_update_bio,value:w.bio.value,isInvalid:w.bio.isInvalid,onChange:a=>C({bio:{value:a.target.value,isInvalid:!1,errorMsg:""}})}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.bio.errorMsg})]}),(0,b.jsxs)(n.A.Group,{controlId:"website",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:`${a("website.label")} ${a("optional",{keyPrefix:"form"})}`}),(0,b.jsx)(n.A.Control,{required:!0,type:"url",placeholder:a("website.placeholder"),disabled:!y.allow_update_website,value:w.website.value,isInvalid:w.website.isInvalid,onChange:a=>C({website:{value:a.target.value,isInvalid:!1,errorMsg:""}})}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.website.errorMsg})]}),(0,b.jsxs)(n.A.Group,{controlId:"location",className:"mb-3",children:[(0,b.jsx)(n.A.Label,{children:`${a("location.label")} ${a("optional",{keyPrefix:"form"})}`}),(0,b.jsx)(n.A.Control,{required:!0,type:"text",placeholder:a("location.placeholder"),disabled:!y.allow_update_location,value:w.location.value,isInvalid:w.location.isInvalid,onChange:a=>C({location:{value:a.target.value,isInvalid:!1,errorMsg:""}})}),(0,b.jsx)(n.A.Control.Feedback,{type:"invalid",children:w.location.errorMsg})]}),(0,b.jsx)(i.A,{variant:"primary",type:"submit",children:a("btn_name")})]})]})},y=t.memo(f)},56116:a=>{var e={utf8:{stringToBytes:function(a){return e.bin.stringToBytes(unescape(encodeURIComponent(a)))},bytesToString:function(a){return decodeURIComponent(escape(e.bin.bytesToString(a)))}},bin:{stringToBytes:function(a){for(var e=[],r=0;r<a.length;r++)e.push(255&a.charCodeAt(r));return e},bytesToString:function(a){for(var e=[],r=0;r<a.length;r++)e.push(String.fromCharCode(a[r]));return e.join("")}}};a.exports=e},47824:a=>{!function(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r={rotl:function(a,e){return a<<e|a>>>32-e},rotr:function(a,e){return a<<32-e|a>>>e},endian:function(a){if(a.constructor==Number)return 16711935&r.rotl(a,8)|4278255360&r.rotl(a,24);for(var e=0;e<a.length;e++)a[e]=r.endian(a[e]);return a},randomBytes:function(a){for(var e=[];a>0;a--)e.push(Math.floor(256*Math.random()));return e},bytesToWords:function(a){for(var e=[],r=0,t=0;r<a.length;r++,t+=8)e[t>>>5]|=a[r]<<24-t%32;return e},wordsToBytes:function(a){for(var e=[],r=0;r<32*a.length;r+=8)e.push(a[r>>>5]>>>24-r%32&255);return e},bytesToHex:function(a){for(var e=[],r=0;r<a.length;r++)e.push((a[r]>>>4).toString(16)),e.push((15&a[r]).toString(16));return e.join("")},hexToBytes:function(a){for(var e=[],r=0;r<a.length;r+=2)e.push(parseInt(a.substr(r,2),16));return e},bytesToBase64:function(a){for(var r=[],t=0;t<a.length;t+=3)for(var n=a[t]<<16|a[t+1]<<8|a[t+2],s=0;s<4;s++)8*t+6*s<=8*a.length?r.push(e.charAt(n>>>6*(3-s)&63)):r.push("=");return r.join("")},base64ToBytes:function(a){a=a.replace(/[^A-Z0-9+\/]/gi,"");for(var r=[],t=0,n=0;t<a.length;n=++t%4)0!=n&&r.push((e.indexOf(a.charAt(t-1))&Math.pow(2,-2*n+8)-1)<<2*n|e.indexOf(a.charAt(t))>>>6-2*n);return r}};a.exports=r}()},48606:a=>{function e(a){return!!a.constructor&&"function"===typeof a.constructor.isBuffer&&a.constructor.isBuffer(a)}a.exports=function(a){return null!=a&&(e(a)||function(a){return"function"===typeof a.readFloatLE&&"function"===typeof a.slice&&e(a.slice(0,0))}(a)||!!a._isBuffer)}},59883:(a,e,r)=>{!function(){var e=r(47824),t=r(56116).utf8,n=r(48606),s=r(56116).bin,l=function(a,r){a.constructor==String?a=r&&"binary"===r.encoding?s.stringToBytes(a):t.stringToBytes(a):n(a)?a=Array.prototype.slice.call(a,0):Array.isArray(a)||a.constructor===Uint8Array||(a=a.toString());for(var i=e.bytesToWords(a),o=8*a.length,u=1732584193,d=-271733879,v=-1732584194,c=271733878,g=0;g<i.length;g++)i[g]=16711935&(i[g]<<8|i[g]>>>24)|4278255360&(i[g]<<24|i[g]>>>8);i[o>>>5]|=128<<o%32,i[14+(o+64>>>9<<4)]=o;var m=l._ff,p=l._gg,h=l._hh,b=l._ii;for(g=0;g<i.length;g+=16){var f=u,y=d,x=v,_=c;u=m(u,d,v,c,i[g+0],7,-680876936),c=m(c,u,d,v,i[g+1],12,-389564586),v=m(v,c,u,d,i[g+2],17,606105819),d=m(d,v,c,u,i[g+3],22,-1044525330),u=m(u,d,v,c,i[g+4],7,-176418897),c=m(c,u,d,v,i[g+5],12,1200080426),v=m(v,c,u,d,i[g+6],17,-1473231341),d=m(d,v,c,u,i[g+7],22,-45705983),u=m(u,d,v,c,i[g+8],7,1770035416),c=m(c,u,d,v,i[g+9],12,-1958414417),v=m(v,c,u,d,i[g+10],17,-42063),d=m(d,v,c,u,i[g+11],22,-1990404162),u=m(u,d,v,c,i[g+12],7,1804603682),c=m(c,u,d,v,i[g+13],12,-40341101),v=m(v,c,u,d,i[g+14],17,-1502002290),u=p(u,d=m(d,v,c,u,i[g+15],22,1236535329),v,c,i[g+1],5,-165796510),c=p(c,u,d,v,i[g+6],9,-1069501632),v=p(v,c,u,d,i[g+11],14,643717713),d=p(d,v,c,u,i[g+0],20,-373897302),u=p(u,d,v,c,i[g+5],5,-701558691),c=p(c,u,d,v,i[g+10],9,38016083),v=p(v,c,u,d,i[g+15],14,-660478335),d=p(d,v,c,u,i[g+4],20,-405537848),u=p(u,d,v,c,i[g+9],5,568446438),c=p(c,u,d,v,i[g+14],9,-1019803690),v=p(v,c,u,d,i[g+3],14,-187363961),d=p(d,v,c,u,i[g+8],20,1163531501),u=p(u,d,v,c,i[g+13],5,-1444681467),c=p(c,u,d,v,i[g+2],9,-51403784),v=p(v,c,u,d,i[g+7],14,1735328473),u=h(u,d=p(d,v,c,u,i[g+12],20,-1926607734),v,c,i[g+5],4,-378558),c=h(c,u,d,v,i[g+8],11,-2022574463),v=h(v,c,u,d,i[g+11],16,1839030562),d=h(d,v,c,u,i[g+14],23,-35309556),u=h(u,d,v,c,i[g+1],4,-1530992060),c=h(c,u,d,v,i[g+4],11,1272893353),v=h(v,c,u,d,i[g+7],16,-155497632),d=h(d,v,c,u,i[g+10],23,-1094730640),u=h(u,d,v,c,i[g+13],4,681279174),c=h(c,u,d,v,i[g+0],11,-358537222),v=h(v,c,u,d,i[g+3],16,-722521979),d=h(d,v,c,u,i[g+6],23,76029189),u=h(u,d,v,c,i[g+9],4,-640364487),c=h(c,u,d,v,i[g+12],11,-421815835),v=h(v,c,u,d,i[g+15],16,530742520),u=b(u,d=h(d,v,c,u,i[g+2],23,-995338651),v,c,i[g+0],6,-198630844),c=b(c,u,d,v,i[g+7],10,1126891415),v=b(v,c,u,d,i[g+14],15,-1416354905),d=b(d,v,c,u,i[g+5],21,-57434055),u=b(u,d,v,c,i[g+12],6,1700485571),c=b(c,u,d,v,i[g+3],10,-1894986606),v=b(v,c,u,d,i[g+10],15,-1051523),d=b(d,v,c,u,i[g+1],21,-2054922799),u=b(u,d,v,c,i[g+8],6,1873313359),c=b(c,u,d,v,i[g+15],10,-30611744),v=b(v,c,u,d,i[g+6],15,-1560198380),d=b(d,v,c,u,i[g+13],21,1309151649),u=b(u,d,v,c,i[g+4],6,-145523070),c=b(c,u,d,v,i[g+11],10,-1120210379),v=b(v,c,u,d,i[g+2],15,718787259),d=b(d,v,c,u,i[g+9],21,-343485551),u=u+f>>>0,d=d+y>>>0,v=v+x>>>0,c=c+_>>>0}return e.endian([u,d,v,c])};l._ff=function(a,e,r,t,n,s,l){var i=a+(e&r|~e&t)+(n>>>0)+l;return(i<<s|i>>>32-s)+e},l._gg=function(a,e,r,t,n,s,l){var i=a+(e&t|r&~t)+(n>>>0)+l;return(i<<s|i>>>32-s)+e},l._hh=function(a,e,r,t,n,s,l){var i=a+(e^r^t)+(n>>>0)+l;return(i<<s|i>>>32-s)+e},l._ii=function(a,e,r,t,n,s,l){var i=a+(r^(e|~t))+(n>>>0)+l;return(i<<s|i>>>32-s)+e},l._blocksize=16,l._digestsize=16,a.exports=function(a,r){if(void 0===a||null===a)throw new Error("Illegal argument "+a);var t=e.wordsToBytes(l(a,r));return r&&r.asBytes?t:r&&r.asString?s.bytesToString(t):e.bytesToHex(t)}}()}}]);
//# sourceMappingURL=7893.d73b5dd3.chunk.js.map