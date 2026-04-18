'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, BookOpen, CheckCircle, XCircle, FileText, ChevronRight, 
  Calculator, AlertCircle, RefreshCw, Save, Trash2, FileType, 
  ChevronDown, ChevronUp, Printer, Share2, Download, Users, 
  FileSpreadsheet, PlayCircle, StopCircle, ClipboardCheck, 
  GraduationCap, Globe, Book, Copy, Pencil, Search, ShieldCheck,
  Zap, Scale, Microscope, Loader2, CheckSquare, Square, Table, LayoutList, Target, BarChart3
} from 'lucide-react';

// ==========================================
// 🔧 CONFIGURATION SECTION
// ==========================================

const HARDCODED_API_KEY = ""; 
const SCHOOL_NAME = "DivVision Math";

// ==========================================

const getMimeType = (file) => {
  if (file.type && file.type !== '') return file.type;
  const extension = file.name ? file.name.split('.').pop().toLowerCase() : 'pdf';
  if (extension === 'pdf') return 'application/pdf';
  if (['jpg', 'jpeg'].includes(extension)) return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  return 'application/pdf';
};

const extractJSON = (text) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error("No data found.");
    let jsonStr = text.substring(start, end + 1);
    
    // Hard-escape for complex math symbols to prevent JSON syntax errors
    jsonStr = jsonStr.replace(/\\(?![/u"bfnrt\\])/g, '\\\\');
    jsonStr = jsonStr.replace(/\n/g, ' '); 
    
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Error:", text);
    throw new Error("Formatting Error: AI symbols were too complex. Please retry.");
  }
};

const generateContent = async (apiKey, prompt, files = []) => {
  const cleanKey = apiKey ? apiKey.trim() : "";
  const modelName = "gemini-2.0-flash-exp"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
  
  const validFiles = files.filter(f => f && f.base64);

  const payload = {
    contents: [{
      role: "user",
      parts: [{ text: prompt }, ...validFiles.map(file => ({
          inlineData: { mimeType: file.mimeType || getMimeType(file.file || {name: "unknown.pdf"}), data: file.base64 }
      }))]
    }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
  };

  const response = await fetch(url, { 
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) 
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `API Error ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!generatedText) throw new Error("No response generated.");
  return generatedText;
};

// --- Custom Components ---

const TopicalTable = ({ analysis }) => (
  <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b">
        <tr>
          <th className="p-5">Learning Objective / Subtopic</th>
          <th className="p-5 text-center">Score</th>
          <th className="p-5">Mastery Level</th>
          <th className="p-5">Strategic Focus</th>
        </tr>
      </thead>
      <tbody>
        {analysis.map((item, idx) => (
          <tr key={idx} className="border-t hover:bg-slate-50 transition-all">
            <td className="p-5 font-bold text-slate-800">{item.subtopic}</td>
            <td className="p-5 text-center tabular-nums font-black text-slate-900">{item.marks} / {item.max}</td>
            <td className="p-5">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                item.level === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 
                item.level === 'Developing' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {item.level}
              </span>
            </td>
            <td className="p-5 text-xs text-slate-500 font-medium leading-relaxed italic">{item.focus_area}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const FileUploader = ({ label, onUpload, currentFile, icon: Icon, acceptedTypes = "application/pdf,image/*", multiple = false, fileCount = 0, isUploading = false, uploadProgress = 0 }) => {
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    onUpload(files, true); 
  };

  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">{Icon && <Icon size={14} className="text-slate-300" />}{label}</div>
      </div>
      <div onClick={() => !isUploading && fileInputRef.current.click()} className={`relative border-2 border-dashed rounded-3xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${currentFile || (multiple && fileCount > 0) ? 'border-blue-500 bg-blue-50/50 shadow-inner' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'} min-h-[120px]`}>
        <input type="file" ref={fileInputRef} className="hidden" accept={acceptedTypes} multiple={multiple} onChange={handleFileChange} />
        {isUploading ? (
          <div className="text-center w-full px-6">
            <Loader2 className="animate-spin mx-auto mb-3 text-blue-500" size={28} />
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Processing: {Math.round(uploadProgress)}%</p>
          </div>
        ) : currentFile && !multiple ? (
          <div className="w-full flex flex-col items-center text-center">
            <FileType size={32} className="text-blue-600 mb-2" />
            <p className="text-[11px] text-blue-800 font-black truncate max-w-[180px]">{currentFile.file.name}</p>
            <button onClick={(e) => { e.stopPropagation(); onUpload(null); }} className="text-[10px] text-red-500 hover:underline mt-2 font-bold uppercase">Remove</button>
          </div>
        ) : multiple && fileCount > 0 ? (
           <div className="text-center">
             <div className="bg-blue-600 text-white font-black rounded-2xl w-12 h-12 flex items-center justify-center mx-auto mb-2 shadow-xl shadow-blue-200 text-lg tracking-tighter">{fileCount}</div>
             <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Evidence Set Ready</p>
           </div>
        ) : (
          <div className="text-center text-slate-300">
            <Upload className="mx-auto mb-2 opacity-40 transition-transform group-hover:-translate-y-1" size={24} />
            <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Select Files</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [mode, setMode] = useState("batch"); 
  const [assessmentCategory, setAssessmentCategory] = useState("Assignment"); 
  const [curriculum, setCurriculum] = useState("IGCSE 0580"); 
  const [selectedStrictness, setSelectedStrictness] = useState(["Medium"]); 

  const [studentNameOverride, setStudentNameOverride] = useState("");
  const [qpFile, setQpFile] = useState(null);
  const [msFile, setMsFile] = useState(null);
  const [batchQueue, setBatchQueue] = useState([]);
  
  const [isUploading, setIsUploading] = useState({ qp: false, ms: false, student: false });
  const [uploadProgress, setUploadProgress] = useState({ qp: 0, ms: 0, student: 0 });

  const [isGrading, setIsGrading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Engine Ready"); 
  const [error, setError] = useState(null);
  const [currentLevelProcessing, setCurrentLevelProcessing] = useState("");

  const toggleStrictness = (level) => {
    setSelectedStrictness(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  const processFiles = async (files, type) => {
    if (!files || files.length === 0) {
      if (type === 'qp') setQpFile(null);
      if (type === 'ms') setMsFile(null);
      if (type === 'student') setBatchQueue([]);
      return;
    }
    setIsUploading(prev => ({ ...prev, [type]: true }));
    const processedFiles = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressValue = ((i + 1) / files.length) * 100;
        await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                processedFiles.push({
                    file, preview: reader.result, base64, 
                    mimeType: getMimeType(file), id: Math.random().toString(36).substr(2, 9), status: 'pending', studentNameOverride: '', results: {} 
                });
                setUploadProgress(prev => ({ ...prev, [type]: progressValue }));
                resolve();
            };
            reader.readAsDataURL(file);
        });
    }
    if (type === 'qp') setQpFile(processedFiles[0]);
    if (type === 'ms') setMsFile(processedFiles[0]);
    if (type === 'student') setBatchQueue(processedFiles);
    setTimeout(() => { setIsUploading(prev => ({ ...prev, [type]: false })); setUploadProgress(prev => ({ ...prev, [type]: 0 })); }, 500);
  };

  const downloadReport = (item, level) => {
    const r = item.results[level]; 
    if (!r) return;
    const finalName = item.studentNameOverride || r.summary.student_name;
    const cleanText = (t) => t ? t.replace(/\$/g, '').replace(/\\/g, '').replace(/`/g, '') : '';
    const htmlContent = `
      <!DOCTYPE html><html><head><title>Audit - ${finalName}</title>
      <style>
        body{font-family:sans-serif;padding:60px;max-width:950px;margin:auto;color:#0f172a;line-height:1.6;background:#f8fafc;}
        .report-card{background:#fff;padding:60px;border-radius:40px;border:1px solid #e2e8f0;box-shadow:0 25px 50px -12px rgb(0 0 0 / 0.1);}
        .header-top{display:flex;justify-content:space-between;align-items:start;margin-bottom:50px;border-bottom:6px solid #1e40af;padding-bottom:40px;}
        .score-display{background:#1e293b;color:#fff;padding:30px 45px;border-radius:30px;text-align:center;}
        .score-val{font-size:56px;font-weight:900;margin:0;letter-spacing:-3px;}
        table{width:100%;border-collapse:collapse;margin:30px 0;background:#fff;border-radius:15px;overflow:hidden;}
        th{background:#f8fafc;padding:15px;font-size:11px;text-transform:uppercase;color:#64748b;}
        td{padding:15px;border-top:1px solid #f1f5f9;font-size:14px;}
        .print-btn { background: #1e40af; color: white; padding: 14px 28px; border: none; border-radius: 15px; cursor: pointer; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom:20px; }
        @media print { .print-btn { display: none !important; } }
      </style>
      </head><body>
        <button onclick="window.print()" class="print-btn">🖨️ Export PDF Audit</button>
        <div class="report-card">
        <div class="header-top">
            <div><h1 style="margin:0;font-size:42px;font-weight:900;letter-spacing:-2px;color:#1e40af;">${assessmentCategory} Report</h1><h2 style="color:#64748b;margin:12px 0;">${finalName}</h2>
            <div style="font-size:10px;font-weight:900;color:#1e40af;text-transform:uppercase;letter-spacing:2px;margin-top:10px;">Board: ${curriculum} • Calibration: ${level}</div>
            </div>
            <div class="score-display">
               <p style="margin:0 0 10px 0;font-size:11px;font-weight:900;opacity:0.6;text-transform:uppercase;">Verified Marks</p><h1 class="score-val">${r.summary.total_marks_awarded}/${r.summary.total_max_marks}</h1><p style="margin:10px 0 0 0;font-weight:900;font-size:16px;color:#60a5fa;">${r.summary.overall_grade_percentage}% Proficiency</p>
            </div>
        </div>
        ${r.topical_analysis ? `
        <h3>Gap Analysis Matrix</h3>
        <table>
            <thead><tr><th>Topic Area</th><th>Score</th><th>Level</th><th>Strategic Focus</th></tr></thead>
            <tbody>
                ${r.topical_analysis.map(t => `
                    <tr><td><b>${t.subtopic}</b></td><td style="text-align:center;">${t.marks}/${t.max}</td><td>${t.level}</td><td><i>${t.focus_area}</i></td></tr>
                `).join('')}
            </tbody>
        </table>` : ''}
        <div style="background:#eff6ff;padding:40px;border-radius:25px;margin:40px 0;border:1px solid #dbeafe;">
            <strong>Pedagogical Summary</strong>
            <p style="margin:15px 0 0 0;font-size:17px;font-style:italic;color:#1e3a8a;line-height:1.8;">"${cleanText(r.summary.general_comments)}"</p>
        </div>
        <div class="footer">Verified by ${SCHOOL_NAME} Auto Grader • Calibration: ${level} • ${new Date().toLocaleDateString()}</div>
      </div></body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Report_${level}_${finalName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const gradeOneFile = async (studentFile, level) => {
    const studentWrapper = studentFile.file ? studentFile : {file: studentFile, base64: studentFile.base64};
    const filesToSend = [qpFile, msFile, studentWrapper]; 
    const nameToUse = studentFile.studentNameOverride || studentNameOverride;
    
    let promptLogic = "";
    if (assessmentCategory === "Assignment") {
        promptLogic = `
        TASK: DEEP TOPICAL ASSIGNMENT AUDIT (HIGH VOLUME). 
        CONTEXT: Large pedagogical assignment. NO mark limit. Audit every single question carefully.
        SUBTOPIC MAPPING: Assign every question to its specific curriculum subtopic.
        PRECISION PROTOCOL: For every question, you MUST transcribe the student's handwritten answer FIRST into text before grading. Look twice at thin ink lines for negative signs and inequalities.
        CALIBRATION: ${level}. 
        ${level === 'Basic' ? 'Focus on legitimate effort and final answers.' : level === 'Medium' ? 'Standard step-by-step marking.' : 'Advanced precision. Penalize notation slips and lack of units.'}`;
    } else {
        promptLogic = `
        TASK: FORMAL TEST AUDIT. 
        PRECISION PROTOCOL: Transcribe handwriting before grading. Ignore header 'Max Marks'; sum every individual point manually across all pages.
        CALIBRATION: ${level}.`;
    }

    const auditPrompt = `
        ACT AS: Senior Master ${curriculum} Examiner.
        ${promptLogic}
        MANDATORY NAME: Use "${nameToUse || 'Candidate'}" as the name.
        
        OUTPUT FINAL JSON ONLY:
        {
          "summary": { "student_name": "String", "total_marks_awarded": number, "total_max_marks": number, "overall_grade_percentage": number, "general_comments": "string" },
          "topical_analysis": ${assessmentCategory === 'Assignment' ? '[ { "subtopic": "Topic Name", "marks": number, "max": number, "level": "Strong|Developing|Weak", "focus_area": "Focus text" } ]' : 'null'},
          "questions": [ { "id": "1", "marks_awarded": number, "max_marks": number, "key_mistake": "string or 'None'", "feedback": "string", "correct_answer": "string" } ]
        }`;

    const finalRes = await generateContent(HARDCODED_API_KEY, auditPrompt, filesToSend);
    const parsed = extractJSON(finalRes);
    
    // JS Manual Summation - PREVENTS 172/100 ERRORS
    if (parsed.questions && parsed.summary) {
        const actualSum = parsed.questions.reduce((acc, q) => acc + (Number(q.marks_awarded) || 0), 0);
        const actualMax = parsed.questions.reduce((acc, q) => acc + (Number(q.max_marks) || 0), 0);
        parsed.summary.total_marks_awarded = actualSum;
        parsed.summary.total_max_marks = actualMax;
        parsed.summary.overall_grade_percentage = Math.round((actualSum / (actualMax || 1)) * 10000) / 100;
    }
    return parsed;
  };

  const handleBatchProcess = async () => {
    if (!qpFile || !msFile || batchQueue.length === 0 || selectedStrictness.length === 0) return setError("Evidence or Calibration Missing");
    setIsGrading(true); setError(null);
    let queue = [...batchQueue];
    for (let i = 0; i < queue.length; i++) {
      queue[i].status = 'processing'; setBatchQueue([...queue]);
      const fileResults = {};
      for (const level of selectedStrictness) {
          setStatusMessage(`Analyzing: ${queue[i].file.name} [${level}]`);
          setCurrentLevelProcessing(level);
          try { fileResults[level] = await gradeOneFile(queue[i], level); } catch (err) { console.error(err); }
      }
      queue[i].results = fileResults;
      queue[i].status = 'done'; setBatchQueue([...queue]);
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsGrading(false); setStatusMessage("All Audits Finished!"); setCurrentLevelProcessing("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-6 no-print selection:bg-blue-100">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-10 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="flex items-center gap-5 text-blue-900">
           <div className="bg-blue-600 text-white p-3.5 rounded-3xl shadow-xl shadow-blue-100"><Calculator size={32} /></div>
           <div>
              <h1 className="font-black text-2xl tracking-tighter uppercase italic leading-none">{SCHOOL_NAME}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Universal Auto Grader</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200 flex items-center gap-3">
                <Globe size={16} className="ml-2 text-slate-400" />
                <select value={curriculum} onChange={(e) => setCurriculum(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none cursor-pointer pr-4">
                    <option value="IGCSE 0580">IGCSE 0580</option>
                    <option value="IGCSE 0606">IGCSE 0606 (Add.)</option>
                    <option value="IGCSE 0607">IGCSE 0607 (Int.)</option>
                    <option value="IB AA HL">IB AA HL</option>
                    <option value="IB AA SL">IB AA SL</option>
                    <option value="IB AI HL">IB AI HL</option>
                    <option value="IB AI SL">IB AI SL</option>
                    <option value="GCSE UK">GCSE (UK)</option>
                </select>
            </div>
            <div className="flex bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                <button onClick={() => setMode('single')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'single' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>Single Student</button>
                <button onClick={() => setMode('batch')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'batch' ? 'bg-white shadow-lg text-blue-600' : 'text-slate-500'}`}>Batch Class</button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-10">
          
          <div className="bg-slate-950 p-8 rounded-[2.5rem] shadow-2xl text-white space-y-6">
            <h2 className="font-black text-[10px] uppercase text-slate-500 tracking-widest flex items-center gap-3"><Scale size={18} className="text-blue-500"/> Calibration Engine</h2>
            <div className="grid grid-cols-1 gap-4">
                {[
                    { id: 'Basic', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-400/40', activeBg: 'bg-yellow-400/10', desc: "Attempt check & Result correctness" },
                    { id: 'Medium', icon: ShieldCheck, color: 'text-blue-400', border: 'border-blue-400/40', activeBg: 'bg-blue-400/10', desc: "Standard Formal Mark Scheme Audit" },
                    { id: 'Advanced', icon: Microscope, color: 'text-rose-400', border: 'border-rose-400/40', activeBg: 'bg-rose-400/10', desc: "Deep Pedagogical Precision" }
                ].map(level => (
                    <button 
                        key={level.id} 
                        onClick={() => toggleStrictness(level.id)}
                        className={`flex items-center gap-5 p-5 rounded-[1.5rem] border transition-all text-left group ${selectedStrictness.includes(level.id) ? `${level.border} ${level.activeBg}` : 'border-slate-800 hover:border-slate-700'}`}
                    >
                        <div className={`p-3 rounded-2xl ${selectedStrictness.includes(level.id) ? level.activeBg : 'bg-slate-900'}`}>
                           <level.icon size={22} className={level.color} />
                        </div>
                        <div className="flex-grow">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${level.color}`}>{level.id} Tool</span>
                            <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">{level.desc}</p>
                        </div>
                        {selectedStrictness.includes(level.id) ? <CheckCircle size={20} className={level.color} /> : <div className="w-5 h-5 border-2 border-slate-700 rounded-full"/>}
                    </button>
                ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <button onClick={() => setAssessmentCategory('Test')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${assessmentCategory === 'Test' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><Target size={14}/> Test</button>
                <button onClick={() => setAssessmentCategory('Assignment')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${assessmentCategory === 'Assignment' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}><BarChart3 size={14}/> Assignment</button>
            </div>
            <FileUploader label="Paper Logic (QP)" currentFile={qpFile} onUpload={(f) => processFiles(f, 'qp')} icon={FileType} isUploading={isUploading.qp} uploadProgress={uploadProgress.qp} />
            <FileUploader label="Marking Protocol (MS)" currentFile={msFile} onUpload={(f) => processFiles(f, 'ms')} icon={CheckCircle} isUploading={isUploading.ms} uploadProgress={uploadProgress.ms} />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
            <h2 className="font-black text-[10px] uppercase text-slate-400 tracking-widest flex items-center gap-3"><Users size={18}/> Submission Intake</h2>
            {mode === 'single' ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Candidate Manual ID</label>
                    <div className="relative">
                      <Pencil size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="text" value={studentNameOverride} onChange={(e) => setStudentNameOverride(e.target.value)} placeholder="Full Name..." className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" />
                    </div>
                  </div>
                  <FileUploader label="Booklet Upload" currentFile={batchQueue[0]} onUpload={(f) => processFiles(f, 'student')} icon={FileText} isUploading={isUploading.student} uploadProgress={uploadProgress.student} />
                </div>
            ) : (
                <FileUploader label="Multiple Student PDF Set" multiple fileCount={batchQueue.length} onUpload={(f) => processFiles(f, 'student')} icon={Users} isUploading={isUploading.student} uploadProgress={uploadProgress.student} />
            )}
            <button onClick={handleBatchProcess} disabled={isGrading || !qpFile || batchQueue.length === 0 || isUploading.student || selectedStrictness.length === 0} className={`w-full py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white shadow-2xl transition-all active:scale-[0.98] ${isGrading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                {isGrading ? <RefreshCw className="animate-spin inline mr-2" size={18} /> : <ShieldCheck className="inline mr-2" size={18} />}
                {isGrading ? `Analyzing [${currentLevelProcessing}]` : "Initialize All Audits"}
            </button>
            <p className="text-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 py-3 rounded-2xl">{statusMessage}</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {error && <div className="bg-rose-50 text-rose-700 p-6 rounded-[2rem] mb-10 border border-rose-100 flex items-center gap-5 animate-bounce font-bold shadow-sm"><AlertCircle size={24} /> {error}</div>}
          
          {batchQueue.length > 0 && (
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-bold text-slate-600">
                        <thead className="bg-slate-50 uppercase tracking-widest border-b text-[10px]">
                            <tr><th className="p-6">Evidence File</th><th className="p-6">Manual Identity</th><th className="p-6 text-center">Status</th><th className="p-6 text-right">Available Audits</th></tr>
                        </thead>
                        <tbody>
                            {batchQueue.map(item => (
                                <tr key={item.id} className="border-t hover:bg-slate-50 transition-all">
                                    <td className="p-6 font-black text-slate-800 truncate max-w-[200px] italic">{item.file.name}</td>
                                    <td className="p-6">
                                        <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] outline-none focus:border-blue-400" value={item.studentNameOverride} onChange={(e) => setBatchQueue(prev => prev.map(it => it.id === item.id ? {...it, studentNameOverride: e.target.value} : it))} placeholder="Manual ID..." />
                                    </td>
                                    <td className="p-6 text-center">
                                        {item.status === 'processing' ? <span className="text-blue-500 animate-pulse font-black uppercase">WORKING</span> : item.status === 'done' ? <span className="text-emerald-500 font-black uppercase">AUDITED</span> : <span className="text-slate-300 uppercase">WAITING</span>}
                                    </td>
                                    <td className="p-6 text-right space-x-3">
                                        {['Basic', 'Medium', 'Advanced'].map(lvl => (
                                            item.results && item.results[lvl] ? (
                                                <button key={lvl} onClick={() => downloadReport(item, lvl)} className={`inline-flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all hover:shadow-lg ${lvl === 'Basic' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : lvl === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                    <Download size={14} /><span className="text-[9px] font-black uppercase">{lvl}</span>
                                                </button>
                                            ) : null
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {mode === 'single' && batchQueue[0]?.results && Object.keys(batchQueue[0].results).length > 0 && (
             <div className="mt-10 space-y-16">
                {Object.keys(batchQueue[0].results).map(lvl => (
                   <div key={lvl} className="bg-white rounded-[3.5rem] shadow-2xl p-14 border border-slate-100 animate-in fade-in slide-in-from-bottom-8">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-10">
                         <div>
                            <h2 className="text-6xl font-black text-slate-800 tracking-tighter italic">{studentNameOverride || batchQueue[0].results[lvl].summary.student_name}</h2>
                            <p className="text-[11px] font-black text-blue-600 tracking-[0.5em] mt-5 uppercase">Pedagogical Audit Report • {assessmentCategory} • {lvl}</p>
                         </div>
                         <div className="text-right">
                            <div className="text-7xl font-black text-slate-900 tabular-nums leading-none tracking-tighter">{batchQueue[0].results[lvl].summary.total_marks_awarded} <span className="text-2xl text-slate-200 font-medium">/ {batchQueue[0].results[lvl].summary.total_max_marks}</span></div>
                            <div className="text-[11px] font-black text-white bg-slate-900 px-6 py-2.5 rounded-2xl mt-5 inline-block uppercase tracking-[0.2em]">{batchQueue[0].results[lvl].summary.overall_grade_percentage}% Understanding</div>
                         </div>
                      </div>
                      
                      {batchQueue[0].results[lvl].topical_analysis && <TopicalTable analysis={batchQueue[0].results[lvl].topical_analysis} />}

                      <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-200 mt-12 relative shadow-inner">
                         <LayoutList className="absolute top-8 right-8 text-slate-200" size={40} />
                         <strong className="text-[11px] font-black uppercase text-slate-400 tracking-widest block mb-5">Pedagogical Insights</strong>
                         <p className="italic text-slate-600 text-2xl leading-relaxed font-medium">"{batchQueue[0].results[lvl].summary.general_comments}"</p>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {(batchQueue.length === 0 || (mode === 'single' && !batchQueue[0]?.results)) && !isGrading && (
             <div className="bg-white rounded-[4rem] border-2 border-dashed border-slate-100 h-[750px] flex flex-col items-center justify-center text-slate-200 space-y-8 shadow-inner transition-all hover:bg-slate-50/30">
                <Calculator size={120} className="opacity-10" />
                <div className="text-center space-y-3">
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic text-slate-200">Auto Grader Ready</h3>
                    <p className="text-[11px] font-bold opacity-40 uppercase tracking-[0.4em]">Establish Context Layers to begin</p>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}