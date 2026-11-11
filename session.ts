import {Game} from './engine';
export type Save=NonNullable<ReturnType<Game['exportSave']>>;
export function validSave(raw:unknown){const g=new Game({getContext:()=>({})} as any,'');return g.restoreSave(raw);}
// Small original synthesized effects. No recordings, network, microphone or autoplay.
export class CatAudio{
 context:AudioContext|null=null;enabled=false;notes=0;failed=false;
 async toggle(){if(this.enabled){this.enabled=false;await this.context?.suspend();return false;}try{this.context??=new AudioContext();await this.context.resume();this.enabled=true;this.play('coffee');return true;}catch{this.failed=true;return false;}}
 quiet(){if(this.enabled)void this.context?.suspend();}
 resume(){if(this.enabled)void this.context?.resume();}
 close(){this.enabled=false;void this.context?.close();}
 play(event:string){const c=this.context;if(!this.enabled||!c||c.state!=='running')return;const patterns:Record<string,number[]>={jump:[260,390],coffee:[660,880],rescue:[523,659,784,1047],hiss:[190,140],swipe:[300,150],gate:[392,523,659],boost:[330,440,660],hit:[180,110],win:[523,659,784,1047,784,1047]};const seq=patterns[event];if(!seq)return;seq.forEach((f,i)=>{const t=c.currentTime+i*.075,o=c.createOscillator(),a=c.createGain();o.type=event==='hiss'?'triangle':'sine';o.frequency.setValueAtTime(f,t);a.gain.setValueAtTime(0,t);a.gain.linearRampToValueAtTime(.055,t+.008);a.gain.exponentialRampToValueAtTime(.0001,t+.11);o.connect(a);a.connect(c.destination);o.start(t);o.stop(t+.12);this.notes++;});}
}
