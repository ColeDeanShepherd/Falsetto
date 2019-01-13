import * as React from 'react';

export class AboutPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div>
        <p>By <a href="http://coledeanshepherd.com">Cole Shepherd</a></p>
      </div>
    );
  }
}