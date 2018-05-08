import React from 'react';
import { NavLink } from 'react-router-dom';

export default class extends React.Component {
  render() {
    return (
      <nav id="mainnav-container">
        <div id="mainnav" >
          <div id="mainnav-menu-wrap">
            <div className="nano">
              <div className="nano-content" >
                <ul id="mainnav-menu" className="list-group">
                  <li className="list-header">Navigation</li>
                  <li>
                    <NavLink exact to="/" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink exact to="/crawler" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">爬虫管理</span>
                      {/* <i className="arrow" /> */}
                    </NavLink>
                    {/* <ul className="collapse">
                      <li><Link to="/crawler/overview">概况</Link></li>
                      <li><a href="dashboard-2.html">新建爬虫</a></li>
                      <li><a href="dashboard-3.html">爬虫列表</a></li>
                    </ul> */}
                  </li>
                  <li>
                    <NavLink to="/inventorySync" activeClassName="active">
                      <i className="demo-pli-home" />
                      <span className="menu-title">库存同步</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
