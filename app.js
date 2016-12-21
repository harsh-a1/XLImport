/**
 * Created by harsh on 15/12/16.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

var dhis2API = require('./dhis2API/dhis2API');

var components = require('./components/components');
$('document').ready(function(){

    ReactDOM.render(components.uploadFile, document.getElementById('container'));


});


debugger