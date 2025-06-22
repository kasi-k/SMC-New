import{u as F,r,j as e,A,y as p,b as D,c as V}from"./index-74p-botU.js";const q=()=>{const m=F(),g=5,[l,i]=r.useState([{sub:""}]),[o,b]=r.useState("4"),[n,j]=r.useState("Text & Image Course"),[$,E]=r.useState(!1),[y,c]=r.useState(!1),[I,G]=r.useState(""),[L,P]=r.useState([]),[O,J]=r.useState(0),h=s=>{b(s.target.value)},x=s=>{j(s.target.value)},N=()=>{m("/viewcourse")};let w=(s,t)=>{let a=[...l];a[s][t.target.name]=t.target.value,i(a)},v=()=>{l.length<g?i([...l,{sub:""}]):p.error("You can only add 5 sub topics")},C=()=>{let s=[...l];s.pop(),i(s)};const T=s=>{s.preventDefault();const t=[];c(!0),l.forEach(u=>{t.push(u.sub)});const a=document.getElementById("topic1").value;if(!a.trim()){c(!1),p.error("Please fill in all required fields");return}if(t.length===0){c(!1),p.error("Please fill in all required fields");return}const d=`Generate a list of Strict ${o} topics and any number sub topic for each topic for main title ${a.toLowerCase()}, everything in single line. Those ${o} topics should Strictly include these topics :- ${t.join(", ").toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
        "${a.toLowerCase()}": [
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   },
   {
   "title": "Topic Title",
   "subtopics": [
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    },
    {
    "title": "Sub Topic Title",
    "theory": "",
    "youtube": "",
    "image": "",
    "done": false
    }
   ]
   }
  ]
  }`;S(d,a,n)};async function S(s,t,a){const d={prompt:s};try{const k=(await D.post(`${V}/api/prompt`,d)).data.generatedText.replace(/```json/g,"").replace(/```/g,"");try{const f=JSON.parse(k);c(!1),m("/topics",{state:{jsonData:f,mainTopic:t.toLowerCase(),type:a.toLowerCase()}})}catch{}}catch{}}return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"flex justify-end mx-1 my-2",children:e.jsx("button",{onClick:N,className:" font-extralight bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-1 px-2",children:"View Own Courses"})}),e.jsx("hr",{}),e.jsxs("div",{className:"my-5 text-white font-poppins ",children:[e.jsx("p",{className:"text-center font-extralight",children:"Generate Course"}),e.jsx("form",{onSubmit:T,children:e.jsxs("div",{className:" grid grid-cols-12 gap-3 mx-10 mt-6",children:[e.jsxs("div",{className:"lg:col-span-6 md:col-span-6 col-span-12",children:[e.jsx("p",{className:"text-sm font-extralight",children:"Type the topic on which you want to Generate course."}),e.jsxs("div",{className:"flex flex-col py-8 gap-1",children:[e.jsxs("label",{htmlFor:"topic1",value:"Topic",children:["Course Topic ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsx("input",{type:"text",placeholder:"Enter Topic",id:"topic1",className:"py-2 px-4  rounded-md  text-black shadow-md outline-none lg:w-3/4 md:w-full w-full"})]}),e.jsx("p",{className:"text-sm font-extralight",children:"Select the number of Subtopics you want this course to be spread across."}),e.jsxs("p",{className:"text-lg py-2",children:["No of Subtopic ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsxs("div",{className:"flex flex-col space-y-4",children:[e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value",id:"4",value:"4",onChange:h,checked:o==="4",className:"hidden peer"}),e.jsxs("label",{htmlFor:"4",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${o==="4"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"5"})]})]}),e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value",id:"7",value:"7",onChange:h,checked:o==="7",className:"hidden peer"}),e.jsxs("label",{htmlFor:"7",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${o==="7"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"10"})]})]})]}),e.jsx("p",{className:"text-sm font-extralight py-5",children:"You can enter a list of subtopics, which are the specifics you want to learn. You can leave this blank if you want our AI to generate the Sub Topics."}),e.jsxs("div",{className:"flex flex-col py-1 gap-1 ",children:[e.jsxs("label",{htmlFor:"subtopic",value:"Sub Topic",className:"text-lg",children:["Enter Subtopic",e.jsx("span",{className:"text-red-600",children:"*"})]}),l.map((s,t)=>e.jsx("div",{children:e.jsx("input",{name:"sub",value:s.sub,onChange:a=>w(t,a),className:"py-2 px-4 rounded-md text-black shadow-md outline-none lg:w-3/4 md:w-full w-full my-1",placeholder:"Enter Subtopic",type:"text"})},t)),e.jsxs("div",{className:" flex flex-wrap gap-3 ",children:[e.jsx("p",{className:` text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2]  py-2.5 ${l.length<=1,"lg:w-3/4 md:w-full w-full"}`,onClick:()=>v(),children:"Add Subtopic"}),l.length>1&&e.jsx("p",{className:" text-base text-center bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-3/4 md:w-full w-full  py-2.5 ",onClick:()=>C(),children:"Remove Subtopic"})]})]})]}),e.jsxs("div",{className:" lg:col-span-6 md:col-span-6 col-span-12 lg:mx-10 md:mx-10",children:[e.jsx("p",{className:"text-sm font-extralight",children:"Choose your course content type"}),e.jsxs("p",{className:"text-lg py-2",children:["Course Type ",e.jsx("span",{className:"text-red-600",children:"*"})]}),e.jsxs("div",{className:"flex flex-col space-y-4",children:[e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value1",id:"textcourse",value:"Text & Image Course",onChange:x,checked:n==="Text & Image Course",className:"hidden peer"}),e.jsxs("label",{htmlFor:"textcourse",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${n==="Text & Image Course"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"Theory & Image Course"})]})]}),e.jsxs("div",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"radio",name:"value1",id:"videocourse",value:"Video & Text Course",onChange:x,checked:n==="Video & Text Course",className:"hidden peer"}),e.jsxs("label",{htmlFor:"videocourse",className:"flex items-center cursor-pointer",children:[e.jsx("span",{className:"w-4 h-4 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500",children:e.jsx("span",{className:`w-3 h-3  ${n==="Video & Text Course"?"bg-white":"hidden"}`})}),e.jsx("span",{className:"ml-2",children:"Video & Theory Course"})]})]})]}),e.jsx("div",{className:"flex justify-center",children:e.jsx("button",{className:" text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] lg:w-1/2 md:w-3/4 w-full py-2.5 my-5 ",type:"submit",children:y?e.jsxs("span",{className:"flex justify-center gap-3",children:[" ",e.jsx(A,{className:"h-6 w-6 animate-spin"})," ",e.jsx("p",{children:"Generating ...."})]}):"Generate Course"})})]})]})})]})]})};export{q as default};
