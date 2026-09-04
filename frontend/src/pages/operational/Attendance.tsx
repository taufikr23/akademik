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
const SO=[{value:'HADIR',label:'Hadir',bgColor:'bg-green-100',textColor:'text-green-700',borderColor:'border-green-300'},{value:'IZIN',label:'Izin',bgColor:'bg-yellow-100',textColor:'text-yellow-700',borderColor:'border-yellow-300'},{value:'SAKIT',label:'Sakit',bgColor:'bg-blue-100',textColor:'text-blue-700',borderColor:'border-blue-300'},{value:'ALPHA',label:'Alpha',bgColor:'bg-red-100',textColor:'text-red-700',borderColor:'border-red-300'}];
const DN=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const DW=[0,1,2,3,4,5,6]; // JS day indices

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">1</span></div><h3 className="text-lg font-semibold">Pilih Kelas & Mata Pelajaran</h3></div>
    {ld?<div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"/></div>:uq.length===0?<div className="text-gray-500 bg-gray-50 p-4 rounded-lg">Tidak ada kelas</div>:
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{tc.map(c=>(<button key={c.teacher_subject_id} onClick={()=>pk(c.class_id,c.teacher_subject_id)} className={"text-left p-4 rounded-xl border-2 "+(selT===c.teacher_subject_id?"border-blue-500 bg-blue-50 shadow-md":"border-gray-200 hover:border-blue-300")}><div className="flex items-center justify-between mb-2"><span className={"text-xs font-medium px-2 py-1 rounded-lg "+(selT===c.teacher_subject_id?"bg-blue-500 text-white":"bg-gray-200 text-gray-600")}>{c.room||c.class_name}</span></div><div className="font-semibold text-gray-800">{c.subject_name}</div><div className="text-sm text-gray-500 mt-1">{c.class_name}</div>{c.day_of_week!==null&&<div className="text-xs text-gray-400 mt-1">{DN[c.day_of_week]} {c.start_time}-{c.end_time}</div>}</button>))}</div>}
    </div>
    {selC&&(<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">2</span></div><h3 className="text-lg font-semibold">Pilih Tanggal</h3></div><div className="flex items-center gap-4"><input type="date" value={selD} onChange={e=>{var d=new Date(e.target.value);var jsDay=d.getDay();var javaDay=jsDay===0?7:jsDay;if(sS&&sS.day_of_week!=null&&sS.day_of_week!==javaDay){alert("Hari ini bukan hari mengajar! Jadwal mengajar hari "+DN[sS.day_of_week||0]);return}setSelD(e.target.value);setSd(false)}} className="border-2 border-gray-200 rounded-xl px-4 py-3 font-medium focus:border-blue-500 focus:outline-none"/>{sS&&<div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl"><span className="font-medium">{sS.subject_name}</span><span className="text-sm ml-2">({sS.class_name})</span></div>}</div></div>)}
    {selC&&ent.length>0&&(<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Daftar Siswa - {sS?.class_name}</h3><div className="flex items-center gap-2"><span className="text-sm text-gray-500">Set semua:</span>{SO.map(s=><button key={s.value} onClick={()=>sa(s.value)} className={"px-3 py-1.5 rounded-lg text-xs font-medium "+s.bgColor+" "+s.textColor}>{s.label}</button>)}</div></div>
    <div className="grid grid-cols-4 gap-3 mb-6"><div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-green-600">{st.h}</div><div className="text-xs text-green-600">Hadir</div></div><div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-yellow-600">{st.i}</div><div className="text-xs text-yellow-600">Izin</div></div><div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-blue-600">{st.s}</div><div className="text-xs text-blue-600">Sakit</div></div><div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-red-600">{st.a}</div><div className="text-xs text-red-600">Alpha</div></div></div>
    <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b-2 border-gray-200"><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">No</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">NIS</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nama</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th></tr></thead><tbody>{ent.map((e,i)=>(<tr key={e.studentId} className="border-b border-gray-100 hover:bg-gray-50"><td className="py-3 px-4 text-sm text-gray-500">{i+1}</td><td className="py-3 px-4 text-sm font-mono text-gray-600">{e.studentNis}</td><td className="py-3 px-4 text-sm font-medium text-gray-800">{e.studentName}</td><td className="py-3 px-4"><div className="flex gap-2">{SO.map(s=><button key={s.value} onClick={()=>cs(e.studentId,s.value)} className={"px-3 py-2 rounded-lg text-xs font-semibold border-2 "+(e.status===s.value?s.bgColor+" "+s.textColor+" "+s.borderColor+" shadow-sm":"bg-white text-gray-400 border-gray-200")}>{s.label}</button>)}</div></td></tr>))}</tbody></table></div>
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200"><div className="flex items-center gap-3">{ex&&<span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-medium"><Clock size={14} className="inline mr-1"/>Sudah ada</span>}{sd&&<span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse"><CheckCircle size={14} className="inline mr-1"/>Berhasil!</span>}</div><button onClick={sb} disabled={sv||!selT} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md">{sv?<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Menyimpan...</>:<><Save size={18}/> Simpan Absen</>}</button></div></div>)}
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
