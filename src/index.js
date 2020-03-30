import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
// import {Provider} from 'react-redux'

const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
    // <Provider>
        <App />
    // </Provider>
    , document.getElementById('root'));

