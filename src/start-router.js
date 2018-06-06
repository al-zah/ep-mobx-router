import tarantino from 'ep-tarantino';
import { autorun } from 'mobx';
import { viewsForDirector } from './utils';

const createDirectorRouter = (views, store) => new tarantino.Router({
  ...viewsForDirector(views, store),
}).configure({
  html5history: true,
  recurse: 'forward',
  strict: false,
}).init();

const startRouter = (views, store) => {
  const router = createDirectorRouter(views, store);

  autorun(() => {
    const { currentPath } = store.router;
    if (currentPath !== window.location.pathname) router.setRoute(currentPath);
  });
};

export default startRouter;
