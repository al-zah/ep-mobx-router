import {toJS, observable, action, computed} from 'mobx';
import {getObjectKeys} from './utils';
import {paramRegex, optionalRegex} from './regex';
import {getRegexMatches} from './utils';
import queryString from 'query-string';

class Route {

  //props
  component;
  path;
  @observable match = false;

  //lifecycle methods
  onEnter;
  onExit;
  beforeEnter;
  beforeExit;

  constructor(props) {
    getObjectKeys(props).forEach((propKey) => this[propKey] = props[propKey]);
    this.originalPath = this.path;

    //if there are optional parameters, replace the path with a regex expression
    this.path = this.path.indexOf('?') === -1 ? this.path : this.path.replace(optionalRegex, "/?([^/\!]*)");

    //bind
    this.replaceUrlParams = this.replaceUrlParams.bind(this);
    this.getParamsObject = this.getParamsObject.bind(this);
    this.goTo = this.goTo.bind(this);
  }

  /*
   Sets the root path for the current path, so it's easier to determine if the route entered/exited or just some params changed
   Example: for '/' the root path is '/', for '/profile/:username/:tab' the root path is '/profile/'
   */
  @computed get rootPath() {
    if (this.ownPath.indexOf(':') !== -1) {
      return this.ownPath.split(':')[0];
    }

    return this.ownPath;
  };

  /*
   replaces url params placeholders with params from an object
   Example: if url is /book/:id/page/:pageId and object is {id:100, pageId:200} it will return /book/100/page/200
   */
  replaceUrlParams(params, queryParams = {}) {
    params = toJS(params);
    queryParams = toJS(queryParams);

    const queryParamsString = queryString.stringify(queryParams).toString();
    const hasQueryParams = queryParamsString !== '';
    let newPath = this.originalPath;

    getRegexMatches(this.originalPath, paramRegex, ([fullMatch, paramKey, paramKeyWithoutColon]) => {
      const value = params[paramKeyWithoutColon];
      newPath = value ? newPath.replace(paramKey, value) : newPath.replace(`/${paramKey}`, '');
    });

    return `${newPath}${hasQueryParams ? `?${queryParamsString}` : ''}`.toString();
  }

  /*
   converts an array of params [123, 100] to an object
   Example: if the current this.path is /book/:id/page/:pageId it will return {id:123, pageId:100}
   */
  getParamsObject = (paramsArray) => {
    const params = [];

    getRegexMatches(this.originalPath, paramRegex, ([paramKeyWithoutColon]) => {
      params.push(paramKeyWithoutColon);
    });

    return paramsArray.reduce((obj, paramValue, index) => {
      if (!params[index]) return obj;
      obj[params[index].replace(/(\/:|\&)/g, '')] = paramValue;

      return obj;
    }, {});
  };

  @action setMatch = (value) => {
    this.match = value;
  }

  goTo(store, paramsArr) {
    const paramsObject = this.getParamsObject(paramsArr);
    const queryParamsObject = queryString.parse(window.location.search);
    store.router.goTo(this, paramsObject, store, queryParamsObject);
  }
}

export default Route;