import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { attendanceService } from "../../services/attendanceService";
import { BookOpen, ChevronRight, ChevronDown, CheckCircle2, XCircle, MinusCircle } from "lucide-react";

const SB: Record<string, {bg:string;text:string;icon:any}> = {
  HADIR: {bg:"bg-green-100",text:"text-green-700",icon:<CheckCircle2 size={14}/>},
  IZIN: {bg:"bg-yellow-100",text:"text-yellow-700",icon:<MinusCircle size={14}/>},
  SAKIT: {bg:"bg-blue-100",text:"text-blue-700",icon:<MinusCircle size={14}/>},
  ALPHA: {bg:"bg-red-100",text:"text-red-700",icon:<XCircle size={14}/>},
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
  if(ld)return(<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/></div>);
  return(<div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-600">{tot.hadir}</div><div className="text-sm text-green-600 font-medium mt-1">Hadir</div></div>
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-yellow-600">{tot.izin}</div><div className="text-sm text-yellow-600 font-medium mt-1">Izin</div></div>
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-blue-600">{tot.sakit}</div><div className="text-sm text-blue-600 font-medium mt-1">Sakit</div></div>
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-red-600">{tot.alpha}</div><div className="text-sm text-red-600 font-medium mt-1">Alpha</div></div>
  </div><div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen size={20} className="text-blue-600"/> Absensi Per Mata Pelajaran</h3>
  {sum.length===0?<div className="bg-gray-50 rounded-xl p-8 text-center"><p className="text-gray-500">Belum ada data absensi</p></div>:<div className="space-y-3">{sum.map(function(ts:any){var t=Number(ts.hadir)+Number(ts.izin)+Number(ts.sakit)+Number(ts.alpha);var r=t>0?Math.round(Number(ts.hadir)/t*100):0;var iS=sel?.teacher_subject_id===ts.teacher_subject_id;return(<div key={ts.teacher_subject_id} className="border border-gray-200 rounded-xl overflow-hidden"><button onClick={function(){iS?setSel(null):ldH(ts)}} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><BookOpen size={20} className="text-blue-600"/></div><div><h4 className="font-semibold text-gray-900">{ts.subject_name}</h4><p className="text-sm text-gray-500">{ts.teacher_name} - {ts.class_name}</p></div></div><div className="flex items-center gap-4"><div className="flex items-center gap-2 text-xs"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">{ts.hadir} Hadir</span><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{ts.izin} Izin</span><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{ts.sakit} Sakit</span><span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">{ts.alpha} Alpha</span></div><span className={"font-bold text-lg "+(r>=80?"text-green-600":r>=50?"text-yellow-600":"text-red-600")}>{r}%</span>{iS?<ChevronDown size={20}/>:<ChevronRight size={20}/>}</div></button>
  {iS&&<div className="border-t border-gray-100 bg-gray-50 p-4">{hl?<div className="flex justify-center py-4"><div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/></div>:hist.length===0?<p className="text-gray-500 text-center py-4">Belum ada riwayat</p>:<div className="space-y-2">{hist.map(function(h:any){var b=SB[h.status]||SB.ALPHA;return(<div key={h.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100"><div className="flex items-center gap-3"><div className="text-sm font-mono text-gray-500 min-w-[100px]">{new Date(h.date).toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</div><span className={"flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium "+b.bg+" "+b.text}>{b.icon} {h.status}</span>{h.room&&<span className="text-xs text-gray-400">Ruang: {h.room}</span>}</div>{h.notes&&<span className="text-xs text-gray-500">{h.notes}</span>}</div>);})}</div>}</div>}</div>);})}</div>}</div></div>);
}