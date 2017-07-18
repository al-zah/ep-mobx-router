export const isObject = obj => obj && typeof obj === 'object' && !(Array.isArray(obj));
export const getObjectKeys = obj => isObject(obj) ? Object.keys(obj) : [];

export const viewsForDirector = (views, store, parentView) => getObjectKeys(views).reduce((obj, viewKey) => {
  const view = views[viewKey];

  if (!view.childRoutes) {
    obj[view.path] = {
      on: (...paramsArr) => {
        view.setMatch(true);
        view.goTo(store, paramsArr);
      },
      after: () => view.setMatch(false),
    };
  } else {
    obj[view.path] = {
      ...viewsForDirector(view.childRoutes, store, view),
      on: (...paramsArr) => {
        view.setMatch(true);
        view.goTo(store, paramsArr);
      },
      after: () => view.setMatch(false),
    };
  }

  if (parentView) {
    view.path = parentView.path + view.path;
    view.originalPath = parentView.originalPath + view.originalPath;
  }

  return obj;
}, {});

export const getRegexMatches = (string, regexExpression, callback) => {
  let match;
  while (( match = regexExpression.exec(string) ) !== null) {
    callback(match);
  }
};
