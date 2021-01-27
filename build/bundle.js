var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function l(t,e,n){t.insertBefore(e,n||null)}function s(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function a(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function f(){return d(" ")}function h(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function g(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function p(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function m(t,e){t.value=null==e?"":e}let y;function v(t){y=t}const b=[],x=[],$=[],w=[],k=Promise.resolve();let S=!1;function _(t){$.push(t)}let A=!1;const N=new Set;function C(){if(!A){A=!0;do{for(let t=0;t<b.length;t+=1){const e=b[t];v(e),E(e.$$)}for(v(null),b.length=0;x.length;)x.pop()();for(let t=0;t<$.length;t+=1){const e=$[t];N.has(e)||(N.add(e),e())}$.length=0}while(b.length);for(;w.length;)w.pop()();S=!1,A=!1,N.clear()}}function E(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(_)}}const M=new Set;function j(t,e){-1===t.$$.dirty[0]&&(b.push(t),S||(S=!0,k.then(C)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function P(c,i,l,u,a,d,f=[-1]){const h=y;v(c);const g=i.props||{},p=c.$$={fragment:null,ctx:null,props:d,update:t,not_equal:a,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:n(),dirty:f,skip_bound:!1};let m=!1;if(p.ctx=l?l(c,g,((t,e,...n)=>{const o=n.length?n[0]:e;return p.ctx&&a(p.ctx[t],p.ctx[t]=o)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](o),m&&j(c,t)),e})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!u&&u(p.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);p.fragment&&p.fragment.l(t),t.forEach(s)}else p.fragment&&p.fragment.c();i.intro&&((b=c.$$.fragment)&&b.i&&(M.delete(b),b.i(x))),function(t,n,c){const{fragment:i,on_mount:l,on_destroy:s,after_update:u}=t.$$;i&&i.m(n,c),_((()=>{const n=l.map(e).filter(r);s?s.push(...n):o(n),t.$$.on_mount=[]})),u.forEach(_)}(c,i.target,i.anchor),C()}var b,x;v(h)}
/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
function L(t,e,n,o){return new(n||(n=Promise))((function(r,c){function i(t){try{s(o.next(t))}catch(t){c(t)}}function l(t){try{s(o.throw(t))}catch(t){c(t)}}function s(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,l)}s((o=o.apply(t,e||[])).next())}))}function z(t){return L(this,void 0,void 0,(function*(){const e=yield function(){return L(this,void 0,void 0,(function*(){const t=yield fetch("/data/lotr_nocomment.json"),e=yield t.json();return e.dates&&(e.dates=T(e.dates),Array.from(e.dates.keys()).forEach((t=>{e.dates.get(t).characters&&(e.dates.get(t).characters=T(e.dates.get(t).characters))}))),console.log("ret:",e),e}))}();let n=new Map;return Array.from(e.dates.keys()).forEach((o=>{let r=e.dates.get(o);r.characters.has(t)&&n.set(o,r.characters.get(t))})),n}))}function T(t){let e=new Map;for(let n of Object.keys(t))e.set(n,t[n]);return e}function O(t){return L(this,void 0,void 0,(function*(){const e=yield function(){return L(this,void 0,void 0,(function*(){const t=yield fetch("/data/places.json");return T(yield t.json())}))}();return console.log(`Get Coords for Place : "${t}"`),console.log("Places:",e),console.log("Has:",e.has(t)),e.has(t)?e.get(t):void 0}))}function H(t,e,n){const o=t.slice();return o[20]=e[n],o}function B(e){let n,o,r=e[20]+"";return{c(){n=u("option"),o=d(r),n.__value=e[20],n.value=n.__value},m(t,e){l(t,n,e),i(n,o)},p:t,d(t){t&&s(n)}}}function D(t){let e,n,r,c,a,y,v,b,x,$,w,k,S=t[0][t[2]]+"";return{c(){e=u("label"),n=d("Date: "),r=d(S),c=f(),a=u("input"),v=f(),b=u("label"),b.textContent="draw Path?",x=f(),$=u("input"),g(e,"for","date-index"),g(a,"type","range"),g(a,"id","date-index"),g(a,"name","date-index"),g(a,"min","0"),g(a,"max",y=t[7].get(G).size-1),g(a,"class","svelte-1uthr1r"),g(b,"for","include-path"),g($,"type","checkbox"),g($,"name","include-path"),g($,"class","svelte-1uthr1r")},m(o,s){l(o,e,s),i(e,n),i(e,r),l(o,c,s),l(o,a,s),m(a,t[2]),l(o,v,s),l(o,b,s),l(o,x,s),l(o,$,s),$.checked=t[1],w||(k=[h(a,"change",t[10]),h(a,"input",t[10]),h($,"change",t[11])],w=!0)},p(t,e){5&e&&S!==(S=t[0][t[2]]+"")&&p(r,S),128&e&&y!==(y=t[7].get(G).size-1)&&g(a,"max",y),4&e&&m(a,t[2]),2&e&&($.checked=t[1])},d(t){t&&s(e),t&&s(c),t&&s(a),t&&s(v),t&&s(b),t&&s(x),t&&s($),w=!1,o(k)}}}function F(e){let n,r,c,m,y,v,b,x,$,w,k,S,_,A,N,C,E,M,j,P,L,z,T,O,F,q=e[7].size>0&&e[7].get(G).size>0,I=e[9],R=[];for(let t=0;t<I.length;t+=1)R[t]=B(H(e,I,t));let V=q&&D(e);return{c(){n=u("header"),r=u("div"),r.innerHTML="<h2>Lord of the Rings - Interactive Path Map</h2>",c=f(),m=u("div"),y=u("label"),y.textContent="Character:",v=f(),b=u("select");for(let t=0;t<R.length;t+=1)R[t].c();x=f(),$=u("label"),$.textContent="Latest Location:",w=u("span"),k=d(e[3]),S=f(),V&&V.c(),_=f(),A=u("label"),A.textContent="show Coordinates on Click",N=f(),C=u("input"),E=f(),M=u("main"),j=a("svg"),P=a("image"),L=a("g"),z=f(),T=u("footer"),T.innerHTML='<div>Map based on <a href="https://github.com/k1tesurfen/mapome">Map of Middle-Earth</a> by k1tesurfen licensed under terms of the Creative Commons Attribution Share Alike 4.0 license (cc-by-sa-4.0).</div>',g(r,"id","header"),g(y,"for","char"),g($,"for","loc"),g(w,"id","loc"),g(w,"name","loc"),g(A,"for","include-path"),g(C,"type","checkbox"),g(C,"name","include-path"),g(C,"class","svelte-1uthr1r"),g(m,"id","controls"),g(m,"class","svelte-1uthr1r"),g(n,"class","svelte-1uthr1r"),g(P,"x","0"),g(P,"y","0"),g(P,"href","/img/mapome-slim.svg"),g(P,"width","100%"),g(P,"height","100%"),g(L,"id","drawing"),g(j,"id","map"),g(j,"viewBox","0 0 3200 2400"),g(j,"version","1.1"),g(j,"xmlns","http://www.w3.org/2000/svg"),g(T,"class","svelte-1uthr1r")},m(t,o){l(t,n,o),i(n,r),i(n,c),i(n,m),i(m,y),i(m,v),i(m,b);for(let t=0;t<R.length;t+=1)R[t].m(b,null);i(m,x),i(m,$),i(m,w),i(w,k),i(m,S),V&&V.m(m,null),i(m,_),i(m,A),i(m,N),i(m,C),C.checked=e[5],l(t,E,o),l(t,M,o),i(M,j),i(j,P),i(j,L),e[13](L),e[14](j),l(t,z,o),l(t,T,o),O||(F=[h(C,"change",e[12]),h(j,"click",e[8])],O=!0)},p(t,[e]){if(512&e){let n;for(I=t[9],n=0;n<I.length;n+=1){const o=H(t,I,n);R[n]?R[n].p(o,e):(R[n]=B(o),R[n].c(),R[n].m(b,null))}for(;n<R.length;n+=1)R[n].d(1);R.length=I.length}8&e&&p(k,t[3]),128&e&&(q=t[7].size>0&&t[7].get(G).size>0),q?V?V.p(t,e):(V=D(t),V.c(),V.m(m,_)):V&&(V.d(1),V=null),32&e&&(C.checked=t[5])},i:t,o:t,d(t){t&&s(n),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(R,t),V&&V.d(),t&&s(E),t&&s(M),e[13](null),e[14](null),t&&s(z),t&&s(T),O=!1,o(F)}}}let G="Frodo";function q(t,e,n){let o,r,c,i=!1;function l(t,e){console.log("drawnow");var n=document.createElementNS("http://www.w3.org/2000/svg","circle");n.setAttributeNS(null,"width",100),n.setAttributeNS(null,"cx",t.toString()),n.setAttributeNS(null,"cy",e.toString()),n.setAttributeNS(null,"r","6"),n.setAttributeNS(null,"fill","red"),c.appendChild(n)}function s(t,e){const n=[O(t)];n.push(O(e)),Promise.all(n).then((t=>{!function(t,e,n=!0){var o=document.createElementNS("http://www.w3.org/2000/svg","line");o.setAttributeNS(null,"x1",t.x.toString()),o.setAttributeNS(null,"y1",t.y.toString()),o.setAttributeNS(null,"x2",e.x.toString()),o.setAttributeNS(null,"y2",e.y.toString()),o.setAttributeNS(null,"stroke","red"),o.setAttributeNS(null,"stroke-width","3"),c.appendChild(o),n&&(l(t.x,t.y),l(e.x,e.y))}(t[0],t[1])}))}let u=[void 0];let a=new Map;function d(t){return t?a.get(G).get(t):""}z(G).then((t=>{n(7,a=a.set(G,t)),console.log("CharData:",a),n(0,u=a.has(G)?Array.from(a.get(G).keys()):[void 0])}));let f=!0,h=0;return t.$$.update=()=>{5&t.$$.dirty&&n(3,o=d(u[h])),15&t.$$.dirty&&O(o).then((t=>{if(t)if(Array.from(c.childNodes).forEach((t=>{c.removeChild(t)})),f&&h>0){let t=o;u.slice(0,h).reverse().forEach((e=>{const n=d(e);s(t,n),t=n}))}else l(t.x,t.y)}))},[u,f,h,o,r,i,c,a,function(t){const e=r.createSVGPoint();e.x=t.clientX,e.y=t.clientY;const n=e.matrixTransform(r.getScreenCTM().inverse());console.log(n.x),console.log(n.y),i&&alert("x: "+n.x+" y:"+n.y)},["Frodo"],function(){var t;t=this.value,h=""===t?null:+t,n(2,h)},function(){f=this.checked,n(1,f)},function(){i=this.checked,n(5,i)},function(t){x[t?"unshift":"push"]((()=>{c=t,n(6,c)}))},function(t){x[t?"unshift":"push"]((()=>{r=t,n(4,r)}))}]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),P(this,t,q,F,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
