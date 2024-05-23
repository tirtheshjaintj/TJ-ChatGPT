import React from 'react'

export default function History({history,setHistory}) {
    
    function histcopy(e){
        let output=e.target.dataset.result;
        if(navigator.clipboard) {
          navigator.clipboard.writeText(output);
        }
      }

      function deleteHistory(index) {
        if(window.confirm("Are you sure you want to delete?")===true){
        let history = JSON.parse(localStorage.getItem("history"));
        history.splice(index, 1); // Removes one item at the specified index
        localStorage.setItem("history", JSON.stringify(history));
        setHistory(history);
        }
      }

      function deleteHistoryAll() {
      if(window.confirm("Are you sure you want to delete All History?")===true){
        localStorage.setItem("history", JSON.stringify([]));
        setHistory([]);
        }
      }

      function histdownloadFile(e){
        let content=e.target.dataset;
        const link = document.createElement("a");
        const file = new Blob([content.result], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = content.prompt+".txt";
        link.click();
        URL.revokeObjectURL(link.href);
      };
      
  return (
   <>
       <div id="history" className='pre-wrapper container p-lg-5 p-3 mt-5 mb-5' style={{fontSize:'1.2rem',color:'white',textAlign:'left'}}>
{history.length>0 && <a href="#history" className='mt-5'> <h2 className='mt-5'>History <i className="fa fa-clock-o mt-5" aria-hidden="true" onClick={deleteHistoryAll}></i></h2></a>}
{history.length>0 && history.map((obj,i)=>{
  {console.log(obj)}
 return <div key={i} className="mb-5">
  <div  className="h_prompt"><b>Prompt:</b> <br/> {obj.prompt.trim()}</div>
  <div className="actions2">
  <button className="fa fa-trash p-2" title="Delete" style={{fontSize:'1.2rem'}} onClick={()=>{deleteHistory(history.length-i-1)}}></button>
  <button className="fa fa-download p-2 download" title="Download" style={{fontSize:'1.2rem'}} data-prompt={obj.prompt.trim()} data-result={obj.result.trim()} onClick={histdownloadFile} ></button>
  <button className="fa fa-copy p-2 copy" title="Copy" style={{fontSize:'1.2rem'}} onClick={histcopy}  data-result={obj.result.trim()} ></button>
 </div>
  <div  className="h_result" ><b>Result:</b> <br /> {obj.result.trim()}</div>
  <div  className="float-right" style={{float:'right'}} ><br/>{obj.timestamp.trim().toUpperCase()}</div>
  <br />
  <hr/>
  </div>
})
      }
      </div>
   </>
  )
}
