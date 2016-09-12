import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import es6Promise from 'es6-promise';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { Redirect, Router, Route, useRouterHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Web3 from 'web3';

import { initStore } from './redux';
import { muiTheme } from './ui';
import { Accounts, Account, Addresses, Address, Application, Contract, Contracts, Dapp, Dapps, Signer, Status } from './views';

// TODO: This is VERY messy, just dumped here to get the Signer going
import { Web3Provider as SignerWeb3Provider, web3Extension as statusWeb3Extension } from './views/Signer/components';
import { WebSocketsProvider, Ws } from './views/Signer/utils';
import { SignerDataProvider, WsDataProvider } from './views/Signer/providers';

// TODO: same with Status...
import { Web3Provider as StatusWeb3Provider } from './views/Status/provider/web3-provider';
import StatusEthcoreWeb3 from './views/Status/provider/web3-ethcore-provider';

import './environment';

import styles from './reset.css';
import './index.html';

es6Promise.polyfill();
injectTapEventPlugin();

// signer
function tokenSetter (token, cb) {
  window.localStorage.setItem('sysuiToken', token);
}

const initToken = window.localStorage.getItem('sysuiToken');
const parityUrl = process.env.NODE_ENV === 'production' ? window.location.host : '127.0.0.1:8180';
const ws = new Ws(parityUrl);
const web3ws = new Web3(new WebSocketsProvider(ws));
statusWeb3Extension(web3ws).map((extension) => web3ws._extend(extension));

// status
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_ADDRESS || '/rpc/'));
const ethcoreWeb3 = new StatusEthcoreWeb3(web3);

const store = initStore(ws, tokenSetter, web3);

// signer
new WsDataProvider(store, ws); // eslint-disable-line no-new
new SignerDataProvider(store, ws); // eslint-disable-line no-new
ws.init(initToken);

// status
new StatusWeb3Provider(web3, ethcoreWeb3, store).start();

const routerHistory = useRouterHistory(createHashHistory)({});

ReactDOM.render(
  <Provider store={ store }>
    <MuiThemeProvider muiTheme={ muiTheme }>
      <SignerWeb3Provider web3={ web3ws }>
        <Router className={ styles.reset } history={ routerHistory }>
          <Redirect from='/' to='/accounts' />
          <Route path='/' component={ Application }>
            <Route path='accounts' component={ Accounts } />
            <Route path='account/:address' component={ Account } />
            <Route path='addresses' component={ Addresses } />
            <Route path='address/:address' component={ Address } />
            <Route path='apps' component={ Dapps } />
            <Route path='app/:name' component={ Dapp } />
            <Route path='contracts' component={ Contracts } />
            <Route path='contract/:address' component={ Contract } />
            <Route path='signer' component={ Signer } />
            <Route path='status' component={ Status } />
            <Route path='status/:subpage' component={ Status } />
          </Route>
        </Router>
      </SignerWeb3Provider>
    </MuiThemeProvider>
  </Provider>,
  document.querySelector('#container')
);