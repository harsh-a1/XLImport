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

