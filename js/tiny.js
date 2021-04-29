function iselm(elm){return elm instanceof Element||elm instanceof HTMLDocument}
function islist(elm){return NodeList.prototype.isPrototypeOf(elm)}
function byid(sel,doc){return iselm(sel) ? sel : (doc||document)['getElementById'](sel)}
function all(sel,doc){return islist(sel)? sel : (doc||document)['querySelectorAll'](sel)}
function one(sel,doc){return iselm(sel)? sel : (doc||document)['querySelector'](sel)}
function log(arg){console.log(arg)}
function len(arg){return isstr(arg)||Array.isArray(arg) ? arg.length : Object.keys(arg).length}
function isset(arg){return typeof arg !== 'undefined'}
function isarr(arr){return arr && Array.isArray(arr)}
function isstr(str){return str && typeof(str)==='string'||str instanceof String}
function str(v){return v!=='undefined' ? v.outerHTML : v.toString()}
function isobj(obj){return obj && typeof obj==='object' && obj.constructor===Object}
function ishtml(str){return /<[a-z/][\s\S]*>/i.test(str)}
function arr2obj(arr){let n, obj={}; for(n in arr){ let p = arr[n].split('='); obj[p[0]] = p[1] } return obj}
function toelm(htm){let elm = document.createElement('div'); elm.innerHTML=htm; return elm.firstChild}
function insert(elm,doc,pos){elm.insertAdjacentHTML(pos||'beforeend',doc)}/*pos=beforebegin/afterbegin/beforeend/afterend*/
function append(elm,doc){iselm(doc) ? elm.appendChild(doc) : elm.innerHTML=elm.innerHTML+doc}
function eclone(e,p){return p>=0?e[p].cloneNode(true):e[e.length+p].cloneNode(true)}
function loop(a,fn){for(let k in a) if(a.hasOwnProperty(k))fn(k,a[k])}
function obj2str(O){let st='';loop(O,function(k,v){st+= k+'='+v+'&'});return st.slice(0,-1)}
function arr2obj(arr){let i,o={};for(i in arr){let pos=arr[i].indexOf('='); o[arr[i].slice(0,pos)]=arr[i].slice(pos+1)}return o}
function on(elm, ev, fn){elm.addEventListener ? elm.addEventListener(ev,fn,false) : elm.attachEvent ? elm.attachEvent("on"+ev,fn) : elm["on"+ev]=fn;}
function off(elm, ev, fn){elm.removeEventListener ? elm.removeEventListener(ev,fn,false) : elm.detachEvent ? elm.detachEvent("on"+ev,fn) : elm["on"+ev]=null;}
function each(arr, fn){for(var i=0,l=arr.length; i<l; i++) if(fn.call(i, arr[i])===false)break}
function attr(els, att, val){if(val==void 0) return els[0].getAttribute(att);each(els,function(el){val ? el.setAttribute(att,val) : el.removeAttribute(att)});}
function eclone(e,p){return p>=0?e[p].cloneNode(true):e[e.length+p].cloneNode(true)}
function uri(u){let a=document.createElement('a'); a.href=u||location.href;a.param = arr2obj(a.search.substr(1).split('&'));return a}
function obj2url(obj){let k,str='';for(k in obj)str += k+'='+obj[k]+'&'; return str.slice(0,-1)}
function merge(obj1, obj2){loop(obj2, function(k, v){ obj1[k] = v }); return obj1}
function addprm(){qp=merge(qp,arr2obj(arguments)); return url.turl+'?'+obj2str(qp)}
function extract(data, where){for(var key in data) where[key]=data[key]}
function tag(tag, att, htm){
	let elm=document.createElement(tag);
	att=isarr(att) ? arr2obj(att) : att;
	if(!isstr(att)) for(let key in att) elm.setAttribute(key, att[key]);
	else if(htm==void 0) htm = att;
	if(isset(htm)) isstr(htm) ? elm.innerHTML=htm:elm.appendChild(htm);
	return elm;
}
function ajax(u,fn,d,m){
	var xh=new XMLHttpRequest();
	xh.open((m||(d?'POST':'GET')),u,true);
	xh.setRequestHeader('Content-Type','application/x-www-form-urlencoded;charset=UTF-8');
	xh.onreadystatechange=function(){if(this.readyState==4&&this.status==200)fn(this.responseText)};
	xh.send(d);
}
function store(n, v){
	if(n=='clear') localStorage.clear();
	else if(v === void 0) return localStorage.getItem(n);
	else if(v === 'remove') localStorage.removeItem(n);
	else localStorage.setItem(n, v);
}
function addClass(el, name){
	 if(el.classList) el.classList.add(name);
	 else{let a=el.className.split(' '),p=a.indexOf(name); if(p<0) el.className=a.push(name).join(' ')}
}
function removeClass(el, name){
	 if(el.classList) el.classList.remove(name);
	 else{let a=el.className.split(' '),p=a.indexOf(name); if(p>-1)el.className=a.splice(p,1).join(' ')}
}
function toggleClass(el, name){
	 if(el.classList) el.classList.toggle(name);
	 else{let a=el.className.split(' '),p=a.indexOf(name); el.className=(p<0? a.push(name) : a.splice(p,1)).join(' ')}
}
function url(){
	var url=location;
	baseUrl = one('base').href,
	baseDir = baseUrl.replace(url.origin, '');
	url.paths = url.pathname.replace(baseDir,'').replace(/^\/+/,'').replace(/\/$/,'').split('/');
	var query = url.search.substr(1);
	url.params = query ? arr2obj(query.split('&')) : {};
	url.turl   = url.href.replace(url.search, '');
	url.base   = baseUrl;
	return url;
}
function mkURL(uri){return url().turl.replace(/\/$/, "") + '/' + uri;}
function setActive(el){
    if(el.nodeName=='BODY') return;
    if(el.nodeName=='LI') addClass(el, 'active');
    setActive(el.parentNode);
}
function filter(e,v,start){
	let txt=e.textContent||e.innerText;
	if(txt){
		if(start||true)e.style.display=txt.toLowerCase().startsWith(v.toLowerCase())?'':'none';
		else e.style.display=txt.toLowerCase().indexOf(v.toLowerCase())>-1?'':'none';
	}
}
function ready(callback){
    document.readyState != 'loading' ? callback() : document.addEventListener('DOMContentLoaded', callback);  
}
function autoRun(callback, time, infinity){
    infinity ? setInterval(callback, time) : window.setTimeout(callback, time);
}
/*****	Super Dyanmic Dom Element Object	*****/
var Dom=function(sel,doc){
	this.sel = sel||document;
	var els=iselm(this.sel)?this.sel:(doc||document)["querySelectorAll"](this.sel);
	if(els.nodeType || iselm(els) || els === window) els = [els];
	 this.length = els.length;
	 for (var i=0, l = els.length; i < l; i++) this[i] = els[i];
},	dom = Dom.prototype;
S=function(sel,doc){return new Dom(sel,doc)}
dom.each  = function(fn){each(this,fn); return this}
dom.append= function(doc){this.each(function(el){append(el, doc)}); return this}
dom.insert= function(doc, pos){this.each(function(el){insert(el, doc, pos)}); return this}
dom.filter= function(v,st){this.each(function(el){filter(el,v,st)});return this}
dom.on    = function(ev, fn){this.each(function(el){ on(el,ev,fn)}); return this}
dom.off   = function(ev, fn){this.each(function(el){off(el,ev,fn)}); return this}
dom.tag   = function(tg, at, ht){this.each(function(el){append(el, tag(tg, at, ht))}); return this}
dom.css   = function(pro, val){this.each(function(el){val!==void 0 ? el.style[pro]=val : el.style=pro}); return this}
dom.attr  = function(att, val){if(val===void 0) return this[0].getAttribute(att); attr(this, att, val); return this}
dom.val   = function(val){if(val===void 0)return this[0].value;this.each(function(el){el.value=val}); return this}
dom.html  = function(htm){if(htm===void 0)return this[0].innerHTML;this.each(function(el){el.innerHTML=htm}); return this}
dom.addClass = function(cName){this.each(function(el){addClass(el, cName)}); return this}
dom.removeClass = function(cName){this.each(function(el){removeClass(el, cName)}); return this}
dom.toggleClass = function(cName){this.each(function(el){toggleClass(el, cName)}); return this}