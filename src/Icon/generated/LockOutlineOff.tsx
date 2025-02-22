import React from "react";
import { IconProps } from '../index';
export default class SvgLockOutlineOff extends React.PureComponent<IconProps> {
  public static defaultProps: Partial<IconProps> = {
    fillColor: '#3E4042',
    accentColor: '#DDE0E2',
    size: 24
  };

  public render() {
    return <svg width={this.props.size} height={this.props.size} style={this.props.style} className={this.props.className} viewBox="0 0 24 24"><path fill={this.props.fillColor} fillRule="evenodd" d="M11 16.732a2 2 0 112 0V18a1 1 0 01-2 0v-1.268zM8 10h11c.667 0 1 .333 1 1v10c0 .667-.333 1-1 1H5c-.667 0-1-.333-1-1V11c0-.667.333-1 1-1h1V7a6 6 0 1112 0 1 1 0 01-2 0 4 4 0 10-8 0v3zm-2 2v8h12v-8H6z" /></svg>;
  }

}