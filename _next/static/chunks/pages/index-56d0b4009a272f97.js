(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return a(6507)}])},6507:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return r},default:function(){return s}});var i=a(5893),n=a(7294);let o=e=>{let t=0;for(let a=0;a<e.length;a++)t=(t<<5)-t+e.charCodeAt(a)&4294967295;return Math.abs(t).toString(36)};var r=!0;function s(e){let{data:t}=function(e){let t=JSON.stringify({query:e.query,variables:e.variables}),a=n.useMemo(()=>o(t),[t]),[i,r]=n.useState(e.data),[s,d]=n.useState(!1),[l,u]=n.useState(!1),[c,p]=n.useState(!1);return n.useEffect(()=>{d(!0),r(e.data),parent.postMessage({type:"url-changed"})},[a]),n.useEffect(()=>{if(l){let e=function(e){let t;let a=e.target.getAttributeNames().find(e=>e.startsWith("data-tina-field"));if(a)e.preventDefault(),e.stopPropagation(),t=e.target.getAttribute(a);else{let a=e.target.closest("[data-tina-field], [data-tina-field-overlay]");if(a){let i=a.getAttributeNames().find(e=>e.startsWith("data-tina-field"));i&&(e.preventDefault(),e.stopPropagation(),t=a.getAttribute(i))}}t&&c&&parent.postMessage({type:"field:selected",fieldName:t},window.location.origin)},t=document.createElement("style");return t.type="text/css",t.textContent=`
        [data-tina-field] {
          outline: 2px dashed rgba(34,150,254,0.5);
          transition: box-shadow ease-out 150ms;
        }
        [data-tina-field]:hover {
          box-shadow: inset 100vi 100vh rgba(34,150,254,0.3);
          outline: 2px solid rgba(34,150,254,1);
          cursor: pointer;
        }
        [data-tina-field-overlay] {
          outline: 2px dashed rgba(34,150,254,0.5);
          position: relative;
        }
        [data-tina-field-overlay]:hover {
          cursor: pointer;
          outline: 2px solid rgba(34,150,254,1);
        }
        [data-tina-field-overlay]::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 20;
          transition: opacity ease-out 150ms;
          background-color: rgba(34,150,254,0.3);
          opacity: 0;
        }
        [data-tina-field-overlay]:hover::after {
          opacity: 1;
        }
      `,document.head.appendChild(t),document.body.classList.add("__tina-quick-editing-enabled"),document.addEventListener("click",e,!0),()=>{document.removeEventListener("click",e,!0),document.body.classList.remove("__tina-quick-editing-enabled"),t.remove()}}},[l,c]),n.useEffect(()=>{(null==e?void 0:e.experimental___selectFormByFormId)&&parent.postMessage({type:"user-select-form",formId:e.experimental___selectFormByFormId()})},[a]),n.useEffect(()=>{let{experimental___selectFormByFormId:t,...i}=e;return parent.postMessage({type:"open",...i,id:a},window.location.origin),window.addEventListener("message",e=>{"quickEditEnabled"===e.data.type&&u(e.data.value),e.data.id===a&&"updateData"===e.data.type&&(r(e.data.data),p(!0),document.querySelector("[data-tina-field]")?parent.postMessage({type:"quick-edit",value:!0},window.location.origin):parent.postMessage({type:"quick-edit",value:!1},window.location.origin))}),()=>{parent.postMessage({type:"close",id:a},window.location.origin)}},[a,u]),{data:i,isClient:s}}({query:e.query,variables:e.variables,data:e.data});return(0,i.jsxs)("div",{className:"mx-auto max-w-4xl py-10 px-4",children:[(0,i.jsx)("h1",{className:"text-4xl font-bold mb-6",children:t.page.title}),(0,i.jsx)("div",{className:"prose",dangerouslySetInnerHTML:{__html:t.page.body}})]})}}},function(e){e.O(0,[888,903,179],function(){return e(e.s=8312)}),_N_E=e.O()}]);