import React from 'react';
import ReactDOM from 'react-dom';

//IMPORT MOBILE CSS
import index from './index.css';
// import media from './media.css';

import App from "./App";

console.log(React.version)

ReactDOM.render(<App/>, document.getElementById('app'))

const route = window.location.href

window.addEventListener('load', () => {

    console.log(route)
})
