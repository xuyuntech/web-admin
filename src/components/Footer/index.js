import React from 'react';

export default class extends React.Component {
  render() {
    return (
      <footer id="footer">

        <div className="show-fixed pad-rgt pull-right">
                You have <a href="#" className="text-main"><span className="badge badge-danger">3</span> pending action.</a>
        </div>


        <div className="hide-fixed pull-right pad-rgt">
                14GB of <strong>512GB</strong> Free.
        </div>

        <p className="pad-lft">© 2017 Your Company</p>


      </footer>
    );
  }
}
