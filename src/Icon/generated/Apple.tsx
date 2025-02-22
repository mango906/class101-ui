import React from "react";
import { IconProps } from '../index';
export default class SvgApple extends React.PureComponent<IconProps> {
  public static defaultProps: Partial<IconProps> = {
    fillColor: '#3E4042',
    accentColor: '#DDE0E2',
    size: 24
  };

  public render() {
    return <svg width={this.props.size} height={this.props.size} style={this.props.style} className={this.props.className} viewBox="0 0 24 24"><path fill={this.props.fillColor} fillRule="evenodd" d="M17.336 12.043c.028 3.003 2.635 4.003 2.664 4.015-.022.07-.417 1.424-1.373 2.823-.828 1.209-1.686 2.413-3.038 2.438-1.33.025-1.757-.788-3.276-.788s-1.994.764-3.251.813c-1.306.05-2.3-1.307-3.134-2.511-1.705-2.465-3.007-6.963-1.258-10 .869-1.508 2.421-2.462 4.106-2.487 1.282-.024 2.492.862 3.276.862.783 0 2.253-1.066 3.8-.91.646.027 2.463.262 3.629 1.969-.094.058-2.167 1.265-2.145 3.775M14.84 4.67c.693-.84 1.16-2.007 1.032-3.169-.999.04-2.207.666-2.923 1.504-.643.743-1.205 1.93-1.053 3.07 1.113.086 2.25-.566 2.944-1.405" /></svg>;
  }

}