import anim from './animations.json';
export type Input={left:boolean;right:boolean;jump:boolean;stalk:boolean;dash:boolean;hiss:boolean;swipe:boolean};
const A=anim as Record<string,{row:number;n:number}>;
export class Game {
 events:string[]=[];emit(s:string){this.events.push(s);if(this.events.length>32)this.events.shift();}
 exportSave(){if(this.phase!=='play'||!this.ground||this.hp<=0||this.inv>0||this.action>0||!this.platforms.some(p=>Math.abs(this.y-p.y)<.1&&this.x>=p.x+12&&this.x<=p.x+p.w-12)||this.drones.some(d=>d.stun===0&&Math.abs(d.x-this.x)<90))return null;return {v:1,x:this.x,y:this.y,hp:this.hp,coffee:this.coffee,beans:this.beans.map(b=>b.got),kittens:this.kittens.map(k=>k.got),gates:this.gates.map(g=>g.open)};}
 restoreSave(raw:unknown){const s=raw as any;const bools=(a:any,n:number)=>Array.isArray(a)&&a.length===n&&a.every((v:any)=>typeof v==='boolean');if(!s||s.v!==1||!Number.isFinite(s.x)||!Number.isFinite(s.y)||s.x<20||s.x>2700||!Number.isInteger(s.hp)||s.hp<1||s.hp>5||!Number.isInteger(s.coffee)||s.coffee<0||s.coffee>11||!bools(s.beans,11)||!bools(s.kittens,3)||!bools(s.gates,2)||!this.platforms.some(p=>Math.abs(s.y-p.y)<.1&&s.x>=p.x+12&&s.x<=p.x+p.w-12))return false;
 this.vx=this.vy=this.action=this.cool=this.boost=this.jumpBuffer=this.coyote=0;this.ground=true;this.paused=false;this.state='idle';this.idle=0;this.lastJump=this.lastHiss=this.lastSwipe=false;Object.keys(this.input).forEach(k=>this.input[k as keyof Input]=false);this.particles=[];this.events=[];this.drones.forEach(d=>{d.x=d.origin;d.stun=0;});this.x=s.x;this.y=s.y;this.hp=s.hp;this.coffee=s.coffee;this.beans.forEach((b,i)=>b.got=s.beans[i]);this.kittens.forEach((k,i)=>k.got=s.kittens[i]);this.gates.forEach((g,i)=>g.open=s.gates[i]);this.saved=this.kittens.filter(k=>k.got).length;this.checkpoint=Math.max(65,...this.kittens.filter(k=>k.got).map(k=>k.x-40));this.camera=Math.max(0,Math.min(2260,this.x-160));this.inv=1.5;this.phase='play';this.say('חזרנו לנקודת המנוחה. הגורים זוכרים אותך!');return true;}

 c:HTMLCanvasElement;g:CanvasRenderingContext2D;atlas:HTMLImageElement;input:Input={left:false,right:false,jump:false,stalk:false,dash:false,hiss:false,swipe:false};
 x=65;y=242;vx=0;vy=0;dir=1;ground=true;time=0;phase='ready';hp=5;coffee=0;saved=0;camera=0;idle=0;state='idle';frame=0;inv=0;action=0;cool=0;boost=0;land=0;checkpoint=65;coyote=0;jumpBuffer=0;lastJump=false;lastHiss=false;lastSwipe=false;particles:any[]=[]; message='';msgTime=0; paused=false;
 platforms=[{x:0,y:242,w:560},{x:615,y:242,w:490},{x:1160,y:242,w:530},{x:1750,y:242,w:1050},{x:260,y:192,w:116},{x:435,y:155,w:105},{x:755,y:184,w:140},{x:1005,y:140,w:105},{x:1250,y:188,w:125},{x:1500,y:150,w:130},{x:1830,y:185,w:140},{x:2010,y:148,w:180},{x:2315,y:192,w:110}];
 beans=[{x:180,y:218},{x:300,y:170},{x:485,y:133},{x:790,y:160},{x:1040,y:118},{x:1300,y:166},{x:1540,y:128},{x:1850,y:163},{x:2115,y:126},{x:2350,y:170},{x:2460,y:220}].map(b=>({...b,got:false}));
 kittens=[{x:485,y:155},{x:1300,y:188},{x:2115,y:148}].map(b=>({...b,got:false}));
 drones=[{x:860,origin:860,y:224,range:110,stun:0,dir:1},{x:1440,origin:1440,y:224,range:100,stun:0,dir:-1},{x:2240,origin:2240,y:224,range:100,stun:0,dir:1}];
 gates=[{x:965,open:false},{x:1985,open:false}];
 constructor(c:HTMLCanvasElement,atlas:string){this.c=c;this.g=c.getContext('2d')!;this.atlas=new Image();this.atlas.src=atlas;this.atlas.onload=()=>this.draw();}
 start(){this.phase='play';this.say('שלושה גורים מחכים. יוצאים לדרך!');}
 say(s:string){this.message=s;this.msgTime=3;}
 spark(x:number,y:number,col:string,n=12){for(let i=0;i<n;i++)this.particles.push({x,y,vx:Math.cos(i/n*Math.PI*2)*(12+i%4*9),vy:-25-Math.sin(i/n*Math.PI*2)*24,t:.6,col});}
 hit(){if(this.inv>0)return;this.hp--;this.emit('hit');this.inv=1.5;this.action=.55;this.state='startle';this.vx=-this.dir*90;this.spark(this.x,this.y-20,'#ffadc8');if(this.hp<=0){this.phase='lost';this.say('הגורים עדיין מחכים. ננסה שוב?');}else this.say('אופס! אפשר להרחיק רובוט ברשיפה.');}
 update(dt:number){dt=Math.min(dt,.035);if(this.paused)return;this.time+=dt;if(this.phase!=='play')return;this.inv=Math.max(0,this.inv-dt);this.cool=Math.max(0,this.cool-dt);this.boost=Math.max(0,this.boost-dt);this.msgTime=Math.max(0,this.msgTime-dt);this.land=Math.max(0,this.land-dt);
 const I=this.input;this.coyote=this.ground?.1:Math.max(0,this.coyote-dt);this.jumpBuffer=I.jump&&!this.lastJump?.12:Math.max(0,this.jumpBuffer-dt);const axis=+I.right-+I.left;
 if(I.hiss&&!this.lastHiss&&this.cool===0){this.emit('hiss');this.action=.55;this.state='hiss';this.cool=1.1;this.spark(this.x+this.dir*30,this.y-20,'#8cf4e0',8);for(const d of this.drones)if(Math.abs(d.x-this.x)<115){d.stun=3.5;d.x+=this.dir*28;}this.say('פששש... הרובוטים עצרו!');}
 if(I.swipe&&!this.lastSwipe&&this.cool===0){this.emit('swipe');this.action=.38;this.state='swipe';this.cool=.5;for(const gate of this.gates)if(Math.abs(gate.x-this.x)<76&&!gate.open){gate.open=true;this.emit('gate');this.spark(gate.x,this.y-26,'#ffe9a1',20);this.say('הדרך פתוחה!');}}
 if(I.dash&&this.coffee>0&&this.boost===0){this.coffee--;this.emit('boost');this.boost=2.4;this.spark(this.x,this.y-15,'#ffdf87');this.say('אספרסו! מהירות וקפיצה משופרות.');I.dash=false;}
 if(this.action<=0){const speed=I.stalk?52:this.boost>0?205:130;const target=axis*speed;this.vx+=(target-this.vx)*Math.min(1,dt*(this.ground?13:5));if(axis)this.dir=axis;
 if(this.jumpBuffer>0&&this.coyote>0){this.emit('jump');this.jumpBuffer=0;this.coyote=0;this.vy=this.boost>0?-380:-320;this.ground=false;this.land=0;this.spark(this.x,this.y,'#a4b1c5',5);}}
 else this.action=Math.max(0,this.action-dt);
 this.lastJump=I.jump;this.lastHiss=I.hiss;this.lastSwipe=I.swipe;
 const oldY=this.y;this.vy+=760*dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.x=Math.max(20,Math.min(2700,this.x));this.ground=false;
 for(const p of this.platforms)if(this.x+11>p.x&&this.x-11<p.x+p.w&&oldY<=p.y+.5&&this.y>=p.y&&this.vy>=0){if(this.vy>100){this.land=.2;this.spark(this.x,p.y,'#8bb3b3',4);}this.y=p.y;this.vy=0;this.ground=true;}
 for(const gate of this.gates)if(!gate.open&&Math.abs(this.x-gate.x)<25&&this.y>188){this.x=gate.x+(this.vx>0?-25:25);this.vx=0;if(this.msgTime===0)this.say('ענפי חלל חוסמים. מכת כפה תפתח מעבר.');}
 if(this.y>345){this.hit();this.x=this.checkpoint;this.y=190;this.vx=this.vy=0;this.say('חוזרים לנקודת המנוחה הקרובה.');}
 for(const b of this.beans)if(!b.got&&Math.hypot(b.x-this.x,b.y-(this.y-16))<28){b.got=true;this.emit('coffee');this.coffee++;this.spark(b.x,b.y,'#ffd887');}
 for(const k of this.kittens)if(!k.got&&Math.hypot(k.x-this.x,k.y-this.y)<40){k.got=true;this.emit('rescue');this.saved++;this.hp=Math.min(5,this.hp+1);this.checkpoint=Math.max(65,k.x-40);this.spark(k.x,k.y-16,'#c3a4ff',22);this.say(`גור ${this.saved} מתוך 3 חולץ. מיאו!`);}
 for(const d of this.drones){d.stun=Math.max(0,d.stun-dt);if(d.stun===0){d.x+=d.dir*45*dt;if(Math.abs(d.x-d.origin)>d.range)d.dir*=-1;}if(d.stun===0&&Math.abs(d.x-this.x)<26&&Math.abs(d.y-this.y)<30)this.hit();}
 if(this.x>2620){if(this.saved===3){this.phase='won';this.emit('win');this.spark(this.x,this.y-30,'#ffd887',40);}else if(this.msgTime===0)this.say('מכונת הקפה מחכה לכל שלושת הגורים.');}
 this.idle=axis||!this.ground||this.action>0?0:this.idle+dt;
 if(this.action===0){if(!this.ground)this.state='jump';else if(this.land>0)this.state='jump';else if(Math.abs(this.vx)>15)this.state=I.stalk?'stalk':Math.abs(this.vx)>100?'run':'walk';else this.state=this.idle>3?'turn':'idle';}
 this.frame+=dt*(this.state==='stalk'?9:this.state==='run'?15:12);this.camera+=(Math.max(0,Math.min(2260,this.x-160))-this.camera)*Math.min(1,dt*7);
 this.particles=this.particles.filter(p=>(p.t-=dt)>0);for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;}
 }
 sprite(name:string,index:number,x:number,y:number,scale=1.6,dir=1){const a=A[name]||A.idle;const n=((Math.floor(index)%a.n)+a.n)%a.n;const g=this.g;g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir,1);g.drawImage(this.atlas,n*60,a.row*52,60,52,-30*scale,-44*scale,60*scale,52*scale);g.restore();}
 draw(){const g=this.g;if(!this.atlas.complete||!this.atlas.naturalWidth)return;g.imageSmoothingEnabled=false;g.clearRect(0,0,480,300);
 const grad=g.createLinearGradient(0,0,0,300);grad.addColorStop(0,'#0b102a');grad.addColorStop(.6,'#26234c');grad.addColorStop(1,'#39335a');g.fillStyle=grad;g.fillRect(0,0,480,300);
 for(let i=0;i<75;i++){const sx=((i*97-this.camera*.12)%500+500)%500;const sy=(i*43)%180;g.fillStyle=i%4===0?'#8fe9dd':'#686e9b';g.fillRect(sx,sy,i%4===0?2:1,i%4===0?2:1);}
 g.fillStyle='#5b477c';g.beginPath();g.arc(375-this.camera*.035,74,38,0,7);g.fill();g.fillStyle='#8a6d99';g.fillRect(345-this.camera*.035,55,39,3);g.fillStyle='#c9a9bb';g.fillRect(351-this.camera*.035,64,19,3);
 // Distant observatory and mountains move slower than the playable world.
 for(let i=-1;i<9;i++){const xx=i*115-this.camera*.25%115;g.fillStyle=i%2?'#302c54':'#292847';g.beginPath();g.moveTo(xx,242);g.lineTo(xx+56,125+i%3*17);g.lineTo(xx+130,242);g.fill();}
 g.save();g.translate(-Math.floor(this.camera),0);
 for(let i=0;i<29;i++){const x=i*101+18;g.fillStyle='#414362';g.fillRect(x,218,5,24);g.fillStyle='#637c86';g.fillRect(x-6,214,18,5);g.fillStyle='#88c1b3';g.fillRect(x-2,211,9,4);}
 for(const p of this.platforms){g.fillStyle='#202b40';g.fillRect(p.x,p.y,p.w,70);g.fillStyle='#64777e';g.fillRect(p.x,p.y,p.w,6);g.fillStyle='#96c8b5';g.fillRect(p.x,p.y,p.w,2);for(let j=10;j<p.w;j+=29){g.fillStyle='#334452';g.fillRect(p.x+j,p.y+16,15,5);g.fillStyle='#3c5160';g.fillRect(p.x+j+9,p.y+38,4,8);}}
 // Landing pad, safe home and espresso machine.
 for(const x of [65,1240,2580]){g.fillStyle='#4f5d78';g.fillRect(x-20,238,70,4);g.fillStyle='#87e2cf';g.fillRect(x-17,238,64,1);}
 for(const b of this.beans)if(!b.got){const yy=b.y+Math.sin(this.time*3+b.x)*3;g.fillStyle='#584261';g.fillRect(b.x-7,yy-8,16,18);g.fillStyle='#ffcc84';g.fillRect(b.x-5,yy-6,11,13);g.fillStyle='#63482d';g.fillRect(b.x,yy-5,2,10);g.fillStyle='#fff0ba';g.fillRect(b.x-3,yy-5,2,3);}
 for(const k of this.kittens)if(!k.got){g.strokeStyle='#c2a0ef';g.strokeRect(k.x-17,k.y-42,34,40);g.fillStyle='#bf9ee6';g.fillRect(k.x-18,k.y-44,36,4);this.sprite('sit',0,k.x,k.y,1,1);g.fillStyle='#ffe9a1';g.fillRect(k.x-2,k.y-51+Math.sin(this.time*4)*2,4,4);}
 for(const gate of this.gates)if(!gate.open){g.strokeStyle='#b3a2d8';g.lineWidth=6;g.beginPath();g.moveTo(gate.x-8,242);g.lineTo(gate.x+9,214);g.lineTo(gate.x-6,190);g.stroke();g.fillStyle='#cbe8a5';for(let i=0;i<4;i++)g.fillRect(gate.x+(i%2?4:-10),194+i*12,12,5);}
 for(const d of this.drones){const yy=d.y-13+Math.sin(this.time*5)*2;g.fillStyle=d.stun>0?'#6b7591':'#d790ad';g.fillRect(d.x-15,yy-8,30,15);g.fillStyle='#363f62';g.fillRect(d.x-10,yy-4,20,6);g.fillStyle=d.stun>0?'#8be5d5':'#ffe2ab';g.fillRect(d.x-5,yy-3,3,3);g.fillRect(d.x+3,yy-3,3,3);g.fillStyle='#8078a7';g.fillRect(d.x-21,yy-11,14,3);g.fillRect(d.x+8,yy-11,14,3);if(d.stun>0){g.fillStyle='#ffe9a1';g.fillText('z z',d.x-10,yy-19);}}
 g.fillStyle='#6b7692';g.fillRect(2640,180,47,62);g.fillStyle='#c0b5cb';g.fillRect(2636,176,55,8);g.fillStyle='#182a3c';g.fillRect(2648,191,31,27);g.fillStyle=this.saved===3?'#9cf2d9':'#a2a3ba';g.fillRect(2654,197,19,4);g.fillStyle='#ffe8b3';g.fillRect(2658,220,13,10);g.fillStyle='#8be5d5';g.fillRect(2645,234,36,3);
 g.fillStyle='#a1a9c8';g.font='9px monospace';for(const [x,s] of [[80,'OBSERVATORY 07'],[1190,'MOON GARDEN'],[2460,'ESPRESSO STATION']] as [number,string][]){g.fillText(s,x,115);}
 let fi=this.frame;if(this.state==='jump'){if(this.land>0)fi=16+(1-this.land/.2)*7;else fi=this.vy<0?4+Math.min(5,(-this.vy/290)*4):10+Math.min(5,this.vy/250*5);}if(this.state==='turn')fi=Math.min(4,(this.idle-3)*3)%5;
 if(this.inv===0||Math.floor(this.inv*12)%2===0)this.sprite(this.state,fi,this.x,this.y,1.6,this.state==='turn'?1:this.dir);
 if(this.boost>0){g.fillStyle='#ffce87';g.fillRect(this.x-this.dir*28,this.y-16,5,3);}
 for(const p of this.particles){g.fillStyle=p.col;g.globalAlpha=Math.max(0,p.t/.6);g.fillRect(p.x,p.y,3,3);}g.globalAlpha=1;g.restore();
 if(this.phase==='ready'||this.phase==='won'||this.phase==='lost'){g.fillStyle='#0b102acc';g.fillRect(0,0,480,300);}
 }
 snapshot(){return {phase:this.phase,x:Math.round(this.x),y:Math.round(this.y),hp:this.hp,coffee:this.coffee,saved:this.saved,state:this.state,ground:this.ground,gates:this.gates.map(g=>g.open),stunned:this.drones.filter(d=>d.stun>0).length};}
  }
