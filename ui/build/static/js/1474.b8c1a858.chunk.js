"use strict";(globalThis.webpackChunkanswer_static=globalThis.webpackChunkanswer_static||[]).push([[1474],{91474:(e,t,r)=>{function a(e){return new RegExp("^(("+e.join(")|(")+"))\\b")}r.r(t),r.d(t,{webIDL:()=>C});var n=["Clamp","Constructor","EnforceRange","Exposed","ImplicitThis","Global","PrimaryGlobal","LegacyArrayClass","LegacyUnenumerableNamedProperties","LenientThis","NamedConstructor","NewObject","NoInterfaceObject","OverrideBuiltins","PutForwards","Replaceable","SameObject","TreatNonObjectAsNull","TreatNullAs","EmptyString","Unforgeable","Unscopeable"],i=a(n),c=["unsigned","short","long","unrestricted","float","double","boolean","byte","octet","Promise","ArrayBuffer","DataView","Int8Array","Int16Array","Int32Array","Uint8Array","Uint16Array","Uint32Array","Uint8ClampedArray","Float32Array","Float64Array","ByteString","DOMString","USVString","sequence","object","RegExp","Error","DOMException","FrozenArray","any","void"],o=a(c),l=["attribute","callback","const","deleter","dictionary","enum","getter","implements","inherit","interface","iterable","legacycaller","maplike","partial","required","serializer","setlike","setter","static","stringifier","typedef","optional","readonly","or"],m=a(l),s=["true","false","Infinity","NaN","null"],u=a(s),f=a(["callback","dictionary","enum","interface"]),b=a(["typedef"]),d=/^[:<=>?]/,y=/^-?([1-9][0-9]*|0[Xx][0-9A-Fa-f]+|0[0-7]*)/,p=/^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][+-]?[0-9]+)?|[0-9]+[Ee][+-]?[0-9]+)/,h=/^_?[A-Za-z][0-9A-Z_a-z-]*/,g=/^_?[A-Za-z][0-9A-Z_a-z-]*(?=\s*;)/,A=/^"[^"]*"/,k=/^\/\*.*?\*\//,D=/^\/\*.*/,w=/^.*?\*\//;const C={name:"webidl",startState:function(){return{inComment:!1,lastToken:"",startDef:!1,endDef:!1}},token:function(e,t){var r=function(e,t){if(e.eatSpace())return null;if(t.inComment)return e.match(w)?(t.inComment=!1,"comment"):(e.skipToEnd(),"comment");if(e.match("//"))return e.skipToEnd(),"comment";if(e.match(k))return"comment";if(e.match(D))return t.inComment=!0,"comment";if(e.match(/^-?[0-9\.]/,!1)&&(e.match(y)||e.match(p)))return"number";if(e.match(A))return"string";if(t.startDef&&e.match(h))return"def";if(t.endDef&&e.match(g))return t.endDef=!1,"def";if(e.match(m))return"keyword";if(e.match(o)){var r=t.lastToken,a=(e.match(/^\s*(.+?)\b/,!1)||[])[1];return":"===r||"implements"===r||"implements"===a||"="===a?"builtin":"type"}return e.match(i)?"builtin":e.match(u)?"atom":e.match(h)?"variable":e.match(d)?"operator":(e.next(),null)}(e,t);if(r){var a=e.current();t.lastToken=a,"keyword"===r?(t.startDef=f.test(a),t.endDef=t.endDef||b.test(a)):t.startDef=!1}return r},languageData:{autocomplete:n.concat(c).concat(l).concat(s)}}}}]);
//# sourceMappingURL=1474.b8c1a858.chunk.js.map