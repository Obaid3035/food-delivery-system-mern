import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import {QueryClientProvider, QueryClient} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

axios.defaults.baseURL = 'http://localhost:4000/';

// axios.defaults.baseURL = 'https://snakrs-server.herokuapp.com/';


const queryClient = new QueryClient();

const app = (

        <QueryClientProvider client={queryClient}>
            <App/>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
)

ReactDOM.render(app, document.getElementById('root'));

