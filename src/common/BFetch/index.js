/**
 * @author cabernety
 */
import 'isomorphic-fetch';
import { isString, isFunction } from 'lodash';
import cookie from 'js-cookie';
import { message } from 'antd';
import { BaseURL } from '../../const';

const logger = console;

/* eslint-disable no-console */

const STATUS = {
  OK: 0,
  Unauthorized: 6,
};

export class Err {
  type = 'ErrDefault';
  options = {
    message: 'default err',
  };
  constructor(options) {
    let opt = options;
    if (isString(options)) {
      opt = {
        status: -1,
        message: options,
      };
    }
    this.options = opt;
  }
  is(err) {
    if (!err) {
      return false;
    }
    return this instanceof err;
  }
  status() {
    return this.options.status;
  }
  error() {
    const { status, message } = this.options;
    return `[${status}] ${message}`;
  }
  message() {
    return this.options.message;
  }
  toString() {
    const { message } = this.options;
    return `[BFetch Err] -> ${this.type}:${message}`;
  }
}

export class ErrAPI extends Err {
  type = 'ErrAPI';
}

export class ErrJSONParse extends Err {
  type = 'ErrJSONParse';
}

export class ErrUnauthroized extends Err {
  type = 'ErrUnauthroized';
}

export class ErrRequest extends Err {
  type = 'ErrRequest';
}

export class ErrUnknow extends Err {
  type = 'ErrUnknow';
  constructor(options) {
    super(options);
    this.err = options.err;
  }
}

const addParams = (url, params) => {
  if (!params) {
    return url;
  }
  const arr = Object.keys(params).map((key) => {
    let param = params[key];
    if (typeof param === 'undefined' || isFunction(param)) {
      param = '';
    }
    return `${key}=${encodeURIComponent(param)}`;
  });
  if (!arr.length) {
    return url;
  }
  return `${url}${/\?/.test(url) ? '&' : '?'}${arr.join('&')}`;
};
const bFetch = async (url, options = {}) => {
  const defaults = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Access-Token': cookie.get('X-Access-Token'),
    },
  };
  const params = {
    ...options.params,
    ...options.pagination,
  };
  let res = null;
  let baseURL = '';
  if (!/^https?:/.test(url)) {
    baseURL = BaseURL;
  }
  try {
    const uUrl = addParams(`${baseURL}${url}`, params);
    logger.log(`fetch: ${uUrl}, params:`, params, 'body', options.body);
    res = await fetch(uUrl, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...(options && options.headers),
        ...(options.token && { 'X-Access-Token': options.token }),
      },
    });
  } catch (err) {
    logger.error(err);
    throw new ErrUnknow({ err, message: `unknow fetch err: ${err}` });
  }
  if (options.rawResponse) {
    return res;
  }
  switch (res.status) {
    case 200: {
      const txt = await res.text();
      let json = null;
      try {
        json = JSON.parse(txt);
      } catch (err) {
        throw new ErrJSONParse(`JSON 解析失败: ${txt}`);
      }
      if (options.disableDefaultHandler) {
        return json;
      }
      if (json.status === STATUS.OK) {
        return json;
      } else if (json.status === STATUS.Unauthorized) {
        cookie.remove('X-Access-Token');
        if (window.location.path !== '/login') {
          window.location.href = '/login';
        }
        return new ErrUnauthroized();
      }
      message.error(json.msg || json.message);
      throw new ErrAPI({
        status: json.status,
        message: json.msg || json.message,
      });
    }
    case 6: // api status code 6 = unauthorized
    case 401: {
      cookie.remove('X-Access-Token');
      if (window.location.path !== '/login') {
        window.location.href = '/login';
      }
      throw new ErrUnauthroized();
    }
    default:
      throw new ErrRequest(`请求失败 ${res.status}:${res.statusText}`);
  }
};
export default bFetch;
