import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import omit from 'lodash.omit';
import bFetch from '../BFetch';

const NOOP = () => {};

const propTypes = {
  url: PropTypes.string,
  method: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  params: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onClick: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

export default class extends React.Component {
  static propTypes = propTypes;
  static defaultProps = {
    url: '',
    method: 'get',
    data: {},
    params: {},
    onClick: NOOP,
    onSuccess: NOOP,
    onError: NOOP,
  };
  state = {
    loading: false,
  };
  onClick = async () => {
    const {
      url, method, data, params, onSuccess, onError,
    } = this.props;
    if (!url) {
      this.props.onClick();
      return;
    }
    this.setState({
      loading: true,
    });
    let dData = data;
    if (typeof data === 'function') {
      dData = data();
    }
    const options = {
      method,
      body: JSON.stringify(dData),
      params,
    };
    try {
      const res = await bFetch(url, options);
      onSuccess(res.results);
    } catch (err) {
      onError(err);
    }
    this.setState({
      loading: false,
    });
  };
  render() {
    const { children, ...props } = this.props;
    const { loading } = this.state;
    return (
      <Button
        {...omit(props, Object.keys(propTypes))}
        loading={loading}
        onClick={this.onClick}
      >
        {children}
      </Button>
    );
  }
}
