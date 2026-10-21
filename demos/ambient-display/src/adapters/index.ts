// Journal-only historical preview. No network or hardware adapter is imported.
import type { FlowerAdapter } from './adapter';
import type { FlowerState, FlowerMode } from '../domain/types';
export function selectAdapter(): FlowerAdapter {
  let state: FlowerState = {
    schemaVersion: 1, transport: 'mock',
    location: {name: 'Berkeley, California', timezone: 'America/Los_Angeles'},
    forecast: {status:'sample',source:'Sunsethue',date:'2026-10-15',quality:0.39,score:39,qualityText:null,fetchedAt:null,eventTime:null},
    device: {connected:false,status:'preview'},
    mode: {desired:'display',confirmed:null,preview:'display',pending:false,error:null},
    motion:{kind:'illustration',closedDeg:5,limitDeg:165,peakDeg:109,angleMeasuredDeg:null,moveMs:3000,holdMs:1500},
    image:{src:'./sunset.png',kind:'illustration',caption:'AI-edited sunset illustration'}
  };
  const listeners = new Set<(s: FlowerState) => void>();
  const select = async (mode: FlowerMode) => {
    state={...state,mode:{...state.mode,desired:mode,preview:mode}};
    listeners.forEach(fn=>fn(state));return state;
  };
  return {kind:'mock',getState:async()=>state,setMode:select,stop:()=>select('off'),subscribe:fn=>{listeners.add(fn);return()=>{listeners.delete(fn);};}};
}
