import * as React from "react";
import { BecomeAPatronButton } from '../ui/Utils/BecomeAPatronButton';

export interface IFooterViewProps {}
export class FooterView extends React.Component<IFooterViewProps, {}> {
  public render(): JSX.Element | null {
    return (
      <div className="footer">
        <BecomeAPatronButton />
      </div>
    );
  }
}