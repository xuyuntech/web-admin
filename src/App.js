import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingComp from './components/Loadable';
import Layout from './components/Layout';
import './App.css';


const load = asyncImport => Loadable({
  loader: asyncImport,
  loading: LoadingComp,
});

export const HomeView = load(() => import('./views/Home'));
export const CrawlerOverviewView = load(() => import('./views/Crawler/Overview'));
export const CrawlerTaskDetailView = load(() => import('./views/Crawler/Task/Detail'));
export const InventorySyncView = load(() => import('./views/InventorySync'));

@observer
class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <div>
            <Route exact path="/" component={HomeView} />
            <Route path="/crawler" component={CrawlerOverviewView} />
            <Route path="/crawler/task/:taskID" component={CrawlerTaskDetailView} />
            <Route path="/inventorySync" component={InventorySyncView} />
          </div>
        </Layout>
      </Router>

    );
  }
}

export default App;
