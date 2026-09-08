import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import { attendanceService } from '../../services/attendanceService';
import { teacherService } from '../../services/academicService';
import { Save, CheckCircle, Clock } from 'lucide-react';
import StudentAttendanceView from './StudentAttendanceView';

interface TeacherClass { teacher_subject_id:number;class_id:number;class_name:string;subject_id:number;subject_name:string;day_of_week:number|null;start_time:string|null;end_time:string|null;room:string|null; }
interface Student { id:number;nis:string;nisn:string;full_name:string;gender:string;phone:string; }
interface SAE { studentId:number;studentName:string;studentNis:string;status:string; }
const SO=[{value:'HADIR',label:'Hadir',bgColor:'bg-emerald-900/40',textColor:'text-emerald-400',borderColor:'border-emerald-600'},{value:'IZIN',label:'Izin',bgColor:'bg-yellow-900/40',textColor:'text-yellow-400',borderColor:'border-yellow-600'},{value:'SAKIT',label:'Sakit',bgColor:'bg-primary-900/40',textColor:'text-primary-300',borderColor:'border-primary-600'},{value:'ALPHA',label:'Alpha',bgColor:'bg-red-900/40',textColor:'text-red-400',borderColor:'border-red-600'}];
const DN=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const DW=[0,1,2,3,4,5,6];

function TAV() {
  const { user } = useAuth();
  const [tc,setTc]=useState<TeacherClass[]>([]);
  const [selC,setSelC]=useState<number|null>(null);
  const [selT,setSelT]=useState<number|null>(null);
  const [selD,setSelD]=useState(()=>new Date().toISOString().split("T")[0]);
  const [ent,setEnt]=useState<SAE[]>([]);
  const [ld,setLd]=useState(true);
  const [sv,setSv]=useState(false);
  const [sd,setSd]=useState(false);
  const [ex,setEx]=useState(false);

  useEffect(()=>{loadData()},[user]);
  async function loadData(){setLd(true);try{var tr=await teacherService.getAll();var ts=tr.data;var me=ts.find((t:any)=>t.nip===user?.username||t.userId===user?.id);if(me){var r=await attendanceService.getTeacherClasses(me.id);setTc(r.data)}}catch(e){console.error(e)}finally{setLd(false)}}
  const uq=useMemo(()=>{var m=new Map<number,TeacherClass[]>();tc.forEach(c=>{var e=m.get(c.class_id)||[];e.push(c);m.set(c.class_id,e)});return Array.from(m.entries()).map(([id,cs])=>({id,nm:cs[0].class_name,sb:cs}))},[tc]);
  useEffect(()=>{if(selC)ldS(selC)},[selC,selD]);
  async function ldS(cid:number){try{var r=await attendanceService.getClassStudents(cid);var ss=r.data;var tsId=selT||tc.find(c=>c.class_id===cid)?.teacher_subject_id;if(tsId&&selD){try{var ar=await attendanceService.getClassAttendance(cid,tsId,selD);if(ar.data?.studentAttendances?.length>0){setEnt(ar.data.studentAttendances.map((s:any)=>({studentId:s.studentId,studentName:s.studentName,studentNis:s.studentNis,status:s.status})));setEx(true);return}}catch{}}setEnt(ss.map((s:Student)=>({studentId:s.id,studentName:s.full_name,studentNis:s.nis,status:"ALPHA"})));setEx(false)}catch(e){console.error(e)}}
  function pk(c:number,t:number){setSelC(c);setSelT(t);setSd(false);setEx(false);var ts=tc.find(x=>x.teacher_subject_id===t);if(ts&&ts.day_of_week){var now=new Date();var curDay=now.getDay();var javaDay=curDay===0?7:curDay;var diff=ts.day_of_week-javaDay;if(diff<=0)diff+=7;var next=new Date(now);next.setDate(next.getDate()+diff);setSelD(next.toISOString().split("T")[0]);}}
  function cs(sid:number,st:string){setEnt(p=>p.map(e=>e.studentId===sid?{...e,status:st}:e))}
  function sa(st:string){setEnt(p=>p.map(e=>({...e,status:st})))}
  async function sb(){if(!selC||!selT||!selD)return;setSv(true);setSd(false);try{await attendanceService.batchSubmit({teacherSubjectId:selT,classId:selC,date:selD,attendances:ent.map(e=>({studentId:e.studentId,status:e.status}))});setSd(true);setEx(true);setTimeout(()=>setSd(false),3000)}catch(e:any){alert(e?.response?.data?.message||"Gagal menyimpan")}finally{setSv(false)}}
  const st=useMemo(()=>({h:ent.filter(e=>e.status==="HADIR").length,i:ent.filter(e=>e.status==="IZIN").length,s:ent.filter(e=>e.status==="SAKIT").length,a:ent.filter(e=>e.status==="ALPHA").length,t:ent.length}),[ent]);
  const sS=tc.find(c=>c.teacher_subject_id===selT);
  return(<div className="space-y-6">
    <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6"><div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-primary-900/40 rounded-lg flex items-center justify-center"><span className="text-primary-300 font-bold text-sm">1</span></div><h3 className="text-lg font-semibold text-slate-100">Pilih Kelas & Mata Pelajaran</h3></div>
    {ld?<div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary-700 border-t-primary-400 rounded-full animate-spin"/></div>:uq.length===0?<div className="text-slate-400 bg-slate-700/50 p-4 rounded-lg">Tidak ada kelas</div>:
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{tc.map(c=>(<button key={c.teacher_subject_id} onClick={()=>pk(c.class_id,c.teacher_subject_id)} className={"text-left p-4 rounded-xl border-2 "+(selT===c.teacher_subject_id?"border-primary-500 bg-primary-900/30 shadow-lg shadow-black/20":"border-slate-700 hover:border-primary-600")}><div className="flex items-center justify-between mb-2"><span className={"text-xs font-medium px-2 py-1 rounded-lg "+(selT===c.teacher_subject_id?"bg-primary-500 text-white":"bg-slate-700 text-slate-400")}>{c.room||c.class_name}</span></div><div className="font-semibold text-slate-200">{c.subject_name}</div><div className="text-sm text-slate-400 mt-1">{c.class_name}</div>{c.day_of_week!==null&&<div className="text-xs text-slate-500 mt-1">{DN[c.day_of_week]} {c.start_time}-{c.end_time}</div>}</button>))}</div>}
    </div>
    {selC&&(<div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6"><div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-primary-900/40 rounded-lg flex items-center justify-center"><span className="text-primary-300 font-bold text-sm">2</span></div><h3 className="text-lg font-semibold text-slate-100">Pilih Tanggal</h3></div><div className="flex items-center gap-4"><input type="date" value={selD} onChange={e=>{var d=new Date(e.target.value);var jsDay=d.getDay();var javaDay=jsDay===0?7:jsDay;if(sS&&sS.day_of_week!=null&&sS.day_of_week!==javaDay){alert("Hari ini bukan hari mengajar! Jadwal mengajar hari "+DN[sS.day_of_week||0]);return}setSelD(e.target.value);setSd(false)}} className="bg-slate-800 text-slate-100 border-2 border-slate-700 rounded-xl px-4 py-3 font-medium focus:border-primary-500 focus:outline-none"/>{sS&&<div className="bg-primary-900/30 text-primary-300 px-4 py-3 rounded-xl"><span className="font-medium">{sS.subject_name}</span><span className="text-sm ml-2">({sS.class_name})</span></div>}</div></div>)}
    {selC&&ent.length>0&&(<div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-slate-100">Daftar Siswa - {sS?.class_name}</h3><div className="flex items-center gap-2"><span className="text-sm text-slate-400">Set semua:</span>{SO.map(s=><button key={s.value} onClick={()=>sa(s.value)} className={"px-3 py-1.5 rounded-lg text-xs font-medium "+s.bgColor+" "+s.textColor}>{s.label}</button>)}</div></div>
    <div className="grid grid-cols-4 gap-3 mb-6"><div className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-emerald-400">{st.h}</div><div className="text-xs text-emerald-400">Hadir</div></div><div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-yellow-400">{st.i}</div><div className="text-xs text-yellow-400">Izin</div></div><div className="bg-primary-900/30 border border-primary-700 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-primary-300">{st.s}</div><div className="text-xs text-primary-300">Sakit</div></div><div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-red-400">{st.a}</div><div className="text-xs text-red-400">Alpha</div></div></div>
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b-2 border-slate-700"><th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">No</th><th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">NIS</th><th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Nama</th><th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Status</th></tr></thead><tbody>{ent.map((e,i)=>(<tr key={e.studentId} className="border-b border-slate-700 hover:bg-slate-700/50"><td className="py-3 px-4 text-sm text-slate-400">{i+1}</td><td className="py-3 px-4 text-sm font-mono text-slate-400">{e.studentNis}</td><td className="py-3 px-4 text-sm font-medium text-slate-200">{e.studentName}</td><td className="py-3 px-4"><div className="flex gap-2">{SO.map(s=><button key={s.value} onClick={()=>cs(e.studentId,s.value)} className={"px-3 py-2 rounded-lg text-xs font-semibold border-2 "+(e.status===s.value?s.bgColor+" "+s.textColor+" "+s.borderColor+" shadow-lg shadow-black/20":"bg-slate-800 text-slate-500 border-slate-700")}>{s.label}</button>)}</div></td></tr>))}</tbody></table></div>
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700"><div className="flex items-center gap-3">{ex&&<span className="bg-yellow-900/40 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-medium"><Clock size={14} className="inline mr-1"/>Sudah ada</span>}{sd&&<span className="bg-emerald-900/40 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse"><CheckCircle size={14} className="inline mr-1"/>Berhasil!</span>}</div><button onClick={sb} disabled={sv||!selT} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg shadow-black/20">{sv?<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Menyimpan...</>:<><Save size={18}/> Simpan Absen</>}</button></div></div>)}
  </div>);
}

export default function Attendance() {
  const { user } = useAuth();
  const isStudent = user?.role === "SISWA";
  return(<div className="min-h-screen">
    <PageHeader title={isStudent?"Presensi Saya":"Presensi Siswa"} subtitle={isStudent?"Lihat rekap absen di setiap mata pelajaran":"Absen kehadiran siswa"}/>
    <div className="mt-6">{isStudent?<StudentAttendanceView/>:<TAV/>}</div>
  </div>);
}
