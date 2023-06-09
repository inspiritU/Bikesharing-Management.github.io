/*
 Copyright (C) Federico Zivolo 2017
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */function getStyleComputedProperty(a,b){if(1!==a.nodeType)return[];const c=window.getComputedStyle(a,null);return b?c[b]:c}function getParentNode(a){return'HTML'===a.nodeName?a:a.parentNode||a.host}function getScrollParent(a){if(!a||-1!==['HTML','BODY','#document'].indexOf(a.nodeName))return window.document.body;const{overflow:b,overflowX:c,overflowY:d}=getStyleComputedProperty(a);return /(auto|scroll)/.test(b+d+c)?a:getScrollParent(getParentNode(a))}function getOffsetParent(a){const b=a&&a.offsetParent,c=b&&b.nodeName;return c&&'BODY'!==c&&'HTML'!==c?-1!==['TD','TABLE'].indexOf(b.nodeName)&&'static'===getStyleComputedProperty(b,'position')?getOffsetParent(b):b:window.document.documentElement}function isOffsetContainer(a){const{nodeName:b}=a;return'BODY'!==b&&('HTML'===b||getOffsetParent(a.firstElementChild)===a)}function getRoot(a){return null===a.parentNode?a:getRoot(a.parentNode)}function findCommonOffsetParent(a,b){if(!a||!a.nodeType||!b||!b.nodeType)return window.document.documentElement;const c=a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING,d=c?a:b,e=c?b:a,f=document.createRange();f.setStart(d,0),f.setEnd(e,0);const{commonAncestorContainer:g}=f;if(a!==g&&b!==g||d.contains(e))return isOffsetContainer(g)?g:getOffsetParent(g);const h=getRoot(a);return h.host?findCommonOffsetParent(h.host,b):findCommonOffsetParent(a,getRoot(b).host)}function getScroll(a,b='top'){const c='top'===b?'scrollTop':'scrollLeft',d=a.nodeName;if('BODY'===d||'HTML'===d){const a=window.document.documentElement,b=window.document.scrollingElement||a;return b[c]}return a[c]}function includeScroll(a,b,c=!1){const d=getScroll(b,'top'),e=getScroll(b,'left'),f=c?-1:1;return a.top+=d*f,a.bottom+=d*f,a.left+=e*f,a.right+=e*f,a}function getBordersSize(a,b){const c='x'===b?'Left':'Top',d='Left'==c?'Right':'Bottom';return+a[`border${c}Width`].split('px')[0]+ +a[`border${d}Width`].split('px')[0]}let isIE10;var isIE10$1=function(){return void 0==isIE10&&(isIE10=-1!==navigator.appVersion.indexOf('MSIE 10')),isIE10};function getSize(a,b,c,d){return Math.max(b[`offset${a}`],c[`client${a}`],c[`offset${a}`],isIE10$1()?c[`offset${a}`]+d[`margin${'Height'===a?'Top':'Left'}`]+d[`margin${'Height'===a?'Bottom':'Right'}`]:0)}function getWindowSizes(){const a=window.document.body,b=window.document.documentElement,c=isIE10$1()&&window.getComputedStyle(b);return{height:getSize('Height',a,b,c),width:getSize('Width',a,b,c)}}var _extends=Object.assign||function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a};function getClientRect(a){return _extends({},a,{right:a.left+a.width,bottom:a.top+a.height})}function getBoundingClientRect(a){let b={};if(isIE10$1())try{b=a.getBoundingClientRect();const c=getScroll(a,'top'),d=getScroll(a,'left');b.top+=c,b.left+=d,b.bottom+=c,b.right+=d}catch(a){}else b=a.getBoundingClientRect();const c={left:b.left,top:b.top,width:b.right-b.left,height:b.bottom-b.top},d='HTML'===a.nodeName?getWindowSizes():{},e=d.width||a.clientWidth||c.right-c.left,f=d.height||a.clientHeight||c.bottom-c.top;let g=a.offsetWidth-e,h=a.offsetHeight-f;if(g||h){const b=getStyleComputedProperty(a);g-=getBordersSize(b,'x'),h-=getBordersSize(b,'y'),c.width-=g,c.height-=h}return getClientRect(c)}function getOffsetRectRelativeToArbitraryNode(a,b){const c=isIE10$1(),d='HTML'===b.nodeName,e=getBoundingClientRect(a),f=getBoundingClientRect(b),g=getScrollParent(a),h=getStyleComputedProperty(b),i=+h.borderTopWidth.split('px')[0],j=+h.borderLeftWidth.split('px')[0];let k=getClientRect({top:e.top-f.top-i,left:e.left-f.left-j,width:e.width,height:e.height});if(k.marginTop=0,k.marginLeft=0,!c&&d){const a=+h.marginTop.split('px')[0],b=+h.marginLeft.split('px')[0];k.top-=i-a,k.bottom-=i-a,k.left-=j-b,k.right-=j-b,k.marginTop=a,k.marginLeft=b}return(c?b.contains(g):b===g&&'BODY'!==g.nodeName)&&(k=includeScroll(k,b)),k}function getViewportOffsetRectRelativeToArtbitraryNode(a){var b=Math.max;const c=window.document.documentElement,d=getOffsetRectRelativeToArbitraryNode(a,c),e=b(c.clientWidth,window.innerWidth||0),f=b(c.clientHeight,window.innerHeight||0),g=getScroll(c),h=getScroll(c,'left'),i={top:g-d.top+d.marginTop,left:h-d.left+d.marginLeft,width:e,height:f};return getClientRect(i)}function isFixed(a){const b=a.nodeName;return'BODY'===b||'HTML'===b?!1:!('fixed'!==getStyleComputedProperty(a,'position'))||isFixed(getParentNode(a))}function getBoundaries(a,b,c,d){let e={top:0,left:0};const f=findCommonOffsetParent(a,b);if('viewport'===d)e=getViewportOffsetRectRelativeToArtbitraryNode(f);else{let b;'scrollParent'===d?(b=getScrollParent(getParentNode(a)),'BODY'===b.nodeName&&(b=window.document.documentElement)):'window'===d?b=window.document.documentElement:b=d;const c=getOffsetRectRelativeToArbitraryNode(b,f);if('HTML'===b.nodeName&&!isFixed(f)){const{height:a,width:b}=getWindowSizes();e.top+=c.top-c.marginTop,e.bottom=a+c.top,e.left+=c.left-c.marginLeft,e.right=b+c.left}else e=c}return e.left+=c,e.top+=c,e.right-=c,e.bottom-=c,e}function getArea({width:a,height:b}){return a*b}function computeAutoPlacement(a,b,c,d,e,f=0){if(-1===a.indexOf('auto'))return a;const g=getBoundaries(c,d,f,e),h={top:{width:g.width,height:b.top-g.top},right:{width:g.right-b.right,height:g.height},bottom:{width:g.width,height:g.bottom-b.bottom},left:{width:b.left-g.left,height:g.height}},i=Object.keys(h).map((a)=>_extends({key:a},h[a],{area:getArea(h[a])})).sort((c,a)=>a.area-c.area),j=i.filter(({width:a,height:b})=>a>=c.clientWidth&&b>=c.clientHeight),k=0<j.length?j[0].key:i[0].key,l=a.split('-')[1];return k+(l?`-${l}`:'')}const nativeHints=['native code','[object MutationObserverConstructor]'];var isNative=(a)=>nativeHints.some((b)=>-1<(a||'').toString().indexOf(b));const isBrowser='undefined'!=typeof window,longerTimeoutBrowsers=['Edge','Trident','Firefox'];let timeoutDuration=0;for(let a=0;a<longerTimeoutBrowsers.length;a+=1)if(isBrowser&&0<=navigator.userAgent.indexOf(longerTimeoutBrowsers[a])){timeoutDuration=1;break}function microtaskDebounce(a){let b=!1,c=0;const d=document.createElement('span'),e=new MutationObserver(()=>{a(),b=!1});return e.observe(d,{attributes:!0}),()=>{b||(b=!0,d.setAttribute('x-index',c),++c)}}function taskDebounce(a){let b=!1;return()=>{b||(b=!0,setTimeout(()=>{b=!1,a()},timeoutDuration))}}const supportsNativeMutationObserver=isBrowser&&isNative(window.MutationObserver);var debounce=supportsNativeMutationObserver?microtaskDebounce:taskDebounce;function find(a,b){return Array.prototype.find?a.find(b):a.filter(b)[0]}function findIndex(a,b,c){if(Array.prototype.findIndex)return a.findIndex((a)=>a[b]===c);const d=find(a,(a)=>a[b]===c);return a.indexOf(d)}function getOffsetRect(a){let b;if('HTML'===a.nodeName){const{width:a,height:c}=getWindowSizes();b={width:a,height:c,left:0,top:0}}else b={width:a.offsetWidth,height:a.offsetHeight,left:a.offsetLeft,top:a.offsetTop};return getClientRect(b)}function getOuterSizes(a){const b=window.getComputedStyle(a),c=parseFloat(b.marginTop)+parseFloat(b.marginBottom),d=parseFloat(b.marginLeft)+parseFloat(b.marginRight),e={width:a.offsetWidth+d,height:a.offsetHeight+c};return e}function getOppositePlacement(a){const b={left:'right',right:'left',bottom:'top',top:'bottom'};return a.replace(/left|right|bottom|top/g,(a)=>b[a])}function getPopperOffsets(a,b,c){c=c.split('-')[0];const d=getOuterSizes(a),e={width:d.width,height:d.height},f=-1!==['right','left'].indexOf(c),g=f?'top':'left',h=f?'left':'top',i=f?'height':'width',j=f?'width':'height';return e[g]=b[g]+b[i]/2-d[i]/2,e[h]=c===h?b[h]-d[j]:b[getOppositePlacement(h)],e}function getReferenceOffsets(a,b,c){const d=findCommonOffsetParent(b,c);return getOffsetRectRelativeToArbitraryNode(c,d)}function getSupportedPropertyName(a){const b=[!1,'ms','Webkit','Moz','O'],c=a.charAt(0).toUpperCase()+a.slice(1);for(let d=0;d<b.length-1;d++){const e=b[d],f=e?`${e}${c}`:a;if('undefined'!=typeof window.document.body.style[f])return f}return null}function isFunction(a){return a&&'[object Function]'==={}.toString.call(a)}function isModifierEnabled(a,b){return a.some(({name:a,enabled:c})=>c&&a===b)}function isModifierRequired(a,b,c){const d=find(a,({name:a})=>a===b),e=!!d&&a.some((a)=>a.name===c&&a.enabled&&a.order<d.order);if(!e){const a=`\`${b}\``,d=`\`${c}\``;console.warn(`${d} modifier is required by ${a} modifier in order to work, be sure to include it before ${a}!`)}return e}function isNumeric(a){return''!==a&&!isNaN(parseFloat(a))&&isFinite(a)}function removeEventListeners(a,b){return window.removeEventListener('resize',b.updateBound),b.scrollParents.forEach((a)=>{a.removeEventListener('scroll',b.updateBound)}),b.updateBound=null,b.scrollParents=[],b.scrollElement=null,b.eventsEnabled=!1,b}function runModifiers(a,b,c){const d=void 0===c?a:a.slice(0,findIndex(a,'name',c));return d.forEach((a)=>{a.function&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');const c=a.function||a.fn;a.enabled&&isFunction(c)&&(b.offsets.popper=getClientRect(b.offsets.popper),b.offsets.reference=getClientRect(b.offsets.reference),b=c(b,a))}),b}function setAttributes(a,b){Object.keys(b).forEach(function(c){const d=b[c];!1===d?a.removeAttribute(c):a.setAttribute(c,b[c])})}function setStyles(a,b){Object.keys(b).forEach((c)=>{let d='';-1!==['width','height','top','right','bottom','left'].indexOf(c)&&isNumeric(b[c])&&(d='px'),a.style[c]=b[c]+d})}function attachToScrollParents(a,b,c,d){const e='BODY'===a.nodeName,f=e?window:a;f.addEventListener(b,c,{passive:!0}),e||attachToScrollParents(getScrollParent(f.parentNode),b,c,d),d.push(f)}function setupEventListeners(a,b,c,d){c.updateBound=d,window.addEventListener('resize',c.updateBound,{passive:!0});const e=getScrollParent(a);return attachToScrollParents(e,'scroll',c.updateBound,c.scrollParents),c.scrollElement=e,c.eventsEnabled=!0,c}var index={computeAutoPlacement,debounce,findIndex,getBordersSize,getBoundaries,getBoundingClientRect,getClientRect,getOffsetParent,getOffsetRect,getOffsetRectRelativeToArbitraryNode,getOuterSizes,getParentNode,getPopperOffsets,getReferenceOffsets,getScroll,getScrollParent,getStyleComputedProperty,getSupportedPropertyName,getWindowSizes,isFixed,isFunction,isModifierEnabled,isModifierRequired,isNative,isNumeric,removeEventListeners,runModifiers,setAttributes,setStyles,setupEventListeners};export{computeAutoPlacement,debounce,findIndex,getBordersSize,getBoundaries,getBoundingClientRect,getClientRect,getOffsetParent,getOffsetRect,getOffsetRectRelativeToArbitraryNode,getOuterSizes,getParentNode,getPopperOffsets,getReferenceOffsets,getScroll,getScrollParent,getStyleComputedProperty,getSupportedPropertyName,getWindowSizes,isFixed,isFunction,isModifierEnabled,isModifierRequired,isNative,isNumeric,removeEventListeners,runModifiers,setAttributes,setStyles,setupEventListeners};export default index;
//# sourceMappingURL=popper-utils.min.js.map