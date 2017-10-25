import React, {Component} from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

@observer
class MobxRouter extends Component {
  getCurrentViewTree(list) {
    return Object.keys(list).reduce((acc, key) => {
      const route = list[key];

      if (!route || !route.match || acc.length >= 1) return acc;

      const Component = list[key].component;

      if (list[key].childRoutes) {
        return [...acc, <Component key={key}>{this.getCurrentViewTree(list[key].childRoutes)}</Component>];
      }

      return typeof list[key].component === 'function' ? [...acc, <Component key={key} />] : [...acc, Component];
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