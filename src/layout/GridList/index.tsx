import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { media } from '../../core/BreakPoints';
import { HTMLDivProps } from '../../interfaces/props';
import { createUniqIDGenerator } from '../../utils/createUniqIDGenerator';

const sizeToPercent = (column?: number) => 100 / (column || 1);
const generateID = createUniqIDGenerator('grid-list-');

type Column = 1 | 2 | 3 | 4 | 6 | 12;
interface Props {
  items: any[] | ReadonlyArray<any>;
  renderItem: any;
  smColumn: Column;
  lgColumn?: Column;
  className?: string;
  divAttributes?: HTMLDivProps;
}

export class GridList extends PureComponent<Props> {
  public render() {
    const { items, renderItem, smColumn, lgColumn, className, divAttributes } = this.props;

    return (
      <Container className={className} {...divAttributes}>
        <GridListUl smColumn={smColumn}>
          {items.concat().map((item, index, arr) => (
            <GridListItem key={generateID()} smColumn={smColumn} lgColumn={lgColumn}>
              {renderItem(item, index, arr)}
            </GridListItem>
          ))}
        </GridListUl>
      </Container>
    );
  }
}

const Container = styled.div``;

const GridListUl = styled.ul<{ smColumn?: Column }>`
  overflow: hidden;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-right: -12px;
  margin-left: -12px;
  margin-bottom: -24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: stretch;

  ${media.sm`
    margin-right: -4px;
    margin-left: -4px;
    ${props =>
      props.smColumn === 2 &&
      `
        margin-right: -8px;
        margin-left: -8px;
      `}%;
  `};
`;

const GridListItem = styled.li<{ lgColumn?: Column; smColumn?: Column }>`
  position: relative;
  min-height: 1px;
  padding-right: 12px;
  padding-left: 12px;
  margin-bottom: 24px;
  box-sizing: border-box;
  width: ${props => sizeToPercent(props.smColumn)}%;

  ${media.sm`
    padding-right: 4px;
    padding-left: 4px;
    ${props =>
      props.smColumn === 2 &&
      `
        padding-right: 8px;
        padding-left: 8px;
      `}%;
    ${props =>
      props.smColumn === 1 &&
      `
        .sale-wish-icon {
          > svg {
            width: 32px;
            height: 32px;
          }
        }
      `}
  `}

  ${media.lg`
    ${props =>
      props.lgColumn &&
      `
        width: ${sizeToPercent(props.lgColumn)}%;
      `}
  `}
`;
