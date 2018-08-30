///<reference types="react" />

type IRouteParams = any;

type LifecyclePropsType = (context: IRoute, params: IRouteParams, store: any) => void;

interface IRoute {
    path: string;
    component?: React.ComponentType<any> | React.ComponentType<any> | React.ReactElement<any> | null;
    async?: () => Promise<any>;
    onEnter?: LifecyclePropsType;
    onParamsChange?: LifecyclePropsType;
    childRoutes?: { [key: string]: any };
}

export const RouterStore: {
    new(): any;
}

export const Route: {
    new(param: IRoute): any;
    childRoutes?: { [key: string]: any };
    async?: Promise<any>;
};
type routerMap = { [key: string]: typeof Route };
export const Link: React.ComponentClass<{ params?: IRouteParams; view: any; store: any; className?: string; styleName?: string; key?: string, style?: React.CSSProperties }>;
export const MobxRouter: React.ComponentClass<{routes: {[key: string]: typeof Route}}>;
export function startRouter(views: {[key: string]: typeof Route}, store: any): void;
