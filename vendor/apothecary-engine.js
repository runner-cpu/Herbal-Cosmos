var Jc=0,Il=1,$c=2;var bi=1,Kc=2,fs=3,Bn=0,Ne=1,we=2,En=0,gi=1,Pl=2,Ll=3,Dl=4,Qc=5;var $n=100,jc=101,th=102,eh=103,nh=104,ih=200,sh=201,rh=202,ah=203,na=204,ia=205,oh=206,lh=207,ch=208,hh=209,uh=210,dh=211,fh=212,ph=213,mh=214,sa=0,ra=1,aa=2,_i=3,oa=4,la=5,ca=6,ha=7,Ha=0,gh=1,_h=2,fn=0,Ul=1,Nl=2,Fl=3,fr=4,Ol=5,Bl=6,zl=7;var kl=300,ri=301,Ei=302,Wa=303,Xa=304,pr=306,zn=1e3,vn=1001,ua=1002,Pe=1003,xh=1004;var mr=1005;var Ue=1006,qa=1007;var ai=1008;var Xe=1009,Vl=1010,Gl=1011,ps=1012,Ya=1013,pn=1014,rn=1015,Tn=1016,Za=1017,Ja=1018,ms=1020,Hl=35902,Wl=35899,Xl=1021,ql=1022,an=1023,yn=1026,oi=1027,$a=1028,Ka=1029,Ti=1030,Qa=1031;var ja=1033,gr=33776,_r=33777,xr=33778,vr=33779,to=35840,eo=35841,no=35842,io=35843,so=36196,ro=37492,ao=37496,oo=37488,lo=37489,co=37490,ho=37491,uo=37808,fo=37809,po=37810,mo=37811,go=37812,_o=37813,xo=37814,vo=37815,yo=37816,Mo=37817,So=37818,bo=37819,Eo=37820,To=37821,wo=36492,Ao=36494,Co=36495,Ro=36283,Io=36284,Po=36285,Lo=36286;var Hs=2300,da=2301,ta=2302,yl=2303,Ml=2400,Sl=2401,bl=2402;var vh=3200;var Do=0,yh=1,mn="",xe="srgb",xi="srgb-linear",Ws="linear",ie="srgb";var mi=7680;var El=519,Mh=512,Sh=513,bh=514,Uo=515,Eh=516,Th=517,No=518,wh=519,Tl=35044,Yl=35048;var Zl="300 es",dn=2e3,Qi=2001;function yu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Mu(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ji(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ah(){let i=ji("canvas");return i.style.display="block",i}var vc={},ts=null;function Jl(...i){let t="THREE."+i.shift();ts?ts("log",t,...i):console.log(t,...i)}function Ch(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Lt(...i){i=Ch(i);let t="THREE."+i.shift();if(ts)ts("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Ut(...i){i=Ch(i);let t="THREE."+i.shift();if(ts)ts("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Xs(...i){let t=i.join(" ");t in vc||(vc[t]=!0,Lt(...i))}function Rh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Ih={[sa]:ra,[aa]:ca,[oa]:ha,[_i]:la,[ra]:sa,[ca]:aa,[ha]:oa,[la]:_i},kn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],yc=1234567,$i=Math.PI/180,es=180/Math.PI;function gs(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function qt(i,t,e){return Math.max(t,Math.min(e,i))}function $l(i,t){return(i%t+t)%t}function Su(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function bu(i,t,e){return i!==t?(e-i)/(t-i):0}function ks(i,t,e){return(1-e)*i+e*t}function Eu(i,t,e,n){return ks(i,t,1-Math.exp(-e*n))}function Tu(i,t=1){return t-Math.abs($l(i,t*2)-t)}function wu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Au(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Cu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ru(i,t){return i+Math.random()*(t-i)}function Iu(i){return i*(.5-Math.random())}function Pu(i){i!==void 0&&(yc=i);let t=yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lu(i){return i*$i}function Du(i){return i*es}function Uu(i){return(i&i-1)===0&&i!==0}function Nu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Fu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ou(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),d=a((t+n)/2),f=r((t-n)/2),u=a((t-n)/2),h=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*d,l*f,l*u,o*c);break;case"YZY":i.set(l*u,o*d,l*f,o*c);break;case"ZXZ":i.set(l*f,l*u,o*d,o*c);break;case"XZX":i.set(o*d,l*p,l*h,o*c);break;case"YXY":i.set(l*h,o*d,l*p,o*c);break;case"ZYZ":i.set(l*p,l*h,o*d,o*c);break;default:Lt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ji(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ge(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ke={DEG2RAD:$i,RAD2DEG:es,generateUUID:gs,clamp:qt,euclideanModulo:$l,mapLinear:Su,inverseLerp:bu,lerp:ks,damp:Eu,pingpong:Tu,smoothstep:wu,smootherstep:Au,randInt:Cu,randFloat:Ru,randFloatSpread:Iu,seededRandom:Pu,degToRad:Lu,radToDeg:Du,isPowerOfTwo:Uu,ceilPowerOfTwo:Nu,floorPowerOfTwo:Fu,setQuaternionFromProperEuler:Ou,normalize:Ge,denormalize:Ji},xt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},He=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],d=n[s+2],f=n[s+3],u=r[a+0],h=r[a+1],p=r[a+2],_=r[a+3];if(f!==_||l!==u||c!==h||d!==p){let g=l*u+c*h+d*p+f*_;g<0&&(u=-u,h=-h,p=-p,_=-_,g=-g);let m=1-o;if(g<.9995){let y=Math.acos(g),b=Math.sin(y);m=Math.sin(m*y)/b,o=Math.sin(o*y)/b,l=l*m+u*o,c=c*m+h*o,d=d*m+p*o,f=f*m+_*o}else{l=l*m+u*o,c=c*m+h*o,d=d*m+p*o,f=f*m+_*o;let y=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=y,c*=y,d*=y,f*=y}}t[e]=l,t[e+1]=c,t[e+2]=d,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],d=n[s+3],f=r[a],u=r[a+1],h=r[a+2],p=r[a+3];return t[e]=o*p+d*f+l*h-c*u,t[e+1]=l*p+d*u+c*f-o*h,t[e+2]=c*p+d*h+o*u-l*f,t[e+3]=d*p-o*f-l*u-c*h,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(s/2),f=o(r/2),u=l(n/2),h=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*d*f+c*h*p,this._y=c*h*f-u*d*p,this._z=c*d*p+u*h*f,this._w=c*d*f-u*h*p;break;case"YXZ":this._x=u*d*f+c*h*p,this._y=c*h*f-u*d*p,this._z=c*d*p-u*h*f,this._w=c*d*f+u*h*p;break;case"ZXY":this._x=u*d*f-c*h*p,this._y=c*h*f+u*d*p,this._z=c*d*p+u*h*f,this._w=c*d*f-u*h*p;break;case"ZYX":this._x=u*d*f-c*h*p,this._y=c*h*f+u*d*p,this._z=c*d*p-u*h*f,this._w=c*d*f+u*h*p;break;case"YZX":this._x=u*d*f+c*h*p,this._y=c*h*f+u*d*p,this._z=c*d*p-u*h*f,this._w=c*d*f-u*h*p;break;case"XZY":this._x=u*d*f-c*h*p,this._y=c*h*f-u*d*p,this._z=c*d*p+u*h*f,this._w=c*d*f+u*h*p;break;default:Lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],d=e[6],f=e[10],u=n+o+f;if(u>0){let h=.5/Math.sqrt(u+1);this._w=.25/h,this._x=(d-l)*h,this._y=(r-c)*h,this._z=(a-s)*h}else if(n>o&&n>f){let h=2*Math.sqrt(1+n-o-f);this._w=(d-l)/h,this._x=.25*h,this._y=(s+a)/h,this._z=(r+c)/h}else if(o>f){let h=2*Math.sqrt(1+o-n-f);this._w=(r-c)/h,this._x=(s+a)/h,this._y=.25*h,this._z=(l+d)/h}else{let h=2*Math.sqrt(1+f-n-o);this._w=(a-s)/h,this._x=(r+c)/h,this._y=(l+d)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,d=e._w;return this._x=n*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-n*c,this._z=r*d+a*c+n*l-s*o,this._w=a*d-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,e=Math.sin(e*c)/d,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},L=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),d=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*d,this.y=n+l*d+o*c-r*f,this.z=s+l*f+r*d-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Yo.copy(this).projectOnVector(t),this.sub(Yo)}reflect(t){return this.sub(Yo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(qt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Yo=new L,Mc=new He,Vt=class i{constructor(t,e,n,s,r,a,o,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){let d=this.elements;return d[0]=t,d[1]=s,d[2]=o,d[3]=e,d[4]=r,d[5]=l,d[6]=n,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],d=n[4],f=n[7],u=n[2],h=n[5],p=n[8],_=s[0],g=s[3],m=s[6],y=s[1],b=s[4],M=s[7],A=s[2],T=s[5],I=s[8];return r[0]=a*_+o*y+l*A,r[3]=a*g+o*b+l*T,r[6]=a*m+o*M+l*I,r[1]=c*_+d*y+f*A,r[4]=c*g+d*b+f*T,r[7]=c*m+d*M+f*I,r[2]=u*_+h*y+p*A,r[5]=u*g+h*b+p*T,r[8]=u*m+h*M+p*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],d=t[8];return e*a*d-e*o*c-n*r*d+n*o*l+s*r*c-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],d=t[8],f=d*a-o*c,u=o*l-d*r,h=c*r-a*l,p=e*f+n*u+s*h;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=f*_,t[1]=(s*c-d*n)*_,t[2]=(o*n-s*a)*_,t[3]=u*_,t[4]=(d*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=h*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Zo.makeScale(t,e)),this}rotate(t){return this.premultiply(Zo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Zo=new Vt,Sc=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bc=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Bu(){let i={enabled:!0,workingColorSpace:xi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ie&&(s.r=On(s.r),s.g=On(s.g),s.b=On(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ie&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===mn?Ws:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Xs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Xs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[xi]:{primaries:t,whitePoint:n,transfer:Ws,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:xe},outputColorSpaceConfig:{drawingBufferColorSpace:xe}},[xe]:{primaries:t,whitePoint:n,transfer:ie,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:xe}}}),i}var Zt=Bu();function On(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ni,fa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ni===void 0&&(Ni=ji("canvas")),Ni.width=t.width,Ni.height=t.height;let s=Ni.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ni}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ji("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=On(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(On(e[n]/255)*255):e[n]=On(e[n]);return{data:e,width:t.width,height:t.height}}else return Lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},zu=0,ns=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=gs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jo(s[a].image)):r.push(Jo(s[a]))}else r=Jo(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Jo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?fa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Lt("Texture: Unable to serialize Texture."),{})}var ku=0,$o=new L,ze=class i extends kn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=vn,s=vn,r=Ue,a=ai,o=an,l=Xe,c=i.DEFAULT_ANISOTROPY,d=mn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=gs(),this.name="",this.source=new ns(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize($o).x}get height(){return this.source.getSize($o).y}get depth(){return this.source.getSize($o).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Lt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Lt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==kl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case zn:t.x=t.x-Math.floor(t.x);break;case vn:t.x=t.x<0?0:1;break;case ua:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case zn:t.y=t.y-Math.floor(t.y);break;case vn:t.y=t.y<0?0:1;break;case ua:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=kl;ze.DEFAULT_ANISOTROPY=1;var de=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],d=l[4],f=l[8],u=l[1],h=l[5],p=l[9],_=l[2],g=l[6],m=l[10];if(Math.abs(d-u)<.01&&Math.abs(f-_)<.01&&Math.abs(p-g)<.01){if(Math.abs(d+u)<.1&&Math.abs(f+_)<.1&&Math.abs(p+g)<.1&&Math.abs(c+h+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let b=(c+1)/2,M=(h+1)/2,A=(m+1)/2,T=(d+u)/4,I=(f+_)/4,v=(p+g)/4;return b>M&&b>A?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=T/n,r=I/n):M>A?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=T/s,r=v/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=I/r,s=v/r),this.set(n,s,r,e),this}let y=Math.sqrt((g-p)*(g-p)+(f-_)*(f-_)+(u-d)*(u-d));return Math.abs(y)<.001&&(y=1),this.x=(g-p)/y,this.y=(f-_)/y,this.z=(u-d)/y,this.w=Math.acos((c+h+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this.w=qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this.w=qt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},pa=class extends kn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ue,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new ze(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Ue,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ns(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},$e=class extends pa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},qs=class extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var ma=class extends ze{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var se=class i{constructor(t,e,n,s,r,a,o,l,c,d,f,u,h,p,_,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,d,f,u,h,p,_,g)}set(t,e,n,s,r,a,o,l,c,d,f,u,h,p,_,g){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=d,m[10]=f,m[14]=u,m[3]=h,m[7]=p,m[11]=_,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Fi.setFromMatrixColumn(t,0).length(),r=1/Fi.setFromMatrixColumn(t,1).length(),a=1/Fi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=a*d,h=a*f,p=o*d,_=o*f;e[0]=l*d,e[4]=-l*f,e[8]=c,e[1]=h+p*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=p+h*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*d,h=l*f,p=c*d,_=c*f;e[0]=u+_*o,e[4]=p*o-h,e[8]=a*c,e[1]=a*f,e[5]=a*d,e[9]=-o,e[2]=h*o-p,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*d,h=l*f,p=c*d,_=c*f;e[0]=u-_*o,e[4]=-a*f,e[8]=p+h*o,e[1]=h+p*o,e[5]=a*d,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*d,h=a*f,p=o*d,_=o*f;e[0]=l*d,e[4]=p*c-h,e[8]=u*c+_,e[1]=l*f,e[5]=_*c+u,e[9]=h*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,h=a*c,p=o*l,_=o*c;e[0]=l*d,e[4]=_-u*f,e[8]=p*f+h,e[1]=f,e[5]=a*d,e[9]=-o*d,e[2]=-c*d,e[6]=h*f+p,e[10]=u-_*f}else if(t.order==="XZY"){let u=a*l,h=a*c,p=o*l,_=o*c;e[0]=l*d,e[4]=-f,e[8]=c*d,e[1]=u*f+_,e[5]=a*d,e[9]=h*f-p,e[2]=p*f-h,e[6]=o*d,e[10]=_*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vu,t,Gu)}lookAt(t,e,n){let s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),Wn.crossVectors(n,Ze),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),Wn.crossVectors(n,Ze)),Wn.normalize(),Ar.crossVectors(Ze,Wn),s[0]=Wn.x,s[4]=Ar.x,s[8]=Ze.x,s[1]=Wn.y,s[5]=Ar.y,s[9]=Ze.y,s[2]=Wn.z,s[6]=Ar.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],d=n[1],f=n[5],u=n[9],h=n[13],p=n[2],_=n[6],g=n[10],m=n[14],y=n[3],b=n[7],M=n[11],A=n[15],T=s[0],I=s[4],v=s[8],x=s[12],R=s[1],w=s[5],P=s[9],D=s[13],N=s[2],F=s[6],z=s[10],k=s[14],$=s[3],Q=s[7],et=s[11],ht=s[15];return r[0]=a*T+o*R+l*N+c*$,r[4]=a*I+o*w+l*F+c*Q,r[8]=a*v+o*P+l*z+c*et,r[12]=a*x+o*D+l*k+c*ht,r[1]=d*T+f*R+u*N+h*$,r[5]=d*I+f*w+u*F+h*Q,r[9]=d*v+f*P+u*z+h*et,r[13]=d*x+f*D+u*k+h*ht,r[2]=p*T+_*R+g*N+m*$,r[6]=p*I+_*w+g*F+m*Q,r[10]=p*v+_*P+g*z+m*et,r[14]=p*x+_*D+g*k+m*ht,r[3]=y*T+b*R+M*N+A*$,r[7]=y*I+b*w+M*F+A*Q,r[11]=y*v+b*P+M*z+A*et,r[15]=y*x+b*D+M*k+A*ht,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],d=t[2],f=t[6],u=t[10],h=t[14],p=t[3],_=t[7],g=t[11],m=t[15],y=l*h-c*u,b=o*h-c*f,M=o*u-l*f,A=a*h-c*d,T=a*u-l*d,I=a*f-o*d;return e*(_*y-g*b+m*M)-n*(p*y-g*A+m*T)+s*(p*b-_*A+m*I)-r*(p*M-_*T+g*I)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],d=t[8],f=t[9],u=t[10],h=t[11],p=t[12],_=t[13],g=t[14],m=t[15],y=e*o-n*a,b=e*l-s*a,M=e*c-r*a,A=n*l-s*o,T=n*c-r*o,I=s*c-r*l,v=d*_-f*p,x=d*g-u*p,R=d*m-h*p,w=f*g-u*_,P=f*m-h*_,D=u*m-h*g,N=y*D-b*P+M*w+A*R-T*x+I*v;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/N;return t[0]=(o*D-l*P+c*w)*F,t[1]=(s*P-n*D-r*w)*F,t[2]=(_*I-g*T+m*A)*F,t[3]=(u*T-f*I-h*A)*F,t[4]=(l*R-a*D-c*x)*F,t[5]=(e*D-s*R+r*x)*F,t[6]=(g*M-p*I-m*b)*F,t[7]=(d*I-u*M+h*b)*F,t[8]=(a*P-o*R+c*v)*F,t[9]=(n*R-e*P-r*v)*F,t[10]=(p*T-_*M+m*y)*F,t[11]=(f*M-d*T-h*y)*F,t[12]=(o*x-a*w-l*v)*F,t[13]=(e*w-n*x+s*v)*F,t[14]=(_*b-p*A-g*y)*F,t[15]=(d*A-f*b+u*y)*F,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,d=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+n,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,d=a+a,f=o+o,u=r*c,h=r*d,p=r*f,_=a*d,g=a*f,m=o*f,y=l*c,b=l*d,M=l*f,A=n.x,T=n.y,I=n.z;return s[0]=(1-(_+m))*A,s[1]=(h+M)*A,s[2]=(p-b)*A,s[3]=0,s[4]=(h-M)*T,s[5]=(1-(u+m))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(p+b)*I,s[9]=(g-y)*I,s[10]=(1-(u+_))*I,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinant();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Fi.set(s[0],s[1],s[2]).length(),o=Fi.set(s[4],s[5],s[6]).length(),l=Fi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),cn.copy(this);let c=1/a,d=1/o,f=1/l;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=d,cn.elements[5]*=d,cn.elements[6]*=d,cn.elements[8]*=f,cn.elements[9]*=f,cn.elements[10]*=f,e.setFromRotationMatrix(cn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=dn,l=!1){let c=this.elements,d=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),h=(n+s)/(n-s),p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===dn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Qi)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=dn,l=!1){let c=this.elements,d=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),h=-(n+s)/(n-s),p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===dn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===Qi)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Fi=new L,cn=new se,Vu=new L(0,0,0),Gu=new L(1,1,1),Wn=new L,Ar=new L,Ze=new L,Ec=new se,Tc=new He,nn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],f=s[2],u=s[6],h=s[10];switch(e){case"XYZ":this._y=Math.asin(qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,h),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,h),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,h),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,h),this._y=0);break;default:Lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ec.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ec,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Tc.setFromEuler(this),this.setFromQuaternion(Tc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};nn.DEFAULT_ORDER="XYZ";var is=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Hu=0,wc=new L,Oi=new He,In=new se,Cr=new L,Ds=new L,Wu=new L,Xu=new He,Ac=new L(1,0,0),Cc=new L(0,1,0),Rc=new L(0,0,1),Ic={type:"added"},qu={type:"removed"},Bi={type:"childadded",child:null},Ko={type:"childremoved",child:null},Me=class i extends kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hu++}),this.uuid=gs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new L,e=new nn,n=new He,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Vt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.premultiply(Oi),this}rotateX(t){return this.rotateOnAxis(Ac,t)}rotateY(t){return this.rotateOnAxis(Cc,t)}rotateZ(t){return this.rotateOnAxis(Rc,t)}translateOnAxis(t,e){return wc.copy(t).applyQuaternion(this.quaternion),this.position.add(wc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ac,t)}translateY(t){return this.translateOnAxis(Cc,t)}translateZ(t){return this.translateOnAxis(Rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Cr.copy(t):Cr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ds.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Ds,Cr,this.up):In.lookAt(Cr,Ds,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Oi.setFromRotationMatrix(In),this.quaternion.premultiply(Oi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ut("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ic),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):Ut("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(qu),Ko.child=t,this.dispatchEvent(Ko),Ko.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ic),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,t,Wu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ds,Xu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),d=a(t.images),f=a(t.shapes),u=a(t.skeletons),h=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),h.length>0&&(n.animations=h),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let l=[];for(let c in o){let d=o[c];delete d.metadata,l.push(d)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),t.pivot!==null&&(this.pivot=t.pivot.clone()),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Me.DEFAULT_UP=new L(0,1,0);Me.DEFAULT_MATRIX_AUTO_UPDATE=!0;Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Fn=class extends Me{constructor(){super(),this.isGroup=!0,this.type="Group"}},Yu={type:"move"},ss=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let g=e.getJointPose(_,n),m=this._getHandJoint(c,_);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=d.position.distanceTo(f.position),h=.02,p=.005;c.inputState.pinching&&u>h+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=h-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Yu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Fn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Ph={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},Rr={h:0,s:0,l:0};function Qo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Ot=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=$l(t,1),e=qt(e,0,1),n=qt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Qo(a,r,t+1/3),this.g=Qo(a,r,t),this.b=Qo(a,r,t-1/3)}return Zt.colorSpaceToWorking(this,s),this}setStyle(t,e=xe){function n(r){r!==void 0&&parseFloat(r)<1&&Lt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Lt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Lt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xe){let n=Ph[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Lt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xe){return Zt.workingToColorSpace(Be.copy(this),t),Math.round(qt(Be.r*255,0,255))*65536+Math.round(qt(Be.g*255,0,255))*256+Math.round(qt(Be.b*255,0,255))}getHexString(t=xe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.workingToColorSpace(Be.copy(this),e);let n=Be.r,s=Be.g,r=Be.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,d=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=d<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=d,t}getRGB(t,e=Zt.workingColorSpace){return Zt.workingToColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=xe){Zt.workingToColorSpace(Be.copy(this),t);let e=Be.r,n=Be.g,s=Be.b;return t!==xe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Xn),this.setHSL(Xn.h+t,Xn.s+e,Xn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Xn),t.getHSL(Rr);let n=ks(Xn.h,Rr.h,e),s=ks(Xn.s,Rr.s,e),r=ks(Xn.l,Rr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Be=new Ot;Ot.NAMES=Ph;var Ys=class i{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ot(t),this.near=e,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},vi=class extends Me{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new nn,this.environmentIntensity=1,this.environmentRotation=new nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},hn=new L,Pn=new L,jo=new L,Ln=new L,zi=new L,ki=new L,Pc=new L,tl=new L,el=new L,nl=new L,il=new de,sl=new de,rl=new de,Nn=class i{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),hn.subVectors(t,e),s.cross(hn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){hn.subVectors(s,e),Pn.subVectors(n,e),jo.subVectors(t,e);let a=hn.dot(hn),o=hn.dot(Pn),l=hn.dot(jo),c=Pn.dot(Pn),d=Pn.dot(jo),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let u=1/f,h=(c*l-o*d)*u,p=(a*d-o*l)*u;return r.set(1-h-p,p,h)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return il.setScalar(0),sl.setScalar(0),rl.setScalar(0),il.fromBufferAttribute(t,e),sl.fromBufferAttribute(t,n),rl.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(il,r.x),a.addScaledVector(sl,r.y),a.addScaledVector(rl,r.z),a}static isFrontFacing(t,e,n,s){return hn.subVectors(n,e),Pn.subVectors(t,e),hn.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),hn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;zi.subVectors(s,n),ki.subVectors(r,n),tl.subVectors(t,n);let l=zi.dot(tl),c=ki.dot(tl);if(l<=0&&c<=0)return e.copy(n);el.subVectors(t,s);let d=zi.dot(el),f=ki.dot(el);if(d>=0&&f<=d)return e.copy(s);let u=l*f-d*c;if(u<=0&&l>=0&&d<=0)return a=l/(l-d),e.copy(n).addScaledVector(zi,a);nl.subVectors(t,r);let h=zi.dot(nl),p=ki.dot(nl);if(p>=0&&h<=p)return e.copy(r);let _=h*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(ki,o);let g=d*p-h*f;if(g<=0&&f-d>=0&&h-p>=0)return Pc.subVectors(r,s),o=(f-d)/(f-d+(h-p)),e.copy(s).addScaledVector(Pc,o);let m=1/(g+_+u);return a=_*m,o=u*m,e.copy(n).addScaledVector(zi,a).addScaledVector(ki,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Mn=class{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ir.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ir.copy(n.boundingBox)),Ir.applyMatrix4(t.matrixWorld),this.union(Ir)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Us),Pr.subVectors(this.max,Us),Vi.subVectors(t.a,Us),Gi.subVectors(t.b,Us),Hi.subVectors(t.c,Us),qn.subVectors(Gi,Vi),Yn.subVectors(Hi,Gi),ui.subVectors(Vi,Hi);let e=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-ui.z,ui.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,ui.z,0,-ui.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-ui.y,ui.x,0];return!al(e,Vi,Gi,Hi,Pr)||(e=[1,0,0,0,1,0,0,0,1],!al(e,Vi,Gi,Hi,Pr))?!1:(Lr.crossVectors(qn,Yn),e=[Lr.x,Lr.y,Lr.z],al(e,Vi,Gi,Hi,Pr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Dn=[new L,new L,new L,new L,new L,new L,new L,new L],un=new L,Ir=new Mn,Vi=new L,Gi=new L,Hi=new L,qn=new L,Yn=new L,ui=new L,Us=new L,Pr=new L,Lr=new L,di=new L;function al(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){di.fromArray(i,r);let o=s.x*Math.abs(di.x)+s.y*Math.abs(di.y)+s.z*Math.abs(di.z),l=t.dot(di),c=e.dot(di),d=n.dot(di);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}var be=new L,Dr=new xt,Zu=0,Ee=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Tl,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Dr.fromBufferAttribute(this,e),Dr.applyMatrix3(t),this.setXY(e,Dr.x,Dr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ge(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ge(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ge(e,this.array),n=Ge(n,this.array),s=Ge(s,this.array),r=Ge(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Tl&&(t.usage=this.usage),t}};var Zs=class extends Ee{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Js=class extends Ee{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Gt=class extends Ee{constructor(t,e,n){super(new Float32Array(t),e,n)}},Ju=new Mn,Ns=new L,ol=new L,Vn=class{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Ju.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ns.subVectors(t,this.center);let e=Ns.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ns,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ol.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ns.copy(t.center).add(ol)),this.expandByPoint(Ns.copy(t.center).sub(ol))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},$u=0,en=new se,ll=new Me,Wi=new L,Je=new Mn,Fs=new Mn,Ie=new L,fe=class i extends kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=gs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yu(t)?Js:Zs)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return ll.lookAt(t),ll.updateMatrix(),this.applyMatrix4(ll.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Gt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Je.setFromBufferAttribute(r),this.morphTargetsRelative?(Ie.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Ie),Ie.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Ie)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ut('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ut("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){let n=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];Fs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ie.addVectors(Je.min,Fs.min),Je.expandByPoint(Ie),Ie.addVectors(Je.max,Fs.max),Je.expandByPoint(Ie)):(Je.expandByPoint(Fs.min),Je.expandByPoint(Fs.max))}Je.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ie.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ie));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ie.fromBufferAttribute(o,c),l&&(Wi.fromBufferAttribute(t,c),Ie.add(Wi)),s=Math.max(s,n.distanceToSquared(Ie))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ut('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ut("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ee(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new L,l[v]=new L;let c=new L,d=new L,f=new L,u=new xt,h=new xt,p=new xt,_=new L,g=new L;function m(v,x,R){c.fromBufferAttribute(n,v),d.fromBufferAttribute(n,x),f.fromBufferAttribute(n,R),u.fromBufferAttribute(r,v),h.fromBufferAttribute(r,x),p.fromBufferAttribute(r,R),d.sub(c),f.sub(c),h.sub(u),p.sub(u);let w=1/(h.x*p.y-p.x*h.y);isFinite(w)&&(_.copy(d).multiplyScalar(p.y).addScaledVector(f,-h.y).multiplyScalar(w),g.copy(f).multiplyScalar(h.x).addScaledVector(d,-p.x).multiplyScalar(w),o[v].add(_),o[x].add(_),o[R].add(_),l[v].add(g),l[x].add(g),l[R].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let v=0,x=y.length;v<x;++v){let R=y[v],w=R.start,P=R.count;for(let D=w,N=w+P;D<N;D+=3)m(t.getX(D+0),t.getX(D+1),t.getX(D+2))}let b=new L,M=new L,A=new L,T=new L;function I(v){A.fromBufferAttribute(s,v),T.copy(A);let x=o[v];b.copy(x),b.sub(A.multiplyScalar(A.dot(x))).normalize(),M.crossVectors(T,x);let w=M.dot(l[v])<0?-1:1;a.setXYZW(v,b.x,b.y,b.z,w)}for(let v=0,x=y.length;v<x;++v){let R=y[v],w=R.start,P=R.count;for(let D=w,N=w+P;D<N;D+=3)I(t.getX(D+0)),I(t.getX(D+1)),I(t.getX(D+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ee(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,h=n.count;u<h;u++)n.setXYZ(u,0,0,0);let s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,d=new L,f=new L;if(t)for(let u=0,h=t.count;u<h;u+=3){let p=t.getX(u+0),_=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,g),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,g),o.add(d),l.add(d),c.add(d),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,h=e.count;u<h;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),d.subVectors(a,r),f.subVectors(s,r),d.cross(f),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ie.fromBufferAttribute(t,e),Ie.normalize(),t.setXYZ(e,Ie.x,Ie.y,Ie.z)}toNonIndexed(){function t(o,l){let c=o.array,d=o.itemSize,f=o.normalized,u=new c.constructor(l.length*d),h=0,p=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?h=l[_]*o.data.stride+o.offset:h=l[_]*d;for(let m=0;m<d;m++)u[p++]=c[h++]}return new Ee(u,d,f)}if(this.index===null)return Lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let d=0,f=c.length;d<f;d++){let u=c[d],h=t(u,n);l.push(h)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],d=[];for(let f=0,u=c.length;f<u;f++){let h=c[f];d.push(h.toJSON(t.data))}d.length>0&&(s[l]=d,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let d=s[c];this.setAttribute(c,d.clone(e))}let r=t.morphAttributes;for(let c in r){let d=[],f=r[c];for(let u=0,h=f.length;u<h;u++)d.push(f[u].clone(e));this.morphAttributes[c]=d}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,d=a.length;c<d;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Ku=0,Sn=class extends kn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ku++}),this.uuid=gs(),this.name="",this.type="Material",this.blending=gi,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=na,this.blendDst=ia,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=_i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=El,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=mi,this.stencilZFail=mi,this.stencilZPass=mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Lt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Lt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gi&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==na&&(n.blendSrc=this.blendSrc),this.blendDst!==ia&&(n.blendDst=this.blendDst),this.blendEquation!==$n&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==El&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Un=new L,cl=new L,Ur=new L,Zn=new L,hl=new L,Nr=new L,ul=new L,rs=class{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){cl.copy(t).add(e).multiplyScalar(.5),Ur.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(cl);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Ur),o=Zn.dot(this.direction),l=-Zn.dot(Ur),c=Zn.lengthSq(),d=Math.abs(1-a*a),f,u,h,p;if(d>0)if(f=a*l-o,u=a*o-l,p=r*d,f>=0)if(u>=-p)if(u<=p){let _=1/d;f*=_,u*=_,h=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),h=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),h=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),h=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),h=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),h=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),h=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(cl).addScaledVector(Ur,u),h}intersectSphere(t,e){Un.subVectors(t.center,this.origin);let n=Un.dot(this.direction),s=Un.dot(Un)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),d>=0?(r=(t.min.y-u.y)*d,a=(t.max.y-u.y)*d):(r=(t.max.y-u.y)*d,a=(t.min.y-u.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,n,s,r){hl.subVectors(e,t),Nr.subVectors(n,t),ul.crossVectors(hl,Nr);let a=this.direction.dot(ul),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,t);let l=o*this.direction.dot(Nr.crossVectors(Zn,Nr));if(l<0)return null;let c=o*this.direction.dot(hl.cross(Zn));if(c<0||l+c>a)return null;let d=-o*Zn.dot(ul);return d<0?null:this.at(d/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Kn=class extends Sn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new nn,this.combine=Ha,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Lc=new se,fi=new rs,Fr=new Vn,Dc=new L,Or=new L,Br=new L,zr=new L,dl=new L,kr=new L,Uc=new L,Vr=new L,ue=class extends Me{constructor(t=new fe,e=new Kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){kr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let d=o[l],f=r[l];d!==0&&(dl.fromBufferAttribute(f,t),a?kr.addScaledVector(dl,d):kr.addScaledVector(dl.sub(e),d))}e.add(kr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fr.copy(n.boundingSphere),Fr.applyMatrix4(r),fi.copy(t.ray).recast(t.near),!(Fr.containsPoint(fi.origin)===!1&&(fi.intersectSphere(Fr,Dc)===null||fi.origin.distanceToSquared(Dc)>(t.far-t.near)**2))&&(Lc.copy(r).invert(),fi.copy(t.ray).applyMatrix4(Lc),!(n.boundingBox!==null&&fi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,fi)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,f=r.attributes.normal,u=r.groups,h=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let g=u[p],m=a[g.materialIndex],y=Math.max(g.start,h.start),b=Math.min(o.count,Math.min(g.start+g.count,h.start+h.count));for(let M=y,A=b;M<A;M+=3){let T=o.getX(M),I=o.getX(M+1),v=o.getX(M+2);s=Gr(this,m,t,n,c,d,f,T,I,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let g=p,m=_;g<m;g+=3){let y=o.getX(g),b=o.getX(g+1),M=o.getX(g+2);s=Gr(this,a,t,n,c,d,f,y,b,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let g=u[p],m=a[g.materialIndex],y=Math.max(g.start,h.start),b=Math.min(l.count,Math.min(g.start+g.count,h.start+h.count));for(let M=y,A=b;M<A;M+=3){let T=M,I=M+1,v=M+2;s=Gr(this,m,t,n,c,d,f,T,I,v),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let p=Math.max(0,h.start),_=Math.min(l.count,h.start+h.count);for(let g=p,m=_;g<m;g+=3){let y=g,b=g+1,M=g+2;s=Gr(this,a,t,n,c,d,f,y,b,M),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function Qu(i,t,e,n,s,r,a,o){let l;if(t.side===Ne?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Bn,o),l===null)return null;Vr.copy(o),Vr.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Vr);return c<e.near||c>e.far?null:{distance:c,point:Vr.clone(),object:i}}function Gr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Or),i.getVertexPosition(l,Br),i.getVertexPosition(c,zr);let d=Qu(i,t,e,n,Or,Br,zr,Uc);if(d){let f=new L;Nn.getBarycoord(Uc,Or,Br,zr,f),s&&(d.uv=Nn.getInterpolatedAttribute(s,o,l,c,f,new xt)),r&&(d.uv1=Nn.getInterpolatedAttribute(r,o,l,c,f,new xt)),a&&(d.normal=Nn.getInterpolatedAttribute(a,o,l,c,f,new L),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new L,materialIndex:0};Nn.getNormal(Or,Br,zr,u.normal),d.face=u,d.barycoord=f}return d}var $s=class extends ze{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Pe,d=Pe,f,u){super(null,a,o,l,c,d,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Qn=class extends Ee{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Xi=new se,Nc=new se,Hr=[],Fc=new Mn,ju=new se,Os=new ue,Bs=new Vn,yi=class extends ue{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Qn(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ju)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Mn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Xi),Fc.copy(t.boundingBox).applyMatrix4(Xi),this.boundingBox.union(Fc)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Xi),Bs.copy(t.boundingSphere).applyMatrix4(Xi),this.boundingSphere.union(Bs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=t.previousInstanceMatrix.clone()),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Os.geometry=this.geometry,Os.material=this.material,Os.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Bs.copy(this.boundingSphere),Bs.applyMatrix4(n),t.ray.intersectsSphere(Bs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Xi),Nc.multiplyMatrices(n,Xi),Os.matrixWorld=Nc,Os.raycast(t,Hr);for(let a=0,o=Hr.length;a<o;a++){let l=Hr[a];l.instanceId=r,l.object=this,e.push(l)}Hr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Qn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new $s(new Float32Array(s*this.count),s,this.count,$a,rn));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},fl=new L,td=new L,ed=new Vt,xn=class{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=fl.subVectors(n,e).cross(td.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(fl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||ed.getNormalMatrix(t),s=this.coplanarPoint(fl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},pi=new Vn,nd=new xt(.5,.5),Wr=new L,as=class{constructor(t=new xn,e=new xn,n=new xn,s=new xn,r=new xn,a=new xn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn,n=!1){let s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],f=r[5],u=r[6],h=r[7],p=r[8],_=r[9],g=r[10],m=r[11],y=r[12],b=r[13],M=r[14],A=r[15];if(s[0].setComponents(c-a,h-d,m-p,A-y).normalize(),s[1].setComponents(c+a,h+d,m+p,A+y).normalize(),s[2].setComponents(c+o,h+f,m+_,A+b).normalize(),s[3].setComponents(c-o,h-f,m-_,A-b).normalize(),n)s[4].setComponents(l,u,g,M).normalize(),s[5].setComponents(c-l,h-u,m-g,A-M).normalize();else if(s[4].setComponents(c-l,h-u,m-g,A-M).normalize(),e===dn)s[5].setComponents(c+l,h+u,m+g,A+M).normalize();else if(e===Qi)s[5].setComponents(l,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(t){pi.center.set(0,0,0);let e=nd.distanceTo(t.center);return pi.radius=.7071067811865476+e,pi.applyMatrix4(t.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Wr.x=s.normal.x>0?t.max.x:t.min.x,Wr.y=s.normal.y>0?t.max.y:t.min.y,Wr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var os=class extends Sn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ot(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},ga=new L,_a=new L,Oc=new se,zs=new rs,Xr=new Vn,pl=new L,Bc=new L,xa=class extends Me{constructor(t=new fe,e=new os){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)ga.fromBufferAttribute(e,s-1),_a.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=ga.distanceTo(_a);t.setAttribute("lineDistance",new Gt(n,1))}else Lt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(s),Xr.radius+=r,t.ray.intersectsSphere(Xr)===!1)return;Oc.copy(s).invert(),zs.copy(t.ray).applyMatrix4(Oc);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=n.index,u=n.attributes.position;if(d!==null){let h=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=h,g=p-1;_<g;_+=c){let m=d.getX(_),y=d.getX(_+1),b=qr(this,t,zs,l,m,y,_);b&&e.push(b)}if(this.isLineLoop){let _=d.getX(p-1),g=d.getX(h),m=qr(this,t,zs,l,_,g,p-1);m&&e.push(m)}}else{let h=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=h,g=p-1;_<g;_+=c){let m=qr(this,t,zs,l,_,_+1,_);m&&e.push(m)}if(this.isLineLoop){let _=qr(this,t,zs,l,p-1,h,p-1);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function qr(i,t,e,n,s,r,a){let o=i.geometry.attributes.position;if(ga.fromBufferAttribute(o,s),_a.fromBufferAttribute(o,r),e.distanceSqToSegment(ga,_a,pl,Bc)>n)return;pl.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(pl);if(!(c<t.near||c>t.far))return{distance:c,point:Bc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var zc=new L,kc=new L,Ks=class extends xa{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)zc.fromBufferAttribute(e,s),kc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zc.distanceTo(kc);t.setAttribute("lineDistance",new Gt(n,1))}else Lt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Qs=class extends ze{constructor(t=[],e=ri,n,s,r,a,o,l,c,d){super(t,e,n,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},bn=class extends ze{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},jn=class extends ze{constructor(t,e,n=pn,s,r,a,o=Pe,l=Pe,c,d=yn,f=1){if(d!==yn&&d!==oi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,a,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ns(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},va=class extends jn{constructor(t,e=pn,n=ri,s,r,a=Pe,o=Pe,l,c=yn){let d={width:t,height:t,depth:1},f=[d,d,d,d,d,d];super(t,t,e,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},js=class extends ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},We=class i extends fe{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],d=[],f=[],u=0,h=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(d,3)),this.setAttribute("uv",new Gt(f,2));function p(_,g,m,y,b,M,A,T,I,v,x){let R=M/I,w=A/v,P=M/2,D=A/2,N=T/2,F=I+1,z=v+1,k=0,$=0,Q=new L;for(let et=0;et<z;et++){let ht=et*w-D;for(let nt=0;nt<F;nt++){let Ct=nt*R-P;Q[_]=Ct*y,Q[g]=ht*b,Q[m]=N,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[g]=0,Q[m]=T>0?1:-1,d.push(Q.x,Q.y,Q.z),f.push(nt/I),f.push(1-et/v),k+=1}}for(let et=0;et<v;et++)for(let ht=0;ht<I;ht++){let nt=u+ht+F*et,Ct=u+ht+F*(et+1),Nt=u+(ht+1)+F*(et+1),te=u+(ht+1)+F*et;l.push(nt,Ct,te),l.push(Ct,Nt,te),$+=6}o.addGroup(h,$,x),h+=$,u+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var tr=class i extends fe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],c=new L,d=new xt;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){let h=n+f/e*s;c.x=t*Math.cos(h),c.y=t*Math.sin(h),a.push(c.x,c.y,c.z),o.push(0,0,1),d.x=(a[u]/t+1)/2,d.y=(a[u+1]/t+1)/2,l.push(d.x,d.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Gt(a,3)),this.setAttribute("normal",new Gt(o,3)),this.setAttribute("uv",new Gt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ke=class i extends fe{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let d=[],f=[],u=[],h=[],p=0,_=[],g=n/2,m=0;y(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(d),this.setAttribute("position",new Gt(f,3)),this.setAttribute("normal",new Gt(u,3)),this.setAttribute("uv",new Gt(h,2));function y(){let M=new L,A=new L,T=0,I=(e-t)/n;for(let v=0;v<=r;v++){let x=[],R=v/r,w=R*(e-t)+t;for(let P=0;P<=s;P++){let D=P/s,N=D*l+o,F=Math.sin(N),z=Math.cos(N);A.x=w*F,A.y=-R*n+g,A.z=w*z,f.push(A.x,A.y,A.z),M.set(F,I,z).normalize(),u.push(M.x,M.y,M.z),h.push(D,1-R),x.push(p++)}_.push(x)}for(let v=0;v<s;v++)for(let x=0;x<r;x++){let R=_[x][v],w=_[x+1][v],P=_[x+1][v+1],D=_[x][v+1];(t>0||x!==0)&&(d.push(R,w,D),T+=3),(e>0||x!==r-1)&&(d.push(w,P,D),T+=3)}c.addGroup(m,T,0),m+=T}function b(M){let A=p,T=new xt,I=new L,v=0,x=M===!0?t:e,R=M===!0?1:-1;for(let P=1;P<=s;P++)f.push(0,g*R,0),u.push(0,R,0),h.push(.5,.5),p++;let w=p;for(let P=0;P<=s;P++){let N=P/s*l+o,F=Math.cos(N),z=Math.sin(N);I.x=x*z,I.y=g*R,I.z=x*F,f.push(I.x,I.y,I.z),u.push(0,R,0),T.x=F*.5+.5,T.y=z*.5*R+.5,h.push(T.x,T.y),p++}for(let P=0;P<s;P++){let D=A+P,N=w+P;M===!0?d.push(N,N+1,D):d.push(N+1,N,D),v+=3}c.addGroup(m,v,M===!0?1:2),m+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ya=class i extends fe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),c(n),d(),this.setAttribute("position",new Gt(r,3)),this.setAttribute("normal",new Gt(r.slice(),3)),this.setAttribute("uv",new Gt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){let b=new L,M=new L,A=new L;for(let T=0;T<e.length;T+=3)h(e[T+0],b),h(e[T+1],M),h(e[T+2],A),l(b,M,A,y)}function l(y,b,M,A){let T=A+1,I=[];for(let v=0;v<=T;v++){I[v]=[];let x=y.clone().lerp(M,v/T),R=b.clone().lerp(M,v/T),w=T-v;for(let P=0;P<=w;P++)P===0&&v===T?I[v][P]=x:I[v][P]=x.clone().lerp(R,P/w)}for(let v=0;v<T;v++)for(let x=0;x<2*(T-v)-1;x++){let R=Math.floor(x/2);x%2===0?(u(I[v][R+1]),u(I[v+1][R]),u(I[v][R])):(u(I[v][R+1]),u(I[v+1][R+1]),u(I[v+1][R]))}}function c(y){let b=new L;for(let M=0;M<r.length;M+=3)b.x=r[M+0],b.y=r[M+1],b.z=r[M+2],b.normalize().multiplyScalar(y),r[M+0]=b.x,r[M+1]=b.y,r[M+2]=b.z}function d(){let y=new L;for(let b=0;b<r.length;b+=3){y.x=r[b+0],y.y=r[b+1],y.z=r[b+2];let M=g(y)/2/Math.PI+.5,A=m(y)/Math.PI+.5;a.push(M,1-A)}p(),f()}function f(){for(let y=0;y<a.length;y+=6){let b=a[y+0],M=a[y+2],A=a[y+4],T=Math.max(b,M,A),I=Math.min(b,M,A);T>.9&&I<.1&&(b<.2&&(a[y+0]+=1),M<.2&&(a[y+2]+=1),A<.2&&(a[y+4]+=1))}}function u(y){r.push(y.x,y.y,y.z)}function h(y,b){let M=y*3;b.x=t[M+0],b.y=t[M+1],b.z=t[M+2]}function p(){let y=new L,b=new L,M=new L,A=new L,T=new xt,I=new xt,v=new xt;for(let x=0,R=0;x<r.length;x+=9,R+=6){y.set(r[x+0],r[x+1],r[x+2]),b.set(r[x+3],r[x+4],r[x+5]),M.set(r[x+6],r[x+7],r[x+8]),T.set(a[R+0],a[R+1]),I.set(a[R+2],a[R+3]),v.set(a[R+4],a[R+5]),A.copy(y).add(b).add(M).divideScalar(3);let w=g(A);_(T,R+0,y,w),_(I,R+2,b,w),_(v,R+4,M,w)}}function _(y,b,M,A){A<0&&y.x===1&&(a[b]=y.x-1),M.x===0&&M.z===0&&(a[b]=A/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.detail)}};var Yr=new L,Zr=new L,ml=new L,Jr=new Nn,er=class extends fe{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let s=Math.pow(10,4),r=Math.cos($i*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],d=["a","b","c"],f=new Array(3),u={},h=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:g,c:m}=Jr;if(_.fromBufferAttribute(o,c[0]),g.fromBufferAttribute(o,c[1]),m.fromBufferAttribute(o,c[2]),Jr.getNormal(ml),f[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,f[1]=`${Math.round(g.x*s)},${Math.round(g.y*s)},${Math.round(g.z*s)}`,f[2]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let y=0;y<3;y++){let b=(y+1)%3,M=f[y],A=f[b],T=Jr[d[y]],I=Jr[d[b]],v=`${M}_${A}`,x=`${A}_${M}`;x in u&&u[x]?(ml.dot(u[x].normal)<=r&&(h.push(T.x,T.y,T.z),h.push(I.x,I.y,I.z)),u[x]=null):v in u||(u[v]={index0:c[y],index1:c[b],normal:ml.clone()})}}for(let p in u)if(u[p]){let{index0:_,index1:g}=u[p];Yr.fromBufferAttribute(o,_),Zr.fromBufferAttribute(o,g),h.push(Yr.x,Yr.y,Yr.z),h.push(Zr.x,Zr.y,Zr.z)}this.setAttribute("position",new Gt(h,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},sn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Lt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let d=n[s],u=n[s+1]-d,h=(a-d)/u;return(s+h)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new xt:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new L,s=[],r=[],a=[],o=new L,l=new se;for(let h=0;h<=t;h++){let p=h/t;s[h]=this.getTangentAt(p,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE,d=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);d<=c&&(c=d,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let h=1;h<=t;h++){if(r[h]=r[h-1].clone(),a[h]=a[h-1].clone(),o.crossVectors(s[h-1],s[h]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(qt(s[h-1].dot(s[h]),-1,1));r[h].applyMatrix4(l.makeRotationAxis(o,p))}a[h].crossVectors(s[h],r[h])}if(e===!0){let h=Math.acos(qt(r[0].dot(r[t]),-1,1));h/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(h=-h);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],h*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},nr=class extends sn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new xt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let d=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,h=c-this.aY;l=u*d-h*f+this.aX,c=u*f+h*d+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Ma=class extends nr{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Kl(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,f){let u=(a-r)/c-(o-r)/(c+d)+(o-a)/d,h=(o-a)/d-(l-a)/(d+f)+(l-o)/f;u*=d,h*=d,s(a,o,u,h)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var $r=new L,gl=new Kl,_l=new Kl,xl=new Kl,ti=class extends sn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:($r.subVectors(s[0],s[1]).add(s[0]),c=$r);let f=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:($r.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=$r),this.curveType==="centripetal"||this.curveType==="chordal"){let h=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(f),h),_=Math.pow(f.distanceToSquared(u),h),g=Math.pow(u.distanceToSquared(d),h);_<1e-4&&(_=1),p<1e-4&&(p=_),g<1e-4&&(g=_),gl.initNonuniformCatmullRom(c.x,f.x,u.x,d.x,p,_,g),_l.initNonuniformCatmullRom(c.y,f.y,u.y,d.y,p,_,g),xl.initNonuniformCatmullRom(c.z,f.z,u.z,d.z,p,_,g)}else this.curveType==="catmullrom"&&(gl.initCatmullRom(c.x,f.x,u.x,d.x,this.tension),_l.initCatmullRom(c.y,f.y,u.y,d.y,this.tension),xl.initCatmullRom(c.z,f.z,u.z,d.z,this.tension));return n.set(gl.calc(l),_l.calc(l),xl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Vc(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function id(i,t){let e=1-i;return e*e*t}function sd(i,t){return 2*(1-i)*i*t}function rd(i,t){return i*i*t}function Vs(i,t,e,n){return id(i,t)+sd(i,e)+rd(i,n)}function ad(i,t){let e=1-i;return e*e*e*t}function od(i,t){let e=1-i;return 3*e*e*i*t}function ld(i,t){return 3*(1-i)*i*i*t}function cd(i,t){return i*i*i*t}function Gs(i,t,e,n,s){return ad(i,t)+od(i,e)+ld(i,n)+cd(i,s)}var Sa=class extends sn{constructor(t=new xt,e=new xt,n=new xt,s=new xt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gs(t,s.x,r.x,a.x,o.x),Gs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ba=class extends sn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Gs(t,s.x,r.x,a.x,o.x),Gs(t,s.y,r.y,a.y,o.y),Gs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ea=class extends sn{constructor(t=new xt,e=new xt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new xt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new xt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ta=class extends sn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},wa=class extends sn{constructor(t=new xt,e=new xt,n=new xt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new xt){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Vs(t,s.x,r.x,a.x),Vs(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ir=class extends sn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Vs(t,s.x,r.x,a.x),Vs(t,s.y,r.y,a.y),Vs(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ls=class extends sn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new xt){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Vc(o,l.x,c.x,d.x,f.x),Vc(o,l.y,c.y,d.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new xt().fromArray(s))}return this}},hd=Object.freeze({__proto__:null,ArcCurve:Ma,CatmullRomCurve3:ti,CubicBezierCurve:Sa,CubicBezierCurve3:ba,EllipseCurve:nr,LineCurve:Ea,LineCurve3:Ta,QuadraticBezierCurve:wa,QuadraticBezierCurve3:ir,SplineCurve:ls});var sr=class i extends ya{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}},rr=class i extends fe{constructor(t=[new xt(0,-.5),new xt(.5,0),new xt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=qt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],d=1/e,f=new L,u=new xt,h=new L,p=new L,_=new L,g=0,m=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:g=t[y+1].x-t[y].x,m=t[y+1].y-t[y].y,h.x=m*1,h.y=-g,h.z=m*0,_.copy(h),h.normalize(),l.push(h.x,h.y,h.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:g=t[y+1].x-t[y].x,m=t[y+1].y-t[y].y,h.x=m*1,h.y=-g,h.z=m*0,p.copy(h),h.x+=_.x,h.y+=_.y,h.z+=_.z,h.normalize(),l.push(h.x,h.y,h.z),_.copy(p)}for(let y=0;y<=e;y++){let b=n+y*d*s,M=Math.sin(b),A=Math.cos(b);for(let T=0;T<=t.length-1;T++){f.x=t[T].x*M,f.y=t[T].y,f.z=t[T].x*A,a.push(f.x,f.y,f.z),u.x=y/e,u.y=T/(t.length-1),o.push(u.x,u.y);let I=l[3*T+0]*M,v=l[3*T+1],x=l[3*T+0]*A;c.push(I,v,x)}}for(let y=0;y<e;y++)for(let b=0;b<t.length-1;b++){let M=b+y*t.length,A=M,T=M+t.length,I=M+t.length+1,v=M+1;r.push(A,T,v),r.push(I,v,T)}this.setIndex(r),this.setAttribute("position",new Gt(a,3)),this.setAttribute("uv",new Gt(o,2)),this.setAttribute("normal",new Gt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var Te=class i extends fe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,d=l+1,f=t/o,u=e/l,h=[],p=[],_=[],g=[];for(let m=0;m<d;m++){let y=m*u-a;for(let b=0;b<c;b++){let M=b*f-r;p.push(M,-y,0),_.push(0,0,1),g.push(b/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<o;y++){let b=y+c*m,M=y+c*(m+1),A=y+1+c*(m+1),T=y+1+c*m;h.push(b,M,T),h.push(M,A,T)}this.setIndex(h),this.setAttribute("position",new Gt(p,3)),this.setAttribute("normal",new Gt(_,3)),this.setAttribute("uv",new Gt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Mi=class i extends fe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,d=[],f=new L,u=new L,h=[],p=[],_=[],g=[];for(let m=0;m<=n;m++){let y=[],b=m/n,M=0;m===0&&a===0?M=.5/e:m===n&&l===Math.PI&&(M=-.5/e);for(let A=0;A<=e;A++){let T=A/e;f.x=-t*Math.cos(s+T*r)*Math.sin(a+b*o),f.y=t*Math.cos(a+b*o),f.z=t*Math.sin(s+T*r)*Math.sin(a+b*o),p.push(f.x,f.y,f.z),u.copy(f).normalize(),_.push(u.x,u.y,u.z),g.push(T+M,1-b),y.push(c++)}d.push(y)}for(let m=0;m<n;m++)for(let y=0;y<e;y++){let b=d[m][y+1],M=d[m][y],A=d[m+1][y],T=d[m+1][y+1];(m!==0||a>0)&&h.push(b,M,T),(m!==n-1||l<Math.PI)&&h.push(M,A,T)}this.setIndex(h),this.setAttribute("position",new Gt(p,3)),this.setAttribute("normal",new Gt(_,3)),this.setAttribute("uv",new Gt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Qe=class i extends fe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],d=[],f=[],u=new L,h=new L,p=new L;for(let _=0;_<=n;_++){let g=a+_/n*o;for(let m=0;m<=s;m++){let y=m/s*r;h.x=(t+e*Math.cos(g))*Math.cos(y),h.y=(t+e*Math.cos(g))*Math.sin(y),h.z=e*Math.sin(g),c.push(h.x,h.y,h.z),u.x=t*Math.cos(y),u.y=t*Math.sin(y),p.subVectors(h,u).normalize(),d.push(p.x,p.y,p.z),f.push(m/s),f.push(_/n)}}for(let _=1;_<=n;_++)for(let g=1;g<=s;g++){let m=(s+1)*_+g-1,y=(s+1)*(_-1)+g-1,b=(s+1)*(_-1)+g,M=(s+1)*_+g;l.push(m,y,M),l.push(y,b,M)}this.setIndex(l),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(d,3)),this.setAttribute("uv",new Gt(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Si=class i extends fe{constructor(t=new ir(new L(-1,-1,0),new L(-1,1,0),new L(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new L,l=new L,c=new xt,d=new L,f=[],u=[],h=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new Gt(f,3)),this.setAttribute("normal",new Gt(u,3)),this.setAttribute("uv",new Gt(h,2));function _(){for(let b=0;b<e;b++)g(b);g(r===!1?e:0),y(),m()}function g(b){d=t.getPointAt(b/e,d);let M=a.normals[b],A=a.binormals[b];for(let T=0;T<=s;T++){let I=T/s*Math.PI*2,v=Math.sin(I),x=-Math.cos(I);l.x=x*M.x+v*A.x,l.y=x*M.y+v*A.y,l.z=x*M.z+v*A.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=d.x+n*l.x,o.y=d.y+n*l.y,o.z=d.z+n*l.z,f.push(o.x,o.y,o.z)}}function m(){for(let b=1;b<=e;b++)for(let M=1;M<=s;M++){let A=(s+1)*(b-1)+(M-1),T=(s+1)*b+(M-1),I=(s+1)*b+M,v=(s+1)*(b-1)+M;p.push(A,T,v),p.push(T,I,v)}}function y(){for(let b=0;b<=e;b++)for(let M=0;M<=s;M++)c.x=b/e,c.y=M/s,h.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new hd[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function wi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){let t={};for(let e=0;e<i.length;e++){let n=wi(i[e]);for(let s in n)t[s]=n[s]}return t}function ud(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ql(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}var Lh={clone:wi,merge:Ve},dd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,je=class extends Sn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dd,this.fragmentShader=fd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=wi(t.uniforms),this.uniformsGroups=ud(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Aa=class extends je{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},ei=class extends Sn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Do,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var ar=class extends Sn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Do,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new nn,this.combine=Ha,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Ca=class extends Sn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ra=class extends Sn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Kr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}var ni=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ia=class extends ni{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ml,endingEnd:Ml}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Sl:r=t,o=2*e-n;break;case bl:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Sl:a=t,l=2*n-e;break;case bl:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let c=(n-e)*.5,d=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=r*d,this._offsetNext=a*d}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,d=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,h=this._weightNext,p=(n-e)/(s-e),_=p*p,g=_*p,m=-u*g+2*u*_-u*p,y=(1+u)*g+(-1.5-2*u)*_+(-.5+u)*p+1,b=(-1-h)*g+(1.5+h)*_+.5*p,M=h*g-h*_;for(let A=0;A!==o;++A)r[A]=m*a[d+A]+y*a[c+A]+b*a[l+A]+M*a[f+A];return r}},Pa=class extends ni{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,d=(n-e)/(s-e),f=1-d;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*d;return r}},La=class extends ni{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Da=class extends ni{interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,d=this.settings||this.DefaultSettings_,f=d.inTangents,u=d.outTangents;if(!f||!u){let _=(n-e)/(s-e),g=1-_;for(let m=0;m!==o;++m)r[m]=a[c+m]*g+a[l+m]*_;return r}let h=o*2,p=t-1;for(let _=0;_!==o;++_){let g=a[c+_],m=a[l+_],y=p*h+_*2,b=u[y],M=u[y+1],A=t*h+_*2,T=f[A],I=f[A+1],v=(n-e)/(s-e),x,R,w,P,D;for(let N=0;N<8;N++){x=v*v,R=x*v,w=1-v,P=w*w,D=P*w;let z=D*e+3*P*v*b+3*w*x*T+R*s-n;if(Math.abs(z)<1e-10)break;let k=3*P*(b-e)+6*w*v*(T-b)+3*x*(s-T);if(Math.abs(k)<1e-10)break;v=v-z/k,v=Math.max(0,Math.min(1,v))}r[_]=D*g+3*P*v*M+3*w*x*I+R*m}return r}},tn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Kr(e,this.TimeBufferType),this.values=Kr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Kr(t.times,Array),values:Kr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new La(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Pa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ia(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Da(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.settings=this.settings),e}setInterpolation(t){let e;switch(t){case Hs:e=this.InterpolantFactoryMethodDiscrete;break;case da:e=this.InterpolantFactoryMethodLinear;break;case ta:e=this.InterpolantFactoryMethodSmooth;break;case yl:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Lt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hs;case this.InterpolantFactoryMethodLinear:return da;case this.InterpolantFactoryMethodSmooth:return ta;case this.InterpolantFactoryMethodBezier:return yl}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Ut("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ut("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Ut("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ut("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&Mu(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Ut("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ta,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=t[o],d=t[o+1];if(c!==d&&(o!==1||c!==t[0]))if(s)l=!0;else{let f=o*n,u=f-n,h=f+n;for(let p=0;p!==n;++p){let _=e[f+p];if(_!==e[u+p]||_!==e[h+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*n,u=a*n;for(let h=0;h!==n;++h)e[u+h]=e[f+h]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};tn.prototype.ValueTypeName="";tn.prototype.TimeBufferType=Float32Array;tn.prototype.ValueBufferType=Float32Array;tn.prototype.DefaultInterpolation=da;var ii=class extends tn{constructor(t,e,n){super(t,e,n)}};ii.prototype.ValueTypeName="bool";ii.prototype.ValueBufferType=Array;ii.prototype.DefaultInterpolation=Hs;ii.prototype.InterpolantFactoryMethodLinear=void 0;ii.prototype.InterpolantFactoryMethodSmooth=void 0;var Ua=class extends tn{constructor(t,e,n,s){super(t,e,n,s)}};Ua.prototype.ValueTypeName="color";var Na=class extends tn{constructor(t,e,n,s){super(t,e,n,s)}};Na.prototype.ValueTypeName="number";var Fa=class extends ni{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let d=c+o;c!==d;c+=4)He.slerpFlat(r,0,a,c-o,a,c,l);return r}},or=class extends tn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Fa(this.times,this.values,this.getValueSize(),t)}};or.prototype.ValueTypeName="quaternion";or.prototype.InterpolantFactoryMethodSmooth=void 0;var si=class extends tn{constructor(t,e,n){super(t,e,n)}};si.prototype.ValueTypeName="string";si.prototype.ValueBufferType=Array;si.prototype.DefaultInterpolation=Hs;si.prototype.InterpolantFactoryMethodLinear=void 0;si.prototype.InterpolantFactoryMethodSmooth=void 0;var Oa=class extends tn{constructor(t,e,n,s){super(t,e,n,s)}};Oa.prototype.ValueTypeName="vector";var ea={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(Gc(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!Gc(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Gc(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var Ba=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(d){o++,r===!1&&s.onStart!==void 0&&s.onStart(d,a,o),r=!0},this.itemEnd=function(d){a++,s.onProgress!==void 0&&s.onProgress(d,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(d){s.onError!==void 0&&s.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,f){return c.push(d,f),this},this.removeHandler=function(d){let f=c.indexOf(d);return f!==-1&&c.splice(f,2),this},this.getHandler=function(d){for(let f=0,u=c.length;f<u;f+=2){let h=c[f],p=c[f+1];if(h.global&&(h.lastIndex=0),h.test(d))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Dh=new Ba,cs=class{constructor(t){this.manager=t!==void 0?t:Dh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};cs.DEFAULT_MATERIAL_NAME="__DEFAULT";var qi=new WeakMap,za=class extends cs{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,a=ea.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(a),r.manager.itemEnd(t)},0);else{let f=qi.get(a);f===void 0&&(f=[],qi.set(a,f)),f.push({onLoad:e,onError:s})}return a}let o=ji("img");function l(){d(),e&&e(this);let f=qi.get(this)||[];for(let u=0;u<f.length;u++){let h=f[u];h.onLoad&&h.onLoad(this)}qi.delete(this),r.manager.itemEnd(t)}function c(f){d(),s&&s(f),ea.remove(`image:${t}`);let u=qi.get(this)||[];for(let h=0;h<u.length;h++){let p=u[h];p.onError&&p.onError(f)}qi.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function d(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),ea.add(`image:${t}`,o),r.manager.itemStart(t),o.src=t,o}};var lr=class extends cs{constructor(t){super(t)}load(t,e,n,s){let r=new ze,a=new za(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){r.image=o,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},hs=class extends Me{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},cr=class extends hs{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},vl=new se,Hc=new L,Wc=new L,ka=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.mapType=Xe,this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new as,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Hc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Hc),Wc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Wc),e.updateMatrixWorld(),vl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vl,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Qi||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(vl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Qr=new L,jr=new He,_n=new L,hr=class extends Me{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Qr,jr,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qr,jr,_n.set(1,1,1)).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorld.decompose(Qr,jr,_n),_n.x===1&&_n.y===1&&_n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qr,jr,_n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Jn=new L,Xc=new xt,qc=new xt,De=class extends hr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=es*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan($i*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return es*2*Math.atan(Math.tan($i*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,Xc,qc),e.subVectors(qc,Xc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan($i*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var wl=class extends ka{constructor(){super(new De(90,1,.5,500)),this.isPointLightShadow=!0}},ur=class extends hs{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new wl}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},us=class extends hr{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Al=class extends ka{constructor(){super(new us(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ds=class extends hs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.target=new Me,this.shadow=new Al}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Yi=-90,Zi=1,Va=class extends Me{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new De(Yi,Zi,t,e);s.layers=this.layers,this.add(s);let r=new De(Yi,Zi,t,e);r.layers=this.layers,this.add(r);let a=new De(Yi,Zi,t,e);a.layers=this.layers,this.add(a);let o=new De(Yi,Zi,t,e);o.layers=this.layers,this.add(o);let l=new De(Yi,Zi,t,e);l.layers=this.layers,this.add(l);let c=new De(Yi,Zi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qi)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,d]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),h=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,d),t.setRenderTarget(f,u,h),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Ga=class extends De{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var jl="\\[\\]\\.:\\/",pd=new RegExp("["+jl+"]","g"),tc="[^"+jl+"]",md="[^"+jl.replace("\\.","")+"]",gd=/((?:WC+[\/:])*)/.source.replace("WC",tc),_d=/(WCOD+)?/.source.replace("WCOD",md),xd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tc),vd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tc),yd=new RegExp("^"+gd+_d+xd+vd+"$"),Md=["material","materials","bones","map"],Cl=class{constructor(t,e,n){let s=n||ce.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ce=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(pd,"")}static parseTrackName(t){let e=yd.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Md.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Lt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ut("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ut("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let d=0;d<t.length;d++)if(t[d].name===c){c=d;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ut("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ut("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Ut("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Ut("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[s];if(a===void 0){let c=e.nodeName;Ut("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ut("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ce.Composite=Cl;ce.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ce.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ce.prototype.GetterByBindingType=[ce.prototype._getValue_direct,ce.prototype._getValue_array,ce.prototype._getValue_arrayElement,ce.prototype._getValue_toArray];ce.prototype.SetterByBindingTypeAndVersioning=[[ce.prototype._setValue_direct,ce.prototype._setValue_direct_setNeedsUpdate,ce.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_array,ce.prototype._setValue_array_setNeedsUpdate,ce.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_arrayElement,ce.prototype._setValue_arrayElement_setNeedsUpdate,ce.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ce.prototype._setValue_fromArray,ce.prototype._setValue_fromArray_setNeedsUpdate,ce.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var w0=new Float32Array(1);var Yc=new se,dr=class{constructor(t,e,n=0,s=1/0){this.ray=new rs(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Ut("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Yc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Yc),this}intersectObject(t,e=!0,n=[]){return Rl(t,this,n,e),n.sort(Zc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Rl(t[s],this,n,e);return n.sort(Zc),n}};function Zc(i,t){return i.distance-t.distance}function Rl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)Rl(r[a],t,e,!0)}}function ec(i,t,e,n){let s=Sd(n);switch(e){case Xl:return i*t;case $a:return i*t/s.components*s.byteLength;case Ka:return i*t/s.components*s.byteLength;case Ti:return i*t*2/s.components*s.byteLength;case Qa:return i*t*2/s.components*s.byteLength;case ql:return i*t*3/s.components*s.byteLength;case an:return i*t*4/s.components*s.byteLength;case ja:return i*t*4/s.components*s.byteLength;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case xr:case vr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:case io:return Math.max(i,16)*Math.max(t,8)/4;case to:case no:return Math.max(i,8)*Math.max(t,8)/2;case so:case ro:case oo:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ao:case co:case ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case _o:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case vo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Eo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case wo:case Ao:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ro:case Io:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Po:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Sd(i){switch(i){case Xe:case Vl:return{byteLength:1,components:1};case ps:case Gl:case Tn:return{byteLength:2,components:1};case Za:case Ja:return{byteLength:2,components:4};case pn:case Ya:case rn:return{byteLength:4,components:1};case Hl:case Wl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"183"}}));typeof window<"u"&&(window.__THREE__?Lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="183");function nu(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rd(i){let t=new WeakMap;function e(o,l){let c=o.array,d=o.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,d),o.onUploadCallback();let h;if(c instanceof Float32Array)h=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=i.SHORT;else if(c instanceof Uint32Array)h=i.UNSIGNED_INT;else if(c instanceof Int32Array)h=i.INT;else if(c instanceof Int8Array)h=i.BYTE;else if(c instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let d=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,d);else{f.sort((h,p)=>h.start-p.start);let u=0;for(let h=1;h<f.length;h++){let p=f[u],_=f[h];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,f[u]=_)}f.length=u+1;for(let h=0,p=f.length;h<p;h++){let _=f[h];i.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let d=t.get(o);(!d||d.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Id=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Pd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ld=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ud=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Nd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Od=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,zd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Wd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Xd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Zd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Jd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,$d=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Qd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,jd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,tf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ef=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,nf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,af=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,of="gl_FragColor = linearToOutputTexel( gl_FragColor );",lf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,hf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,df=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ff=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,pf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_f=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,vf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ef=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Af=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,If=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Df=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Of=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,kf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Yf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$f=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ep=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,np=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ip=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,ap=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,op=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,up=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,fp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_p=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,yp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ep=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Ip=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Np=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Op=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Bp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Yp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Jp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$p=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Kp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Qp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,em=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,im=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,rm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,am=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,om=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ht={alphahash_fragment:Id,alphahash_pars_fragment:Pd,alphamap_fragment:Ld,alphamap_pars_fragment:Dd,alphatest_fragment:Ud,alphatest_pars_fragment:Nd,aomap_fragment:Fd,aomap_pars_fragment:Od,batching_pars_vertex:Bd,batching_vertex:zd,begin_vertex:kd,beginnormal_vertex:Vd,bsdfs:Gd,iridescence_fragment:Hd,bumpmap_pars_fragment:Wd,clipping_planes_fragment:Xd,clipping_planes_pars_fragment:qd,clipping_planes_pars_vertex:Yd,clipping_planes_vertex:Zd,color_fragment:Jd,color_pars_fragment:$d,color_pars_vertex:Kd,color_vertex:Qd,common:jd,cube_uv_reflection_fragment:tf,defaultnormal_vertex:ef,displacementmap_pars_vertex:nf,displacementmap_vertex:sf,emissivemap_fragment:rf,emissivemap_pars_fragment:af,colorspace_fragment:of,colorspace_pars_fragment:lf,envmap_fragment:cf,envmap_common_pars_fragment:hf,envmap_pars_fragment:uf,envmap_pars_vertex:df,envmap_physical_pars_fragment:bf,envmap_vertex:ff,fog_vertex:pf,fog_pars_vertex:mf,fog_fragment:gf,fog_pars_fragment:_f,gradientmap_pars_fragment:xf,lightmap_pars_fragment:vf,lights_lambert_fragment:yf,lights_lambert_pars_fragment:Mf,lights_pars_begin:Sf,lights_toon_fragment:Ef,lights_toon_pars_fragment:Tf,lights_phong_fragment:wf,lights_phong_pars_fragment:Af,lights_physical_fragment:Cf,lights_physical_pars_fragment:Rf,lights_fragment_begin:If,lights_fragment_maps:Pf,lights_fragment_end:Lf,logdepthbuf_fragment:Df,logdepthbuf_pars_fragment:Uf,logdepthbuf_pars_vertex:Nf,logdepthbuf_vertex:Ff,map_fragment:Of,map_pars_fragment:Bf,map_particle_fragment:zf,map_particle_pars_fragment:kf,metalnessmap_fragment:Vf,metalnessmap_pars_fragment:Gf,morphinstance_vertex:Hf,morphcolor_vertex:Wf,morphnormal_vertex:Xf,morphtarget_pars_vertex:qf,morphtarget_vertex:Yf,normal_fragment_begin:Zf,normal_fragment_maps:Jf,normal_pars_fragment:$f,normal_pars_vertex:Kf,normal_vertex:Qf,normalmap_pars_fragment:jf,clearcoat_normal_fragment_begin:tp,clearcoat_normal_fragment_maps:ep,clearcoat_pars_fragment:np,iridescence_pars_fragment:ip,opaque_fragment:sp,packing:rp,premultiplied_alpha_fragment:ap,project_vertex:op,dithering_fragment:lp,dithering_pars_fragment:cp,roughnessmap_fragment:hp,roughnessmap_pars_fragment:up,shadowmap_pars_fragment:dp,shadowmap_pars_vertex:fp,shadowmap_vertex:pp,shadowmask_pars_fragment:mp,skinbase_vertex:gp,skinning_pars_vertex:_p,skinning_vertex:xp,skinnormal_vertex:vp,specularmap_fragment:yp,specularmap_pars_fragment:Mp,tonemapping_fragment:Sp,tonemapping_pars_fragment:bp,transmission_fragment:Ep,transmission_pars_fragment:Tp,uv_pars_fragment:wp,uv_pars_vertex:Ap,uv_vertex:Cp,worldpos_vertex:Rp,background_vert:Ip,background_frag:Pp,backgroundCube_vert:Lp,backgroundCube_frag:Dp,cube_vert:Up,cube_frag:Np,depth_vert:Fp,depth_frag:Op,distance_vert:Bp,distance_frag:zp,equirect_vert:kp,equirect_frag:Vp,linedashed_vert:Gp,linedashed_frag:Hp,meshbasic_vert:Wp,meshbasic_frag:Xp,meshlambert_vert:qp,meshlambert_frag:Yp,meshmatcap_vert:Zp,meshmatcap_frag:Jp,meshnormal_vert:$p,meshnormal_frag:Kp,meshphong_vert:Qp,meshphong_frag:jp,meshphysical_vert:tm,meshphysical_frag:em,meshtoon_vert:nm,meshtoon_frag:im,points_vert:sm,points_frag:rm,shadow_vert:am,shadow_frag:om,sprite_vert:lm,sprite_frag:cm},ut={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},An={basic:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Ot(0)},envMapIntensity:{value:1}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:Ve([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:Ve([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:Ve([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:Ve([ut.points,ut.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:Ve([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:Ve([ut.common,ut.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:Ve([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:Ve([ut.sprite,ut.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distance:{uniforms:Ve([ut.common,ut.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distance_vert,fragmentShader:Ht.distance_frag},shadow:{uniforms:Ve([ut.lights,ut.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};An.physical={uniforms:Ve([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var Fo={r:0,b:0,g:0},Ai=new nn,hm=new se;function um(i,t,e,n,s,r){let a=new Ot(0),o=s===!0?0:1,l,c,d=null,f=0,u=null;function h(y){let b=y.isScene===!0?y.background:null;if(b&&b.isTexture){let M=y.backgroundBlurriness>0;b=t.get(b,M)}return b}function p(y){let b=!1,M=h(y);M===null?g(a,o):M&&M.isColor&&(g(M,1),b=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||b)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(y,b){let M=h(b);M&&(M.isCubeTexture||M.mapping===pr)?(c===void 0&&(c=new ue(new We(1,1,1),new je({name:"BackgroundCubeMaterial",uniforms:wi(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:Ne,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),Ai.copy(b.backgroundRotation),Ai.x*=-1,Ai.y*=-1,Ai.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Ai.y*=-1,Ai.z*=-1),c.material.uniforms.envMap.value=M,c.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(hm.makeRotationFromEuler(Ai)),c.material.toneMapped=Zt.getTransfer(M.colorSpace)!==ie,(d!==M||f!==M.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,d=M,f=M.version,u=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ue(new Te(2,2),new je({name:"BackgroundMaterial",uniforms:wi(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Zt.getTransfer(M.colorSpace)!==ie,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(d!==M||f!==M.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,d=M,f=M.version,u=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function g(y,b){y.getRGB(Fo,Ql(i)),e.buffers.color.setClear(Fo.r,Fo.g,Fo.b,b,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,b=1){a.set(y),o=b,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,g(a,o)},render:p,addToRenderList:_,dispose:m}}function dm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,a=!1;function o(w,P,D,N,F){let z=!1,k=f(w,N,D,P);r!==k&&(r=k,c(r.object)),z=h(w,N,D,F),z&&p(w,N,D,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,M(w,P,D,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(w){return i.bindVertexArray(w)}function d(w){return i.deleteVertexArray(w)}function f(w,P,D,N){let F=N.wireframe===!0,z=n[P.id];z===void 0&&(z={},n[P.id]=z);let k=w.isInstancedMesh===!0?w.id:0,$=z[k];$===void 0&&($={},z[k]=$);let Q=$[D.id];Q===void 0&&(Q={},$[D.id]=Q);let et=Q[F];return et===void 0&&(et=u(l()),Q[F]=et),et}function u(w){let P=[],D=[],N=[];for(let F=0;F<e;F++)P[F]=0,D[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:D,attributeDivisors:N,object:w,attributes:{},index:null}}function h(w,P,D,N){let F=r.attributes,z=P.attributes,k=0,$=D.getAttributes();for(let Q in $)if($[Q].location>=0){let ht=F[Q],nt=z[Q];if(nt===void 0&&(Q==="instanceMatrix"&&w.instanceMatrix&&(nt=w.instanceMatrix),Q==="instanceColor"&&w.instanceColor&&(nt=w.instanceColor)),ht===void 0||ht.attribute!==nt||nt&&ht.data!==nt.data)return!0;k++}return r.attributesNum!==k||r.index!==N}function p(w,P,D,N){let F={},z=P.attributes,k=0,$=D.getAttributes();for(let Q in $)if($[Q].location>=0){let ht=z[Q];ht===void 0&&(Q==="instanceMatrix"&&w.instanceMatrix&&(ht=w.instanceMatrix),Q==="instanceColor"&&w.instanceColor&&(ht=w.instanceColor));let nt={};nt.attribute=ht,ht&&ht.data&&(nt.data=ht.data),F[Q]=nt,k++}r.attributes=F,r.attributesNum=k,r.index=N}function _(){let w=r.newAttributes;for(let P=0,D=w.length;P<D;P++)w[P]=0}function g(w){m(w,0)}function m(w,P){let D=r.newAttributes,N=r.enabledAttributes,F=r.attributeDivisors;D[w]=1,N[w]===0&&(i.enableVertexAttribArray(w),N[w]=1),F[w]!==P&&(i.vertexAttribDivisor(w,P),F[w]=P)}function y(){let w=r.newAttributes,P=r.enabledAttributes;for(let D=0,N=P.length;D<N;D++)P[D]!==w[D]&&(i.disableVertexAttribArray(D),P[D]=0)}function b(w,P,D,N,F,z,k){k===!0?i.vertexAttribIPointer(w,P,D,F,z):i.vertexAttribPointer(w,P,D,N,F,z)}function M(w,P,D,N){_();let F=N.attributes,z=D.getAttributes(),k=P.defaultAttributeValues;for(let $ in z){let Q=z[$];if(Q.location>=0){let et=F[$];if(et===void 0&&($==="instanceMatrix"&&w.instanceMatrix&&(et=w.instanceMatrix),$==="instanceColor"&&w.instanceColor&&(et=w.instanceColor)),et!==void 0){let ht=et.normalized,nt=et.itemSize,Ct=t.get(et);if(Ct===void 0)continue;let Nt=Ct.buffer,te=Ct.type,J=Ct.bytesPerElement,it=te===i.INT||te===i.UNSIGNED_INT||et.gpuType===Ya;if(et.isInterleavedBufferAttribute){let rt=et.data,Ft=rt.stride,St=et.offset;if(rt.isInstancedInterleavedBuffer){for(let Dt=0;Dt<Q.locationSize;Dt++)m(Q.location+Dt,rt.meshPerAttribute);w.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Dt=0;Dt<Q.locationSize;Dt++)g(Q.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,Nt);for(let Dt=0;Dt<Q.locationSize;Dt++)b(Q.location+Dt,nt/Q.locationSize,te,ht,Ft*J,(St+nt/Q.locationSize*Dt)*J,it)}else{if(et.isInstancedBufferAttribute){for(let rt=0;rt<Q.locationSize;rt++)m(Q.location+rt,et.meshPerAttribute);w.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let rt=0;rt<Q.locationSize;rt++)g(Q.location+rt);i.bindBuffer(i.ARRAY_BUFFER,Nt);for(let rt=0;rt<Q.locationSize;rt++)b(Q.location+rt,nt/Q.locationSize,te,ht,nt*J,nt/Q.locationSize*rt*J,it)}}else if(k!==void 0){let ht=k[$];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(Q.location,ht);break;case 3:i.vertexAttrib3fv(Q.location,ht);break;case 4:i.vertexAttrib4fv(Q.location,ht);break;default:i.vertexAttrib1fv(Q.location,ht)}}}}y()}function A(){x();for(let w in n){let P=n[w];for(let D in P){let N=P[D];for(let F in N){let z=N[F];for(let k in z)d(z[k].object),delete z[k];delete N[F]}}delete n[w]}}function T(w){if(n[w.id]===void 0)return;let P=n[w.id];for(let D in P){let N=P[D];for(let F in N){let z=N[F];for(let k in z)d(z[k].object),delete z[k];delete N[F]}}delete n[w.id]}function I(w){for(let P in n){let D=n[P];for(let N in D){let F=D[N];if(F[w.id]===void 0)continue;let z=F[w.id];for(let k in z)d(z[k].object),delete z[k];delete F[w.id]}}}function v(w){for(let P in n){let D=n[P],N=w.isInstancedMesh===!0?w.id:0,F=D[N];if(F!==void 0){for(let z in F){let k=F[z];for(let $ in k)d(k[$].object),delete k[$];delete F[z]}delete D[N],Object.keys(D).length===0&&delete n[P]}}}function x(){R(),a=!0,r!==s&&(r=s,c(r.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:x,resetDefaultState:R,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:I,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function fm(i,t,e){let n;function s(c){n=c}function r(c,d){i.drawArrays(n,c,d),e.update(d,n,1)}function a(c,d,f){f!==0&&(i.drawArraysInstanced(n,c,d,f),e.update(d,n,f))}function o(c,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,f);let h=0;for(let p=0;p<f;p++)h+=d[p];e.update(h,n,1)}function l(c,d,f,u){if(f===0)return;let h=t.get("WEBGL_multi_draw");if(h===null)for(let p=0;p<c.length;p++)a(c[p],d[p],u[p]);else{h.multiDrawArraysInstancedWEBGL(n,c,0,d,0,u,0,f);let p=0;for(let _=0;_<f;_++)p+=d[_]*u[_];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function pm(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let I=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==an&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){let v=I===Tn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==Xe&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==rn&&!v)}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",d=l(c);d!==c&&(Lt("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:h,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:M,maxSamples:A,samples:T}}function mm(i){let t=this,e=null,n=0,s=!1,r=!1,a=new xn,o=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let h=f.length!==0||u||n!==0||s;return s=u,n=f.length,h},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=d(f,u,0)},this.setState=function(f,u,h){let p=f.clippingPlanes,_=f.clipIntersection,g=f.clipShadows,m=i.get(f);if(!s||p===null||p.length===0||r&&!g)r?d(null):c();else{let y=r?0:n,b=y*4,M=m.clippingState||null;l.value=M,M=d(p,u,b,h);for(let A=0;A!==b;++A)M[A]=e[A];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(f,u,h,p){let _=f!==null?f.length:0,g=null;if(_!==0){if(g=l.value,p!==!0||g===null){let m=h+_*4,y=u.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<m)&&(g=new Float32Array(m));for(let b=0,M=h;b!==_;++b,M+=4)a.copy(f[b]).applyMatrix4(y,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,g}}var li=4,Uh=[.125,.215,.35,.446,.526,.582],Ri=20,gm=256,yr=new us,Nh=new Ot,nc=null,ic=0,sc=0,rc=!1,_m=new L,vs=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:a=256,position:o=_m}=r;nc=this._renderer.getRenderTarget(),ic=this._renderer.getActiveCubeFace(),sc=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(nc,ic,sc),this._renderer.xr.enabled=rc,t.scissorTest=!1,_s(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ri||t.mapping===Ei?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),nc=this._renderer.getRenderTarget(),ic=this._renderer.getActiveCubeFace(),sc=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ue,minFilter:Ue,generateMipmaps:!1,type:Tn,format:an,colorSpace:xi,depthBuffer:!1},s=Fh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=xm(r)),this._blurMaterial=ym(r,t,e),this._ggxMaterial=vm(r,t,e)}return s}_compileMaterial(t){let e=new ue(new fe,t);this._renderer.compile(e,yr)}_sceneToCubeUV(t,e,n,s,r){let l=new De(90,1,e,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,h=f.toneMapping;f.getClearColor(Nh),f.toneMapping=fn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ue(new We,new Kn({name:"PMREM.Background",side:Ne,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,g=_.material,m=!1,y=t.background;y?y.isColor&&(g.color.copy(y),t.background=null,m=!0):(g.color.copy(Nh),m=!0);for(let b=0;b<6;b++){let M=b%3;M===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[b],r.y,r.z)):M===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[b]));let A=this._cubeSize;_s(s,M*A,b>2?A:0,A,A),f.setRenderTarget(s),m&&f.render(_,l),f.render(t,l)}f.toneMapping=h,f.autoClear=u,t.background=y}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ri||t.mapping===Ei;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oh());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;_s(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,yr)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-d*d),u=0+c*1.25,h=f*u,{_lodMax:p}=this,_=this._sizeLods[n],g=3*_*(n>p-li?n-p+li:0),m=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=h,l.mipInt.value=p-e,_s(r,g,m,3*_,2*_),s.setRenderTarget(r),s.render(o,yr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,_s(t,g,m,3*_,2*_),s.setRenderTarget(t),s.render(o,yr)}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ut("blur direction must be either latitudinal or longitudinal!");let d=3,f=this._lodMeshes[s];f.material=c;let u=c.uniforms,h=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*h):2*Math.PI/(2*Ri-1),_=r/p,g=isFinite(r)?1+Math.floor(d*_):Ri;g>Ri&&Lt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Ri}`);let m=[],y=0;for(let I=0;I<Ri;++I){let v=I/_,x=Math.exp(-v*v/2);m.push(x),I===0?y+=x:I<g&&(y+=2*x)}for(let I=0;I<m.length;I++)m[I]=m[I]/y;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=m,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:b}=this;u.dTheta.value=p,u.mipInt.value=b-n;let M=this._sizeLods[s],A=3*M*(s>b-li?s-b+li:0),T=4*(this._cubeSize-M);_s(e,A,T,3*M,2*M),l.setRenderTarget(e),l.render(f,yr)}};function xm(i){let t=[],e=[],n=[],s=i,r=i-li+1+Uh.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>i-li?l=Uh[a-i+li-1]:a===0&&(l=0),e.push(l);let c=1/(o-2),d=-c,f=1+c,u=[d,d,f,d,f,f,d,d,f,f,d,f],h=6,p=6,_=3,g=2,m=1,y=new Float32Array(_*p*h),b=new Float32Array(g*p*h),M=new Float32Array(m*p*h);for(let T=0;T<h;T++){let I=T%3*2/3-1,v=T>2?0:-1,x=[I,v,0,I+2/3,v,0,I+2/3,v+1,0,I,v,0,I+2/3,v+1,0,I,v+1,0];y.set(x,_*p*T),b.set(u,g*p*T);let R=[T,T,T,T,T,T];M.set(R,m*p*T)}let A=new fe;A.setAttribute("position",new Ee(y,_)),A.setAttribute("uv",new Ee(b,g)),A.setAttribute("faceIndex",new Ee(M,m)),n.push(new ue(A,null)),s>li&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function Fh(i,t,e){let n=new $e(i,t,e);return n.texture.mapping=pr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _s(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function vm(i,t,e){return new je({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:gm,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ko(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function ym(i,t,e){let n=new Float32Array(Ri),s=new L(0,1,0);return new je({name:"SphericalGaussianBlur",defines:{n:Ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function Oh(){return new je({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function Bh(){return new je({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ko(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:En,depthTest:!1,depthWrite:!1})}function ko(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Bo=class extends $e{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Qs(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new We(5,5,5),r=new je({name:"CubemapFromEquirect",uniforms:wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ne,blending:En});r.uniforms.tEquirect.value=e;let a=new ue(s,r),o=e.minFilter;return e.minFilter===ai&&(e.minFilter=Ue),new Va(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}};function Mm(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,h=!1){return u==null?null:h?a(u):r(u)}function r(u){if(u&&u.isTexture){let h=u.mapping;if(h===Wa||h===Xa)if(t.has(u)){let p=t.get(u).texture;return o(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let _=new Bo(p.height);return _.fromEquirectangularTexture(i,u),t.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let h=u.mapping,p=h===Wa||h===Xa,_=h===ri||h===Ei;if(p||_){let g=e.get(u),m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new vs(i)),g=p?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let y=u.image;return p&&y&&y.height>0||_&&y&&l(y)?(n===null&&(n=new vs(i)),g=p?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",d),g.texture):null}}}return u}function o(u,h){return h===Wa?u.mapping=ri:h===Xa&&(u.mapping=Ei),u}function l(u){let h=0,p=6;for(let _=0;_<p;_++)u[_]!==void 0&&h++;return h===p}function c(u){let h=u.target;h.removeEventListener("dispose",c);let p=t.get(h);p!==void 0&&(t.delete(h),p.dispose())}function d(u){let h=u.target;h.removeEventListener("dispose",d);let p=e.get(h);p!==void 0&&(e.delete(h),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Sm(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Xs("WebGLRenderer: "+n+" extension not supported."),s}}}function bm(i,t,e,n){let s={},r=new WeakMap;function a(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];let h=r.get(u);h&&(t.remove(h),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let h in u)t.update(u[h],i.ARRAY_BUFFER)}function c(f){let u=[],h=f.index,p=f.attributes.position,_=0;if(p===void 0)return;if(h!==null){let y=h.array;_=h.version;for(let b=0,M=y.length;b<M;b+=3){let A=y[b+0],T=y[b+1],I=y[b+2];u.push(A,T,T,I,I,A)}}else{let y=p.array;_=p.version;for(let b=0,M=y.length/3-1;b<M;b+=3){let A=b+0,T=b+1,I=b+2;u.push(A,T,T,I,I,A)}}let g=new(p.count>=65535?Js:Zs)(u,1);g.version=_;let m=r.get(f);m&&t.remove(m),r.set(f,g)}function d(f){let u=r.get(f);if(u){let h=f.index;h!==null&&u.version<h.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:d}}function Em(i,t,e){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,h){i.drawElements(n,h,r,u*a),e.update(h,n,1)}function c(u,h,p){p!==0&&(i.drawElementsInstanced(n,h,r,u*a,p),e.update(h,n,p))}function d(u,h,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,u,0,p);let g=0;for(let m=0;m<p;m++)g+=h[m];e.update(g,n,1)}function f(u,h,p,_){if(p===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<u.length;m++)c(u[m]/a,h[m],_[m]);else{g.multiDrawElementsInstancedWEBGL(n,h,0,r,u,0,_,0,p);let m=0;for(let y=0;y<p;y++)m+=h[y]*_[y];e.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function Tm(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Ut("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function wm(i,t,e){let n=new WeakMap,s=new de;function r(a,o,l){let c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=d!==void 0?d.length:0,u=n.get(o);if(u===void 0||u.count!==f){let x=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",x)};u!==void 0&&u.texture.dispose();let h=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],y=o.morphAttributes.color||[],b=0;h===!0&&(b=1),p===!0&&(b=2),_===!0&&(b=3);let M=o.attributes.position.count*b,A=1;M>t.maxTextureSize&&(A=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let T=new Float32Array(M*A*4*f),I=new qs(T,M,A,f);I.type=rn,I.needsUpdate=!0;let v=b*4;for(let R=0;R<f;R++){let w=g[R],P=m[R],D=y[R],N=M*A*4*R;for(let F=0;F<w.count;F++){let z=F*v;h===!0&&(s.fromBufferAttribute(w,F),T[N+z+0]=s.x,T[N+z+1]=s.y,T[N+z+2]=s.z,T[N+z+3]=0),p===!0&&(s.fromBufferAttribute(P,F),T[N+z+4]=s.x,T[N+z+5]=s.y,T[N+z+6]=s.z,T[N+z+7]=0),_===!0&&(s.fromBufferAttribute(D,F),T[N+z+8]=s.x,T[N+z+9]=s.y,T[N+z+10]=s.z,T[N+z+11]=D.itemSize===4?s.w:1)}}u={count:f,texture:I,size:new xt(M,A)},n.set(o,u),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let h=0;for(let _=0;_<c.length;_++)h+=c[_];let p=o.morphTargetsRelative?1:1-h;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Am(i,t,e,n,s){let r=new WeakMap;function a(c){let d=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==d&&(t.update(u),r.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==d&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){let h=c.skeleton;r.get(h)!==d&&(h.update(),r.set(h,d))}return u}function o(){r=new WeakMap}function l(c){let d=c.target;d.removeEventListener("dispose",l),n.releaseStatesOfObject(d),e.remove(d.instanceMatrix),d.instanceColor!==null&&e.remove(d.instanceColor)}return{update:a,dispose:o}}var Cm={[Ul]:"LINEAR_TONE_MAPPING",[Nl]:"REINHARD_TONE_MAPPING",[Fl]:"CINEON_TONE_MAPPING",[fr]:"ACES_FILMIC_TONE_MAPPING",[Bl]:"AGX_TONE_MAPPING",[zl]:"NEUTRAL_TONE_MAPPING",[Ol]:"CUSTOM_TONE_MAPPING"};function Rm(i,t,e,n,s){let r=new $e(t,e,{type:i,depthBuffer:n,stencilBuffer:s}),a=new $e(t,e,{type:Tn,depthBuffer:!1,stencilBuffer:!1}),o=new fe;o.setAttribute("position",new Gt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Gt([0,2,0,0,2,0],2));let l=new Aa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ue(o,l),d=new us(-1,1,1,-1,0,1),f=null,u=null,h=!1,p,_=null,g=[],m=!1;this.setSize=function(y,b){r.setSize(y,b),a.setSize(y,b);for(let M=0;M<g.length;M++){let A=g[M];A.setSize&&A.setSize(y,b)}},this.setEffects=function(y){g=y,m=g.length>0&&g[0].isRenderPass===!0;let b=r.width,M=r.height;for(let A=0;A<g.length;A++){let T=g[A];T.setSize&&T.setSize(b,M)}},this.begin=function(y,b){if(h||y.toneMapping===fn&&g.length===0)return!1;if(_=b,b!==null){let M=b.width,A=b.height;(r.width!==M||r.height!==A)&&this.setSize(M,A)}return m===!1&&y.setRenderTarget(r),p=y.toneMapping,y.toneMapping=fn,!0},this.hasRenderPass=function(){return m},this.end=function(y,b){y.toneMapping=p,h=!0;let M=r,A=a;for(let T=0;T<g.length;T++){let I=g[T];if(I.enabled!==!1&&(I.render(y,A,M,b),I.needsSwap!==!1)){let v=M;M=A,A=v}}if(f!==y.outputColorSpace||u!==y.toneMapping){f=y.outputColorSpace,u=y.toneMapping,l.defines={},Zt.getTransfer(f)===ie&&(l.defines.SRGB_TRANSFER="");let T=Cm[u];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,y.setRenderTarget(_),y.render(c,d),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}var iu=new ze,lc=new jn(1,1),su=new qs,ru=new ma,au=new Qs,zh=[],kh=[],Vh=new Float32Array(16),Gh=new Float32Array(9),Hh=new Float32Array(4);function ys(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=zh[s];if(r===void 0&&(r=new Float32Array(s),zh[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Vo(i,t){let e=kh[t];e===void 0&&(e=new Int32Array(t),kh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Im(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Pm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function Lm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function Dm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function Um(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Ae(e,n))return;Hh.set(n),i.uniformMatrix2fv(this.addr,!1,Hh),Ce(e,n)}}function Nm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Ae(e,n))return;Gh.set(n),i.uniformMatrix3fv(this.addr,!1,Gh),Ce(e,n)}}function Fm(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Ae(e,n))return;Vh.set(n),i.uniformMatrix4fv(this.addr,!1,Vh),Ce(e,n)}}function Om(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Bm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function zm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function km(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function Vm(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function Hm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function Wm(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function Xm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(lc.compareFunction=e.isReversedDepthBuffer()?No:Uo,r=lc):r=iu,e.setTexture2D(t||r,s)}function qm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ru,s)}function Ym(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||au,s)}function Zm(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||su,s)}function Jm(i){switch(i){case 5126:return Im;case 35664:return Pm;case 35665:return Lm;case 35666:return Dm;case 35674:return Um;case 35675:return Nm;case 35676:return Fm;case 5124:case 35670:return Om;case 35667:case 35671:return Bm;case 35668:case 35672:return zm;case 35669:case 35673:return km;case 5125:return Vm;case 36294:return Gm;case 36295:return Hm;case 36296:return Wm;case 35678:case 36198:case 36298:case 36306:case 35682:return Xm;case 35679:case 36299:case 36307:return qm;case 35680:case 36300:case 36308:case 36293:return Ym;case 36289:case 36303:case 36311:case 36292:return Zm}}function $m(i,t){i.uniform1fv(this.addr,t)}function Km(i,t){let e=ys(t,this.size,2);i.uniform2fv(this.addr,e)}function Qm(i,t){let e=ys(t,this.size,3);i.uniform3fv(this.addr,e)}function jm(i,t){let e=ys(t,this.size,4);i.uniform4fv(this.addr,e)}function tg(i,t){let e=ys(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function eg(i,t){let e=ys(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function ng(i,t){let e=ys(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function ig(i,t){i.uniform1iv(this.addr,t)}function sg(i,t){i.uniform2iv(this.addr,t)}function rg(i,t){i.uniform3iv(this.addr,t)}function ag(i,t){i.uniform4iv(this.addr,t)}function og(i,t){i.uniform1uiv(this.addr,t)}function lg(i,t){i.uniform2uiv(this.addr,t)}function cg(i,t){i.uniform3uiv(this.addr,t)}function hg(i,t){i.uniform4uiv(this.addr,t)}function ug(i,t,e){let n=this.cache,s=t.length,r=Vo(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=lc:a=iu;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function dg(i,t,e){let n=this.cache,s=t.length,r=Vo(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||ru,r[a])}function fg(i,t,e){let n=this.cache,s=t.length,r=Vo(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||au,r[a])}function pg(i,t,e){let n=this.cache,s=t.length,r=Vo(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||su,r[a])}function mg(i){switch(i){case 5126:return $m;case 35664:return Km;case 35665:return Qm;case 35666:return jm;case 35674:return tg;case 35675:return eg;case 35676:return ng;case 5124:case 35670:return ig;case 35667:case 35671:return sg;case 35668:case 35672:return rg;case 35669:case 35673:return ag;case 5125:return og;case 36294:return lg;case 36295:return cg;case 36296:return hg;case 35678:case 36198:case 36298:case 36306:case 35682:return ug;case 35679:case 36299:case 36307:return dg;case 35680:case 36300:case 36308:case 36293:return fg;case 36289:case 36303:case 36311:case 36292:return pg}}var cc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Jm(e.type)}},hc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=mg(e.type)}},uc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},ac=/(\w+)(\])?(\[|\.)?/g;function Wh(i,t){i.seq.push(t),i.map[t.id]=t}function gg(i,t,e){let n=i.name,s=n.length;for(ac.lastIndex=0;;){let r=ac.exec(n),a=ac.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Wh(e,c===void 0?new cc(o,i,t):new hc(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new uc(o),Wh(e,f)),e=f}}}var xs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);gg(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function Xh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var _g=37297,xg=0;function vg(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var qh=new Vt;function yg(i){Zt._getMatrix(qh,Zt.workingColorSpace,i);let t=`mat3( ${qh.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case Ws:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return Lt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Yh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+vg(i.getShaderSource(t),o)}else return r}function Mg(i,t){let e=yg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var Sg={[Ul]:"Linear",[Nl]:"Reinhard",[Fl]:"Cineon",[fr]:"ACESFilmic",[Bl]:"AgX",[zl]:"Neutral",[Ol]:"Custom"};function bg(i,t){let e=Sg[t];return e===void 0?(Lt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Oo=new L;function Eg(){Zt.getLuminanceCoefficients(Oo);let i=Oo.x.toFixed(4),t=Oo.y.toFixed(4),e=Oo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sr).join(`
`)}function wg(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ag(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Sr(i){return i!==""}function Zh(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Cg=/^[ \t]*#include +<([\w\d./]+)>/gm;function dc(i){return i.replace(Cg,Ig)}var Rg=new Map;function Ig(i,t){let e=Ht[t];if(e===void 0){let n=Rg.get(t);if(n!==void 0)e=Ht[n],Lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dc(e)}var Pg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $h(i){return i.replace(Pg,Lg)}function Lg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Kh(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Dg={[bi]:"SHADOWMAP_TYPE_PCF",[fs]:"SHADOWMAP_TYPE_VSM"};function Ug(i){return Dg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Ng={[ri]:"ENVMAP_TYPE_CUBE",[Ei]:"ENVMAP_TYPE_CUBE",[pr]:"ENVMAP_TYPE_CUBE_UV"};function Fg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Ng[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Og={[Ei]:"ENVMAP_MODE_REFRACTION"};function Bg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Og[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var zg={[Ha]:"ENVMAP_BLENDING_MULTIPLY",[gh]:"ENVMAP_BLENDING_MIX",[_h]:"ENVMAP_BLENDING_ADD"};function kg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":zg[i.combine]||"ENVMAP_BLENDING_NONE"}function Vg(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Gg(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Ug(e),c=Fg(e),d=Bg(e),f=kg(e),u=Vg(e),h=Tg(e),p=wg(r),_=s.createProgram(),g,m,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Sr).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Sr).join(`
`),m.length>0&&(m+=`
`)):(g=[Kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sr).join(`
`),m=[Kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+d:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fn?"#define TONE_MAPPING":"",e.toneMapping!==fn?Ht.tonemapping_pars_fragment:"",e.toneMapping!==fn?bg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,Mg("linearToOutputTexel",e.outputColorSpace),Eg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Sr).join(`
`)),a=dc(a),a=Zh(a,e),a=Jh(a,e),o=dc(o),o=Zh(o,e),o=Jh(o,e),a=$h(a),o=$h(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",e.glslVersion===Zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let b=y+g+a,M=y+m+o,A=Xh(s,s.VERTEX_SHADER,b),T=Xh(s,s.FRAGMENT_SHADER,M);s.attachShader(_,A),s.attachShader(_,T),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function I(w){if(i.debug.checkShaderErrors){let P=s.getProgramInfoLog(_)||"",D=s.getShaderInfoLog(A)||"",N=s.getShaderInfoLog(T)||"",F=P.trim(),z=D.trim(),k=N.trim(),$=!0,Q=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,A,T);else{let et=Yh(s,A,"vertex"),ht=Yh(s,T,"fragment");Ut("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+F+`
`+et+`
`+ht)}else F!==""?Lt("WebGLProgram: Program Info Log:",F):(z===""||k==="")&&(Q=!1);Q&&(w.diagnostics={runnable:$,programLog:F,vertexShader:{log:z,prefix:g},fragmentShader:{log:k,prefix:m}})}s.deleteShader(A),s.deleteShader(T),v=new xs(s,_),x=Ag(s,_)}let v;this.getUniforms=function(){return v===void 0&&I(this),v};let x;this.getAttributes=function(){return x===void 0&&I(this),x};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=s.getProgramParameter(_,_g)),R},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=xg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=T,this}var Hg=0,fc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new pc(t),e.set(t,n)),n}},pc=class{constructor(t){this.id=Hg++,this.code=t,this.usedTimes=0}};function Wg(i,t,e,n,s,r){let a=new is,o=new fc,l=new Set,c=[],d=new Map,f=n.logarithmicDepthBuffer,u=n.precision,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,x,R,w,P){let D=w.fog,N=P.geometry,F=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?w.environment:null,z=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,k=t.get(v.envMap||F,z),$=k&&k.mapping===pr?k.image.height:null,Q=h[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Lt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let et=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ht=et!==void 0?et.length:0,nt=0;N.morphAttributes.position!==void 0&&(nt=1),N.morphAttributes.normal!==void 0&&(nt=2),N.morphAttributes.color!==void 0&&(nt=3);let Ct,Nt,te,J;if(Q){let jt=An[Q];Ct=jt.vertexShader,Nt=jt.fragmentShader}else Ct=v.vertexShader,Nt=v.fragmentShader,o.update(v),te=o.getVertexShaderID(v),J=o.getFragmentShaderID(v);let it=i.getRenderTarget(),rt=i.state.buffers.depth.getReversed(),Ft=P.isInstancedMesh===!0,St=P.isBatchedMesh===!0,Dt=!!v.map,pe=!!v.matcap,Yt=!!k,Kt=!!v.aoMap,Jt=!!v.lightMap,Bt=!!v.bumpMap,he=!!v.normalMap,U=!!v.displacementMap,ee=!!v.emissiveMap,$t=!!v.metalnessMap,re=!!v.roughnessMap,vt=v.anisotropy>0,C=v.clearcoat>0,S=v.dispersion>0,B=v.iridescence>0,q=v.sheen>0,K=v.transmission>0,Z=vt&&!!v.anisotropyMap,pt=C&&!!v.clearcoatMap,lt=C&&!!v.clearcoatNormalMap,Tt=C&&!!v.clearcoatRoughnessMap,It=B&&!!v.iridescenceMap,j=B&&!!v.iridescenceThicknessMap,st=q&&!!v.sheenColorMap,mt=q&&!!v.sheenRoughnessMap,yt=!!v.specularMap,at=!!v.specularColorMap,zt=!!v.specularIntensityMap,O=K&&!!v.transmissionMap,ct=K&&!!v.thicknessMap,ot=!!v.gradientMap,gt=!!v.alphaMap,tt=v.alphaTest>0,Y=!!v.alphaHash,Mt=!!v.extensions,Pt=fn;v.toneMapped&&(it===null||it.isXRRenderTarget===!0)&&(Pt=i.toneMapping);let ne={shaderID:Q,shaderType:v.type,shaderName:v.name,vertexShader:Ct,fragmentShader:Nt,defines:v.defines,customVertexShaderID:te,customFragmentShaderID:J,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:St,batchingColor:St&&P._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&P.instanceColor!==null,instancingMorph:Ft&&P.morphTexture!==null,outputColorSpace:it===null?i.outputColorSpace:it.isXRRenderTarget===!0?it.texture.colorSpace:xi,alphaToCoverage:!!v.alphaToCoverage,map:Dt,matcap:pe,envMap:Yt,envMapMode:Yt&&k.mapping,envMapCubeUVHeight:$,aoMap:Kt,lightMap:Jt,bumpMap:Bt,normalMap:he,displacementMap:U,emissiveMap:ee,normalMapObjectSpace:he&&v.normalMapType===yh,normalMapTangentSpace:he&&v.normalMapType===Do,metalnessMap:$t,roughnessMap:re,anisotropy:vt,anisotropyMap:Z,clearcoat:C,clearcoatMap:pt,clearcoatNormalMap:lt,clearcoatRoughnessMap:Tt,dispersion:S,iridescence:B,iridescenceMap:It,iridescenceThicknessMap:j,sheen:q,sheenColorMap:st,sheenRoughnessMap:mt,specularMap:yt,specularColorMap:at,specularIntensityMap:zt,transmission:K,transmissionMap:O,thicknessMap:ct,gradientMap:ot,opaque:v.transparent===!1&&v.blending===gi&&v.alphaToCoverage===!1,alphaMap:gt,alphaTest:tt,alphaHash:Y,combine:v.combine,mapUv:Dt&&p(v.map.channel),aoMapUv:Kt&&p(v.aoMap.channel),lightMapUv:Jt&&p(v.lightMap.channel),bumpMapUv:Bt&&p(v.bumpMap.channel),normalMapUv:he&&p(v.normalMap.channel),displacementMapUv:U&&p(v.displacementMap.channel),emissiveMapUv:ee&&p(v.emissiveMap.channel),metalnessMapUv:$t&&p(v.metalnessMap.channel),roughnessMapUv:re&&p(v.roughnessMap.channel),anisotropyMapUv:Z&&p(v.anisotropyMap.channel),clearcoatMapUv:pt&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:lt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Tt&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:It&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:j&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:st&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:mt&&p(v.sheenRoughnessMap.channel),specularMapUv:yt&&p(v.specularMap.channel),specularColorMapUv:at&&p(v.specularColorMap.channel),specularIntensityMapUv:zt&&p(v.specularIntensityMap.channel),transmissionMapUv:O&&p(v.transmissionMap.channel),thicknessMapUv:ct&&p(v.thicknessMap.channel),alphaMapUv:gt&&p(v.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(he||vt),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!N.attributes.uv&&(Dt||gt),fog:!!D,useFog:v.fog===!0,fogExp2:!!D&&D.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||N.attributes.normal===void 0&&he===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:rt,skinning:P.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:nt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pt,decodeVideoTexture:Dt&&v.map.isVideoTexture===!0&&Zt.getTransfer(v.map.colorSpace)===ie,decodeVideoTextureEmissive:ee&&v.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(v.emissiveMap.colorSpace)===ie,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===we,flipSided:v.side===Ne,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Mt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&v.extensions.multiDraw===!0||St)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ne.vertexUv1s=l.has(1),ne.vertexUv2s=l.has(2),ne.vertexUv3s=l.has(3),l.clear(),ne}function g(v){let x=[];if(v.shaderID?x.push(v.shaderID):(x.push(v.customVertexShaderID),x.push(v.customFragmentShaderID)),v.defines!==void 0)for(let R in v.defines)x.push(R),x.push(v.defines[R]);return v.isRawShaderMaterial===!1&&(m(x,v),y(x,v),x.push(i.outputColorSpace)),x.push(v.customProgramCacheKey),x.join()}function m(v,x){v.push(x.precision),v.push(x.outputColorSpace),v.push(x.envMapMode),v.push(x.envMapCubeUVHeight),v.push(x.mapUv),v.push(x.alphaMapUv),v.push(x.lightMapUv),v.push(x.aoMapUv),v.push(x.bumpMapUv),v.push(x.normalMapUv),v.push(x.displacementMapUv),v.push(x.emissiveMapUv),v.push(x.metalnessMapUv),v.push(x.roughnessMapUv),v.push(x.anisotropyMapUv),v.push(x.clearcoatMapUv),v.push(x.clearcoatNormalMapUv),v.push(x.clearcoatRoughnessMapUv),v.push(x.iridescenceMapUv),v.push(x.iridescenceThicknessMapUv),v.push(x.sheenColorMapUv),v.push(x.sheenRoughnessMapUv),v.push(x.specularMapUv),v.push(x.specularColorMapUv),v.push(x.specularIntensityMapUv),v.push(x.transmissionMapUv),v.push(x.thicknessMapUv),v.push(x.combine),v.push(x.fogExp2),v.push(x.sizeAttenuation),v.push(x.morphTargetsCount),v.push(x.morphAttributeCount),v.push(x.numDirLights),v.push(x.numPointLights),v.push(x.numSpotLights),v.push(x.numSpotLightMaps),v.push(x.numHemiLights),v.push(x.numRectAreaLights),v.push(x.numDirLightShadows),v.push(x.numPointLightShadows),v.push(x.numSpotLightShadows),v.push(x.numSpotLightShadowsWithMaps),v.push(x.numLightProbes),v.push(x.shadowMapType),v.push(x.toneMapping),v.push(x.numClippingPlanes),v.push(x.numClipIntersection),v.push(x.depthPacking)}function y(v,x){a.disableAll(),x.instancing&&a.enable(0),x.instancingColor&&a.enable(1),x.instancingMorph&&a.enable(2),x.matcap&&a.enable(3),x.envMap&&a.enable(4),x.normalMapObjectSpace&&a.enable(5),x.normalMapTangentSpace&&a.enable(6),x.clearcoat&&a.enable(7),x.iridescence&&a.enable(8),x.alphaTest&&a.enable(9),x.vertexColors&&a.enable(10),x.vertexAlphas&&a.enable(11),x.vertexUv1s&&a.enable(12),x.vertexUv2s&&a.enable(13),x.vertexUv3s&&a.enable(14),x.vertexTangents&&a.enable(15),x.anisotropy&&a.enable(16),x.alphaHash&&a.enable(17),x.batching&&a.enable(18),x.dispersion&&a.enable(19),x.batchingColor&&a.enable(20),x.gradientMap&&a.enable(21),v.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reversedDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),v.push(a.mask)}function b(v){let x=h[v.type],R;if(x){let w=An[x];R=Lh.clone(w.uniforms)}else R=v.uniforms;return R}function M(v,x){let R=d.get(x);return R!==void 0?++R.usedTimes:(R=new Gg(i,x,v,s),c.push(R),d.set(x,R)),R}function A(v){if(--v.usedTimes===0){let x=c.indexOf(v);c[x]=c[c.length-1],c.pop(),d.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function I(){o.dispose()}return{getParameters:_,getProgramCacheKey:g,getUniforms:b,acquireProgram:M,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:I}}function Xg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function qg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Qh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function jh(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let h=0;return u.isInstancedMesh&&(h+=2),u.isSkinnedMesh&&(h+=1),h}function o(u,h,p,_,g,m){let y=i[t];return y===void 0?(y={id:u.id,object:u,geometry:h,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:g,group:m},i[t]=y):(y.id=u.id,y.object=u,y.geometry=h,y.material=p,y.materialVariant=a(u),y.groupOrder=_,y.renderOrder=u.renderOrder,y.z=g,y.group=m),t++,y}function l(u,h,p,_,g,m){let y=o(u,h,p,_,g,m);p.transmission>0?n.push(y):p.transparent===!0?s.push(y):e.push(y)}function c(u,h,p,_,g,m){let y=o(u,h,p,_,g,m);p.transmission>0?n.unshift(y):p.transparent===!0?s.unshift(y):e.unshift(y)}function d(u,h){e.length>1&&e.sort(u||qg),n.length>1&&n.sort(h||Qh),s.length>1&&s.sort(h||Qh)}function f(){for(let u=t,h=i.length;u<h;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:d}}function Yg(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new jh,i.set(n,[a])):s>=r.length?(a=new jh,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Zg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Ot};break;case"SpotLight":e={position:new L,direction:new L,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Jg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var $g=0;function Kg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Qg(i){let t=new Zg,e=Jg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);let s=new L,r=new se,a=new se;function o(c){let d=0,f=0,u=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let h=0,p=0,_=0,g=0,m=0,y=0,b=0,M=0,A=0,T=0,I=0;c.sort(Kg);for(let x=0,R=c.length;x<R;x++){let w=c[x],P=w.color,D=w.intensity,N=w.distance,F=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===Ti?F=w.shadow.map.texture:F=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)d+=P.r*D,f+=P.g*D,u+=P.b*D;else if(w.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(w.sh.coefficients[z],D);I++}else if(w.isDirectionalLight){let z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){let k=w.shadow,$=e.get(w);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,n.directionalShadow[h]=$,n.directionalShadowMap[h]=F,n.directionalShadowMatrix[h]=w.shadow.matrix,y++}n.directional[h]=z,h++}else if(w.isSpotLight){let z=t.get(w);z.position.setFromMatrixPosition(w.matrixWorld),z.color.copy(P).multiplyScalar(D),z.distance=N,z.coneCos=Math.cos(w.angle),z.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),z.decay=w.decay,n.spot[_]=z;let k=w.shadow;if(w.map&&(n.spotLightMap[A]=w.map,A++,k.updateMatrices(w),w.castShadow&&T++),n.spotLightMatrix[_]=k.matrix,w.castShadow){let $=e.get(w);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,n.spotShadow[_]=$,n.spotShadowMap[_]=F,M++}_++}else if(w.isRectAreaLight){let z=t.get(w);z.color.copy(P).multiplyScalar(D),z.halfWidth.set(w.width*.5,0,0),z.halfHeight.set(0,w.height*.5,0),n.rectArea[g]=z,g++}else if(w.isPointLight){let z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),z.distance=w.distance,z.decay=w.decay,w.castShadow){let k=w.shadow,$=e.get(w);$.shadowIntensity=k.intensity,$.shadowBias=k.bias,$.shadowNormalBias=k.normalBias,$.shadowRadius=k.radius,$.shadowMapSize=k.mapSize,$.shadowCameraNear=k.camera.near,$.shadowCameraFar=k.camera.far,n.pointShadow[p]=$,n.pointShadowMap[p]=F,n.pointShadowMatrix[p]=w.shadow.matrix,b++}n.point[p]=z,p++}else if(w.isHemisphereLight){let z=t.get(w);z.skyColor.copy(w.color).multiplyScalar(D),z.groundColor.copy(w.groundColor).multiplyScalar(D),n.hemi[m]=z,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ut.LTC_FLOAT_1,n.rectAreaLTC2=ut.LTC_FLOAT_2):(n.rectAreaLTC1=ut.LTC_HALF_1,n.rectAreaLTC2=ut.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=f,n.ambient[2]=u;let v=n.hash;(v.directionalLength!==h||v.pointLength!==p||v.spotLength!==_||v.rectAreaLength!==g||v.hemiLength!==m||v.numDirectionalShadows!==y||v.numPointShadows!==b||v.numSpotShadows!==M||v.numSpotMaps!==A||v.numLightProbes!==I)&&(n.directional.length=h,n.spot.length=_,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=M+A-T,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=I,v.directionalLength=h,v.pointLength=p,v.spotLength=_,v.rectAreaLength=g,v.hemiLength=m,v.numDirectionalShadows=y,v.numPointShadows=b,v.numSpotShadows=M,v.numSpotMaps=A,v.numLightProbes=I,n.version=$g++)}function l(c,d){let f=0,u=0,h=0,p=0,_=0,g=d.matrixWorldInverse;for(let m=0,y=c.length;m<y;m++){let b=c[m];if(b.isDirectionalLight){let M=n.directional[f];M.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),f++}else if(b.isSpotLight){let M=n.spot[h];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(g),h++}else if(b.isRectAreaLight){let M=n.rectArea[p];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),M.halfWidth.set(b.width*.5,0,0),M.halfHeight.set(0,b.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),p++}else if(b.isPointLight){let M=n.point[u];M.position.setFromMatrixPosition(b.matrixWorld),M.position.applyMatrix4(g),u++}else if(b.isHemisphereLight){let M=n.hemi[_];M.direction.setFromMatrixPosition(b.matrixWorld),M.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:n}}function tu(i){let t=new Qg(i),e=[],n=[];function s(d){c.camera=d,e.length=0,n.length=0}function r(d){e.push(d)}function a(d){n.push(d)}function o(){t.setup(e)}function l(d){t.setupView(e,d)}let c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function jg(i){let t=new WeakMap;function e(s,r=0){let a=t.get(s),o;return a===void 0?(o=new tu(i),t.set(s,[o])):r>=a.length?(o=new tu(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var t0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,e0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,n0=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],i0=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],eu=new se,Mr=new L,oc=new L;function s0(i,t,e){let n=new as,s=new xt,r=new xt,a=new de,o=new Ca,l=new Ra,c={},d=e.maxTextureSize,f={[Bn]:Ne,[Ne]:Bn,[we]:we},u=new je({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:t0,fragmentShader:e0}),h=u.clone();h.defines.HORIZONTAL_PASS=1;let p=new fe;p.setAttribute("position",new Ee(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ue(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bi;let m=this.type;this.render=function(T,I,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Kc&&(Lt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=bi);let x=i.getRenderTarget(),R=i.getActiveCubeFace(),w=i.getActiveMipmapLevel(),P=i.state;P.setBlending(En),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let D=m!==this.type;D&&I.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(F=>F.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,F=T.length;N<F;N++){let z=T[N],k=z.shadow;if(k===void 0){Lt("WebGLShadowMap:",z,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let $=k.getFrameExtents();s.multiply($),r.copy(k.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/$.x),s.x=r.x*$.x,k.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/$.y),s.y=r.y*$.y,k.mapSize.y=r.y));let Q=i.state.buffers.depth.getReversed();if(k.camera._reversedDepth=Q,k.map===null||D===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===fs){if(z.isPointLight){Lt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new $e(s.x,s.y,{format:Ti,type:Tn,minFilter:Ue,magFilter:Ue,generateMipmaps:!1}),k.map.texture.name=z.name+".shadowMap",k.map.depthTexture=new jn(s.x,s.y,rn),k.map.depthTexture.name=z.name+".shadowMapDepth",k.map.depthTexture.format=yn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Pe,k.map.depthTexture.magFilter=Pe}else z.isPointLight?(k.map=new Bo(s.x),k.map.depthTexture=new va(s.x,pn)):(k.map=new $e(s.x,s.y),k.map.depthTexture=new jn(s.x,s.y,pn)),k.map.depthTexture.name=z.name+".shadowMap",k.map.depthTexture.format=yn,this.type===bi?(k.map.depthTexture.compareFunction=Q?No:Uo,k.map.depthTexture.minFilter=Ue,k.map.depthTexture.magFilter=Ue):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Pe,k.map.depthTexture.magFilter=Pe);k.camera.updateProjectionMatrix()}let et=k.map.isWebGLCubeRenderTarget?6:1;for(let ht=0;ht<et;ht++){if(k.map.isWebGLCubeRenderTarget)i.setRenderTarget(k.map,ht),i.clear();else{ht===0&&(i.setRenderTarget(k.map),i.clear());let nt=k.getViewport(ht);a.set(r.x*nt.x,r.y*nt.y,r.x*nt.z,r.y*nt.w),P.viewport(a)}if(z.isPointLight){let nt=k.camera,Ct=k.matrix,Nt=z.distance||nt.far;Nt!==nt.far&&(nt.far=Nt,nt.updateProjectionMatrix()),Mr.setFromMatrixPosition(z.matrixWorld),nt.position.copy(Mr),oc.copy(nt.position),oc.add(n0[ht]),nt.up.copy(i0[ht]),nt.lookAt(oc),nt.updateMatrixWorld(),Ct.makeTranslation(-Mr.x,-Mr.y,-Mr.z),eu.multiplyMatrices(nt.projectionMatrix,nt.matrixWorldInverse),k._frustum.setFromProjectionMatrix(eu,nt.coordinateSystem,nt.reversedDepth)}else k.updateMatrices(z);n=k.getFrustum(),M(I,v,k.camera,z,this.type)}k.isPointLightShadow!==!0&&this.type===fs&&y(k,v),k.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(x,R,w)};function y(T,I){let v=t.update(_);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,h.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,h.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new $e(s.x,s.y,{format:Ti,type:Tn})),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(I,null,v,u,_,null),h.uniforms.shadow_pass.value=T.mapPass.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(I,null,v,h,_,null)}function b(T,I,v,x){let R=null,w=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(w!==void 0)R=w;else if(R=v.isPointLight===!0?l:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let P=R.uuid,D=I.uuid,N=c[P];N===void 0&&(N={},c[P]=N);let F=N[D];F===void 0&&(F=R.clone(),N[D]=F,I.addEventListener("dispose",A)),R=F}if(R.visible=I.visible,R.wireframe=I.wireframe,x===fs?R.side=I.shadowSide!==null?I.shadowSide:I.side:R.side=I.shadowSide!==null?I.shadowSide:f[I.side],R.alphaMap=I.alphaMap,R.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,R.map=I.map,R.clipShadows=I.clipShadows,R.clippingPlanes=I.clippingPlanes,R.clipIntersection=I.clipIntersection,R.displacementMap=I.displacementMap,R.displacementScale=I.displacementScale,R.displacementBias=I.displacementBias,R.wireframeLinewidth=I.wireframeLinewidth,R.linewidth=I.linewidth,v.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let P=i.properties.get(R);P.light=v}return R}function M(T,I,v,x,R){if(T.visible===!1)return;if(T.layers.test(I.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&R===fs)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);let D=t.update(T),N=T.material;if(Array.isArray(N)){let F=D.groups;for(let z=0,k=F.length;z<k;z++){let $=F[z],Q=N[$.materialIndex];if(Q&&Q.visible){let et=b(T,Q,x,R);T.onBeforeShadow(i,T,I,v,D,et,$),i.renderBufferDirect(v,null,D,et,T,$),T.onAfterShadow(i,T,I,v,D,et,$)}}}else if(N.visible){let F=b(T,N,x,R);T.onBeforeShadow(i,T,I,v,D,F,null),i.renderBufferDirect(v,null,D,F,T,null),T.onAfterShadow(i,T,I,v,D,F,null)}}let P=T.children;for(let D=0,N=P.length;D<N;D++)M(P[D],I,v,x,R)}function A(T){T.target.removeEventListener("dispose",A);for(let v in c){let x=c[v],R=T.target.uuid;R in x&&(x[R].dispose(),delete x[R])}}}function r0(i,t){function e(){let O=!1,ct=new de,ot=null,gt=new de(0,0,0,0);return{setMask:function(tt){ot!==tt&&!O&&(i.colorMask(tt,tt,tt,tt),ot=tt)},setLocked:function(tt){O=tt},setClear:function(tt,Y,Mt,Pt,ne){ne===!0&&(tt*=Pt,Y*=Pt,Mt*=Pt),ct.set(tt,Y,Mt,Pt),gt.equals(ct)===!1&&(i.clearColor(tt,Y,Mt,Pt),gt.copy(ct))},reset:function(){O=!1,ot=null,gt.set(-1,0,0,0)}}}function n(){let O=!1,ct=!1,ot=null,gt=null,tt=null;return{setReversed:function(Y){if(ct!==Y){let Mt=t.get("EXT_clip_control");Y?Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.ZERO_TO_ONE_EXT):Mt.clipControlEXT(Mt.LOWER_LEFT_EXT,Mt.NEGATIVE_ONE_TO_ONE_EXT),ct=Y;let Pt=tt;tt=null,this.setClear(Pt)}},getReversed:function(){return ct},setTest:function(Y){Y?it(i.DEPTH_TEST):rt(i.DEPTH_TEST)},setMask:function(Y){ot!==Y&&!O&&(i.depthMask(Y),ot=Y)},setFunc:function(Y){if(ct&&(Y=Ih[Y]),gt!==Y){switch(Y){case sa:i.depthFunc(i.NEVER);break;case ra:i.depthFunc(i.ALWAYS);break;case aa:i.depthFunc(i.LESS);break;case _i:i.depthFunc(i.LEQUAL);break;case oa:i.depthFunc(i.EQUAL);break;case la:i.depthFunc(i.GEQUAL);break;case ca:i.depthFunc(i.GREATER);break;case ha:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}gt=Y}},setLocked:function(Y){O=Y},setClear:function(Y){tt!==Y&&(tt=Y,ct&&(Y=1-Y),i.clearDepth(Y))},reset:function(){O=!1,ot=null,gt=null,tt=null,ct=!1}}}function s(){let O=!1,ct=null,ot=null,gt=null,tt=null,Y=null,Mt=null,Pt=null,ne=null;return{setTest:function(jt){O||(jt?it(i.STENCIL_TEST):rt(i.STENCIL_TEST))},setMask:function(jt){ct!==jt&&!O&&(i.stencilMask(jt),ct=jt)},setFunc:function(jt,ve,me){(ot!==jt||gt!==ve||tt!==me)&&(i.stencilFunc(jt,ve,me),ot=jt,gt=ve,tt=me)},setOp:function(jt,ve,me){(Y!==jt||Mt!==ve||Pt!==me)&&(i.stencilOp(jt,ve,me),Y=jt,Mt=ve,Pt=me)},setLocked:function(jt){O=jt},setClear:function(jt){ne!==jt&&(i.clearStencil(jt),ne=jt)},reset:function(){O=!1,ct=null,ot=null,gt=null,tt=null,Y=null,Mt=null,Pt=null,ne=null}}}let r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap,d={},f={},u=new WeakMap,h=[],p=null,_=!1,g=null,m=null,y=null,b=null,M=null,A=null,T=null,I=new Ot(0,0,0),v=0,x=!1,R=null,w=null,P=null,D=null,N=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,k=0,$=i.getParameter(i.VERSION);$.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec($)[1]),z=k>=1):$.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),z=k>=2);let Q=null,et={},ht=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),Ct=new de().fromArray(ht),Nt=new de().fromArray(nt);function te(O,ct,ot,gt){let tt=new Uint8Array(4),Y=i.createTexture();i.bindTexture(O,Y),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Mt=0;Mt<ot;Mt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,gt,0,i.RGBA,i.UNSIGNED_BYTE,tt):i.texImage2D(ct+Mt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,tt);return Y}let J={};J[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),it(i.DEPTH_TEST),a.setFunc(_i),Bt(!1),he(Il),it(i.CULL_FACE),Kt(En);function it(O){d[O]!==!0&&(i.enable(O),d[O]=!0)}function rt(O){d[O]!==!1&&(i.disable(O),d[O]=!1)}function Ft(O,ct){return f[O]!==ct?(i.bindFramebuffer(O,ct),f[O]=ct,O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ct),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function St(O,ct){let ot=h,gt=!1;if(O){ot=u.get(ct),ot===void 0&&(ot=[],u.set(ct,ot));let tt=O.textures;if(ot.length!==tt.length||ot[0]!==i.COLOR_ATTACHMENT0){for(let Y=0,Mt=tt.length;Y<Mt;Y++)ot[Y]=i.COLOR_ATTACHMENT0+Y;ot.length=tt.length,gt=!0}}else ot[0]!==i.BACK&&(ot[0]=i.BACK,gt=!0);gt&&i.drawBuffers(ot)}function Dt(O){return p!==O?(i.useProgram(O),p=O,!0):!1}let pe={[$n]:i.FUNC_ADD,[jc]:i.FUNC_SUBTRACT,[th]:i.FUNC_REVERSE_SUBTRACT};pe[eh]=i.MIN,pe[nh]=i.MAX;let Yt={[ih]:i.ZERO,[sh]:i.ONE,[rh]:i.SRC_COLOR,[na]:i.SRC_ALPHA,[uh]:i.SRC_ALPHA_SATURATE,[ch]:i.DST_COLOR,[oh]:i.DST_ALPHA,[ah]:i.ONE_MINUS_SRC_COLOR,[ia]:i.ONE_MINUS_SRC_ALPHA,[hh]:i.ONE_MINUS_DST_COLOR,[lh]:i.ONE_MINUS_DST_ALPHA,[dh]:i.CONSTANT_COLOR,[fh]:i.ONE_MINUS_CONSTANT_COLOR,[ph]:i.CONSTANT_ALPHA,[mh]:i.ONE_MINUS_CONSTANT_ALPHA};function Kt(O,ct,ot,gt,tt,Y,Mt,Pt,ne,jt){if(O===En){_===!0&&(rt(i.BLEND),_=!1);return}if(_===!1&&(it(i.BLEND),_=!0),O!==Qc){if(O!==g||jt!==x){if((m!==$n||M!==$n)&&(i.blendEquation(i.FUNC_ADD),m=$n,M=$n),jt)switch(O){case gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFunc(i.ONE,i.ONE);break;case Ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ut("WebGLState: Invalid blending: ",O);break}else switch(O){case gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ll:Ut("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dl:Ut("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ut("WebGLState: Invalid blending: ",O);break}y=null,b=null,A=null,T=null,I.set(0,0,0),v=0,g=O,x=jt}return}tt=tt||ct,Y=Y||ot,Mt=Mt||gt,(ct!==m||tt!==M)&&(i.blendEquationSeparate(pe[ct],pe[tt]),m=ct,M=tt),(ot!==y||gt!==b||Y!==A||Mt!==T)&&(i.blendFuncSeparate(Yt[ot],Yt[gt],Yt[Y],Yt[Mt]),y=ot,b=gt,A=Y,T=Mt),(Pt.equals(I)===!1||ne!==v)&&(i.blendColor(Pt.r,Pt.g,Pt.b,ne),I.copy(Pt),v=ne),g=O,x=!1}function Jt(O,ct){O.side===we?rt(i.CULL_FACE):it(i.CULL_FACE);let ot=O.side===Ne;ct&&(ot=!ot),Bt(ot),O.blending===gi&&O.transparent===!1?Kt(En):Kt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let gt=O.stencilWrite;o.setTest(gt),gt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ee(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?it(i.SAMPLE_ALPHA_TO_COVERAGE):rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Bt(O){R!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),R=O)}function he(O){O!==Jc?(it(i.CULL_FACE),O!==w&&(O===Il?i.cullFace(i.BACK):O===$c?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):rt(i.CULL_FACE),w=O}function U(O){O!==P&&(z&&i.lineWidth(O),P=O)}function ee(O,ct,ot){O?(it(i.POLYGON_OFFSET_FILL),(D!==ct||N!==ot)&&(D=ct,N=ot,a.getReversed()&&(ct=-ct),i.polygonOffset(ct,ot))):rt(i.POLYGON_OFFSET_FILL)}function $t(O){O?it(i.SCISSOR_TEST):rt(i.SCISSOR_TEST)}function re(O){O===void 0&&(O=i.TEXTURE0+F-1),Q!==O&&(i.activeTexture(O),Q=O)}function vt(O,ct,ot){ot===void 0&&(Q===null?ot=i.TEXTURE0+F-1:ot=Q);let gt=et[ot];gt===void 0&&(gt={type:void 0,texture:void 0},et[ot]=gt),(gt.type!==O||gt.texture!==ct)&&(Q!==ot&&(i.activeTexture(ot),Q=ot),i.bindTexture(O,ct||J[O]),gt.type=O,gt.texture=ct)}function C(){let O=et[Q];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function S(){try{i.compressedTexImage2D(...arguments)}catch(O){Ut("WebGLState:",O)}}function B(){try{i.compressedTexImage3D(...arguments)}catch(O){Ut("WebGLState:",O)}}function q(){try{i.texSubImage2D(...arguments)}catch(O){Ut("WebGLState:",O)}}function K(){try{i.texSubImage3D(...arguments)}catch(O){Ut("WebGLState:",O)}}function Z(){try{i.compressedTexSubImage2D(...arguments)}catch(O){Ut("WebGLState:",O)}}function pt(){try{i.compressedTexSubImage3D(...arguments)}catch(O){Ut("WebGLState:",O)}}function lt(){try{i.texStorage2D(...arguments)}catch(O){Ut("WebGLState:",O)}}function Tt(){try{i.texStorage3D(...arguments)}catch(O){Ut("WebGLState:",O)}}function It(){try{i.texImage2D(...arguments)}catch(O){Ut("WebGLState:",O)}}function j(){try{i.texImage3D(...arguments)}catch(O){Ut("WebGLState:",O)}}function st(O){Ct.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),Ct.copy(O))}function mt(O){Nt.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Nt.copy(O))}function yt(O,ct){let ot=c.get(ct);ot===void 0&&(ot=new WeakMap,c.set(ct,ot));let gt=ot.get(O);gt===void 0&&(gt=i.getUniformBlockIndex(ct,O.name),ot.set(O,gt))}function at(O,ct){let gt=c.get(ct).get(O);l.get(ct)!==gt&&(i.uniformBlockBinding(ct,gt,O.__bindingPointIndex),l.set(ct,gt))}function zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},Q=null,et={},f={},u=new WeakMap,h=[],p=null,_=!1,g=null,m=null,y=null,b=null,M=null,A=null,T=null,I=new Ot(0,0,0),v=0,x=!1,R=null,w=null,P=null,D=null,N=null,Ct.set(0,0,i.canvas.width,i.canvas.height),Nt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:it,disable:rt,bindFramebuffer:Ft,drawBuffers:St,useProgram:Dt,setBlending:Kt,setMaterial:Jt,setFlipSided:Bt,setCullFace:he,setLineWidth:U,setPolygonOffset:ee,setScissorTest:$t,activeTexture:re,bindTexture:vt,unbindTexture:C,compressedTexImage2D:S,compressedTexImage3D:B,texImage2D:It,texImage3D:j,updateUBOMapping:yt,uniformBlockBinding:at,texStorage2D:lt,texStorage3D:Tt,texSubImage2D:q,texSubImage3D:K,compressedTexSubImage2D:Z,compressedTexSubImage3D:pt,scissor:st,viewport:mt,reset:zt}}function a0(i,t,e,n,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,d=new WeakMap,f,u=new WeakMap,h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(C,S){return h?new OffscreenCanvas(C,S):ji("canvas")}function _(C,S,B){let q=1,K=vt(C);if((K.width>B||K.height>B)&&(q=B/Math.max(K.width,K.height)),q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let Z=Math.floor(q*K.width),pt=Math.floor(q*K.height);f===void 0&&(f=p(Z,pt));let lt=S?p(Z,pt):f;return lt.width=Z,lt.height=pt,lt.getContext("2d").drawImage(C,0,0,Z,pt),Lt("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+Z+"x"+pt+")."),lt}else return"data"in C&&Lt("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),C;return C}function g(C){return C.generateMipmaps}function m(C){i.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(C,S,B,q,K=!1){if(C!==null){if(i[C]!==void 0)return i[C];Lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Z=S;if(S===i.RED&&(B===i.FLOAT&&(Z=i.R32F),B===i.HALF_FLOAT&&(Z=i.R16F),B===i.UNSIGNED_BYTE&&(Z=i.R8)),S===i.RED_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.R8UI),B===i.UNSIGNED_SHORT&&(Z=i.R16UI),B===i.UNSIGNED_INT&&(Z=i.R32UI),B===i.BYTE&&(Z=i.R8I),B===i.SHORT&&(Z=i.R16I),B===i.INT&&(Z=i.R32I)),S===i.RG&&(B===i.FLOAT&&(Z=i.RG32F),B===i.HALF_FLOAT&&(Z=i.RG16F),B===i.UNSIGNED_BYTE&&(Z=i.RG8)),S===i.RG_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RG8UI),B===i.UNSIGNED_SHORT&&(Z=i.RG16UI),B===i.UNSIGNED_INT&&(Z=i.RG32UI),B===i.BYTE&&(Z=i.RG8I),B===i.SHORT&&(Z=i.RG16I),B===i.INT&&(Z=i.RG32I)),S===i.RGB_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),B===i.UNSIGNED_INT&&(Z=i.RGB32UI),B===i.BYTE&&(Z=i.RGB8I),B===i.SHORT&&(Z=i.RGB16I),B===i.INT&&(Z=i.RGB32I)),S===i.RGBA_INTEGER&&(B===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),B===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),B===i.UNSIGNED_INT&&(Z=i.RGBA32UI),B===i.BYTE&&(Z=i.RGBA8I),B===i.SHORT&&(Z=i.RGBA16I),B===i.INT&&(Z=i.RGBA32I)),S===i.RGB&&(B===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),B===i.UNSIGNED_INT_10F_11F_11F_REV&&(Z=i.R11F_G11F_B10F)),S===i.RGBA){let pt=K?Ws:Zt.getTransfer(q);B===i.FLOAT&&(Z=i.RGBA32F),B===i.HALF_FLOAT&&(Z=i.RGBA16F),B===i.UNSIGNED_BYTE&&(Z=pt===ie?i.SRGB8_ALPHA8:i.RGBA8),B===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),B===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function M(C,S){let B;return C?S===null||S===pn||S===ms?B=i.DEPTH24_STENCIL8:S===rn?B=i.DEPTH32F_STENCIL8:S===ps&&(B=i.DEPTH24_STENCIL8,Lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===pn||S===ms?B=i.DEPTH_COMPONENT24:S===rn?B=i.DEPTH_COMPONENT32F:S===ps&&(B=i.DEPTH_COMPONENT16),B}function A(C,S){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Pe&&C.minFilter!==Ue?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function T(C){let S=C.target;S.removeEventListener("dispose",T),v(S),S.isVideoTexture&&d.delete(S)}function I(C){let S=C.target;S.removeEventListener("dispose",I),R(S)}function v(C){let S=n.get(C);if(S.__webglInit===void 0)return;let B=C.source,q=u.get(B);if(q){let K=q[S.__cacheKey];K.usedTimes--,K.usedTimes===0&&x(C),Object.keys(q).length===0&&u.delete(B)}n.remove(C)}function x(C){let S=n.get(C);i.deleteTexture(S.__webglTexture);let B=C.source,q=u.get(B);delete q[S.__cacheKey],a.memory.textures--}function R(C){let S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(S.__webglFramebuffer[q]))for(let K=0;K<S.__webglFramebuffer[q].length;K++)i.deleteFramebuffer(S.__webglFramebuffer[q][K]);else i.deleteFramebuffer(S.__webglFramebuffer[q]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[q])}else{if(Array.isArray(S.__webglFramebuffer))for(let q=0;q<S.__webglFramebuffer.length;q++)i.deleteFramebuffer(S.__webglFramebuffer[q]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let q=0;q<S.__webglColorRenderbuffer.length;q++)S.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[q]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}let B=C.textures;for(let q=0,K=B.length;q<K;q++){let Z=n.get(B[q]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(B[q])}n.remove(C)}let w=0;function P(){w=0}function D(){let C=w;return C>=s.maxTextures&&Lt("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),w+=1,C}function N(C){let S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function F(C,S){let B=n.get(C);if(C.isVideoTexture&&$t(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&B.__version!==C.version){let q=C.image;if(q===null)Lt("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Lt("WebGLRenderer: Texture marked for update but image is incomplete");else{J(B,C,S);return}}else C.isExternalTexture&&(B.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,B.__webglTexture,i.TEXTURE0+S)}function z(C,S){let B=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){J(B,C,S);return}else C.isExternalTexture&&(B.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,B.__webglTexture,i.TEXTURE0+S)}function k(C,S){let B=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&B.__version!==C.version){J(B,C,S);return}e.bindTexture(i.TEXTURE_3D,B.__webglTexture,i.TEXTURE0+S)}function $(C,S){let B=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&B.__version!==C.version){it(B,C,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,B.__webglTexture,i.TEXTURE0+S)}let Q={[zn]:i.REPEAT,[vn]:i.CLAMP_TO_EDGE,[ua]:i.MIRRORED_REPEAT},et={[Pe]:i.NEAREST,[xh]:i.NEAREST_MIPMAP_NEAREST,[mr]:i.NEAREST_MIPMAP_LINEAR,[Ue]:i.LINEAR,[qa]:i.LINEAR_MIPMAP_NEAREST,[ai]:i.LINEAR_MIPMAP_LINEAR},ht={[Mh]:i.NEVER,[wh]:i.ALWAYS,[Sh]:i.LESS,[Uo]:i.LEQUAL,[bh]:i.EQUAL,[No]:i.GEQUAL,[Eh]:i.GREATER,[Th]:i.NOTEQUAL};function nt(C,S){if(S.type===rn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Ue||S.magFilter===qa||S.magFilter===mr||S.magFilter===ai||S.minFilter===Ue||S.minFilter===qa||S.minFilter===mr||S.minFilter===ai)&&Lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Q[S.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Q[S.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Q[S.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,et[S.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,et[S.minFilter]),S.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ht[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Pe||S.minFilter!==mr&&S.minFilter!==ai||S.type===rn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){let B=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function Ct(C,S){let B=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",T));let q=S.source,K=u.get(q);K===void 0&&(K={},u.set(q,K));let Z=N(S);if(Z!==C.__cacheKey){K[Z]===void 0&&(K[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,B=!0),K[Z].usedTimes++;let pt=K[C.__cacheKey];pt!==void 0&&(K[C.__cacheKey].usedTimes--,pt.usedTimes===0&&x(S)),C.__cacheKey=Z,C.__webglTexture=K[Z].texture}return B}function Nt(C,S,B){return Math.floor(Math.floor(C/B)/S)}function te(C,S,B,q){let Z=C.updateRanges;if(Z.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,S.width,S.height,B,q,S.data);else{Z.sort((j,st)=>j.start-st.start);let pt=0;for(let j=1;j<Z.length;j++){let st=Z[pt],mt=Z[j],yt=st.start+st.count,at=Nt(mt.start,S.width,4),zt=Nt(st.start,S.width,4);mt.start<=yt+1&&at===zt&&Nt(mt.start+mt.count-1,S.width,4)===at?st.count=Math.max(st.count,mt.start+mt.count-st.start):(++pt,Z[pt]=mt)}Z.length=pt+1;let lt=i.getParameter(i.UNPACK_ROW_LENGTH),Tt=i.getParameter(i.UNPACK_SKIP_PIXELS),It=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,S.width);for(let j=0,st=Z.length;j<st;j++){let mt=Z[j],yt=Math.floor(mt.start/4),at=Math.ceil(mt.count/4),zt=yt%S.width,O=Math.floor(yt/S.width),ct=at,ot=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),e.texSubImage2D(i.TEXTURE_2D,0,zt,O,ct,ot,B,q,S.data)}C.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,lt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Tt),i.pixelStorei(i.UNPACK_SKIP_ROWS,It)}}function J(C,S,B){let q=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(q=i.TEXTURE_3D);let K=Ct(C,S),Z=S.source;e.bindTexture(q,C.__webglTexture,i.TEXTURE0+B);let pt=n.get(Z);if(Z.version!==pt.__version||K===!0){e.activeTexture(i.TEXTURE0+B);let lt=Zt.getPrimaries(Zt.workingColorSpace),Tt=S.colorSpace===mn?null:Zt.getPrimaries(S.colorSpace),It=S.colorSpace===mn||lt===Tt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let j=_(S.image,!1,s.maxTextureSize);j=re(S,j);let st=r.convert(S.format,S.colorSpace),mt=r.convert(S.type),yt=b(S.internalFormat,st,mt,S.colorSpace,S.isVideoTexture);nt(q,S);let at,zt=S.mipmaps,O=S.isVideoTexture!==!0,ct=pt.__version===void 0||K===!0,ot=Z.dataReady,gt=A(S,j);if(S.isDepthTexture)yt=M(S.format===oi,S.type),ct&&(O?e.texStorage2D(i.TEXTURE_2D,1,yt,j.width,j.height):e.texImage2D(i.TEXTURE_2D,0,yt,j.width,j.height,0,st,mt,null));else if(S.isDataTexture)if(zt.length>0){O&&ct&&e.texStorage2D(i.TEXTURE_2D,gt,yt,zt[0].width,zt[0].height);for(let tt=0,Y=zt.length;tt<Y;tt++)at=zt[tt],O?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,at.width,at.height,st,mt,at.data):e.texImage2D(i.TEXTURE_2D,tt,yt,at.width,at.height,0,st,mt,at.data);S.generateMipmaps=!1}else O?(ct&&e.texStorage2D(i.TEXTURE_2D,gt,yt,j.width,j.height),ot&&te(S,j,st,mt)):e.texImage2D(i.TEXTURE_2D,0,yt,j.width,j.height,0,st,mt,j.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){O&&ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,gt,yt,zt[0].width,zt[0].height,j.depth);for(let tt=0,Y=zt.length;tt<Y;tt++)if(at=zt[tt],S.format!==an)if(st!==null)if(O){if(ot)if(S.layerUpdates.size>0){let Mt=ec(at.width,at.height,S.format,S.type);for(let Pt of S.layerUpdates){let ne=at.data.subarray(Pt*Mt/at.data.BYTES_PER_ELEMENT,(Pt+1)*Mt/at.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,Pt,at.width,at.height,1,st,ne)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,at.width,at.height,j.depth,st,at.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,tt,yt,at.width,at.height,j.depth,0,at.data,0,0);else Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?ot&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,tt,0,0,0,at.width,at.height,j.depth,st,mt,at.data):e.texImage3D(i.TEXTURE_2D_ARRAY,tt,yt,at.width,at.height,j.depth,0,st,mt,at.data)}else{O&&ct&&e.texStorage2D(i.TEXTURE_2D,gt,yt,zt[0].width,zt[0].height);for(let tt=0,Y=zt.length;tt<Y;tt++)at=zt[tt],S.format!==an?st!==null?O?ot&&e.compressedTexSubImage2D(i.TEXTURE_2D,tt,0,0,at.width,at.height,st,at.data):e.compressedTexImage2D(i.TEXTURE_2D,tt,yt,at.width,at.height,0,at.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,at.width,at.height,st,mt,at.data):e.texImage2D(i.TEXTURE_2D,tt,yt,at.width,at.height,0,st,mt,at.data)}else if(S.isDataArrayTexture)if(O){if(ct&&e.texStorage3D(i.TEXTURE_2D_ARRAY,gt,yt,j.width,j.height,j.depth),ot)if(S.layerUpdates.size>0){let tt=ec(j.width,j.height,S.format,S.type);for(let Y of S.layerUpdates){let Mt=j.data.subarray(Y*tt/j.data.BYTES_PER_ELEMENT,(Y+1)*tt/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Y,j.width,j.height,1,st,mt,Mt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,st,mt,j.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,yt,j.width,j.height,j.depth,0,st,mt,j.data);else if(S.isData3DTexture)O?(ct&&e.texStorage3D(i.TEXTURE_3D,gt,yt,j.width,j.height,j.depth),ot&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,st,mt,j.data)):e.texImage3D(i.TEXTURE_3D,0,yt,j.width,j.height,j.depth,0,st,mt,j.data);else if(S.isFramebufferTexture){if(ct)if(O)e.texStorage2D(i.TEXTURE_2D,gt,yt,j.width,j.height);else{let tt=j.width,Y=j.height;for(let Mt=0;Mt<gt;Mt++)e.texImage2D(i.TEXTURE_2D,Mt,yt,tt,Y,0,st,mt,null),tt>>=1,Y>>=1}}else if(zt.length>0){if(O&&ct){let tt=vt(zt[0]);e.texStorage2D(i.TEXTURE_2D,gt,yt,tt.width,tt.height)}for(let tt=0,Y=zt.length;tt<Y;tt++)at=zt[tt],O?ot&&e.texSubImage2D(i.TEXTURE_2D,tt,0,0,st,mt,at):e.texImage2D(i.TEXTURE_2D,tt,yt,st,mt,at);S.generateMipmaps=!1}else if(O){if(ct){let tt=vt(j);e.texStorage2D(i.TEXTURE_2D,gt,yt,tt.width,tt.height)}ot&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,st,mt,j)}else e.texImage2D(i.TEXTURE_2D,0,yt,st,mt,j);g(S)&&m(q),pt.__version=Z.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function it(C,S,B){if(S.image.length!==6)return;let q=Ct(C,S),K=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+B);let Z=n.get(K);if(K.version!==Z.__version||q===!0){e.activeTexture(i.TEXTURE0+B);let pt=Zt.getPrimaries(Zt.workingColorSpace),lt=S.colorSpace===mn?null:Zt.getPrimaries(S.colorSpace),Tt=S.colorSpace===mn||pt===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let It=S.isCompressedTexture||S.image[0].isCompressedTexture,j=S.image[0]&&S.image[0].isDataTexture,st=[];for(let Y=0;Y<6;Y++)!It&&!j?st[Y]=_(S.image[Y],!0,s.maxCubemapSize):st[Y]=j?S.image[Y].image:S.image[Y],st[Y]=re(S,st[Y]);let mt=st[0],yt=r.convert(S.format,S.colorSpace),at=r.convert(S.type),zt=b(S.internalFormat,yt,at,S.colorSpace),O=S.isVideoTexture!==!0,ct=Z.__version===void 0||q===!0,ot=K.dataReady,gt=A(S,mt);nt(i.TEXTURE_CUBE_MAP,S);let tt;if(It){O&&ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,gt,zt,mt.width,mt.height);for(let Y=0;Y<6;Y++){tt=st[Y].mipmaps;for(let Mt=0;Mt<tt.length;Mt++){let Pt=tt[Mt];S.format!==an?yt!==null?O?ot&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt,0,0,Pt.width,Pt.height,yt,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt,zt,Pt.width,Pt.height,0,Pt.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt,0,0,Pt.width,Pt.height,yt,at,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt,zt,Pt.width,Pt.height,0,yt,at,Pt.data)}}}else{if(tt=S.mipmaps,O&&ct){tt.length>0&&gt++;let Y=vt(st[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,gt,zt,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(j){O?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,st[Y].width,st[Y].height,yt,at,st[Y].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,zt,st[Y].width,st[Y].height,0,yt,at,st[Y].data);for(let Mt=0;Mt<tt.length;Mt++){let ne=tt[Mt].image[Y].image;O?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt+1,0,0,ne.width,ne.height,yt,at,ne.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt+1,zt,ne.width,ne.height,0,yt,at,ne.data)}}else{O?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,yt,at,st[Y]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,zt,yt,at,st[Y]);for(let Mt=0;Mt<tt.length;Mt++){let Pt=tt[Mt];O?ot&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt+1,0,0,yt,at,Pt.image[Y]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Mt+1,zt,yt,at,Pt.image[Y])}}}g(S)&&m(i.TEXTURE_CUBE_MAP),Z.__version=K.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function rt(C,S,B,q,K,Z){let pt=r.convert(B.format,B.colorSpace),lt=r.convert(B.type),Tt=b(B.internalFormat,pt,lt,B.colorSpace),It=n.get(S),j=n.get(B);if(j.__renderTarget=S,!It.__hasExternalTextures){let st=Math.max(1,S.width>>Z),mt=Math.max(1,S.height>>Z);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,Z,Tt,st,mt,S.depth,0,pt,lt,null):e.texImage2D(K,Z,Tt,st,mt,0,pt,lt,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),ee(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,K,j.__webglTexture,0,U(S)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,K,j.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(C,S,B){if(i.bindRenderbuffer(i.RENDERBUFFER,C),S.depthBuffer){let q=S.depthTexture,K=q&&q.isDepthTexture?q.type:null,Z=M(S.stencilBuffer,K),pt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ee(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,U(S),Z,S.width,S.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,U(S),Z,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Z,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,pt,i.RENDERBUFFER,C)}else{let q=S.textures;for(let K=0;K<q.length;K++){let Z=q[K],pt=r.convert(Z.format,Z.colorSpace),lt=r.convert(Z.type),Tt=b(Z.internalFormat,pt,lt,Z.colorSpace);ee(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,U(S),Tt,S.width,S.height):B?i.renderbufferStorageMultisample(i.RENDERBUFFER,U(S),Tt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Tt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function St(C,S,B){let q=S.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(S.depthTexture);if(K.__renderTarget=S,(!K.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),q){if(K.__webglInit===void 0&&(K.__webglInit=!0,S.depthTexture.addEventListener("dispose",T)),K.__webglTexture===void 0){K.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),nt(i.TEXTURE_CUBE_MAP,S.depthTexture);let It=r.convert(S.depthTexture.format),j=r.convert(S.depthTexture.type),st;S.depthTexture.format===yn?st=i.DEPTH_COMPONENT24:S.depthTexture.format===oi&&(st=i.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,st,S.width,S.height,0,It,j,null)}}else F(S.depthTexture,0);let Z=K.__webglTexture,pt=U(S),lt=q?i.TEXTURE_CUBE_MAP_POSITIVE_X+B:i.TEXTURE_2D,Tt=S.depthTexture.format===oi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(S.depthTexture.format===yn)ee(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Tt,lt,Z,0,pt):i.framebufferTexture2D(i.FRAMEBUFFER,Tt,lt,Z,0);else if(S.depthTexture.format===oi)ee(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Tt,lt,Z,0,pt):i.framebufferTexture2D(i.FRAMEBUFFER,Tt,lt,Z,0);else throw new Error("Unknown depthTexture format")}function Dt(C){let S=n.get(C),B=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){let q=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),q){let K=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,q.removeEventListener("dispose",K)};q.addEventListener("dispose",K),S.__depthDisposeCallback=K}S.__boundDepthTexture=q}if(C.depthTexture&&!S.__autoAllocateDepthBuffer)if(B)for(let q=0;q<6;q++)St(S.__webglFramebuffer[q],C,q);else{let q=C.texture.mipmaps;q&&q.length>0?St(S.__webglFramebuffer[0],C,0):St(S.__webglFramebuffer,C,0)}else if(B){S.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[q]),S.__webglDepthbuffer[q]===void 0)S.__webglDepthbuffer[q]=i.createRenderbuffer(),Ft(S.__webglDepthbuffer[q],C,!1);else{let K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=S.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,Z)}}else{let q=C.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),Ft(S.__webglDepthbuffer,C,!1);else{let K=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,Z)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function pe(C,S,B){let q=n.get(C);S!==void 0&&rt(q.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),B!==void 0&&Dt(C)}function Yt(C){let S=C.texture,B=n.get(C),q=n.get(S);C.addEventListener("dispose",I);let K=C.textures,Z=C.isWebGLCubeRenderTarget===!0,pt=K.length>1;if(pt||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=S.version,a.memory.textures++),Z){B.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer[lt]=[];for(let Tt=0;Tt<S.mipmaps.length;Tt++)B.__webglFramebuffer[lt][Tt]=i.createFramebuffer()}else B.__webglFramebuffer[lt]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){B.__webglFramebuffer=[];for(let lt=0;lt<S.mipmaps.length;lt++)B.__webglFramebuffer[lt]=i.createFramebuffer()}else B.__webglFramebuffer=i.createFramebuffer();if(pt)for(let lt=0,Tt=K.length;lt<Tt;lt++){let It=n.get(K[lt]);It.__webglTexture===void 0&&(It.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&ee(C)===!1){B.__webglMultisampledFramebuffer=i.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let lt=0;lt<K.length;lt++){let Tt=K[lt];B.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,B.__webglColorRenderbuffer[lt]);let It=r.convert(Tt.format,Tt.colorSpace),j=r.convert(Tt.type),st=b(Tt.internalFormat,It,j,Tt.colorSpace,C.isXRRenderTarget===!0),mt=U(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,st,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,B.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(B.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(B.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),nt(i.TEXTURE_CUBE_MAP,S);for(let lt=0;lt<6;lt++)if(S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)rt(B.__webglFramebuffer[lt][Tt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Tt);else rt(B.__webglFramebuffer[lt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);g(S)&&m(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(pt){for(let lt=0,Tt=K.length;lt<Tt;lt++){let It=K[lt],j=n.get(It),st=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(st=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(st,j.__webglTexture),nt(st,It),rt(B.__webglFramebuffer,C,It,i.COLOR_ATTACHMENT0+lt,st,0),g(It)&&m(st)}e.unbindTexture()}else{let lt=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(lt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,q.__webglTexture),nt(lt,S),S.mipmaps&&S.mipmaps.length>0)for(let Tt=0;Tt<S.mipmaps.length;Tt++)rt(B.__webglFramebuffer[Tt],C,S,i.COLOR_ATTACHMENT0,lt,Tt);else rt(B.__webglFramebuffer,C,S,i.COLOR_ATTACHMENT0,lt,0);g(S)&&m(lt),e.unbindTexture()}C.depthBuffer&&Dt(C)}function Kt(C){let S=C.textures;for(let B=0,q=S.length;B<q;B++){let K=S[B];if(g(K)){let Z=y(C),pt=n.get(K).__webglTexture;e.bindTexture(Z,pt),m(Z),e.unbindTexture()}}}let Jt=[],Bt=[];function he(C){if(C.samples>0){if(ee(C)===!1){let S=C.textures,B=C.width,q=C.height,K=i.COLOR_BUFFER_BIT,Z=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=n.get(C),lt=S.length>1;if(lt)for(let It=0;It<S.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer);let Tt=C.texture.mipmaps;Tt&&Tt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let It=0;It<S.length;It++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),lt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pt.__webglColorRenderbuffer[It]);let j=n.get(S[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,B,q,0,0,B,q,K,i.NEAREST),l===!0&&(Jt.length=0,Bt.length=0,Jt.push(i.COLOR_ATTACHMENT0+It),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Jt.push(Z),Bt.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Bt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Jt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let It=0;It<S.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,pt.__webglColorRenderbuffer[It]);let j=n.get(S[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,j,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let S=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function U(C){return Math.min(s.maxSamples,C.samples)}function ee(C){let S=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function $t(C){let S=a.render.frame;d.get(C)!==S&&(d.set(C,S),C.update())}function re(C,S){let B=C.colorSpace,q=C.format,K=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||B!==xi&&B!==mn&&(Zt.getTransfer(B)===ie?(q!==an||K!==Xe)&&Lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ut("WebGLTextures: Unsupported texture color space:",B)),S}function vt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=P,this.setTexture2D=F,this.setTexture2DArray=z,this.setTexture3D=k,this.setTextureCube=$,this.rebindTextures=pe,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=Kt,this.updateMultisampleRenderTarget=he,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=rt,this.useMultisampledRTT=ee,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function o0(i,t){function e(n,s=mn){let r,a=Zt.getTransfer(s);if(n===Xe)return i.UNSIGNED_BYTE;if(n===Za)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ja)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Hl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Wl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Vl)return i.BYTE;if(n===Gl)return i.SHORT;if(n===ps)return i.UNSIGNED_SHORT;if(n===Ya)return i.INT;if(n===pn)return i.UNSIGNED_INT;if(n===rn)return i.FLOAT;if(n===Tn)return i.HALF_FLOAT;if(n===Xl)return i.ALPHA;if(n===ql)return i.RGB;if(n===an)return i.RGBA;if(n===yn)return i.DEPTH_COMPONENT;if(n===oi)return i.DEPTH_STENCIL;if(n===$a)return i.RED;if(n===Ka)return i.RED_INTEGER;if(n===Ti)return i.RG;if(n===Qa)return i.RG_INTEGER;if(n===ja)return i.RGBA_INTEGER;if(n===gr||n===_r||n===xr||n===vr)if(a===ie)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===to||n===eo||n===no||n===io)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===to)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===io)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===so||n===ro)return a===ie?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ao)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===oo)return r.COMPRESSED_R11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===co)return r.COMPRESSED_RG11_EAC;if(n===ho)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===xo||n===vo||n===yo||n===Mo||n===So||n===bo||n===Eo||n===To)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===uo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===po)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===mo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===go)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===_o)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===xo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===vo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===yo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Mo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===So)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Eo)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===To)return a===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wo||n===Ao||n===Co)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===wo)return a===ie?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Co)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ro||n===Io||n===Po||n===Lo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ro)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Io)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Lo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ms?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var l0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,c0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,mc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new js(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new je({vertexShader:l0,fragmentShader:c0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ue(new Te(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gc=class extends kn{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,f=null,u=null,h=null,p=null,_=typeof XRWebGLBinding<"u",g=new mc,m={},y=e.getContextAttributes(),b=null,M=null,A=[],T=[],I=new xt,v=null,x=new De;x.viewport=new de;let R=new De;R.viewport=new de;let w=[x,R],P=new Ga,D=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let it=A[J];return it===void 0&&(it=new ss,A[J]=it),it.getTargetRaySpace()},this.getControllerGrip=function(J){let it=A[J];return it===void 0&&(it=new ss,A[J]=it),it.getGripSpace()},this.getHand=function(J){let it=A[J];return it===void 0&&(it=new ss,A[J]=it),it.getHandSpace()};function F(J){let it=T.indexOf(J.inputSource);if(it===-1)return;let rt=A[it];rt!==void 0&&(rt.update(J.inputSource,J.frame,c||a),rt.dispatchEvent({type:J.type,data:J.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",k);for(let J=0;J<A.length;J++){let it=T[J];it!==null&&(T[J]=null,A[J].disconnect(it))}D=null,N=null,g.reset();for(let J in m)delete m[J];t.setRenderTarget(b),h=null,u=null,f=null,s=null,M=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return u!==null?u:h},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",k),y.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(I),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let rt=null,Ft=null,St=null;y.depth&&(St=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,rt=y.stencil?oi:yn,Ft=y.stencil?ms:pn);let Dt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Dt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new $e(u.textureWidth,u.textureHeight,{format:an,type:Xe,depthTexture:new jn(u.textureWidth,u.textureHeight,Ft,void 0,void 0,void 0,void 0,void 0,void 0,rt),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let rt={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};h=new XRWebGLLayer(s,e,rt),s.updateRenderState({baseLayer:h}),t.setPixelRatio(1),t.setSize(h.framebufferWidth,h.framebufferHeight,!1),M=new $e(h.framebufferWidth,h.framebufferHeight,{format:an,type:Xe,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),te.setContext(s),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function k(J){for(let it=0;it<J.removed.length;it++){let rt=J.removed[it],Ft=T.indexOf(rt);Ft>=0&&(T[Ft]=null,A[Ft].disconnect(rt))}for(let it=0;it<J.added.length;it++){let rt=J.added[it],Ft=T.indexOf(rt);if(Ft===-1){for(let Dt=0;Dt<A.length;Dt++)if(Dt>=T.length){T.push(rt),Ft=Dt;break}else if(T[Dt]===null){T[Dt]=rt,Ft=Dt;break}if(Ft===-1)break}let St=A[Ft];St&&St.connect(rt)}}let $=new L,Q=new L;function et(J,it,rt){$.setFromMatrixPosition(it.matrixWorld),Q.setFromMatrixPosition(rt.matrixWorld);let Ft=$.distanceTo(Q),St=it.projectionMatrix.elements,Dt=rt.projectionMatrix.elements,pe=St[14]/(St[10]-1),Yt=St[14]/(St[10]+1),Kt=(St[9]+1)/St[5],Jt=(St[9]-1)/St[5],Bt=(St[8]-1)/St[0],he=(Dt[8]+1)/Dt[0],U=pe*Bt,ee=pe*he,$t=Ft/(-Bt+he),re=$t*-Bt;if(it.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(re),J.translateZ($t),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),St[10]===-1)J.projectionMatrix.copy(it.projectionMatrix),J.projectionMatrixInverse.copy(it.projectionMatrixInverse);else{let vt=pe+$t,C=Yt+$t,S=U-re,B=ee+(Ft-re),q=Kt*Yt/C*vt,K=Jt*Yt/C*vt;J.projectionMatrix.makePerspective(S,B,q,K,vt,C),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ht(J,it){it===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(it.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let it=J.near,rt=J.far;g.texture!==null&&(g.depthNear>0&&(it=g.depthNear),g.depthFar>0&&(rt=g.depthFar)),P.near=R.near=x.near=it,P.far=R.far=x.far=rt,(D!==P.near||N!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),D=P.near,N=P.far),P.layers.mask=J.layers.mask|6,x.layers.mask=P.layers.mask&-5,R.layers.mask=P.layers.mask&-3;let Ft=J.parent,St=P.cameras;ht(P,Ft);for(let Dt=0;Dt<St.length;Dt++)ht(St[Dt],Ft);St.length===2?et(P,x,R):P.projectionMatrix.copy(x.projectionMatrix),nt(J,P,Ft)};function nt(J,it,rt){rt===null?J.matrix.copy(it.matrixWorld):(J.matrix.copy(rt.matrixWorld),J.matrix.invert(),J.matrix.multiply(it.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(it.projectionMatrix),J.projectionMatrixInverse.copy(it.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=es*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(u===null&&h===null))return l},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(P)},this.getCameraTexture=function(J){return m[J]};let Ct=null;function Nt(J,it){if(d=it.getViewerPose(c||a),p=it,d!==null){let rt=d.views;h!==null&&(t.setRenderTargetFramebuffer(M,h.framebuffer),t.setRenderTarget(M));let Ft=!1;rt.length!==P.cameras.length&&(P.cameras.length=0,Ft=!0);for(let Yt=0;Yt<rt.length;Yt++){let Kt=rt[Yt],Jt=null;if(h!==null)Jt=h.getViewport(Kt);else{let he=f.getViewSubImage(u,Kt);Jt=he.viewport,Yt===0&&(t.setRenderTargetTextures(M,he.colorTexture,he.depthStencilTexture),t.setRenderTarget(M))}let Bt=w[Yt];Bt===void 0&&(Bt=new De,Bt.layers.enable(Yt),Bt.viewport=new de,w[Yt]=Bt),Bt.matrix.fromArray(Kt.transform.matrix),Bt.matrix.decompose(Bt.position,Bt.quaternion,Bt.scale),Bt.projectionMatrix.fromArray(Kt.projectionMatrix),Bt.projectionMatrixInverse.copy(Bt.projectionMatrix).invert(),Bt.viewport.set(Jt.x,Jt.y,Jt.width,Jt.height),Yt===0&&(P.matrix.copy(Bt.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Ft===!0&&P.cameras.push(Bt)}let St=s.enabledFeatures;if(St&&St.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=n.getBinding();let Yt=f.getDepthInformation(rt[0]);Yt&&Yt.isValid&&Yt.texture&&g.init(Yt,s.renderState)}if(St&&St.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let Yt=0;Yt<rt.length;Yt++){let Kt=rt[Yt].camera;if(Kt){let Jt=m[Kt];Jt||(Jt=new js,m[Kt]=Jt);let Bt=f.getCameraImage(Kt);Jt.sourceTexture=Bt}}}}for(let rt=0;rt<A.length;rt++){let Ft=T[rt],St=A[rt];Ft!==null&&St!==void 0&&St.update(Ft,it,c||a)}Ct&&Ct(J,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),p=null}let te=new nu;te.setAnimationLoop(Nt),this.setAnimationLoop=function(J){Ct=J},this.dispose=function(){}}},Ci=new nn,h0=new se;function u0(i,t){function e(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,Ql(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,y,b,M){m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),f(g,m)):m.isMeshPhongMaterial?(r(g,m),d(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&h(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),_(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,y,b):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,e(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Ne&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,e(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Ne&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,e(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,e(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let y=t.get(m),b=y.envMap,M=y.envMapRotation;b&&(g.envMap.value=b,Ci.copy(M),Ci.x*=-1,Ci.y*=-1,Ci.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Ci.y*=-1,Ci.z*=-1),g.envMapRotation.value.setFromMatrix4(h0.makeRotationFromEuler(Ci)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,y,b){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*y,g.scale.value=b*.5,m.map&&(g.map.value=m.map,e(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,e(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,e(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function d(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function h(g,m,y){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ne&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function _(g,m){let y=t.get(m).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function d0(i,t,e,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){let M=b.program;n.uniformBlockBinding(y,M)}function c(y,b){let M=s[y.id];M===void 0&&(p(y),M=d(y),s[y.id]=M,y.addEventListener("dispose",g));let A=b.program;n.updateUBOMapping(y,A);let T=t.render.frame;r[y.id]!==T&&(u(y),r[y.id]=T)}function d(y){let b=f();y.__bindingPointIndex=b;let M=i.createBuffer(),A=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,A,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,M),M}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ut("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let b=s[y.id],M=y.uniforms,A=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let T=0,I=M.length;T<I;T++){let v=Array.isArray(M[T])?M[T]:[M[T]];for(let x=0,R=v.length;x<R;x++){let w=v[x];if(h(w,T,x,A)===!0){let P=w.__offset,D=Array.isArray(w.value)?w.value:[w.value],N=0;for(let F=0;F<D.length;F++){let z=D[F],k=_(z);typeof z=="number"||typeof z=="boolean"?(w.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,P+N,w.__data)):z.isMatrix3?(w.__data[0]=z.elements[0],w.__data[1]=z.elements[1],w.__data[2]=z.elements[2],w.__data[3]=0,w.__data[4]=z.elements[3],w.__data[5]=z.elements[4],w.__data[6]=z.elements[5],w.__data[7]=0,w.__data[8]=z.elements[6],w.__data[9]=z.elements[7],w.__data[10]=z.elements[8],w.__data[11]=0):(z.toArray(w.__data,N),N+=k.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,w.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(y,b,M,A){let T=y.value,I=b+"_"+M;if(A[I]===void 0)return typeof T=="number"||typeof T=="boolean"?A[I]=T:A[I]=T.clone(),!0;{let v=A[I];if(typeof T=="number"||typeof T=="boolean"){if(v!==T)return A[I]=T,!0}else if(v.equals(T)===!1)return v.copy(T),!0}return!1}function p(y){let b=y.uniforms,M=0,A=16;for(let I=0,v=b.length;I<v;I++){let x=Array.isArray(b[I])?b[I]:[b[I]];for(let R=0,w=x.length;R<w;R++){let P=x[R],D=Array.isArray(P.value)?P.value:[P.value];for(let N=0,F=D.length;N<F;N++){let z=D[N],k=_(z),$=M%A,Q=$%k.boundary,et=$+Q;M+=Q,et!==0&&A-et<k.storage&&(M+=A-et),P.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=M,M+=k.storage}}}let T=M%A;return T>0&&(M+=A-T),y.__size=M,y.__cache={},this}function _(y){let b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?Lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Lt("WebGLRenderer: Unsupported uniform value type.",y),b}function g(y){let b=y.target;b.removeEventListener("dispose",g);let M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function m(){for(let y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:m}}var f0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),wn=null;function p0(){return wn===null&&(wn=new $s(f0,16,16,Ti,Tn),wn.name="DFG_LUT",wn.minFilter=Ue,wn.magFilter=Ue,wn.wrapS=vn,wn.wrapT=vn,wn.generateMipmaps=!1,wn.needsUpdate=!0),wn}var zo=class{constructor(t={}){let{canvas:e=Ah(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:h=Xe}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let _=h,g=new Set([ja,Qa,Ka]),m=new Set([Xe,pn,ps,ms,Za,Ja]),y=new Uint32Array(4),b=new Int32Array(4),M=null,A=null,T=[],I=[],v=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,R=!1;this._outputColorSpace=xe;let w=0,P=0,D=null,N=-1,F=null,z=new de,k=new de,$=null,Q=new Ot(0),et=0,ht=e.width,nt=e.height,Ct=1,Nt=null,te=null,J=new de(0,0,ht,nt),it=new de(0,0,ht,nt),rt=!1,Ft=new as,St=!1,Dt=!1,pe=new se,Yt=new L,Kt=new de,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Bt=!1;function he(){return D===null?Ct:1}let U=n;function ee(E,V){return e.getContext(E,V)}try{let E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"183"}`),e.addEventListener("webglcontextlost",Mt,!1),e.addEventListener("webglcontextrestored",Pt,!1),e.addEventListener("webglcontextcreationerror",ne,!1),U===null){let V="webgl2";if(U=ee(V,E),U===null)throw ee(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw Ut("WebGLRenderer: "+E.message),E}let $t,re,vt,C,S,B,q,K,Z,pt,lt,Tt,It,j,st,mt,yt,at,zt,O,ct,ot,gt;function tt(){$t=new Sm(U),$t.init(),ct=new o0(U,$t),re=new pm(U,$t,t,ct),vt=new r0(U,$t),re.reversedDepthBuffer&&u&&vt.buffers.depth.setReversed(!0),C=new Tm(U),S=new Xg,B=new a0(U,$t,vt,S,re,ct,C),q=new Mm(x),K=new Rd(U),ot=new dm(U,K),Z=new bm(U,K,C,ot),pt=new Am(U,Z,K,ot,C),at=new wm(U,re,B),st=new mm(S),lt=new Wg(x,q,$t,re,ot,st),Tt=new u0(x,S),It=new Yg,j=new jg($t),yt=new um(x,q,vt,pt,p,l),mt=new s0(x,pt,re),gt=new d0(U,C,re,vt),zt=new fm(U,$t,C),O=new Em(U,$t,C),C.programs=lt.programs,x.capabilities=re,x.extensions=$t,x.properties=S,x.renderLists=It,x.shadowMap=mt,x.state=vt,x.info=C}tt(),_!==Xe&&(v=new Rm(_,e.width,e.height,s,r));let Y=new gc(x,U);this.xr=Y,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let E=$t.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=$t.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Ct},this.setPixelRatio=function(E){E!==void 0&&(Ct=E,this.setSize(ht,nt,!1))},this.getSize=function(E){return E.set(ht,nt)},this.setSize=function(E,V,X=!0){if(Y.isPresenting){Lt("WebGLRenderer: Can't change size while VR device is presenting.");return}ht=E,nt=V,e.width=Math.floor(E*Ct),e.height=Math.floor(V*Ct),X===!0&&(e.style.width=E+"px",e.style.height=V+"px"),v!==null&&v.setSize(e.width,e.height),this.setViewport(0,0,E,V)},this.getDrawingBufferSize=function(E){return E.set(ht*Ct,nt*Ct).floor()},this.setDrawingBufferSize=function(E,V,X){ht=E,nt=V,Ct=X,e.width=Math.floor(E*X),e.height=Math.floor(V*X),this.setViewport(0,0,E,V)},this.setEffects=function(E){if(_===Xe){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let V=0;V<E.length;V++)if(E[V].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}v.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(z)},this.getViewport=function(E){return E.copy(J)},this.setViewport=function(E,V,X,H){E.isVector4?J.set(E.x,E.y,E.z,E.w):J.set(E,V,X,H),vt.viewport(z.copy(J).multiplyScalar(Ct).round())},this.getScissor=function(E){return E.copy(it)},this.setScissor=function(E,V,X,H){E.isVector4?it.set(E.x,E.y,E.z,E.w):it.set(E,V,X,H),vt.scissor(k.copy(it).multiplyScalar(Ct).round())},this.getScissorTest=function(){return rt},this.setScissorTest=function(E){vt.setScissorTest(rt=E)},this.setOpaqueSort=function(E){Nt=E},this.setTransparentSort=function(E){te=E},this.getClearColor=function(E){return E.copy(yt.getClearColor())},this.setClearColor=function(){yt.setClearColor(...arguments)},this.getClearAlpha=function(){return yt.getClearAlpha()},this.setClearAlpha=function(){yt.setClearAlpha(...arguments)},this.clear=function(E=!0,V=!0,X=!0){let H=0;if(E){let G=!1;if(D!==null){let dt=D.texture.format;G=g.has(dt)}if(G){let dt=D.texture.type,_t=m.has(dt),ft=yt.getClearColor(),bt=yt.getClearAlpha(),At=ft.r,kt=ft.g,Xt=ft.b;_t?(y[0]=At,y[1]=kt,y[2]=Xt,y[3]=bt,U.clearBufferuiv(U.COLOR,0,y)):(b[0]=At,b[1]=kt,b[2]=Xt,b[3]=bt,U.clearBufferiv(U.COLOR,0,b))}else H|=U.COLOR_BUFFER_BIT}V&&(H|=U.DEPTH_BUFFER_BIT),X&&(H|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&U.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Mt,!1),e.removeEventListener("webglcontextrestored",Pt,!1),e.removeEventListener("webglcontextcreationerror",ne,!1),yt.dispose(),It.dispose(),j.dispose(),S.dispose(),q.dispose(),pt.dispose(),ot.dispose(),gt.dispose(),lt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",ws),Y.removeEventListener("sessionend",wr),Rn.stop()};function Mt(E){E.preventDefault(),Jl("WebGLRenderer: Context Lost."),R=!0}function Pt(){Jl("WebGLRenderer: Context Restored."),R=!1;let E=C.autoReset,V=mt.enabled,X=mt.autoUpdate,H=mt.needsUpdate,G=mt.type;tt(),C.autoReset=E,mt.enabled=V,mt.autoUpdate=X,mt.needsUpdate=H,mt.type=G}function ne(E){Ut("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function jt(E){let V=E.target;V.removeEventListener("dispose",jt),ve(V)}function ve(E){me(E),S.remove(E)}function me(E){let V=S.get(E).programs;V!==void 0&&(V.forEach(function(X){lt.releaseProgram(X)}),E.isShaderMaterial&&lt.releaseShaderCache(E))}this.renderBufferDirect=function(E,V,X,H,G,dt){V===null&&(V=Jt);let _t=G.isMesh&&G.matrixWorld.determinant()<0,ft=W(E,V,X,H,G);vt.setMaterial(H,_t);let bt=X.index,At=1;if(H.wireframe===!0){if(bt=Z.getWireframeAttribute(X),bt===void 0)return;At=2}let kt=X.drawRange,Xt=X.attributes.position,Rt=kt.start*At,ae=(kt.start+kt.count)*At;dt!==null&&(Rt=Math.max(Rt,dt.start*At),ae=Math.min(ae,(dt.start+dt.count)*At)),bt!==null?(Rt=Math.max(Rt,0),ae=Math.min(ae,bt.count)):Xt!=null&&(Rt=Math.max(Rt,0),ae=Math.min(ae,Xt.count));let ye=ae-Rt;if(ye<0||ye===1/0)return;ot.setup(G,H,ft,X,bt);let _e,oe=zt;if(bt!==null&&(_e=K.get(bt),oe=O,oe.setIndex(_e)),G.isMesh)H.wireframe===!0?(vt.setLineWidth(H.wireframeLinewidth*he()),oe.setMode(U.LINES)):oe.setMode(U.TRIANGLES);else if(G.isLine){let Fe=H.linewidth;Fe===void 0&&(Fe=1),vt.setLineWidth(Fe*he()),G.isLineSegments?oe.setMode(U.LINES):G.isLineLoop?oe.setMode(U.LINE_LOOP):oe.setMode(U.LINE_STRIP)}else G.isPoints?oe.setMode(U.POINTS):G.isSprite&&oe.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Xs("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),oe.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if($t.get("WEBGL_multi_draw"))oe.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Fe=G._multiDrawStarts,Et=G._multiDrawCounts,Ye=G._multiDrawCount,Qt=bt?K.get(bt).bytesPerElement:1,ln=S.get(H).currentProgram.getUniforms();for(let gn=0;gn<Ye;gn++)ln.setValue(U,"_gl_DrawID",gn),oe.render(Fe[gn]/Qt,Et[gn])}else if(G.isInstancedMesh)oe.renderInstances(Rt,ye,G.count);else if(X.isInstancedBufferGeometry){let Fe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Et=Math.min(X.instanceCount,Fe);oe.renderInstances(Rt,ye,Et)}else oe.render(Rt,ye)};function Se(E,V,X){E.transparent===!0&&E.side===we&&E.forceSinglePass===!1?(E.side=Ne,E.needsUpdate=!0,Is(E,V,X),E.side=Bn,E.needsUpdate=!0,Is(E,V,X),E.side=we):Is(E,V,X)}this.compile=function(E,V,X=null){X===null&&(X=E),A=j.get(X),A.init(V),I.push(A),X.traverseVisible(function(G){G.isLight&&G.layers.test(V.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),E!==X&&E.traverseVisible(function(G){G.isLight&&G.layers.test(V.layers)&&(A.pushLight(G),G.castShadow&&A.pushShadow(G))}),A.setupLights();let H=new Set;return E.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let dt=G.material;if(dt)if(Array.isArray(dt))for(let _t=0;_t<dt.length;_t++){let ft=dt[_t];Se(ft,X,G),H.add(ft)}else Se(dt,X,G),H.add(dt)}),A=I.pop(),H},this.compileAsync=function(E,V,X=null){let H=this.compile(E,V,X);return new Promise(G=>{function dt(){if(H.forEach(function(_t){S.get(_t).currentProgram.isReady()&&H.delete(_t)}),H.size===0){G(E);return}setTimeout(dt,10)}$t.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let Ts=null;function qo(E){Ts&&Ts(E)}function ws(){Rn.stop()}function wr(){Rn.start()}let Rn=new nu;Rn.setAnimationLoop(qo),typeof self<"u"&&Rn.setContext(self),this.setAnimationLoop=function(E){Ts=E,Y.setAnimationLoop(E),E===null?Rn.stop():Rn.start()},Y.addEventListener("sessionstart",ws),Y.addEventListener("sessionend",wr),this.render=function(E,V){if(V!==void 0&&V.isCamera!==!0){Ut("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;let X=Y.enabled===!0&&Y.isPresenting===!0,H=v!==null&&(D===null||X)&&v.begin(x,D);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(v===null||v.isCompositing()===!1)&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(V),V=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,V,D),A=j.get(E,I.length),A.init(V),I.push(A),pe.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),Ft.setFromProjectionMatrix(pe,dn,V.reversedDepth),Dt=this.localClippingEnabled,St=st.init(this.clippingPlanes,Dt),M=It.get(E,T.length),M.init(),T.push(M),Y.enabled===!0&&Y.isPresenting===!0){let _t=x.xr.getDepthSensingMesh();_t!==null&&Pi(_t,V,-1/0,x.sortObjects)}Pi(E,V,0,x.sortObjects),M.finish(),x.sortObjects===!0&&M.sort(Nt,te),Bt=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Bt&&yt.addToRenderList(M,E),this.info.render.frame++,St===!0&&st.beginShadows();let G=A.state.shadowsArray;if(mt.render(G,E,V),St===!0&&st.endShadows(),this.info.autoReset===!0&&this.info.reset(),(H&&v.hasRenderPass())===!1){let _t=M.opaque,ft=M.transmissive;if(A.setupLights(),V.isArrayCamera){let bt=V.cameras;if(ft.length>0)for(let At=0,kt=bt.length;At<kt;At++){let Xt=bt[At];Cs(_t,ft,E,Xt)}Bt&&yt.render(E);for(let At=0,kt=bt.length;At<kt;At++){let Xt=bt[At];As(M,E,Xt,Xt.viewport)}}else ft.length>0&&Cs(_t,ft,E,V),Bt&&yt.render(E),As(M,E,V)}D!==null&&P===0&&(B.updateMultisampleRenderTarget(D),B.updateRenderTargetMipmap(D)),H&&v.end(x),E.isScene===!0&&E.onAfterRender(x,E,V),ot.resetDefaultState(),N=-1,F=null,I.pop(),I.length>0?(A=I[I.length-1],St===!0&&st.setGlobalState(x.clippingPlanes,A.state.camera)):A=null,T.pop(),T.length>0?M=T[T.length-1]:M=null};function Pi(E,V,X,H){if(E.visible===!1)return;if(E.layers.test(V.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(V);else if(E.isLight)A.pushLight(E),E.castShadow&&A.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||Ft.intersectsSprite(E)){H&&Kt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(pe);let _t=pt.update(E),ft=E.material;ft.visible&&M.push(E,_t,ft,X,Kt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||Ft.intersectsObject(E))){let _t=pt.update(E),ft=E.material;if(H&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Kt.copy(E.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),Kt.copy(_t.boundingSphere.center)),Kt.applyMatrix4(E.matrixWorld).applyMatrix4(pe)),Array.isArray(ft)){let bt=_t.groups;for(let At=0,kt=bt.length;At<kt;At++){let Xt=bt[At],Rt=ft[Xt.materialIndex];Rt&&Rt.visible&&M.push(E,_t,Rt,X,Kt.z,Xt)}}else ft.visible&&M.push(E,_t,ft,X,Kt.z,null)}}let dt=E.children;for(let _t=0,ft=dt.length;_t<ft;_t++)Pi(dt[_t],V,X,H)}function As(E,V,X,H){let{opaque:G,transmissive:dt,transparent:_t}=E;A.setupLightsView(X),St===!0&&st.setGlobalState(x.clippingPlanes,X),H&&vt.viewport(z.copy(H)),G.length>0&&ci(G,V,X),dt.length>0&&ci(dt,V,X),_t.length>0&&ci(_t,V,X),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function Cs(E,V,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[H.id]===void 0){let Rt=$t.has("EXT_color_buffer_half_float")||$t.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[H.id]=new $e(1,1,{generateMipmaps:!0,type:Rt?Tn:Xe,minFilter:ai,samples:Math.max(4,re.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace})}let dt=A.state.transmissionRenderTarget[H.id],_t=H.viewport||z;dt.setSize(_t.z*x.transmissionResolutionScale,_t.w*x.transmissionResolutionScale);let ft=x.getRenderTarget(),bt=x.getActiveCubeFace(),At=x.getActiveMipmapLevel();x.setRenderTarget(dt),x.getClearColor(Q),et=x.getClearAlpha(),et<1&&x.setClearColor(16777215,.5),x.clear(),Bt&&yt.render(X);let kt=x.toneMapping;x.toneMapping=fn;let Xt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),A.setupLightsView(H),St===!0&&st.setGlobalState(x.clippingPlanes,H),ci(E,X,H),B.updateMultisampleRenderTarget(dt),B.updateRenderTargetMipmap(dt),$t.has("WEBGL_multisampled_render_to_texture")===!1){let Rt=!1;for(let ae=0,ye=V.length;ae<ye;ae++){let _e=V[ae],{object:oe,geometry:Fe,material:Et,group:Ye}=_e;if(Et.side===we&&oe.layers.test(H.layers)){let Qt=Et.side;Et.side=Ne,Et.needsUpdate=!0,Rs(oe,X,H,Fe,Et,Ye),Et.side=Qt,Et.needsUpdate=!0,Rt=!0}}Rt===!0&&(B.updateMultisampleRenderTarget(dt),B.updateRenderTargetMipmap(dt))}x.setRenderTarget(ft,bt,At),x.setClearColor(Q,et),Xt!==void 0&&(H.viewport=Xt),x.toneMapping=kt}function ci(E,V,X){let H=V.isScene===!0?V.overrideMaterial:null;for(let G=0,dt=E.length;G<dt;G++){let _t=E[G],{object:ft,geometry:bt,group:At}=_t,kt=_t.material;kt.allowOverride===!0&&H!==null&&(kt=H),ft.layers.test(X.layers)&&Rs(ft,V,X,bt,kt,At)}}function Rs(E,V,X,H,G,dt){E.onBeforeRender(x,V,X,H,G,dt),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),G.onBeforeRender(x,V,X,H,E,dt),G.transparent===!0&&G.side===we&&G.forceSinglePass===!1?(G.side=Ne,G.needsUpdate=!0,x.renderBufferDirect(X,V,H,G,E,dt),G.side=Bn,G.needsUpdate=!0,x.renderBufferDirect(X,V,H,G,E,dt),G.side=we):x.renderBufferDirect(X,V,H,G,E,dt),E.onAfterRender(x,V,X,H,G,dt)}function Is(E,V,X){V.isScene!==!0&&(V=Jt);let H=S.get(E),G=A.state.lights,dt=A.state.shadowsArray,_t=G.state.version,ft=lt.getParameters(E,G.state,dt,V,X),bt=lt.getProgramCacheKey(ft),At=H.programs;H.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?V.environment:null,H.fog=V.fog;let kt=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;H.envMap=q.get(E.envMap||H.environment,kt),H.envMapRotation=H.environment!==null&&E.envMap===null?V.environmentRotation:E.envMapRotation,At===void 0&&(E.addEventListener("dispose",jt),At=new Map,H.programs=At);let Xt=At.get(bt);if(Xt!==void 0){if(H.currentProgram===Xt&&H.lightsStateVersion===_t)return Ls(E,ft),Xt}else ft.uniforms=lt.getUniforms(E),E.onBeforeCompile(ft,x),Xt=lt.acquireProgram(ft,bt),At.set(bt,Xt),H.uniforms=ft.uniforms;let Rt=H.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Rt.clippingPlanes=st.uniform),Ls(E,ft),H.needsLights=Wt(E),H.lightsStateVersion=_t,H.needsLights&&(Rt.ambientLightColor.value=G.state.ambient,Rt.lightProbe.value=G.state.probe,Rt.directionalLights.value=G.state.directional,Rt.directionalLightShadows.value=G.state.directionalShadow,Rt.spotLights.value=G.state.spot,Rt.spotLightShadows.value=G.state.spotShadow,Rt.rectAreaLights.value=G.state.rectArea,Rt.ltc_1.value=G.state.rectAreaLTC1,Rt.ltc_2.value=G.state.rectAreaLTC2,Rt.pointLights.value=G.state.point,Rt.pointLightShadows.value=G.state.pointShadow,Rt.hemisphereLights.value=G.state.hemi,Rt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Rt.spotLightMatrix.value=G.state.spotLightMatrix,Rt.spotLightMap.value=G.state.spotLightMap,Rt.pointShadowMatrix.value=G.state.pointShadowMatrix),H.currentProgram=Xt,H.uniformsList=null,Xt}function Ps(E){if(E.uniformsList===null){let V=E.currentProgram.getUniforms();E.uniformsList=xs.seqWithValue(V.seq,E.uniforms)}return E.uniformsList}function Ls(E,V){let X=S.get(E);X.outputColorSpace=V.outputColorSpace,X.batching=V.batching,X.batchingColor=V.batchingColor,X.instancing=V.instancing,X.instancingColor=V.instancingColor,X.instancingMorph=V.instancingMorph,X.skinning=V.skinning,X.morphTargets=V.morphTargets,X.morphNormals=V.morphNormals,X.morphColors=V.morphColors,X.morphTargetsCount=V.morphTargetsCount,X.numClippingPlanes=V.numClippingPlanes,X.numIntersection=V.numClipIntersection,X.vertexAlphas=V.vertexAlphas,X.vertexTangents=V.vertexTangents,X.toneMapping=V.toneMapping}function W(E,V,X,H,G){V.isScene!==!0&&(V=Jt),B.resetTextureUnits();let dt=V.fog,_t=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?V.environment:null,ft=D===null?x.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:xi,bt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,At=q.get(H.envMap||_t,bt),kt=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Xt=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Rt=!!X.morphAttributes.position,ae=!!X.morphAttributes.normal,ye=!!X.morphAttributes.color,_e=fn;H.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(_e=x.toneMapping);let oe=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,Fe=oe!==void 0?oe.length:0,Et=S.get(H),Ye=A.state.lights;if(St===!0&&(Dt===!0||E!==F)){let Re=E===F&&H.id===N;st.setState(H,E,Re)}let Qt=!1;H.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Ye.state.version||Et.outputColorSpace!==ft||G.isBatchedMesh&&Et.batching===!1||!G.isBatchedMesh&&Et.batching===!0||G.isBatchedMesh&&Et.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Et.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Et.instancing===!1||!G.isInstancedMesh&&Et.instancing===!0||G.isSkinnedMesh&&Et.skinning===!1||!G.isSkinnedMesh&&Et.skinning===!0||G.isInstancedMesh&&Et.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Et.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Et.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Et.instancingMorph===!1&&G.morphTexture!==null||Et.envMap!==At||H.fog===!0&&Et.fog!==dt||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==st.numPlanes||Et.numIntersection!==st.numIntersection)||Et.vertexAlphas!==kt||Et.vertexTangents!==Xt||Et.morphTargets!==Rt||Et.morphNormals!==ae||Et.morphColors!==ye||Et.toneMapping!==_e||Et.morphTargetsCount!==Fe)&&(Qt=!0):(Qt=!0,Et.__version=H.version);let ln=Et.currentProgram;Qt===!0&&(ln=Is(H,V,G));let gn=!1,hi=!1,Di=!1,le=ln.getUniforms(),Le=Et.uniforms;if(vt.useProgram(ln.program)&&(gn=!0,hi=!0,Di=!0),H.id!==N&&(N=H.id,hi=!0),gn||F!==E){vt.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),le.setValue(U,"projectionMatrix",E.projectionMatrix),le.setValue(U,"viewMatrix",E.matrixWorldInverse);let Hn=le.map.cameraPosition;Hn!==void 0&&Hn.setValue(U,Yt.setFromMatrixPosition(E.matrixWorld)),re.logarithmicDepthBuffer&&le.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&le.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),F!==E&&(F=E,hi=!0,Di=!0)}if(Et.needsLights&&(Ye.state.directionalShadowMap.length>0&&le.setValue(U,"directionalShadowMap",Ye.state.directionalShadowMap,B),Ye.state.spotShadowMap.length>0&&le.setValue(U,"spotShadowMap",Ye.state.spotShadowMap,B),Ye.state.pointShadowMap.length>0&&le.setValue(U,"pointShadowMap",Ye.state.pointShadowMap,B)),G.isSkinnedMesh){le.setOptional(U,G,"bindMatrix"),le.setOptional(U,G,"bindMatrixInverse");let Re=G.skeleton;Re&&(Re.boneTexture===null&&Re.computeBoneTexture(),le.setValue(U,"boneTexture",Re.boneTexture,B))}G.isBatchedMesh&&(le.setOptional(U,G,"batchingTexture"),le.setValue(U,"batchingTexture",G._matricesTexture,B),le.setOptional(U,G,"batchingIdTexture"),le.setValue(U,"batchingIdTexture",G._indirectTexture,B),le.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&le.setValue(U,"batchingColorTexture",G._colorsTexture,B));let Gn=X.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&at.update(G,X,ln),(hi||Et.receiveShadow!==G.receiveShadow)&&(Et.receiveShadow=G.receiveShadow,le.setValue(U,"receiveShadow",G.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&V.environment!==null&&(Le.envMapIntensity.value=V.environmentIntensity),Le.dfgLUT!==void 0&&(Le.dfgLUT.value=p0()),hi&&(le.setValue(U,"toneMappingExposure",x.toneMappingExposure),Et.needsLights&&wt(Le,Di),dt&&H.fog===!0&&Tt.refreshFogUniforms(Le,dt),Tt.refreshMaterialUniforms(Le,H,Ct,nt,A.state.transmissionRenderTarget[E.id]),xs.upload(U,Ps(Et),Le,B)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(xs.upload(U,Ps(Et),Le,B),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&le.setValue(U,"center",G.center),le.setValue(U,"modelViewMatrix",G.modelViewMatrix),le.setValue(U,"normalMatrix",G.normalMatrix),le.setValue(U,"modelMatrix",G.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){let Re=H.uniformsGroups;for(let Hn=0,Ui=Re.length;Hn<Ui;Hn++){let xc=Re[Hn];gt.update(xc,ln),gt.bind(xc,ln)}}return ln}function wt(E,V){E.ambientLightColor.needsUpdate=V,E.lightProbe.needsUpdate=V,E.directionalLights.needsUpdate=V,E.directionalLightShadows.needsUpdate=V,E.pointLights.needsUpdate=V,E.pointLightShadows.needsUpdate=V,E.spotLights.needsUpdate=V,E.spotLightShadows.needsUpdate=V,E.rectAreaLights.needsUpdate=V,E.hemisphereLights.needsUpdate=V}function Wt(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(E,V,X){let H=S.get(E);H.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),S.get(E.texture).__webglTexture=V,S.get(E.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,V){let X=S.get(E);X.__webglFramebuffer=V,X.__useDefaultFramebuffer=V===void 0};let ge=U.createFramebuffer();this.setRenderTarget=function(E,V=0,X=0){D=E,w=V,P=X;let H=null,G=!1,dt=!1;if(E){let ft=S.get(E);if(ft.__useDefaultFramebuffer!==void 0){vt.bindFramebuffer(U.FRAMEBUFFER,ft.__webglFramebuffer),z.copy(E.viewport),k.copy(E.scissor),$=E.scissorTest,vt.viewport(z),vt.scissor(k),vt.setScissorTest($),N=-1;return}else if(ft.__webglFramebuffer===void 0)B.setupRenderTarget(E);else if(ft.__hasExternalTextures)B.rebindTextures(E,S.get(E.texture).__webglTexture,S.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let kt=E.depthTexture;if(ft.__boundDepthTexture!==kt){if(kt!==null&&S.has(kt)&&(E.width!==kt.image.width||E.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");B.setupDepthRenderbuffer(E)}}let bt=E.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(dt=!0);let At=S.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(At[V])?H=At[V][X]:H=At[V],G=!0):E.samples>0&&B.useMultisampledRTT(E)===!1?H=S.get(E).__webglMultisampledFramebuffer:Array.isArray(At)?H=At[X]:H=At,z.copy(E.viewport),k.copy(E.scissor),$=E.scissorTest}else z.copy(J).multiplyScalar(Ct).floor(),k.copy(it).multiplyScalar(Ct).floor(),$=rt;if(X!==0&&(H=ge),vt.bindFramebuffer(U.FRAMEBUFFER,H)&&vt.drawBuffers(E,H),vt.viewport(z),vt.scissor(k),vt.setScissorTest($),G){let ft=S.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+V,ft.__webglTexture,X)}else if(dt){let ft=V;for(let bt=0;bt<E.textures.length;bt++){let At=S.get(E.textures[bt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+bt,At.__webglTexture,X,ft)}}else if(E!==null&&X!==0){let ft=S.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ft.__webglTexture,X)}N=-1},this.readRenderTargetPixels=function(E,V,X,H,G,dt,_t,ft=0){if(!(E&&E.isWebGLRenderTarget)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=S.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_t!==void 0&&(bt=bt[_t]),bt){vt.bindFramebuffer(U.FRAMEBUFFER,bt);try{let At=E.textures[ft],kt=At.format,Xt=At.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ft),!re.textureFormatReadable(kt)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!re.textureTypeReadable(Xt)){Ut("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=E.width-H&&X>=0&&X<=E.height-G&&U.readPixels(V,X,H,G,ct.convert(kt),ct.convert(Xt),dt)}finally{let At=D!==null?S.get(D).__webglFramebuffer:null;vt.bindFramebuffer(U.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(E,V,X,H,G,dt,_t,ft=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=S.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&_t!==void 0&&(bt=bt[_t]),bt)if(V>=0&&V<=E.width-H&&X>=0&&X<=E.height-G){vt.bindFramebuffer(U.FRAMEBUFFER,bt);let At=E.textures[ft],kt=At.format,Xt=At.type;if(E.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ft),!re.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!re.textureTypeReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Rt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Rt),U.bufferData(U.PIXEL_PACK_BUFFER,dt.byteLength,U.STREAM_READ),U.readPixels(V,X,H,G,ct.convert(kt),ct.convert(Xt),0);let ae=D!==null?S.get(D).__webglFramebuffer:null;vt.bindFramebuffer(U.FRAMEBUFFER,ae);let ye=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Rh(U,ye,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Rt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,dt),U.deleteBuffer(Rt),U.deleteSync(ye),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,V=null,X=0){let H=Math.pow(2,-X),G=Math.floor(E.image.width*H),dt=Math.floor(E.image.height*H),_t=V!==null?V.x:0,ft=V!==null?V.y:0;B.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,X,0,0,_t,ft,G,dt),vt.unbindTexture()};let Li=U.createFramebuffer(),qe=U.createFramebuffer();this.copyTextureToTexture=function(E,V,X=null,H=null,G=0,dt=0){let _t,ft,bt,At,kt,Xt,Rt,ae,ye,_e=E.isCompressedTexture?E.mipmaps[dt]:E.image;if(X!==null)_t=X.max.x-X.min.x,ft=X.max.y-X.min.y,bt=X.isBox3?X.max.z-X.min.z:1,At=X.min.x,kt=X.min.y,Xt=X.isBox3?X.min.z:0;else{let Le=Math.pow(2,-G);_t=Math.floor(_e.width*Le),ft=Math.floor(_e.height*Le),E.isDataArrayTexture?bt=_e.depth:E.isData3DTexture?bt=Math.floor(_e.depth*Le):bt=1,At=0,kt=0,Xt=0}H!==null?(Rt=H.x,ae=H.y,ye=H.z):(Rt=0,ae=0,ye=0);let oe=ct.convert(V.format),Fe=ct.convert(V.type),Et;V.isData3DTexture?(B.setTexture3D(V,0),Et=U.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(B.setTexture2DArray(V,0),Et=U.TEXTURE_2D_ARRAY):(B.setTexture2D(V,0),Et=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,V.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,V.unpackAlignment);let Ye=U.getParameter(U.UNPACK_ROW_LENGTH),Qt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),ln=U.getParameter(U.UNPACK_SKIP_PIXELS),gn=U.getParameter(U.UNPACK_SKIP_ROWS),hi=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,_e.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_e.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,At),U.pixelStorei(U.UNPACK_SKIP_ROWS,kt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Xt);let Di=E.isDataArrayTexture||E.isData3DTexture,le=V.isDataArrayTexture||V.isData3DTexture;if(E.isDepthTexture){let Le=S.get(E),Gn=S.get(V),Re=S.get(Le.__renderTarget),Hn=S.get(Gn.__renderTarget);vt.bindFramebuffer(U.READ_FRAMEBUFFER,Re.__webglFramebuffer),vt.bindFramebuffer(U.DRAW_FRAMEBUFFER,Hn.__webglFramebuffer);for(let Ui=0;Ui<bt;Ui++)Di&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,S.get(E).__webglTexture,G,Xt+Ui),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,S.get(V).__webglTexture,dt,ye+Ui)),U.blitFramebuffer(At,kt,_t,ft,Rt,ae,_t,ft,U.DEPTH_BUFFER_BIT,U.NEAREST);vt.bindFramebuffer(U.READ_FRAMEBUFFER,null),vt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||E.isRenderTargetTexture||S.has(E)){let Le=S.get(E),Gn=S.get(V);vt.bindFramebuffer(U.READ_FRAMEBUFFER,Li),vt.bindFramebuffer(U.DRAW_FRAMEBUFFER,qe);for(let Re=0;Re<bt;Re++)Di?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Le.__webglTexture,G,Xt+Re):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Le.__webglTexture,G),le?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Gn.__webglTexture,dt,ye+Re):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Gn.__webglTexture,dt),G!==0?U.blitFramebuffer(At,kt,_t,ft,Rt,ae,_t,ft,U.COLOR_BUFFER_BIT,U.NEAREST):le?U.copyTexSubImage3D(Et,dt,Rt,ae,ye+Re,At,kt,_t,ft):U.copyTexSubImage2D(Et,dt,Rt,ae,At,kt,_t,ft);vt.bindFramebuffer(U.READ_FRAMEBUFFER,null),vt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else le?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Et,dt,Rt,ae,ye,_t,ft,bt,oe,Fe,_e.data):V.isCompressedArrayTexture?U.compressedTexSubImage3D(Et,dt,Rt,ae,ye,_t,ft,bt,oe,_e.data):U.texSubImage3D(Et,dt,Rt,ae,ye,_t,ft,bt,oe,Fe,_e):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,dt,Rt,ae,_t,ft,oe,Fe,_e.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,dt,Rt,ae,_e.width,_e.height,oe,_e.data):U.texSubImage2D(U.TEXTURE_2D,dt,Rt,ae,_t,ft,oe,Fe,_e);U.pixelStorei(U.UNPACK_ROW_LENGTH,Ye),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Qt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,ln),U.pixelStorei(U.UNPACK_SKIP_ROWS,gn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,hi),dt===0&&V.generateMipmaps&&U.generateMipmap(Et),vt.unbindTexture()},this.initRenderTarget=function(E){S.get(E).__webglFramebuffer===void 0&&B.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?B.setTextureCube(E,0):E.isData3DTexture?B.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?B.setTexture2DArray(E,0):B.setTexture2D(E,0),vt.unbindTexture()},this.resetState=function(){w=0,P=0,D=null,vt.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}};function lu(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new fe,c=0;for(let d=0;d<i.length;++d){let f=i[d],u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let h in f.attributes){if(!n.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+'. All geometries must have compatible attributes; make sure "'+h+'" attribute exists among all geometries, or in none of them.'),null;r[h]===void 0&&(r[h]=[]),r[h].push(f.attributes[h]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let h in f.morphAttributes){if(!s.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+".  .morphAttributes must be consistent throughout all geometries."),null;a[h]===void 0&&(a[h]=[]),a[h].push(f.morphAttributes[h])}if(t){let h;if(e)h=f.index.count;else if(f.attributes.position!==void 0)h=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+d+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,h,d),c+=h}}if(e){let d=0,f=[];for(let u=0;u<i.length;++u){let h=i[u].index;for(let p=0;p<h.count;++p)f.push(h.getX(p)+d);d+=i[u].attributes.position.count}l.setIndex(f)}for(let d in r){let f=ou(r[d]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" attribute."),null;l.setAttribute(d,f)}for(let d in a){let f=a[d][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[d]=[];for(let u=0;u<f;++u){let h=[];for(let _=0;_<a[d].length;++_)h.push(a[d][_][u]);let p=ou(h);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+d+" morphAttribute."),null;l.morphAttributes[d].push(p)}}return l}function ou(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){let d=i[c];if(t===void 0&&(t=d.array.constructor),t!==d.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=d.itemSize),e!==d.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=d.normalized),n!==d.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=d.gpuType),s!==d.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=d.count*e}let a=new t(r),o=new Ee(a,e,n),l=0;for(let c=0;c<i.length;++c){let d=i[c];if(d.isInterleavedBufferAttribute){let f=l/e;for(let u=0,h=d.count;u<h;u++)for(let p=0;p<e;p++){let _=d.getComponent(u,p);o.setComponent(u+f,p,_)}}else a.set(d.array,l);l+=d.count*e}return s!==void 0&&(o.gpuType=s),o}var br=new L;function on(i,t,e,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;br.copy(t),br[n]=0,br.normalize();let c=.5*a/(a+o),d=1-br.angleTo(i)/l;return Math.sign(br[e])===1?d*c:o/(a+o)+c+c*(1-d)}var Ss=class i extends We{constructor(t=1,e=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let l=new L,c=new L,d=new L(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,u=this.attributes.normal.array,h=this.attributes.uv.array,p=f.length/6,_=new L,g=.5/a;for(let m=0,y=0;m<f.length;m+=3,y+=2)switch(l.fromArray(f,m),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),f[m+0]=d.x*Math.sign(l.x)+c.x*r,f[m+1]=d.y*Math.sign(l.y)+c.y*r,f[m+2]=d.z*Math.sign(l.z)+c.z*r,u[m+0]=c.x,u[m+1]=c.y,u[m+2]=c.z,Math.floor(m/p)){case 0:_.set(1,0,0),h[y+0]=on(_,c,"z","y",r,n),h[y+1]=1-on(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),h[y+0]=1-on(_,c,"z","y",r,n),h[y+1]=1-on(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),h[y+0]=1-on(_,c,"x","z",r,t),h[y+1]=on(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),h[y+0]=1-on(_,c,"x","z",r,t),h[y+1]=1-on(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),h[y+0]=1-on(_,c,"x","y",r,t),h[y+1]=1-on(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),h[y+0]=on(_,c,"x","y",r,t),h[y+1]=1-on(_,c,"y","x",r,e);break}}static fromJSON(t){return new i(t.width,t.height,t.depth,t.segments,t.radius)}};function cu({add:i,box:t,stem:e,curve:n,leaf:s,random:r,m:a,compact:o}){let l=(h,p,_,g,m)=>i(new Te(h,p),_,g,m),c=(h,p,_,g=!1)=>{t(g?[.32,2.65,_]:[_,2.65,.32],a.ochreWall,[h,1.33,p]),t(g?[.4,.38,_]:[_,.38,.4],a.stone,[h,.2,p]);for(let m of[-1,1])t(g?[.43,.09,_+.2]:[_+.2,.09,.43],a.tileRib,[h+(g?m*.17:0),2.74,p+(g?0:m*.17)],g?[0,0,m*-.28]:[m*.28,0,0]);for(let m=-_/2;m<_/2;m+=.22){let y=[h+(g?0:m),2.79,p+(g?m:0)];i(new Ke(.075,.075,.8,6,1,!0,0,Math.PI),a.tileRib,y,g?[0,0,Math.PI/2]:[Math.PI/2,0,0])}};c(0,-15,43),c(-21.5,4,38,!0),c(21.5,3,36,!0),c(-17.8,13,16,!0),c(-12.5,21.5,10),c(13.5,22,11);for(let h=6;h<22;h+=.85)for(let p=-20.5;p<-18.2;p+=.82)t([.78,.08,.81],a.stone,[p,.1,h]);let d=(h,p,_,g)=>{t([_,.25,g],a.stone,[h,.15,p]),t([_-.2,3.5,.18],a.plaster,[h,1.94,p-g/2+.2]);for(let b of[-1,1])t([.18,3.5,g-.4],a.plaster,[h+b*(_/2-.2),1.94,p]);for(let b=-1;b<=1;b++){let M=h+b*(_/2-.3);e([M,.2,p+g/2-.5],[M,3.9,p+g/2-.5],.12,a.wood,1)}t([_,.2,.24],a.wood,[h,3.6,p+g/2-.45]);for(let b of[-1,1]){let M=h+b*_*.28;t([_*.37,2.9,.1],a.darkwood,[M,1.7,p+g/2-.85]);for(let A=0;A<5;A++)t([.045,1.5,.14],a.wood,[M-.55+A*.28,2.15,p+g/2-.76]);for(let A=0;A<4;A++)t([1.25,.045,.14],a.wood,[M,1.6+A*.35,p+g/2-.75])}let m=new Te(_+1.2,g+1.5,20,16),y=m.attributes.position;for(let b=0;b<y.count;b++){let M=y.getX(b),A=-y.getY(b);y.setXYZ(b,h+M,3.85+1.9*(1-Math.abs(A)/((g+1.5)/2))+Math.sin(M*2.1)*.035,p+A)}m.computeVertexNormals(),i(m,a.thatch);for(let b of[-1,1])for(let M=0;M<8;M++){let A=b*((g+1.5)/2)*(M+.5)/8,T=3.85+1.9*(1-Math.abs(A)/((g+1.5)/2));for(let I=0;I<(o?25:44);I++){let v=h-(_+1.1)/2+I*(_+1.1)/(o?25:44);t([.2,.06,.62],a.thatch,[v,T+.04+r()*.035,p+A],[b*.38,0,(r()-.5)*.06])}}for(let b of[-1,1]){let M=p+b*(g+1.5)/2;t([_+1.18,.23,.24],a.thatch,[h,3.77,M]);for(let A=0;A<(o?50:180);A++){let T=h-_/2-.5+r()*(_+1);e([T,4.04,M-b*.24],[T+(r()-.5)*.06,3.65+r()*.2,M+b*.07],.008,a.straw,.7)}}n([[h-_/2-.6,5.75,p],[h,5.83,p],[h+_/2+.6,5.75,p]],.18,a.thatch);for(let b=0;b<5;b++){let M=h-_/2+b*_/4;n([[M,3.9,p-(g+1.4)/2],[M,5.83,p],[M,3.9,p+(g+1.4)/2]],.022,a.bamboo)}};d(-13.1,.4,6.8,9),d(13.2,-6,6.4,7);let f=(h,p,_,g)=>{let m=(r()-.5)*1.3,y=[[h,0,p],[h-.15,_*.3,p+.3],[h+m,_*.58,p],[h+m+.4,_*.76,p+.5]];y.slice(1).forEach((M,A)=>e(y[A],M,(.31+_*.012)*(1-A*.22),a.bark,.76));for(let M=0;M<5;M++){let A=M*2.4;e([h,.7,p],[h+Math.cos(A)*1.2,.06,p+Math.sin(A)*1.2],.18,a.bark,.1)}for(let M=0;M<7;M++){let A=M*2.4,T=[h+Math.cos(A)*g*.68,_*(.65+r()*.25),p+Math.sin(A)*g*.68];e([h+m*.5,_*.5,p],T,.13,a.bark,.25)}let b=o?100:160;for(let M=0;M<b;M++){let A=M*2.39996,T=Math.sqrt(r())*g,I=_*.79+(r()-.5)*g*.8,v=[h+Math.cos(A)*T,I,p+Math.sin(A)*T];l(3+r(),2.6+r(),a.canopy,v,[(r()-.5)*2,r()*Math.PI,r()-.5])}};[[-19,-12,13,4.2],[-11,-17,15,4.7],[-2,-18,16,5],[9,-17,14,4.4],[18,-15,15,4.8],[-25,1,15,4.6],[25,-3,14,4.3],[-22,16,13,4.5],[24,15,15,4.8],[-11,21,12,4],[15,23,13,4.1]].forEach(h=>f(...h));for(let h of[-1,1])for(let p=0;p<(o?40:70);p++){let _=h*(7.4+r()*17),g=18+r()*10;for(let m=0;m<3;m++)l(1.6,1.2,a.understory,[_+(r()-.5)*.6,.4+r()*.3,g],[0,m*2.1,0])}for(let h=0;h<(o?230:450);h++){let _=(h%2?-1:1)*(9+r()*19),g=-19+r()*47;if(Math.abs(_)<17&&g>-8&&g<6||_<-17.5&&_>-21&&g>5&&g<23)continue;let m=.55+r()*.9;if(l(m*1.6,m,a.understory,[_,.22+m*.3,g],[-.35,r()*6.28,0]),h%5===0)for(let y=0;y<5;y++)s([_,.06,g],[-.9+r()*.4,y*1.26,.15],[.18,.3,.9],a.herb)}for(let[h,p]of[[-11,7],[-15,8],[15,4]]){e([h,0,p],[h,2.4,p],.08,a.bambooGreen,.6);for(let _=0;_<9;_++)s([h,1.3+r(),p],[-.7,_*2.4,.2],[.75,.8,1.9],a.leaf)}for(let h=-12;h<-1;h+=.85)for(let p of[6.8,7.65])t([.8,.08,.8],a.stone,[h,.08,p])}function _c(i=209){let t=i;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var Ho=i=>(i=Math.max(0,Math.min(1,i)),i*i*(3-2*i)),Go=(i,t)=>{let e=Math.sin(i*127.1+t*311.7)*43758.5453;return e-Math.floor(e)};function Er(i,t){let e=Math.floor(i),n=Math.floor(t),s=Ho(i-e),r=Ho(t-n);return ke.lerp(ke.lerp(Go(e,n),Go(e+1,n),s),ke.lerp(Go(e,n+1),Go(e+1,n+1),s),r)}function bs(i,t){let e=Math.max(Math.abs(i)-27,-t-24,t-33,0),n=Ho(e/18),s=1.3+5.5*Er(i*.035,t*.035)+2.4*Er(i*.085+9,t*.085),r=Math.sin((t-23)*.045)*6,a=t>23?.72*Math.exp(-(((i-r)/9)**2)):0;return-.045+n*s*(1-a)}function m0(i=!1){let t=new Te(480,480,i?80:120,i?80:120),e=t.attributes.position;for(let n=0;n<e.count;n++){let s=e.getX(n),r=-e.getY(n);e.setXYZ(n,s,bs(s,r),r)}return t.computeVertexNormals(),t}function g0(i,t=!1){let e=420+i*65,n=95+i*15,s=new Te(e,n,t?100:180,t?18:40),r=s.attributes.position,a=[[[-150,56,30],[-90,42,28],[-25,64,27],[47,47,28],[115,68,28],[173,43,30]],[[-183,66,34],[-116,88,36],[-40,54,28],[31,87,34],[106,63,28],[180,80,38]],[[-220,80,44],[-139,66,30],[-62,98,40],[24,72,32],[97,108,39],[200,94,46]]][i];for(let u=0;u<r.count;u++){let h=r.getX(u),p=(r.getY(u)+n/2)/n,_=4;for(let[T,I,v]of a)_+=I*Math.exp(-(((h-T)/v)**2));let g=.43+.12*Math.sin(h*.043+i*3)+.05*Math.sin(h*.11),m=Math.max(0,1-Math.abs(p-g)/(p<g?g:1-g)),y=Er(h*.1+i*13,p*13)-.5,b=Er(h*.38,p*36)-.5,M=.13*Math.sin(h*.18+p*7)+.07*Math.cos(h*.4-p*12),A=-1+Math.pow(m,1.15)*_*(.64+i*.04)*(1+y*.32+b*.12+M);r.setXYZ(u,h,A,-72-i*92-p*n)}s.computeVertexNormals();let o=s.attributes.normal,l=new Float32Array(r.count*3),c=new Ot(["#65736c","#72858a","#93a2ab"][i]),d=new Ot(["#35564c","#5c797b","#859aa4"][i]),f=new Ot;for(let u=0;u<r.count;u++){let h=Er(r.getX(u)*.16,r.getZ(u)*.14),p=1-Math.abs(o.getY(u));f.copy(d).lerp(c,Ho(p*1.8+h*.55)).multiplyScalar(.8+h*.28),l.set([f.r,f.g,f.b],u*3)}return s.setAttribute("color",new Ee(l,3)),s}function hu({add:i,box:t,ball:e,stem:n,leaf:s,m:r,compact:a}){let o=_c(429);i(m0(a),r.ground);for(let l=2;l>=0;l--)i(g0(l,a),r.mountains[l]);for(let l=23;l<82;l+=1.08){let c=Math.sin((l-23)*.045)*6;for(let d=-1;d<=1;d++){let f=c+d*1.02;t([.97,.09,1.02],r.stone,[f,bs(f,l)+.08,l],[0,Math.cos(l*.045)*.26,0])}}for(let l=0;l<(a?55:90);l++){let c=(l%2?-1:1)*(29+o()*38),d=-40+o()*110,f=bs(c,d),u=.45+o()*1.6;if(e(u,r.stone,[c,f+u*.28,d],[1.4,.55,1]),l%3)for(let h=0;h<4;h++)s([c,f+.05,d],[-.6,h*1.57,.3],[.4,.4,1],r.herb)}for(let l=0;l<(a?40:70);l++){let c=-85+o()*170,d=-36-o()*28,f=bs(c,d),u=4+o()*8;n([c,f,d],[c,f+u,d],.1,r.bark,.25);for(let h=0;h<(a?16:25);h++){let p=h*2.39996,_=.7+o()*2;i(new Te(3.5,3.2),r.canopy,[c+Math.cos(p)*_,f+u*(.65+o()*.25),d+Math.sin(p)*_],[(o()-.5)*1.7,p,o()-.5])}}}function _0(i,t,e,n,s,r,a=0){return new L(i+n*r*r,a+e*r,t+s*r*r)}function uu({add:i,stem:t,m:e,compact:n}){let s=_c(1977),r=(l,c,d)=>{for(let f=0;f<2;f++)i(new Te(d*1.6,d),e.bambooCrown,l.toArray(),[-.15+f*.7,c+f*1.2,.18])},a=(l,c,d,f,u)=>{let h=bs(l,c)+.04,p=Math.cos(f)*u,_=Math.sin(f)*u,g=Array.from({length:12},(T,I)=>_0(l,c,d,p,_,I/11,h)),m=new ti(g),y=.045+s()*.025,b=new Si(m,18,y,7,!1),M=b.attributes.position;for(let T=0;T<M.count;T++){let I=Math.floor(T/8)/18,v=m.getPointAt(I),x=new L().fromBufferAttribute(M,T).sub(v).multiplyScalar(1-I*.62).add(v);M.setXYZ(T,x.x,x.y,x.z)}b.computeVertexNormals(),i(b,e.bambooGreen);let A=Math.round(d/.42);for(let T=1;T<A;T++){let I=T/A,v=m.getPointAt(I),x=m.getTangentAt(I),R=new Qe(y*(1-I*.62)+.008,.009,n?3:4,n?5:8);if(R.applyQuaternion(new He().setFromUnitVectors(new L(0,0,1),x)),i(R,e.bambooNode,v.toArray()),I<.32||T%(n?3:2))continue;let w=f+T*2.4,P=(Math.sin(I*Math.PI)*1.2+.35)*(.8+s()*.45);for(let D of[-1,1]){let N=w+D*.48,F=v.clone().add(new L(Math.cos(N)*P,.18-I*.1,Math.sin(N)*P)),z=v.clone().lerp(F,.6);z.y+=.14,t(v.toArray(),z.toArray(),.018,e.bambooGreen,.5),t(z.toArray(),F.toArray(),.009,e.bambooGreen,.15),r(F,-N,.85+s()*.4)}}r(m.getPointAt(.98),f,.85)},o=[[-17,9,6.3],[-16,14,7],[-20,-8,7.8],[18,8,7],[18,15,7.6],[21,-12,8],[-24,3,8.5],[25,0,8.4],[-15,-20,7.5],[14,-21,7.8]];return o.forEach(([l,c,d])=>{let f=n?5:8;for(let u=0;u<f;u++){let h=u*2.39996+s()*.3,p=.2+Math.sqrt(s())*1.3;a(l+Math.cos(h)*p,c+Math.sin(h)*p,d*(.72+s()*.36),h,.4+s()*1.2)}}),{clumps:o.length,culms:o.length*(n?5:8)}}function du({scene:i,materials:t,geometries:e,shadows:n,compact:s}){let r=new Map,a=new Me,o=(x,R,w=[0,0,0],P=[0,0,0],D=[1,1,1])=>{if(a.position.set(...w),a.rotation.set(...P),a.scale.set(...D),a.updateMatrix(),x.applyMatrix4(a.matrix),R.vertexColors&&!x.attributes.color){let F=.75+p()*.36,z=x.attributes.position.count,k=new Float32Array(z*3);for(let $=0;$<z;$++)k.set([F,F*(.96+p()*.04),F*.92],$*3);x.setAttribute("color",new Ee(k,3))}let N=R;r.has(N)||r.set(N,[]),r.get(N).push(x)},l=(x,R,w,P)=>o(new We(...x),R,w,P),c=(x,R,w,P,D=.03)=>o(new Ss(...x,1,D),R,w,P),d=(x,R,w,P=[1,1,1])=>o(new sr(x,1),R,w,[0,0,0],P),f=(x,R,w,P,D=.7)=>{let N=new L(...x),F=new L(...R),z=F.clone().sub(N),k=new Ke(w*D,w,z.length(),w>.1?12:6);k.applyQuaternion(new He().setFromUnitVectors(new L(0,1,0),z.normalize())),o(k,P,N.add(F).multiplyScalar(.5).toArray())},u=(x,R,w)=>o(new Si(new ti(x.map(P=>new L(...P))),s?10:16,R,5,!1),w),h=209,p=()=>(h=Math.imul(h,1664525)+1013904223>>>0,h/4294967296),_=(x,R,w,P=t.treeLeaf)=>{let D=new fe;D.setAttribute("position",new Gt([0,0,0,-.37,.05,.42,0,.13,.48,.37,.05,.42,0,0,1],3)),D.setAttribute("uv",new Gt([.5,0,0,.42,.5,.48,1,.42,.5,1],2)),D.setIndex([0,1,2,0,2,3,1,4,2,2,4,3]),D.computeVertexNormals(),o(D,P,x,R,w)},g=(x,R,w)=>{for(let P=0;P<5;P++){let D=P*Math.PI*.4;_(x,[Math.PI*.18,D,.1],[w*1.7,w,w],R)}};l([24,.1,21],t.gravel,[0,0,2]),l([19.5,.45,13.4],t.stone,[0,.23,0]),l([18.8,.18,12.8],t.floor,[0,.54,0]);for(let x=0;x<3;x++)c([6.4+x*.65,.17,.65],t.stone,[0,.42-x*.16,6.8+x*.6]);for(let x=8.4;x<23;x+=1.12)for(let R=-1;R<=1;R++)c([1-p()*.05,.13,.98-p()*.04],t.stone,[R*1.08+Math.round(x)%2*.08,.1+p()*.025,x],[0,(p()-.5)*.06,0]),p()>.6&&d(.13,t.moss,[R*1.08+.51,.1,x+.42],[1.8,.06,1]);l([18,6,.3],t.plaster,[0,3.6,-6.1]),l([.3,6,12],t.plaster,[-8.9,3.6,0]),l([.3,6,12],t.plaster,[8.9,3.6,0]),l([18.3,.65,.45],t.stone,[0,.95,-6.1]);for(let x of[-1,1])for(let R=0;R<4;R++)for(let w=0;w<15;w++)c([.36,.18,.78],t.stone,[x*8.94,.73+R*.2,-5.7+w*.79+R%2*.2],[0,0,0],.012);for(let x of[-8.6,-6,-3,3,6,8.6]){f([x,.65,5.4],[x,6.15,5.4],.18,t.redwood,1),o(new Ke(.28,.34,.32,8),t.stone,[x,.8,5.4]),l([.6,.16,.65],t.wood,[x,5.77,5.4]),l([.94,.16,.38],t.redwood,[x,5.95,5.4]),l([.45,.16,1.05],t.wood,[x,6.1,5.4]);for(let R of[-1,1])u([[x,5.35,5.4],[x+R*.22,5.5,5.4],[x+R*.65,5.9,5.4]],.06,t.redwood),l([.2,.16,.54],t.darkwood,[x+R*.4,5.83,5.4]);f([x,5.85,4.8],[x,6.42,6.6],.09,t.wood,.85)}for(let x of[-5.5,0,5.4])l([18,.35,.4],t.redwood,[0,6.24,x]);for(let x of[-8.8,8.8])l([.3,.35,12.4],t.wood,[x,6.2,0]);for(let x=-9.6;x<=9.6;x+=.5)f([x,6.4,5.1],[x,6.59,7.1],.055,t.wood,1);for(let x of[-1,1]){let R=x*7.3;l([2.15,1.1,.14],t.wood,[R,1.25,5.45]);for(let w=-3;w<=3;w++)l([.055,3.8,.1],t.wood,[R+w*.29,3.65,5.45]);for(let w=0;w<9;w++)l([2.15,.055,.1],t.wood,[R,1.85+w*.43,5.45])}let m=(x,R,w,P,D,N)=>{let F=Math.abs(R)/P;return D+N*(1-F)**1.7+.34*F**8+.4*(Math.abs(x)/w)**10},y=(x,R,w,P,D=0)=>{let N=x/2,F=R/2,z=new Te(x,R,32,24),k=z.attributes.position;for(let et=0;et<k.count;et++){let ht=k.getX(et),nt=-k.getY(et);k.setXYZ(et,ht,m(ht,nt,N,F,w,P),nt+D)}z.computeVertexNormals(),o(z,t.tile);let $=.36,Q=.5;for(let et=-N+$/2;et<N;et+=$)for(let ht of[-1,1])for(let nt=.04;nt<F;nt+=s?.65:.43){let Ct=new Te($-.012,Q,6,1),Nt=Ct.attributes.position,te=.035+p()*.018;for(let J=0;J<Nt.count;J++){let it=Nt.getX(J),rt=Nt.getY(J)+Q/2,Ft=ht*Math.min(F+.06,nt+rt),St=Math.sqrt(Math.max(0,1-(it/($/2))**2))*.075;Nt.setXYZ(J,et+it,m(et+it,Math.min(Math.abs(Ft),F),N,F,w,P)+St+te+rt*.034,Ft+D)}Ct.computeVertexNormals(),o(Ct,t.tile)}for(let et of[-1,1]){let ht=Array.from({length:12},(nt,Ct)=>{let Nt=-N+x*Ct/11;return[Nt,m(Nt,F,N,F,w,P)-.08,et*F+D]});u(ht,.13,t.wood);for(let nt=-N+.18;nt<N;nt+=.36){let Ct=m(nt,F,N,F,w,P);o(new Ke(.1,.1,.09,14),t.tileRib,[nt,Ct,et*(F+.09)+D],[Math.PI/2,0,0]),o(new Qe(.067,.012,4,12),t.tile,[nt,Ct,et*(F+.14)+D])}}for(let et of[-1,1]){let ht=Array.from({length:25},(nt,Ct)=>{let Nt=-F+Ct/24*R;return[et*N,m(N,Nt,N,F,w,P)-.09,Nt+D]});u(ht,.15,t.tileRib)}u([[-N,w+P+.8,D],[-N+1,w+P+.15,D],[0,w+P+.12,D],[N-1,w+P+.15,D],[N,w+P+.8,D]],.16,t.tileRib)};y(20.4,14.4,6.35,2.5),l([5.6,1.55,.2],t.wood,[0,5.25,5.95]),o(new Te(5.4,1.45),t.sign,[0,5.25,6.065]);for(let x of[-2.35,2.35])o(new Qe(.12,.022,5,12),t.brass,[x,4.36,6.08]),f([x,4.24,6.08],[x,3.86,6.08],.042,t.lantern,.55);[[-4.5,4.7,5.7],[4.5,4.7,5.7],[-2.7,3.3,18],[2.7,3.3,18]].forEach(([x,R,w])=>{f([x,R+.4,w],[x,R+1.2,w],.015,t.wood,1),o(new Mi(.36,12,8),t.lantern,[x,R,w],[0,0,0],[1,1.3,1]);for(let P of[-.42,.42])o(new Ke(.23,.23,.1,10),t.brass,[x,R+P,w]);for(let P=0;P<8;P++){let D=P*Math.PI/4;u([[x+Math.cos(D)*.19,R+.4,w+Math.sin(D)*.19],[x+Math.cos(D)*.37,R,w+Math.sin(D)*.37],[x+Math.cos(D)*.19,R-.4,w+Math.sin(D)*.19]],.012,t.redwood)}f([x,R-.5,w],[x,R-.92,w],.032,t.lantern,.4)});for(let x of[-4.7,0,4.7]){l([4.55,5.9,.85],t.darkwood,[x,3.45,-2.18]);for(let R of[-2.23,2.23])l([.13,6,1],t.wood,[x+R,3.45,-2.05]);c([4.7,.2,1.1],t.wood,[x,6.48,-2.05]),c([4.78,.1,1.14],t.redwood,[x,6.58,-2.05]);for(let R=0;R<=10;R++)l([4.4,.035,.15],t.wood,[x,1.1+R*.46,-1.65]);for(let R=1;R<4;R++)l([.035,4.65,.15],t.wood,[x-2.12+R*1.06,3.42,-1.65]);for(let R of[-1.1,1.1])l([2.05,.5,.14],t.redwood,[x+R,.82,-1.68]),o(new Qe(.08,.017,5,12),t.brass,[x+R,.82,-1.57]);c([4.45,.13,1.05],t.wood,[x,5.86,-2])}let M=(x,R,w,P=1)=>{let D=[[.14,0],[.25,.05],[.3,.25],[.25,.45],[.16,.52],[.18,.57]].map(([F,z])=>new xt(F*P,z*P)),N=new ls(D);o(new rr(N.getPoints(s?16:28),s?16:24),t.ceramic,[x,R,w]),o(new Ke(.19*P,.19*P,.06*P,12),t.ceramic,[x,R+.59*P,w]);for(let F of[.13,.38])o(new Qe(.276*P,.018*P,4,16),t.blue,[x,R+F*P,w],[Math.PI/2,0,0])};for(let x=-6;x<=6;x+=1.5)M(x,5.93,-1.9,.65);l([7.1,1,1.4],t.darkwood,[0,1.1,2.8]),c([7.4,.12,1.65],t.wood,[0,1.66,2.8]);for(let x of[-2.3,0,2.3])l([2.1,.65,.05],t.redwood,[x,1.12,3.53]),l([1.92,.5,.04],t.wood,[x,1.12,3.57]);M(-2.5,1.73,2.8),M(-1.65,1.73,2.8,.8),f([.2,1.74,2.8],[.2,2.48,2.8],.025,t.brass,1),f([-.45,2.43,2.8],[.85,2.43,2.8],.025,t.brass,1);for(let x of[-.43,.83])f([x,2.43,2.8],[x,2.05,2.8],.008,t.brass,1),o(new Ke(.19,.12,.06,12),t.brass,[x,2.03,2.8]);o(new Ke(.5,.42,.1,18),t.bamboo,[2.3,1.78,2.8]);for(let x=0;x<24;x++)d(.065,t.herb,[2.3+(p()-.5)*.7,1.88,2.8+(p()-.5)*.6],[1,.3,1.8]);let A=(x,R,w,P)=>{let D=Math.hypot(w-x,P-R);for(let F of[.6,1.2])f([x,F,R],[w,F,P],.05,t.bamboo,1);let N=Math.ceil(D/.7);for(let F=0;F<=N;F++){let z=x+(w-x)*F/N,k=R+(P-R)*F/N;f([z,.05,k],[z+(p()-.5)*.12,1.55+.12*Math.sin(F),k+(p()-.5)*.09],.055,t.bamboo,.8);for(let $ of[.6,1.2])o(new Qe(.065,.014,4,8),t.bark,[z,$,k],[Math.PI/2,0,0])}};A(-16,-9,16,-9),A(-16,-9,-16,18),A(16,-9,16,18),A(-16,18,-3,18),A(3,18,16,18);for(let x of[-2.7,2.7])f([x,.1,18],[x,4.6,18],.15,t.wood,1),l([.55,.4,.55],t.stone,[x,.22,18]);l([6.1,.3,.45],t.redwood,[0,4.4,18]),y(6.6,2.3,4.6,.65,18);for(let x of[-5.2,5.2])for(let R of[9.3,13.7]){l([4.3,.18,3.4],t.soil,[x,.15,R]);for(let P of[-2.2,2.2])l([.18,.28,3.65],t.stone,[x+P,.17,R]);for(let P of[-1.78,1.78])l([4.5,.28,.18],t.stone,[x,.17,R+P]);let w=s?18:32;for(let P=0;P<w;P++){let D=x+(p()-.5)*3.8,N=R+(p()-.5)*2.9,F=.35+p()*.5;f([D,.2,N],[D,.2+F,N],.018,t.leaf,.4);for(let z=0;z<4;z++){let k=z*Math.PI*.7+P;_([D,.3+F*z/5,N],[-.4,k,.4],[.2,.2,.35],P%3?t.herb:t.leaf)}P%6===0&&g([D,.23+F,N],t.flower,.07)}}let T=(x,R,w,P,D=!1)=>{u([[x,0,R],[x-.16,w*.24,R+.12],[x+.12,w*.48,R],[x+.33,w*.75,R+.1]],D?.12:.21,t.bark);for(let N=0;N<5;N++){let F=N*1.26;f([x,.35,R],[x+Math.cos(F)*.7,.02,R+Math.sin(F)*.7],.1,t.bark,.2)}for(let N=0;N<(s?7:9);N++){let F=N*2.4,z=D?.85:1.3+p()*1.25,k=[x+Math.cos(F)*z,w*(.6+p()*.3),R+Math.sin(F)*z],$=[x+.1,w*(.35+N*.025),R],Q=[($[0]+k[0])/2,k[1]-.5,($[2]+k[2])/2];u([$,Q,k],D?.035:.065,t.bark);for(let et=0;et<(s?6:9);et++){let ht=[k[0]+(p()-.5)*1.75,k[1]+(p()-.4)*1.3,k[2]+(p()-.5)*1.75];f(k,ht,.018,t.bark,.15);for(let nt=0;nt<(s?16:26);nt++){let Ct=[ht[0]+(p()-.5)*.8,ht[1]+(p()-.5)*.6,ht[2]+(p()-.5)*.8];_(Ct,[p()*1.2-.6,p()*6.28,p()*1.4-.7],[D?.25:.16,.18,D?.34:.32],nt%3?t.treeLeaf:t.leaf)}for(let nt=0;nt<(D||s?2:4);nt++)g([ht[0]+(p()-.5)*.65,ht[1]+.25,ht[2]+(p()-.5)*.65],P,D?.09:.065)}}};T(-10,11.3,5.3,t.pink),T(10.7,12.8,5.8,t.pink),T(12,-5.5,5.4,t.flower),T(-11.4,-4.5,2.8,t.flower,!0),cu({add:o,box:l,stem:f,curve:u,leaf:_,random:p,m:t,compact:s});for(let x=0;x<26;x++){let R=x%2?-1:1;d(.3+p()*.6,t.stone,[R*(10+p()*5),.18,-6+p()*22],[1.3,.6,1])}hu({add:o,box:l,ball:d,stem:f,leaf:_,m:t,compact:s});let I=uu({add:o,stem:f,m:t,compact:s}),v=new Fn;v.name="apothecary-courtyard",v.userData.bamboo=I,v.userData.mountainLayers=3;for(let[x,R]of r){let w=R.map(N=>N.index?N.toNonIndexed():N),P=lu(w,!1);for(let N of new Set([...R,...w]))N.dispose();if(!P)throw new Error("Courtyard geometry merge failed");e.push(P);let D=new ue(P,x);D.name=x.name||"courtyard-batch",D.castShadow=n&&![t.ground,t.gravel,...t.mountains].includes(x),D.receiveShadow=n,v.add(D)}return i.add(v),v}async function fu(i,t){let e=new lr,n={};return await Promise.all(["dark_wooden_planks","rough_plaster_03","monastery_stone_floor","forest_ground_04"].map(async s=>{let r=await Promise.all(["color","normal","roughness"].map(async a=>{try{let o=await e.loadAsync(new URL(`../src/assets/apothecary/${s}_${a}.webp`,import.meta.url).href);return o.colorSpace=a==="color"?xe:mn,o.wrapS=o.wrapT=zn,o.anisotropy=Math.min(8,t),i.push(o),[a,o]}catch{return[a,null]}}));n[s]=Object.fromEntries(r)})),n}function Cn(i,t,e=[1,1],n=[0,0]){let s={};for(let[r,a]of[["color","map"],["normal","normalMap"],["roughness","roughnessMap"]]){if(!i[r])continue;let o=i[r].clone();o.repeat.set(...e),o.offset.set(...n),o.needsUpdate=!0,t.push(o),s[a]=o}return s.normalScale=new xt(.4,.4),s}function Tr(i,t){i.onBeforeCompile=e=>{e.vertexShader=`varying vec3 vWeatherPosition;
`+e.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vWeatherPosition = (modelMatrix * vec4(position, 1.0)).xyz;`),e.fragmentShader=`varying vec3 vWeatherPosition;
      float ageHash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float ageNoise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(ageHash(i),ageHash(i+vec2(1,0)),f.x),mix(ageHash(i+vec2(0,1)),ageHash(i+vec2(1,1)),f.x),f.y); }
      `+e.fragmentShader;let n=t==="wall"?`float damp = (1.0-smoothstep(.6,1.9+ageNoise(vWeatherPosition.xz*3.0)*.8,vWeatherPosition.y));
         float streak=ageNoise(vec2((vWeatherPosition.x+vWeatherPosition.z)*9.0,vWeatherPosition.y*.38));
         diffuseColor.rgb *= mix(vec3(1.0),vec3(.44,.48,.36),damp*(.35+streak*.55));`:`float patina=ageNoise(vWeatherPosition.xz*2.2); diffuseColor.rgb *= .76 + .27*patina;
         diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.11,.15,.075),smoothstep(.74,.95,patina)*.38);`;e.fragmentShader=e.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
`+n)},i.customProgramCacheKey=()=>`courtyard-weather-${t}-v1`}function pu(){let i=document.createElement("canvas");i.width=i.height=256;let t=i.getContext("2d"),e=t.createImageData(256,256);for(let s=0;s<256;s++)for(let r=0;r<256;r++){let a=Math.sin(r*.046+Math.sin(s*.055)*2)*Math.cos(s*.031+r*.023),o=Math.sin(r*18.1+s*31.7)*.07,l=ke.clamp((a-.25)*.5+o,0,.3),c=(s*256+r)*4;e.data[c]=132*(1-l)+48*l,e.data[c+1]=100*(1-l)+69*l,e.data[c+2]=58*(1-l)+53*l,e.data[c+3]=255}t.putImageData(e,0,0);let n=new bn(i);return n.colorSpace=xe,n}function mu(){let i=document.createElement("canvas");i.width=i.height=512;let t=i.getContext("2d"),e=713,n=()=>(e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296);for(let r=0;r<8;r++){let a=r*2.4,o=256+Math.cos(a)*(125+n()*85),l=256+Math.sin(a)*(125+n()*85);t.strokeStyle="#5d5a38",t.lineWidth=2.4,t.beginPath(),t.moveTo(256,300),t.lineTo(o,l),t.stroke();for(let c=0;c<22;c++){let d=.15+n()*.85,f=256+(o-256)*d+(n()-.5)*100,u=300+(l-300)*d+(n()-.5)*100,h=a+(n()-.5)*2;t.save(),t.translate(f,u),t.rotate(h);let p=13+n()*18,_=75+Math.floor(n()*65);t.fillStyle=`rgb(${_},${_+22},${Math.floor(_*.6)})`,t.beginPath(),t.moveTo(0,-p),t.quadraticCurveTo(p*.65,-p*.3,0,p),t.quadraticCurveTo(-p*.65,p*.3,0,-p),t.fill(),t.strokeStyle="rgba(206,201,137,.30)",t.lineWidth=.8,t.beginPath(),t.moveTo(0,-p*.9),t.lineTo(0,p),t.stroke(),t.restore()}}let s=new bn(i);return s.colorSpace=xe,s}function gu(){let i=document.createElement("canvas");i.width=i.height=512;let t=i.getContext("2d");t.fillStyle="#69604a",t.fillRect(0,0,512,512);for(let n=0;n<2200;n++){let s=n*151.7%512,r=n*83.3%512;t.strokeStyle=["#9c9278","#5e5948","#b1a58a","#79715b"][n%4],t.lineWidth=.7+n%3*.35,t.beginPath(),t.moveTo(s,r),t.lineTo(s+Math.sin(n)*6,r+20+n%90),t.stroke()}let e=new bn(i);return e.wrapS=e.wrapT=zn,e.repeat.set(5,2),e.colorSpace=xe,e}function _u(){let i=document.createElement("canvas");i.width=i.height=512;let t=i.getContext("2d");for(let n=0;n<5;n++){let a=200+n*60,o=65+Math.abs(n-2)*55;t.lineWidth=n===2?3:1.7,t.strokeStyle="#3d512b",t.beginPath(),t.moveTo(90,400),t.quadraticCurveTo(220,150,a,o),t.stroke();for(let l=1;l<8;l++){let c=l/8,d=(1-c)**2*90+2*(1-c)*c*220+c*c*a,f=(1-c)**2*400+2*(1-c)*c*150+c*c*o,h=(l%2?1:-1)*(42+(l*11+n*7)%32),p=10+l*19%30;t.fillStyle=["#3e602f","#53783b","#6f8e49","#36542b"][(l+n)%4],t.beginPath(),t.moveTo(d,f),t.quadraticCurveTo(d+h*.52,f+p*.5-10,d+h,f+p),t.quadraticCurveTo(d+h*.42,f+p*.6+6,d,f),t.fill(),t.strokeStyle="#82945b66",t.lineWidth=.65,t.beginPath(),t.moveTo(d,f),t.lineTo(d+h*.9,f+p*.9),t.stroke()}}let e=new bn(i);return e.colorSpace=xe,e}var Wo=class extends vi{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new We;t.deleteAttribute("uv");let e=new ei({side:Ne}),n=new ei,s=new ur(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ue(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let a=new yi(t,n,6),o=new Me;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let l=new ue(t,Es(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new ue(t,Es(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let d=new ue(t,Es(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);let f=new ue(t,Es(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let u=new ue(t,Es(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let h=new ue(t,Es(100));h.position.set(0,20,0),h.scale.set(1,.1,1),this.add(h)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Es(i){return new ar({color:0,emissive:16777215,emissiveIntensity:i})}var xu={outside:{target:[0,5.2,-1],yaw:-.16,pitch:.12,distance:39},panorama:{target:[0,8.5,-5],yaw:.22,pitch:.22,distance:65},bamboo:{target:[18,3.6,10],yaw:-.4,pitch:.04,distance:11.5},hall:{target:[0,3,-1],yaw:0,pitch:.1,distance:16},cabinet:{target:[0,3.35,-1.5],yaw:0,pitch:0,distance:6.5},drawer:{target:[0,3.5,-1.5],yaw:0,pitch:.04,distance:2.6}},x0=(i={})=>{let t=String(i.habitat||i.habitatLabel||i.ecology||"").toLowerCase();return/(山林|根境|forest|mountain|shanlin)/.test(t)?"forest":/(草甸|原野|草原|meadow|grassland|caodian)/.test(t)?"meadow":/(花野|芳香|花卉|flower|aromatic|huaye)/.test(t)?"flower":/(果实|种籽|果园|fruit|seed|guoshi)/.test(t)?"fruit":/(水泽|湿地|水生|wetland|water|shuize)/.test(t)?"wetland":"fungus"},v0=(i={})=>{let t=Array.isArray(i.tags)?i.tags:[],e=new Set([i.habitatLabel,"\u6DF1\u5EA6\u6761\u76EE","\u62D3\u5C55\u76EE\u5F55","\u7CBE\u9009\u6761\u76EE","\u76EE\u5F55\u6761\u76EE"]);return t.find(n=>n&&!e.has(n))||i.form||i.partUsed||"\u5F62\u6001\u5F85\u8865"};function Ii(i,t,e){let n=document.createElement("canvas");n.width=i,n.height=t;let s=n.getContext("2d");e(s,i,t);let r=new bn(n);return r.colorSpace=xe,r.anisotropy=Math.min(4,Xo||4),r.needsUpdate=!0,r}var Xo=4;function vu(i="#5b3c2b",t="#4a3023"){return Ii(512,256,(e,n,s)=>{e.fillStyle=i,e.fillRect(0,0,n,s);for(let r=0;r<110;r+=1){let a=Math.random()*s;e.globalAlpha=.04+Math.random()*.15,e.strokeStyle=Math.random()>.5?t:"#6d4a33",e.lineWidth=.8+Math.random()*2.6,e.beginPath(),e.moveTo(0,a),e.bezierCurveTo(n*.3,a+(Math.random()-.5)*20,n*.7,a+(Math.random()-.5)*24,n,a),e.stroke()}e.globalAlpha=1})}function y0(){return Ii(512,256,(i,t,e)=>{i.fillStyle="#efe2cd",i.fillRect(0,0,t,e);for(let n=0;n<180;n+=1){let s=Math.random()*t,r=Math.random()*e;i.globalAlpha=.03+Math.random()*.06,i.fillStyle=Math.random()>.5?"#d9c8ab":"#f7edda",i.beginPath(),i.arc(s,r,2+Math.random()*12,0,Math.PI*2),i.fill()}i.globalAlpha=1})}function M0(){return Ii(1024,512,(i,t,e)=>{let n=i.createLinearGradient(0,0,0,e);n.addColorStop(0,"#6e97ab"),n.addColorStop(.46,"#b6c7c4"),n.addColorStop(.74,"#e0d4bb"),n.addColorStop(1,"#f0dfc3"),i.fillStyle=n,i.fillRect(0,0,t,e);for(let s=0;s<12;s+=1){let r=Math.random()*t,a=Math.random()*e*.62,o=18+Math.random()*76,l=i.createRadialGradient(r,a,0,r,a,o);l.addColorStop(0,"rgba(255,247,229,.12)"),l.addColorStop(1,"rgba(255,247,229,0)"),i.fillStyle=l,i.beginPath(),i.arc(r,a,o,0,Math.PI*2),i.fill()}})}function S0(){return Ii(1024,1024,(i,t,e)=>{i.fillStyle="#6d7a58",i.fillRect(0,0,t,e);for(let n=0;n<320;n+=1){let s=Math.random()*t,r=Math.random()*e,a=12+Math.random()*86,o=i.createRadialGradient(s,r,0,s,r,a),l=Math.random()>.55?"#5d6a4c":"#7f8a61";o.addColorStop(0,l),o.addColorStop(1,"rgba(109,122,88,0)"),i.globalAlpha=.35,i.fillStyle=o,i.beginPath(),i.arc(s,r,a,0,Math.PI*2),i.fill()}i.globalAlpha=1;for(let n=0;n<1800;n+=1){i.strokeStyle=Math.random()>.5?"rgba(215,226,176,.07)":"rgba(50,61,43,.08)",i.lineWidth=1+Math.random()*2;let s=Math.random()*t,r=Math.random()*e;i.beginPath(),i.moveTo(s,r),i.lineTo(s+(Math.random()-.5)*12,r-4-Math.random()*10),i.stroke()}})}function b0(){return Ii(512,512,(i,t,e)=>{i.fillStyle="#8f8a80",i.fillRect(0,0,t,e);for(let n=0;n<260;n+=1)i.globalAlpha=.06+Math.random()*.12,i.fillStyle=Math.random()>.5?"#a5a196":"#6e6a63",i.beginPath(),i.ellipse(Math.random()*t,Math.random()*e,6+Math.random()*34,4+Math.random()*18,Math.random()*Math.PI,0,Math.PI*2),i.fill();i.globalAlpha=1})}function E0(){return Ii(2048,768,(i,t,e)=>{let n=i.createLinearGradient(0,0,t,e);n.addColorStop(0,"#1c1210"),n.addColorStop(.5,"#2d1d16"),n.addColorStop(1,"#150e0c"),i.fillStyle=n,i.fillRect(0,0,t,e);for(let r=0;r<260;r+=1)i.globalAlpha=.02+Math.random()*.05,i.fillStyle="#f2d8a4",i.fillRect(Math.random()*t,Math.random()*e,2+Math.random()*5,2+Math.random()*4);i.globalAlpha=1,i.strokeStyle="#d8b270",i.lineWidth=14,i.strokeRect(34,34,t-68,e-68),i.strokeStyle="rgba(244,223,171,.34)",i.lineWidth=6,i.strokeRect(76,76,t-152,e-152);let s=i.createLinearGradient(0,e*.2,0,e*.82);s.addColorStop(0,"#fff4cf"),s.addColorStop(.55,"#f5cf79"),s.addColorStop(1,"#a9762f"),i.fillStyle=s,i.font='600 375px KaiTi, STKaiti, "Noto Serif SC", SimSun, serif',i.textAlign="center",i.textBaseline="middle",i.shadowColor="rgba(0,0,0,.55)",i.shadowBlur=24,i.fillText("\u767E\u5B50\u836F\u5802",t/2,e/2-12),i.shadowBlur=0;for(let r=0;r<160;r++)i.fillStyle=r%3?"rgba(114,80,45,.35)":"rgba(12,9,7,.3)",i.fillRect(18+Math.random()*(t-36),r%2?38:e-47,4+Math.random()*22,3+Math.random()*8)})}function T0(i=[]){return Ii(12*341,1540,(r,a,o)=>{r.fillStyle="#f6ead2",r.fillRect(0,0,a,o);for(let l=0;l<120;l+=1){let c=l%12,d=Math.floor(l/12),f=c*341,u=d*154,h=i[l];r.fillStyle=l%4?"#e1d0a6":"#ebdbb8",r.fillRect(f+4,u+4,333,146),r.strokeStyle="#8a5c36",r.lineWidth=3,r.strokeRect(f+10,u+10,321,134),r.strokeStyle="rgba(138,92,54,.34)",r.lineWidth=2;for(let g=0;g<25;g++)r.fillStyle="rgba(99,69,32,.09)",r.fillRect(f+6+Math.random()*329,u+6+Math.random()*142,1+Math.random()*3,1);let p=String(h?.nameZh||"\u672C\u8349"),_=76;r.textAlign="center",r.textBaseline="middle";do{if(r.font=`600 ${_}px KaiTi, STKaiti, "Noto Serif SC", SimSun, serif`,r.measureText(p).width<=275)break;_-=4}while(_>38);r.fillStyle="#2b1c11",r.fillText(p,f+341/2,u+154/2-2)}})}async function Xv({root:i,canvas:t,items:e=[],activeHabitat:n="forest",morphology:s="all",selectedId:r="",onSelect:a,onError:o}={}){if(!i||!t||!e.length)throw new Error("Apothecary root, canvas, or catalog missing");let l=e.filter(Boolean);if(l.length>120)throw new Error("Apothecary capacity exceeded");let c=window.matchMedia("(prefers-reduced-motion: reduce)"),d=c.matches,f=window.matchMedia("(max-width: 700px)").matches,u=!0,h=new zo({canvas:t,antialias:!0,powerPreference:"high-performance"});Xo=h.capabilities.getMaxAnisotropy(),h.setPixelRatio(Math.min(window.devicePixelRatio||1,f?1.35:1.7)),h.outputColorSpace=xe,h.toneMapping=fr,h.toneMappingExposure=1.03,h.shadowMap.enabled=u,h.shadowMap.type=bi,h.shadowMap.autoUpdate=!1,h.shadowMap.needsUpdate=!0;let p=new vi;p.fog=new Ys("#a9babc",110,560);let _=new De(42,1,.08,620),g=[],m=[],y=[],b=W=>(y.push(W),W),M=(W,wt)=>{let Wt=new ei(wt);return Wt.name=W,g.push(Wt),Wt},A=await fu(y,Xo),T=Cn(A.dark_wooden_planks,y,[1.2,.18],[0,.04]),I=Cn(A.dark_wooden_planks,y,[4,3]),v=Cn(A.rough_plaster_03,y,[3,1]);delete v.map,v.normalScale.set(.12,.12);let x=Cn(A.monastery_stone_floor,y,[.26,.26],[.1,.2]),R=Cn(A.forest_ground_04,y,[4,4]),w=b(vu("#815b3e","#30231c")),P=b(vu("#513c2c","#271e18")),D=b(b0()),N=b(S0());N.wrapS=N.wrapT=zn,N.repeat.set(18,18);let F=b(M0());p.background=F;let z=b(E0()),k=b(T0(l));k.anisotropy=Math.min(8,Xo);let $={wood:M("timber",{map:w,...T,color:"#88715a",roughness:.95}),floor:M("floorboards",{map:w,...I,color:"#a49176",roughness:.94}),darkwood:M("cabinet-recesses",{map:P,...T,color:"#504437",roughness:.96}),redwood:M("red-lacquer",{map:w,...T,color:"#966d57",roughness:.85}),plaster:M("lime-plaster",{map:b(y0()),...v,color:"#d3ceba",roughness:1}),ochreWall:M("garden-red-wall",{...v,color:"#974b35",roughness:.96}),thatch:M("layered-thatch",{map:b(gu()),color:"#b7ad91",roughness:1,side:we}),straw:M("thatch-ends",{color:"#8c8265",roughness:1}),stone:M("weathered-stone",{map:D,...x,color:"#9e9f8d",roughness:.96}),ground:M("grassland",{map:N,...Cn(A.forest_ground_04,y,[50,50]),color:"#8b9873",roughness:1}),gravel:M("courtyard-gravel",{map:D,...Cn(A.monastery_stone_floor,y,[10,9]),color:"#9b9987",roughness:1}),tile:M("curved-tile-roof",{color:"#3f4442",roughness:.94,vertexColors:!0,side:we}),tileRib:M("tile-ridges",{color:"#555951",roughness:.94,vertexColors:!0}),moss:M("crevice-moss",{color:"#434d28",roughness:1}),brass:M("aged-brass",{map:b(pu()),color:"#b1a188",roughness:.56,metalness:.65}),lantern:M("red-silk",{color:"#893d2c",emissive:"#d3853c",emissiveIntensity:.13,roughness:.95}),bamboo:M("split-bamboo",{map:w,...T,color:"#afa17a",roughness:.95}),bambooGreen:M("bamboo-stems",{color:"#52663b",roughness:.73,vertexColors:!0}),bambooNode:M("bamboo-nodes",{color:"#7c8053",roughness:.86}),leaf:M("deep-leaves",{color:"#354c27",roughness:.95,side:we,vertexColors:!0}),treeLeaf:M("tree-leaves",{color:"#53653a",roughness:.95,side:we,vertexColors:!0}),herb:M("herb-leaves",{color:"#617e36",roughness:.95,side:we,vertexColors:!0}),soil:M("garden-soil",{...R,color:"#6d6150",roughness:1}),flower:M("ivory-blossoms",{color:"#ece4cb",roughness:.85,side:we}),pink:M("peach-blossoms",{color:"#cfa2a3",roughness:.9,side:we}),bark:M("tree-bark",{map:P,...Cn(A.dark_wooden_planks,y,[.2,2]),color:"#777264",roughness:1}),ceramic:M("porcelain",{color:"#e3e5d7",roughness:.28}),blue:M("porcelain-blue",{color:"#406477",roughness:.35}),mountains:[0,1,2].map(W=>{let wt=Cn(A.rough_plaster_03,y,[28,10]);return delete wt.map,wt.normalScale.set(.65,.65),M(`mountain-${W}`,{...wt,color:"#b5c4c1",vertexColors:!0,roughness:1,envMapIntensity:.12})})},et={map:b(mu()),alphaTest:.45,side:we,roughness:.92,vertexColors:!0};$.canopy=M("garden-tree-canopies",{...et,color:"#b4c090"}),$.understory=M("garden-understory",{...et,color:"#9eae72"}),$.bambooCrown=M("bamboo-leaf-sprays",{...et,map:b(_u()),color:"#e2e5c7",alphaTest:.35}),Tr($.plaster,"wall"),Tr($.ochreWall,"wall"),Tr($.stone,"stone"),Tr($.tile,"roof");let ht=new vs(h),nt=new Wo,Ct=ht.fromScene(nt,.035);p.environment=Ct.texture,p.environmentIntensity=.28,nt.dispose(),ht.dispose(),$.sign=new Kn({map:z,toneMapped:!1}),g.push($.sign);let Nt=new ds("#fff1d6",2.6);Nt.position.set(-17,26,20),Nt.target.position.set(0,0,4),Nt.castShadow=u,Nt.shadow.mapSize.set(f?1024:2048,f?1024:2048),Object.assign(Nt.shadow.camera,{near:1,far:90,left:-28,right:28,top:28,bottom:-28}),Nt.shadow.bias=-3e-4,Nt.shadow.normalBias=.035,p.add(Nt,Nt.target,new cr("#d7e0e1","#655747",1.7));let te=new ds("#ffe9c4",.95);te.position.set(0,5,12),p.add(te);let J=du({scene:p,materials:$,geometries:m,shadows:u,compact:f});i.dataset.hallBambooCulms=String(J.userData.bamboo.culms),i.dataset.hallMountainLayers=String(J.userData.mountainLayers);let it=l.map((W,wt)=>{let Wt=Math.floor(wt/40),ge=wt%40;return new L((Wt-1)*4.7-1.59+ge%4*1.06,5.47-Math.floor(ge/4)*.46,-1.6)}),rt=(W,wt)=>{m.push(W);let Wt=new yi(W,wt,l.length);return Wt.instanceMatrix.setUsage(Yl),Wt.frustumCulled=!1,p.add(Wt),Wt},Ft=M("drawer-fronts",{map:w,...T,roughness:.87,color:"#a48c70"}),St=rt(new Ss(.98,.41,.5,1,.016),Ft);St.castShadow=u,St.receiveShadow=u;let Dt=rt(new Qe(.052,.01,f?5:8,f?10:20),$.brass),pe=rt(f?new tr(.035,8):new Mi(.035,12,8),$.brass),Yt=new Kn({map:k,toneMapped:!1});g.push(Yt),Yt.onBeforeCompile=W=>{W.vertexShader=`attribute vec2 labelOffset;
`+W.vertexShader,W.vertexShader=W.vertexShader.replace("#include <uv_vertex>",`#include <uv_vertex>
vMapUv = vMapUv / vec2(12.0, 10.0) + labelOffset;`)},Yt.customProgramCacheKey=()=>"herb-label-atlas-v1";let Kt=new Te(.76,.25);Kt.setAttribute("labelOffset",new Qn(new Float32Array(l.flatMap((W,wt)=>[wt%12/12,1-(Math.floor(wt/12)+1)/10])),2));let Jt=rt(Kt,Yt),Bt=new se,he=(W,wt)=>{let Wt=it[W],ge=Wt.z+wt*.42;St.setMatrixAt(W,Bt.makeTranslation(Wt.x,Wt.y,ge)),Dt.setMatrixAt(W,Bt.makeTranslation(Wt.x,Wt.y-.145,ge+.29)),pe.setMatrixAt(W,Bt.makeTranslation(Wt.x,Wt.y-.1,ge+.254)),Jt.setMatrixAt(W,Bt.makeTranslation(Wt.x,Wt.y+.047,ge+.256))},U=()=>{for(let W of[St,Dt,pe,Jt])W.instanceMatrix.needsUpdate=!0;h.shadowMap.needsUpdate=!0},ee=new Float32Array(l.length);it.forEach((W,wt)=>he(wt,0)),U();let $t=new er(new We(1.015,.445,.51)),re=new os({color:"#ffe5a0",toneMapped:!1});m.push($t),g.push(re);let vt=new Ks($t,re);vt.visible=!1,p.add(vt);let C=i.querySelector("[data-apothecary-note]"),S=i.querySelector("[data-apothecary-mode]"),B=W=>{C&&(C.textContent=W)},q=-1,K=new Set,Z=!1,pt=0,lt=!0,Tt=1,It=1,j=0,st="outside",mt=new L,yt=new L,at={yaw:0,pitch:0,distance:40},zt=new L,O=new dr,ct=new xt,ot=()=>zt.set(mt.x+at.distance*Math.sin(at.yaw)*Math.cos(at.pitch),Math.max(.85,mt.y+at.distance*Math.sin(at.pitch)),mt.z+at.distance*Math.cos(at.yaw)*Math.cos(at.pitch)),gt=()=>i.querySelectorAll("[data-apothecary-view]").forEach(W=>{let wt=W.dataset.apothecaryView===st;W.classList.toggle("is-active",wt),W.setAttribute("aria-pressed",String(wt))}),tt=(W,wt)=>Math.max(W,wt/(2*Math.tan(ke.degToRad(_.fov/2))*_.aspect));function Y(W="outside"){W==="reset"&&(W="outside"),W==="drawer"&&q<0&&(W="cabinet");let wt=xu[W]||xu.outside;st=W;let Wt=ke.radToDeg(2*Math.atan(15.2/(2*wt.distance*_.aspect)));_.fov=W==="cabinet"?ke.clamp(Wt,62,112):W==="panorama"||W==="outside"?50:42,_.updateProjectionMatrix(),mt.fromArray(wt.target),at.yaw=wt.yaw,at.pitch=wt.pitch,at.distance=W==="cabinet"?wt.distance:tt(wt.distance,W==="panorama"?48:W==="outside"?27:W==="hall"?19:W==="bamboo"?8:2.5),W==="drawer"&&mt.copy(it[q]),i.dataset.hallView=W,gt(),B(W==="outside"?"\u5C71\u95F4\u836F\u5802 \xB7 \u7AF9\u5F71\u4E0E\u5C42\u5CE6":W==="panorama"?"\u7FA4\u5C71\u5168\u666F \xB7 \u5761\u5730\u3001\u66F2\u5F84\u4E0E\u5EAD\u9662":W==="bamboo"?"\u7AF9\u5F84\u8FD1\u89C2 \xB7 \u7AF9\u8282\u3001\u4FA7\u679D\u4E0E\u62AB\u5782\u53F6":W==="hall"?"\u6A90\u4E0B\u5165\u5802 \xB7 \u62D6\u62FD\u73AF\u89C6":W==="cabinet"?`120 \u683C\u5E38\u9A7B \xB7 \u5F53\u524D\u7B5B\u9009\u4EAE\u8D77 ${K.size} \u5473`:`${l[q].nameZh} \xB7 \u836F\u5C49\u805A\u7126`),ve()}function Mt(){K=new Set(l.filter(W=>(n==="all"||x0(W)===n)&&(s==="all"||v0(W).includes(s))).map(W=>W.id)),l.forEach((W,wt)=>{let Wt=K.has(W.id);St.setColorAt(wt,new Ot(wt===q?"#ebd9b6":Wt?"#d9c6a4":"#a89a87").multiplyScalar(.9+wt*37%17*.008)),Jt.setColorAt(wt,new Ot(Wt||wt===q?"#ffffff":"#b1b4ad"))}),St.instanceColor.needsUpdate=!0,Jt.instanceColor.needsUpdate=!0,i.dataset.hallDrawerCount=String(l.length),i.dataset.hallMatchCount=String(K.size)}function Pt(W,wt=!0){q=W,i.dataset.hallSelected=W>=0?l[W].id:"",Mt(),W>=0&&Y("drawer"),wt&&a?.(W>=0?l[W]:null),ve()}function ne(){if(q<0)return!1;let W=l[q].nameZh;return Pt(-1),B(`${W} \xB7 \u836F\u5C49\u5173\u95ED`),!0}function jt(W=performance.now()){if(pt=0,Z||document.hidden||!lt)return;let wt=Math.min((W-j)/1e3||.016,.25);j=W;let Wt=d?1:1-Math.exp(-wt*5.5);yt.lerp(mt,Wt),_.position.lerp(ot(),Wt),_.lookAt(yt);let ge=_.position.distanceToSquared(zt)>1e-5||yt.distanceToSquared(mt)>1e-5,Li=!1;for(let qe=0;qe<ee.length;qe++){let E=qe===q?1:0;Math.abs(ee[qe]-E)>.001&&(ee[qe]=d?E:ke.lerp(ee[qe],E,1-Math.exp(-wt*12)),Math.abs(ee[qe]-E)<.001&&(ee[qe]=E),he(qe,ee[qe]),Li=!0,ge||=ee[qe]!==E)}Li&&U(),vt.visible=q>=0,q>=0&&(vt.position.copy(it[q]),vt.position.z+=ee[q]*.42),h.render(p,_),i.dataset.hallDrawCalls=String(h.info.render.calls),i.dataset.hallTriangles=String(h.info.render.triangles),i.dataset.hallTextures=String(h.info.memory.textures),i.dataset.hallGeometries=String(h.info.memory.geometries),i.dataset.hallAnimating=String(ge),ge&&!d&&ve()}function ve(){!Z&&!pt&&lt&&!document.hidden&&(pt=requestAnimationFrame(jt))}let me=new Map,Se=null,Ts=W=>{W.button===0&&(t.setPointerCapture?.(W.pointerId),me.set(W.pointerId,[W.clientX,W.clientY]),me.size===1?Se={x:W.clientX,y:W.clientY,lastX:W.clientX,lastY:W.clientY,moved:!1}:Se&&(Se.moved=!0))},qo=W=>{if(!(!me.has(W.pointerId)||!Se)){if(me.size===2){let wt=[...me.values()],Wt=Math.hypot(wt[0][0]-wt[1][0],wt[0][1]-wt[1][1]);me.set(W.pointerId,[W.clientX,W.clientY]);let ge=[...me.values()],Li=Math.hypot(ge[0][0]-ge[1][0],ge[0][1]-ge[1][1]);at.distance=ke.clamp(at.distance*Wt/Math.max(1,Li),1.8,100),Se.moved=!0}else me.set(W.pointerId,[W.clientX,W.clientY]),Se.moved||=Math.hypot(W.clientX-Se.x,W.clientY-Se.y)>5,at.yaw=ke.clamp(at.yaw-(W.clientX-Se.lastX)*.004,-.9,.9),at.pitch=ke.clamp(at.pitch+(W.clientY-Se.lastY)*.003,-.08,.72);Se.lastX=W.clientX,Se.lastY=W.clientY,ve()}},ws=W=>{let wt=me.has(W.pointerId)&&me.size===1&&Se&&!Se.moved&&W.type==="pointerup";if(me.delete(W.pointerId),me.size?Se&&(Se.moved=!0):Se=null,t.releasePointerCapture?.(W.pointerId),!wt)return;if(["outside","panorama","bamboo","hall"].includes(st)){Y(st==="hall"?"cabinet":"hall");return}let Wt=t.getBoundingClientRect();ct.set((W.clientX-Wt.left)/Wt.width*2-1,1-(W.clientY-Wt.top)/Wt.height*2),O.setFromCamera(ct,_);let ge=O.intersectObject(St,!1)[0];Number.isInteger(ge?.instanceId)&&(ge.instanceId===q?ne():Pt(ge.instanceId))},wr=W=>{W.preventDefault(),at.distance=ke.clamp(at.distance*Math.exp(W.deltaY*.001),1.8,100),ve()},Rn=W=>{if(W.key==="Escape"){ne();return}if(W.key==="Enter"||W.key===" "){W.preventDefault(),Pt(q>=0?q:l.findIndex(Wt=>K.has(Wt.id)));return}let wt={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[W.key];wt&&(W.preventDefault(),Pt((Math.max(0,q)+wt+l.length)%l.length))},Pi=()=>{Tt=t.clientWidth||i.clientWidth,It=t.clientHeight||440,h.setSize(Tt,It,!1),_.aspect=Tt/It,_.updateProjectionMatrix(),Y(st),ve()},As=new ResizeObserver(Pi),Cs=new IntersectionObserver(W=>{lt=W[0].isIntersecting,lt?ve():(cancelAnimationFrame(pt),pt=0)}),ci=()=>{document.hidden?(cancelAnimationFrame(pt),pt=0):ve()},Rs=()=>{d=c.matches,ve()},Ps=[["pointerdown",Ts],["pointermove",qo],["pointerup",ws],["pointercancel",ws],["wheel",wr],["keydown",Rn],["webglcontextlost",W=>{W.preventDefault(),Ls(),o?.(new Error("WebGL context lost"))}]];Ps.forEach(([W,wt])=>t.addEventListener(W,wt,W==="wheel"?{passive:!1}:void 0)),c.addEventListener("change",Rs),document.addEventListener("visibilitychange",ci),t.tabIndex=0,t.setAttribute("aria-label","\u53E4\u98CE\u5EAD\u9662\uFF1A\u62D6\u62FD\u73AF\u89C6\uFF0C\u70B9\u51FB\u5165\u5802\uFF1B\u8FD1\u666F\u70B9\u51FB\u836F\u5C49\u3002\u65B9\u5411\u952E\u9009\u836F\uFF0CEnter \u805A\u7126\uFF0CEscape \u5173\u95ED\u3002"),Mt(),Pi(),_.position.copy(ot()),yt.copy(mt),r&&Pt(l.findIndex(W=>W.id===r),!1),i.classList.add("is-hall-ready"),document.body.classList.add("is-hall-ready"),i.dataset.hallMode="WebGL2",S&&(S.textContent="\u767E\u5B50\u836F\u5802 \xB7 120 \u683C"),As.observe(t.parentElement),Cs.observe(t),ve();function Ls(){if(!Z){Z=!0,cancelAnimationFrame(pt),As.disconnect(),Cs.disconnect(),c.removeEventListener("change",Rs),document.removeEventListener("visibilitychange",ci),Ps.forEach(([W,wt])=>t.removeEventListener(W,wt)),i.classList.remove("is-hall-ready"),document.body.classList.remove("is-hall-ready");for(let W of[St,Dt,pe,Jt])W.dispose();for(let W of new Set(m))W.dispose();for(let W of new Set(g))W.dispose();for(let W of new Set(y))W.dispose();Nt.shadow.dispose(),Ct.dispose(),h.dispose()}}return{mode:"WebGL2",setView:Y,closeDrawer:ne,dispose:Ls,focusSelected:()=>q<0?!1:(Y("drawer"),!0),update(W={}){n=W.habitat??n,s=W.morphology??s,"selectedId"in W&&Pt(l.findIndex(wt=>wt.id===W.selectedId),!1),Mt(),W.selectedId||Y("cabinet"),ve()}}}export{Xv as mountApothecaryEngine};
