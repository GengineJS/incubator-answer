"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[3771],{3771:(e,t,n)=>{n.r(t),n.d(t,{toml:()=>r});const r={name:"toml",startState:function(){return{inString:!1,stringType:"",lhs:!0,inArray:0}},token:function(e,t){if(t.inString||'"'!=e.peek()&&"'"!=e.peek()||(t.stringType=e.peek(),e.next(),t.inString=!0),e.sol()&&0===t.inArray&&(t.lhs=!0),t.inString){for(;t.inString&&!e.eol();)e.peek()===t.stringType?(e.next(),t.inString=!1):"\\"===e.peek()?(e.next(),e.next()):e.match(/^.[^\\\"\']*/);return t.lhs?"property":"string"}return t.inArray&&"]"===e.peek()?(e.next(),t.inArray--,"bracket"):t.lhs&&"["===e.peek()&&e.skipTo("]")?(e.next(),"]"===e.peek()&&e.next(),"atom"):"#"===e.peek()?(e.skipToEnd(),"comment"):e.eatSpace()?null:t.lhs&&e.eatWhile((function(e){return"="!=e&&" "!=e}))?"property":t.lhs&&"="===e.peek()?(e.next(),t.lhs=!1,null):!t.lhs&&e.match(/^\d\d\d\d[\d\-\:\.T]*Z/)?"atom":t.lhs||!e.match("true")&&!e.match("false")?t.lhs||"["!==e.peek()?!t.lhs&&e.match(/^\-?\d+(?:\.\d+)?/)?"number":(e.eatSpace()||e.next(),null):(t.inArray++,e.next(),"bracket"):"atom"},languageData:{commentTokens:{line:"#"}}}}}]);
//# sourceMappingURL=3771.cfbc558e.chunk.js.map