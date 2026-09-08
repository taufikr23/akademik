import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { attendanceService } from "../../services/attendanceService";
import { BookOpen, ChevronRight, ChevronDown, CheckCircle2, XCircle, MinusCircle } from "lucide-react";

const SB: Record<string, {bg:string;text:string;icon:any}> = {
  HADIR: {bg:"bg-emerald-900/40",text:"text-emerald-400",icon:<CheckCircle2 size={14}/>},
  IZIN: {bg:"bg-yellow-900/40",text:"text-yellow-400",icon:<MinusCircle size={14}/>},
  SAKIT: {bg:"bg-primary-900/40",text:"text-primary-300",icon:<MinusCircle size={14}/>},
  ALPHA: {bg:"bg-red-900/40",text:"text-red-400",icon:<XCircle size={14}/>},
};

export default function StudentAttendanceView() {
  const { user } = useAuth();
  const [sum, setSum] = useState<any[]>([]);
  const [sel, setSel] = useState<any>(null);
  const [hist, setHist] = useState<any[]>([]);
  const [ld, setLd] = useState(true);
  const [hl, setHl] = useState(false);
  useEffect(()=>{ldS()},[user]);
  async function ldS(){setLd(true);try{var r=await import("../../api/client").then(function(m){return m.default.get("/api/students")});var ss=Array.isArray(r.data)?r.data:[];var me=ss.find(function(s:any){return s.nis===user?.username||s.userId===user?.id});if(me){var res=await attendanceService.getStudentSummary(me.id);setSum(res.data)}}catch(e){console.error(e)}finally{setLd(false)}}
  async function ldH(ts:any){setSel(ts);setHl(true);try{var r=await import("../../api/client").then(function(m){return m.default.get("/api/students")});var ss=Array.isArray(r.data)?r.data:[];var me=ss.find(function(s:any){return s.nis===user?.username||s.userId===user?.id});if(me){var res=await attendanceService.getStudentSubjectAttendance(me.id,ts.teacher_subject_id);setHist(res.data)}}catch(e){console.error(e)}finally{setHl(false)}}
  var tot=sum.reduce(function(a:any,s:any){return{hadir:a.hadir+(Number(s.hadir)||0),izin:a.izin+(Number(s.izin)||0),sakit:a.sakit+(Number(s.sakit)||0),alpha:a.alpha+(Number(s.alpha)||0)}},{hadir:0,izin:0,sakit:0,alpha:0});
  if(ld)return(<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary-700 border-t-primary-400 rounded-full animate-spin"/></div>);
  return(<div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-emerald-400">{tot.hadir}</div><div className="text-sm text-emerald-400 font-medium mt-1">Hadir</div></div>
    <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-yellow-400">{tot.izin}</div><div className="text-sm text-yellow-400 font-medium mt-1">Izin</div></div>
    <div className="bg-primary-900/30 border border-primary-700 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-primary-300">{tot.sakit}</div><div className="text-sm text-primary-300 font-medium mt-1">Sakit</div></div>
    <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-red-400">{tot.alpha}</div><div className="text-sm text-red-400 font-medium mt-1">Alpha</div></div>
  </div><div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6"><h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2"><BookOpen size={20} className="text-primary-300"/> Absensi Per Mata Pelajaran</h3>
  {sum.length===0?<div className="bg-slate-700/50 rounded-xl p-8 text-center"><p className="text-slate-400">Belum ada data absensi</p></div>:<div className="space-y-3">{sum.map(function(ts:any){var t=Number(ts.hadir)+Number(ts.izin)+Number(ts.sakit)+Number(ts.alpha);var r=t>0?Math.round(Number(ts.hadir)/t*100):0;var iS=sel?.teacher_subject_id===ts.teacher_subject_id;return(<div key={ts.teacher_subject_id} className="border border-slate-700 rounded-xl overflow-hidden"><button onClick={function(){iS?setSel(null):ldH(ts)}} className="w-full text-left p-4 hover:bg-slate-700/50 transition-colors flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-900/40 rounded-xl flex items-center justify-center"><BookOpen size={20} className="text-primary-300"/></div><div><h4 className="font-semibold text-slate-100">{ts.subject_name}</h4><p className="text-sm text-slate-400">{ts.teacher_name} - {ts.class_name}</p></div></div><div className="flex items-center gap-4"><div className="flex items-center gap-2 text-xs"><span className="bg-emerald-900/40 text-emerald-400 px-2 py-1 rounded-full">{ts.hadir} Hadir</span><span className="bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded-full">{ts.izin} Izin</span><span className="bg-primary-900/40 text-primary-300 px-2 py-1 rounded-full">{ts.sakit} Sakit</span><span className="bg-red-900/40 text-red-400 px-2 py-1 rounded-full">{ts.alpha} Alpha</span></div><span className={"font-bold text-lg "+(r>=80?"text-emerald-400":r>=50?"text-yellow-400":"text-red-400")}>{r}%</span>{iS?<ChevronDown size={20} className="text-slate-400"/>:<ChevronRight size={20} className="text-slate-400"/>}</div></button>
  {iS&&<div className="border-t border-slate-700 bg-slate-700/50 p-4">{hl?<div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-primary-700 border-t-primary-400 rounded-full animate-spin"/></div>:hist.length===0?<p className="text-slate-400 text-center py-4">Belum ada riwayat</p>:<div className="space-y-2">{hist.map(function(h:any){var b=SB[h.status]||SB.ALPHA;return(<div key={h.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 border border-slate-700"><div className="flex items-center gap-3"><div className="text-sm font-mono text-slate-400 min-w-[100px]">{new Date(h.date).toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div><span className={"flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium "+b.bg+" "+b.text}>{b.icon} {h.status}</span>{h.room&&<span className="text-xs text-slate-500">Ruang: {h.room}</span>}</div>{h.notes&&<span className="text-xs text-slate-400">{h.notes}</span>}</div>);})}</div>}</div>}</div>);})}</div>}</div></div>);
}
