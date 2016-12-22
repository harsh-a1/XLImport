/**
 * Created by harsh on 21/12/16.
 */

import React from 'react';


export class UploadFile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        };
    }
        foo(){debugger}

        render () {
            return (
                <div>
                    <label>Upload .xlsx or .csv file</label>
                    <input type="file" id="fileInput"/>
                    <button onClick={this.foo}>Import</button>
                </div>
            )
        }
    }
