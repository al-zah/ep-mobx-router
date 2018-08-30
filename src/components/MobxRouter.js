import React, {Component} from 'react';
import { autorun, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';

@observer
class AsyncComponent extends Component {
  @observable isLoaded = false;
  @observable component = null;

  componentDidMount() {
    this.props.async.then((component) => runInAction(() => { this.component = component; this.isLoaded = true; } ))
  }
  render() {
    if (this.isLoaded) {
      return <this.component>{this.props.children}</this.component>
    }

    return (
        <div>{this.props.children}</div>
    );
  }
}

@observer
class MobxRouter extends Component {
  getCurrentViewTree(list) {
    return Object.keys(list).reduce((acc, key) => {
      const route = list[key];

      if (!route || !route.match || acc.length >= 1) return acc;

      if (route.async && route.match) {
        if (route.childRoutes) {
          return [...acc, <AsyncComponent key={key} async={route.async}>{this.getCurrentViewTree(route.childRoutes)}</AsyncComponent>];
        }

        return [...acc, <AsyncComponent key={key} async={route.async}/>];
      }

      const Component = route.component;

      if (route.childRoutes) {
        return [...acc, <Component key={key}>{this.getCurrentViewTree(route.childRoutes)}</Component>];
      }

      return typeof route.component === 'function' ? [...acc, <Component key={key} />] : [...acc, Component];
    }, []);
  }

  render() {
    const { routes } = this.props;

    return (
      <div>{this.getCurrentViewTree(routes)}</div>
    )
  }
}

export default MobxRouter;