import * as React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import App from './App';

class ScrollToTop extends React.Component<RouteComponentProps, {}> {
  public componentDidUpdate(prevProps: RouteComponentProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      App.instance.scrollBodyToTop();
    }
  }

  public render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);