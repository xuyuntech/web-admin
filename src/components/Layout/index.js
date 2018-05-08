import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header';
import MainNav from '../MainNav';
import Footer from '../Footer';

export default class extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };
  render() {
    return (
      <div id="container" className="effect aside-float aside-bright mainnav-lg navbar-fixed footer-fixed mainnav-fixed">
        <Header />
        <div className="boxed">
          <div id="content-container" >
            <div id="page-head">
              <div id="page-title">
                <h1 className="page-header text-overflow">Static Tables</h1>
                <ol className="breadcrumb">
                  <li><a href="#"><i className="demo-pli-home" /></a></li>
                  <li><a href="#">Tables</a></li>
                  <li className="active">Static Tables</li>
                </ol>
              </div>
            </div>
            <div id="page-content">
              {this.props.children}
            </div>
          </div>
          <MainNav />
        </div>
        <Footer />
      </div>
    );
  }
}
