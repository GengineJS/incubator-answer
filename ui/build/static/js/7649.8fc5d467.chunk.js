"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[7649],{7649:(t,e,n)=>{n.r(e),n.d(e,{shell:()=>k});var r={};function s(t,e){for(var n=0;n<e.length;n++)r[e[n]]=t}var i=["true","false"],o=["if","then","do","else","elif","while","until","for","in","esac","fi","fin","fil","done","exit","set","unset","export","function"],a=["ab","awk","bash","beep","cat","cc","cd","chown","chmod","chroot","clear","cp","curl","cut","diff","echo","find","gawk","gcc","get","git","grep","hg","kill","killall","ln","ls","make","mkdir","openssl","mv","nc","nl","node","npm","ping","ps","restart","rm","rmdir","sed","service","sh","shopt","shred","source","sort","sleep","ssh","start","stop","su","sudo","svn","tee","telnet","top","touch","vi","vim","wall","wc","wget","who","write","yes","zsh"];function u(t,e){if(t.eatSpace())return null;var n,s=t.sol(),i=t.next();if("\\"===i)return t.next(),null;if("'"===i||'"'===i||"`"===i)return e.tokens.unshift(c(i,"`"===i?"quote":"string")),h(t,e);if("#"===i)return s&&t.eat("!")?(t.skipToEnd(),"meta"):(t.skipToEnd(),"comment");if("$"===i)return e.tokens.unshift(f),h(t,e);if("+"===i||"="===i)return"operator";if("-"===i)return t.eat("-"),t.eatWhile(/\w/),"attribute";if("<"==i){if(t.match("<<"))return"operator";var o=t.match(/^<-?\s*(?:['"]([^'"]*)['"]|([^'"\s]*))/);if(o)return e.tokens.unshift((n=o[1]||o[2],function(t,e){return t.sol()&&t.string==n&&e.tokens.shift(),t.skipToEnd(),"string.special"})),"string.special"}if(/\d/.test(i)&&(t.eatWhile(/\d/),t.eol()||!/\w/.test(t.peek())))return"number";t.eatWhile(/[\w-]/);var a=t.current();return"="===t.peek()&&/\w+/.test(a)?"def":r.hasOwnProperty(a)?r[a]:null}function c(t,e){var n="("==t?")":"{"==t?"}":t;return function(r,s){for(var i,o=!1;null!=(i=r.next());){if(i===n&&!o){s.tokens.shift();break}if("$"===i&&!o&&"'"!==t&&r.peek()!=n){o=!0,r.backUp(1),s.tokens.unshift(f);break}if(!o&&t!==n&&i===t)return s.tokens.unshift(c(t,e)),h(r,s);if(!o&&/['"]/.test(i)&&!/['"]/.test(t)){s.tokens.unshift(l(i,"string")),r.backUp(1);break}o=!o&&"\\"===i}return e}}function l(t,e){return function(n,r){return r.tokens[0]=c(t,e),n.next(),h(n,r)}}s("atom",i),s("keyword",o),s("builtin",a);var f=function(t,e){e.tokens.length>1&&t.eat("$");var n=t.next();return/['"({]/.test(n)?(e.tokens[0]=c(n,"("==n?"quote":"{"==n?"def":"string"),h(t,e)):(/\d/.test(n)||t.eatWhile(/\w/),e.tokens.shift(),"def")};function h(t,e){return(e.tokens[0]||u)(t,e)}const k={name:"shell",startState:function(){return{tokens:[]}},token:function(t,e){return h(t,e)},languageData:{autocomplete:i.concat(o,a),closeBrackets:{brackets:["(","[","{","'",'"',"`"]},commentTokens:{line:"#"}}}}}]);
//# sourceMappingURL=7649.8fc5d467.chunk.js.map