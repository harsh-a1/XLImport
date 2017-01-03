/**
 * Created by harsh on 21/12/16.
 */

import React from 'react';


export function UploadFile(props){
        return (
                <div>
                    <label>Upload .xlsx or .csv file</label>
                    <input type="file" id="fileInput"/>
                    <button onClick={props.onClick}>Import</button>
                </div>
            )
}

export function ImportSummaryTable(props){
    function getRows(){
        var rows = [];
        for (var key in props.data){
            var items = props.data[key];
            var index=0;
            for (var key2 in items){debugger
                var item = items[key2];
                var domain = item.domain;
                rows.push( <tr key={key}>
                    <td key={key+index+"1"}>{domain}</td>

                </tr>)
                index = index+1;
            }

        }
        return rows;
    }

    return(
    <table >
        <thead>
        <tr>
            <th>Row</th>
            <th>Domain</th>
            <th>Status</th>
            <th>HTTP Response</th>
            <th>Conflict Details</th>
            <th>Reference</th>
        </tr>
        </thead>

        <tbody>
        {getRows()}
        </tbody>

    </table>
    )
}

