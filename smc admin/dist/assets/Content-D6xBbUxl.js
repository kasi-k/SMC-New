import{r as d,n as ue,u as fe,j as s,a2 as pe,a3 as Y,a4 as ge,a5 as ye,a6 as we,a7 as _,a8 as be,a9 as je,aa as ve,ab as Ne,c as m,b as u,y as C}from"./index-DgKZBfYf.js";const ke=()=>{const[Se,Ce]=d.useState(!1),[Te,Ie]=d.useState(""),{state:q}=ue(),{mainTopic:c,type:g,courseId:R,end:z}=q||{},h=JSON.parse(localStorage.getItem("jsonData")),[De,Le]=d.useState(!1),[W,b]=d.useState(""),[J,j]=d.useState(""),[T,f]=d.useState(""),[I,U]=d.useState(0),[K,D]=d.useState(!1),p=fe(),[L,v]=d.useState([]),[N,B]=d.useState(""),[Q,F]=d.useState(!1),[X,G]=d.useState(!1),Z=()=>{let t=0,e=0;h[c.toLowerCase()].forEach(o=>{o.subtopics.forEach(n=>{n.done&&t++,e++})});const a=Math.round(t/e*100);U(a),a>="100"&&D(!0)},[$,ee]=d.useState({}),te=t=>{ee(e=>({...e,[t]:!e[t]}))},se={height:"390",width:"640"};async function k(){if(localStorage.getItem("first")==="true")if(z)p("/viewcertificate",{state:{courseTitle:c,end:z}});else{const e=new Date().toLocaleDateString("en-GB");p("/viewcertificate",{state:{courseTitle:c,end:e}})}else{const t={courseId:R};try{const e=m+"/api/finish";if((await u.post(e,t)).data.success){const n=new Date().toLocaleDateString("en-GB");localStorage.setItem("first","true"),ae(n)}else k()}catch{k()}}}async function ae(t){const e=localStorage.getItem("fname"),a=localStorage.getItem("email"),o=`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <title>Certificate of Completion</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap">
            <style>
            body {
                font-family: 'Roboto', sans-serif;
                text-align: center;
                background-color: #fff;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
        
            .certificate {
                border: 10px solid #000;
                max-width: 600px;
                margin: 20px auto;
                padding: 50px;
                background-color: #fff;
                position: relative;
                color: #000;
                text-align: center;
            }
        
            h1 {
                font-weight: 900;
                font-size: 24px;
                margin-bottom: 10px;
            }
        
            h4 {
                font-weight: 900;
                text-align: center;
                font-size: 20px;
            }
        
            h2 {
                font-weight: 700;
                font-size: 18px;
                margin-top: 10px;
                margin-bottom: 5px;
                text-decoration: underline;
            }
        
            h3 {
                font-weight: 700;
                text-decoration: underline;
                font-size: 16px;
                margin-top: 5px;
                margin-bottom: 10px;
            }
        
            p {
                font-weight: 400;
                line-height: 1.5;
            }
        
            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                text-align: center;
                align-self: center;
            }
            </style>
        </head>
        <body>
        
        <div class="certificate">
        <h1>Certificate of Completion 🥇</h1>
        <p>This is to certify that</p>
        <h2>${e}</h2>
        <p>has successfully completed the course on</p>
        <h3>${c}</h3>
        <p>on ${t}.</p>
    
        <div class="signature">
            <img src=''>
            <h4>''</h4>
        </div>
    </div>
        
        </body>
        </html>`;try{const n=m+"/api/sendcertificate";await u.post(n,{html:o,email:a}).then(r=>{p("/viewcertificate",{state:{courseTitle:c,end:t}})}).catch(r=>{p("/viewcertificate",{state:{courseTitle:c,end:t}})})}catch{p("/viewcertificate",{state:{courseTitle:c,end:t}})}}d.useEffect(()=>{H();const t=()=>{let e=0,a=0;h[c.toLowerCase()].forEach(n=>{n.subtopics.forEach(r=>{r.done&&e++,a++})});const o=Math.round(e/a*100);U(o),o>="100"&&D(!0)};if(!c)p("/create");else{I>="100"&&D(!0);const a=h[c.toLowerCase()][0].subtopics[0];a.done=!0,b(a.title),j(a.theory),f(g==="video & text course"?a.youtube:a.image),localStorage.setItem("jsonData",JSON.stringify(h)),t()}},[]),d.useEffect(()=>{G(!0);const t=setTimeout(()=>{G(!1)},5e3);return()=>clearTimeout(t)},[]);const oe=(t,e)=>{const a=h[c.toLowerCase()].find(n=>n.title===t),o=a==null?void 0:a.subtopics.find(n=>n.title===e);if(o.theory===""||o.theory===void 0||o.theory===null)if(g==="video & text course"){const n=`${o.title} ${c} in english`,r=C.loading("Please wait...");M(n,t,e,r,o.title)}else{const n=`Explain me about this subtopic of ${c} with examples :- ${o.title}. Please Strictly Don't Give Additional Resources And Images.`,r=`Example of ${o.title} in ${c}`,i=C.loading("Please wait...");A(n,r,t,e,i)}else b(o.title),j(o.theory),f(g==="video & text course"?o.youtube:o.image)};async function A(t,e,a,o,n){const r={prompt:t};try{const i=m+"/api/generate",y=(await u.post(i,r)).data.text;try{O(y,e,a,o,n)}catch{A(t,e,a,o,n)}}catch{A(t,e,a,o,n)}}async function O(t,e,a,o,n){const r={prompt:e};try{const i=m+"/api/image",l=await u.post(i,r);try{const x=l.data.url;ne(x,t,a,o,n)}catch{O(t,e,a,o,n)}}catch{O(t,e,a,o,n)}}async function ne(t,e,a,o,n){const r=h[c.toLowerCase()].find(l=>l.title===a),i=r==null?void 0:r.subtopics.find(l=>l.title===o);i.theory=e,i.image=t,b(i.title),C.update(n,{render:"Done!",type:"success",isLoading:!1,autoClose:3e3,hideProgressBar:!1,closeOnClick:!0}),j(e),f(g==="video & text course"?i.youtube:t),i.done=!0,P()}async function ie(t,e,a,o,n){const r=h[c.toLowerCase()].find(l=>l.title===a),i=r==null?void 0:r.subtopics.find(l=>l.title===o);i.theory=e,i.youtube=t,b(i.title),C.update(n,{render:"Done!",type:"success",isLoading:!1,autoClose:3e3,hideProgressBar:!1,closeOnClick:!0}),j(e),f(g==="video & text course"?t:i.image),i.done=!0,P()}async function P(){Z(),localStorage.setItem("jsonData",JSON.stringify(h));const t={content:JSON.stringify(h),courseId:R};try{const e=m+"/api/update";await u.post(e,t)}catch{P()}}async function M(t,e,a,o,n){const r={prompt:t};try{const i=m+"/api/yt",l=await u.post(i,r);try{const x=l.data.url;re(x,e,a,o,n)}catch{M(t,e,a,o,n)}}catch{M(t,e,a,o,n)}}async function re(t,e,a,o,n){const r={prompt:t};try{const i=m+"/api/transcript",l=await u.post(i,r);try{const xe=`Summarize this theory in a teaching way :- ${l.data.url.map(me=>me.text).join(" ")}.`;w(xe,t,e,a,o)}catch{const y=`Explain me about this subtopic of ${c} with examples :- ${n}. Please Strictly Don't Give Additional Resources And Images.`;w(y,t,e,a,o)}}catch{const l=`Explain me about this subtopic of ${c} with examples :- ${n}.  Please Strictly Don't Give Additional Resources And Images.`;w(l,t,e,a,o)}}async function w(t,e,a,o,n){const r={prompt:t};try{const i=m+"/api/generate",y=(await u.post(i,r)).data.text;try{ie(e,y,a,o,n)}catch{w(t,e,a,o,n)}}catch{w(t,e,a,o,n)}}const ce=`<p>Hey there! I'm your AI teacher. If you have any questions about your ${c} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`,le=`I have a doubt about this topic :- ${c}. Please clarify my doubt in very short :- `,H=async()=>{try{const t=localStorage.getItem(c);if(t!==null)v(JSON.parse(t));else{const e=[...L,{text:ce,sender:"bot"}];v(e),await E(e)}}catch{H()}},V=async()=>{if(N.trim()==="")return;const t={text:N,sender:"user"},e=[...L,t];v(e),await E(e),B("");const o={prompt:le+N},n=m+"/api/chat";try{const r=await u.post(n,o);if(r.data.success===!1)V();else{const i={text:r.data.text,sender:"bot"},l=[...e,i];v(l),await E(l)}}catch{}};async function E(t){try{localStorage.setItem(c,JSON.stringify(t))}catch{localStorage.setItem(c,JSON.stringify(t))}}const de=()=>{p("/viewcourse")},he=t=>s.jsxs(s.Fragment,{children:[s.jsxs("span",{className:" flex gap-2 mx-4 items-center text-white font-poppins font-extralight ",onClick:de,children:[s.jsx(je,{className:"text-lg cursor-pointer"}),s.jsx("p",{className:"my-3 cursor-pointer ",children:" Back to Home"})]}),s.jsx("div",{className:" font-poppins font-extralight ",children:t.map(e=>s.jsx("div",{className:"",children:s.jsxs("div",{className:" ",children:[s.jsxs("button",{onClick:()=>te(e.title),type:"button",className:`inline-flex  justify-between w-full text-left text-lg  text-white px-6 py-2.5 ${$[e.title]?"bg-gradient-to-r from-[#110038] to-[#08006B]":""}`,children:[e.title,s.jsx(ve,{className:` h-5 w-5 mt-2 transition-transform bg-white text-[#200098] rounded ${$[e.title]?"rotate-180":""}`})]}),$[e.title]&&s.jsx("div",{className:"px-5",children:s.jsx("div",{className:"py-0.5",role:"menu","aria-orientation":"vertical",children:e.subtopics.map(a=>s.jsxs("p",{onClick:()=>oe(e.title,a.title),className:"flex py-1 text-base items-center font-extralight text-white cursor-pointer",role:"menuitem",children:[a.title,a.done&&s.jsx(Ne,{className:"ml-2",size:12})]},a.title))})})]})},e.title))})]});return s.jsxs(s.Fragment,{children:[s.jsx(pe,{}),c?s.jsxs("div",{className:"flex flex-col h-screen  ",children:["import ",Y,' from "framer-motion";',X&&s.jsx(Y.div,{initial:{opacity:0,y:100},animate:{opacity:1,y:0},exit:{opacity:0,y:100},transition:{duration:1,ease:[.6,-.05,.01,.99]},className:"fixed bottom-36 right-10 z-50",children:s.jsxs("div",{className:"relative bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-xl shadow-lg w-48 font-poppins border-2",children:[s.jsxs("p",{className:"text-center text-sm font-light leading-relaxed",children:["Hi, I am your AI teacher. ",s.jsx("br",{}),"You can ask me any doubts you have on this course."]}),s.jsx("div",{className:"absolute -bottom-2 right-6 h-5 w-5 rotate-45 bg-gradient-to-r from-blue-500 to-blue-500"})]})}),s.jsx("div",{onClick:()=>F(!0),className:"m-5 fixed bottom-8 right-6 z-40  w-32 h-16  text-white  flex justify-center items-center shadow-md ",children:s.jsx("img",{src:ge,alt:"Image"})}),s.jsxs("div",{className:"flex flex-row overflow-y-auto mt-12 ",children:[s.jsx("div",{className:"w-3/12 bg-[#200098]  overflow-y-auto",children:s.jsx("div",{className:"mt-3",children:h&&he(h[c.toLowerCase()])})}),s.jsxs("div",{className:"overflow-y-auto flex-grow flex-col w-9/12 ",children:[s.jsx("nav",{className:"py-5 bg-gradient-to-b from-[#110038] via-[#150243] to-[#150243] border-b border-white flex items-center",children:s.jsxs("div",{className:"ml-1  flex flex-col w-1/2",children:[s.jsx(ye,{text:c,len:10}),K?s.jsx("p",{onClick:k,className:"mr-3 underline cursor-pointer text-white font-normal mx-8",children:"Download Certificate"}):s.jsxs("span",{className:"text-white",children:[s.jsx("p",{className:"w-3/4 text-end mx-4 text-lg font-extralight",children:`${I}%`}),s.jsx("div",{class:"w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700 mx-5",children:s.jsx("div",{class:"bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] h-4 rounded-full",style:{width:`${I}%`}})}),s.jsx("p",{className:"mx-6 mt-0.5 text-sm",children:"Completion status"})]})]})}),s.jsxs("div",{className:"px-5 text-white bg-gradient-to-b from-[#110038] via-[#150243] to-[#300080] pt-5 font-poppins font-extralight",children:[s.jsx("p",{className:"text-white font-normal text-lg",children:W}),s.jsx("div",{className:"overflow-hidden mt-4 text-white text-base pb-10 max-w-full",children:g==="video & text course"?s.jsxs("div",{children:[s.jsx(we,{className:"mb-5",videoId:T,opts:se},T),s.jsx(_,{text:J})]}):s.jsxs("div",{children:[s.jsx(_,{text:J}),s.jsx("img",{className:"overflow-hidden p-10",src:T,alt:"Media"})]})})]})]})]}),s.jsx("div",{className:`fixed inset-0 z-50 ${Q?"block":"hidden"}`,children:s.jsxs("div",{className:"bg-[#200098] h-full lg:w-96 md:w-80 w-72 right-0 absolute",children:[s.jsx("div",{className:"flex justify-end items-center p-2",children:s.jsx("button",{onClick:()=>F(!1),className:"text-white",children:s.jsx(be,{size:24})})}),s.jsx("div",{className:"overflow-y-auto",style:{height:"calc(100% - 250px)"},children:L.map((t,e)=>s.jsx("div",{className:`flex font-poppins font-extralight text-base ${t.sender==="user"?"justify-end":"justify-start"}`,children:s.jsx("div",{className:`rounded-lg  p-1 m-2 ${t.sender==="user","text-center text-white"}`,children:s.jsx("div",{dangerouslySetInnerHTML:{__html:t.text}})})},e))}),s.jsx("div",{className:"mx-6",children:s.jsx("textarea",{value:N,rows:3,placeholder:"Ask Something...",onChange:t=>B(t.target.value),className:"w-full border border-gray-300 rounded-md outline-none p-2 text-center align-middle ",type:"text"})}),s.jsx("div",{className:"flex justify-center",children:s.jsx("button",{className:"text-white text-base bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] w-1/2 py-2.5 my-5 ",type:"submit",onClick:V,children:"Submit"})})]})})]}):null]})};export{ke as default};
