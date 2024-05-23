import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function History({ history, setHistory }) {

    useEffect(() => {
        // Load and reverse history on initial render
        const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
        setHistory(storedHistory.reverse());
    }, [setHistory]);

    function histcopy(e) {
        let output = e.target.dataset.result;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(output);
        }
    }

    function deleteHistory(index) {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this history!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                let storedHistory = JSON.parse(localStorage.getItem("history"));
                storedHistory.splice(storedHistory.length - 1 - index, 1); // Adjust the index to match the original order
                localStorage.setItem("history", JSON.stringify(storedHistory));
                setHistory([...storedHistory].reverse());
                Swal.fire(
                    'Deleted!',
                    'Your history has been deleted.',
                    'success'
                );
            }
        });
    }

    function deleteHistoryAll() {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this history!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete all!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem("history", JSON.stringify([]));
                setHistory([]);
                Swal.fire(
                    'Deleted!',
                    'All history has been deleted.',
                    'success'
                );
            }
        });
    }

    function histdownloadFile(e) {
        let content = e.target.dataset;
        const link = document.createElement("a");
        const file = new Blob([content.result], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = `${content.prompt}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return (
        <>
            <div id="history" className='pre-wrapper container p-lg-5 p-3 mt-5 mb-5' style={{ fontSize: '1.2rem', color: 'white', textAlign: 'left' }}>
                {history.length > 0 && <a href="#history" className='mt-5'><h2 className='mt-5'>History <i className="fa fa-clock-o mt-5" aria-hidden="true" onClick={deleteHistoryAll}></i></h2></a>}
                {history.length > 0 && history.map((obj, i) => (
                    <div key={i} className="mb-5">
                        <div className="h_prompt"><b>Prompt:</b> <br /> {obj.prompt.trim()}</div>
                        <div className="actions2">
                            <button className="fa fa-trash p-2" title="Delete" style={{ fontSize: '1.2rem' }} onClick={() => { deleteHistory(i) }}></button>
                            <button className="fa fa-download p-2 download" title="Download" style={{ fontSize: '1.2rem' }} data-prompt={obj.prompt.trim()} data-result={obj.result.trim()} onClick={histdownloadFile}></button>
                            <button className="fa fa-copy p-2 copy" title="Copy" style={{ fontSize: '1.2rem' }} onClick={histcopy} data-result={obj.result.trim()}></button>
                        </div>
                        <div className="h_result"><b>Result:</b> <br /> {obj.result.trim()}</div>
                        <div className="float-right" style={{ float: 'right' }}><br />{obj.timestamp.trim().toUpperCase()}</div>
                        <br />
                        <hr />
                    </div>
                ))}
            </div>
        </>
    );
}
