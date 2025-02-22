import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';

import { gray300, gray500, gray800 } from '../../../core/Colors';
import { body1 } from '../../../core/TextStyles';
import RadioIcon from './RadioIcon';

export interface RadioButtonContainerProps {
  stackingDirection?: 'horizontal' | 'vertical';
  showBorder?: boolean;
  showDivider?: boolean;
  checked?: boolean;
  textAlign?: 'left' | 'center';
}

export interface RadioButtonProps extends RadioButtonContainerProps {
  index?: number;
  color?: string;
  value: string;
  onClick?: (index: number) => any;
}

export class RadioButton extends PureComponent<RadioButtonProps> {
  public static defaultProps: Partial<RadioButtonProps> = {
    stackingDirection: 'vertical',
    showBorder: true,
    color: gray800,
    showDivider: false,
    textAlign: 'left',
  };

  public render() {
    const { stackingDirection, textAlign, checked, children, color, showBorder, showDivider } = this.props;

    return (
      <RadioButtonContainer
        showBorder={showBorder}
        stackingDirection={stackingDirection}
        textAlign={textAlign}
        showDivider={showDivider}
        checked={checked}
        onClick={this.handleClick}
      >
        <RadioIcon size="lg" checked={checked} color={color} />
        <RadioButtonText checked={checked} color={color}>
          {children}
        </RadioButtonText>
      </RadioButtonContainer>
    );
  }

  private handleClick = () => {
    const { onClick, index } = this.props;
    if (onClick) {
      onClick(index!);
    }
  };
}

const optionStyles = ({
  checked,
  showBorder,
  stackingDirection,
  textAlign,
  showDivider,
}: RadioButtonContainerProps) => {
  const origin = 12;

  let style = css`
    flex: 1;
    padding: ${origin}px 16px;
    text-align: ${textAlign};
  `;

  if (stackingDirection === 'vertical') {
    style = css`
      ${style};
      margin-bottom: ${origin}px;
    `;
    if (showBorder) {
      style = css`
        ${style};
        border: 1px solid ${gray300};
      `;
    } else if (showDivider) {
      style = css`
        ${style};
        margin-bottom: 0;
        border-bottom: 1px solid ${gray300} !important;
        &:last-child {
          border-bottom: none !important;
        }
      `;
    }
  } else if (stackingDirection === 'horizontal') {
    style = css`
      ${style};
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    `;
    if (showBorder) {
      style = css`
        ${style};
        border: 1px solid ${gray300};
      `;
    }
  }

  if (checked) {
    style = css`
      ${style};
      border-color: ${gray800};
    `;
  }

  return style;
};

export const RadioButtonContainer = styled.div<RadioButtonContainerProps>`
  display: flex;
  align-items: center;
  border-radius: 1px;
  cursor: pointer;
  white-space: nowrap;
  ${props => optionStyles(props)};
`;

export const RadioButtonText = styled.div<{ checked?: boolean; color?: string }>`
  ${body1};
  flex: 1;
  color: ${gray500};
  white-space: normal;

  ${props =>
    props.checked &&
    css`
      color: ${props.color || gray800};
    `};
`;
