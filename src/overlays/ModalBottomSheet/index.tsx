import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Button, ButtonColor, ButtonProps, IconButton } from '../../components/Button';
import { media } from '../../core/BreakPoints';
import { gray600, gray800, white } from '../../core/Colors';
import { elevation5 } from '../../core/ElevationStyles';
import { Body2, Headline3 } from '../../core/Typography';
import { Close } from '../../Icon';
import { isClient, isServer } from '../../utils';
import { Portal } from '../Portal';

export interface ModalBottomSheetProps {
  opened: boolean;
  title: React.ReactNode;
  opener?: React.ReactElement<{ onClick: () => void }>;
  zIndex: number;
  children: React.ReactNode;
  subTitle?: React.ReactNode;
  successText?: string;
  className?: string;
  successAttributes: Partial<ButtonProps>;
  cancelText?: string;
  cancelAttributes: Partial<ButtonProps>;
  closeable: boolean;
  hideScroll: boolean;
  noSsr: boolean;
  removeContentPadding: boolean;
  modalStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  destroyOnClose: boolean;
  onOpen?: () => boolean | void;
  onClose?: () => void;
  onSuccess?: (close: () => void) => void;
  onCancel?: (close: () => void) => void;
}

interface State {
  mounted: boolean;
  opened: boolean;
  scrollbarWidth: number;
  viewPortHeight: number;
}

export class ModalBottomSheet extends PureComponent<ModalBottomSheetProps, State> {
  public static defaultProps: Partial<ModalBottomSheetProps> = {
    zIndex: 3000,
    closeable: true,
    hideScroll: false,
    noSsr: false,
    cancelAttributes: {},
    successAttributes: {},
    removeContentPadding: false,
    destroyOnClose: false,
  };

  public static getDerivedStateFromProps(nextProps: ModalBottomSheetProps, prevState: State): Partial<State> | null {
    if (nextProps.opened !== undefined && nextProps.opened !== prevState.opened) {
      return {
        opened: nextProps.opened,
      };
    }
    return null;
  }

  public readonly state: State = {
    mounted: this.props.noSsr,
    opened: false,
    scrollbarWidth: 0,
    viewPortHeight: 0,
  };

  private unmountScrollTimeout?: number;

  public componentDidMount() {
    this.setState({
      mounted: true,
      scrollbarWidth: this.getScrollbarWidth(),
      viewPortHeight: this.getViewPortHeight(),
    });

    if (isClient()) {
      window.addEventListener('resize', this.setViewPortHeight);
    }
  }

  public componentDidUpdate(prevProps: ModalBottomSheetProps, prevState: State) {
    const { opened } = this.state;

    if (prevState.opened !== opened) {
      if (opened) {
        this.disableBodyScroll();
      } else {
        this.unmountScrollTimeout = setTimeout(() => {
          this.enableBodyScroll();
        }, 225);
      }
    }
  }

  public componentWillUnmount() {
    if (this.unmountScrollTimeout) {
      clearTimeout(this.unmountScrollTimeout);
    }

    if (isClient()) {
      window.removeEventListener('resize', this.setViewPortHeight);
    }

    this.enableBodyScroll();
  }

  public render() {
    const {
      zIndex,
      children,
      title,
      subTitle,
      successText,
      className,
      cancelText,
      hideScroll,
      closeable,
      modalStyle,
      contentStyle,
      removeContentPadding,
      opener,
      successAttributes,
      cancelAttributes,
      destroyOnClose,
    } = this.props;
    const { mounted, opened, viewPortHeight } = this.state;

    if (!mounted || isServer()) {
      return opener || <React.Fragment />;
    }
    if (!successAttributes.color) {
      successAttributes.color = ButtonColor.ORANGE;
    }

    const clonedOpener =
      opener &&
      React.cloneElement(opener, {
        onClick: this.showModal,
      });
    return (
      <>
        {clonedOpener}
        <Portal container={document.body} key={destroyOnClose ? new Date().getTime() : undefined}>
          <Container zIndex={zIndex} visible={opened} onClick={closeable ? this.handleCloseModal : undefined}>
            <Dialog
              visible={opened}
              onClick={this.blockPropagation}
              style={modalStyle}
              viewPortHeight={viewPortHeight}
              className={className}
            >
              <DialogHead>
                <DialogTitle>{title}</DialogTitle>
                {closeable && (
                  <IconButton
                    icon={<Close />}
                    onClick={this.handleCloseModal}
                    fillColor={gray800}
                    color="transparent"
                  />
                )}
              </DialogHead>
              {subTitle && <DialogSubTitle>{subTitle}</DialogSubTitle>}
              <DialogBody style={contentStyle} hideScroll={hideScroll} removeContentPadding={removeContentPadding}>
                {children}
              </DialogBody>
              <DialogFooter>
                {cancelText && (
                  <DialogFooterButton onClick={this.handleCancelModal} {...cancelAttributes}>
                    {cancelText}
                  </DialogFooterButton>
                )}
                {successText && (
                  <DialogFooterButton onClick={this.handleSuccessModal} {...successAttributes}>
                    {successText}
                  </DialogFooterButton>
                )}
              </DialogFooter>
            </Dialog>
          </Container>
        </Portal>
      </>
    );
  }

  private disableBodyScroll = () => {
    const { scrollbarWidth } = this.state;
    if (isClient()) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    }
  };

  private enableBodyScroll = () => {
    if (isClient()) {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
  };

  private showModal = () => {
    const { onOpen } = this.props;

    if (!onOpen || onOpen() !== false) {
      this.setState({
        opened: true,
      });
    }
  };

  private hideModal = () => {
    this.setState({
      opened: false,
    });
  };

  private getScrollbarWidth = () => {
    if (isServer()) {
      return 0;
    }
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    outer.parentNode && outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  };

  private getViewPortHeight = () => {
    if (isServer()) {
      return 0;
    }
    return window.innerHeight;
  };

  private setViewPortHeight = () => {
    this.setState({
      viewPortHeight: this.getViewPortHeight(),
    });
  };

  private blockPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  private handleCloseModal = () => {
    const { opener, onClose } = this.props;
    if (opener) {
      this.hideModal();
    }
    onClose ? onClose() : this.hideModal();
  };

  private handleCancelModal = () => {
    const { onCancel } = this.props;
    onCancel ? onCancel(this.hideModal) : this.hideModal();
  };

  private handleSuccessModal = () => {
    const { onSuccess } = this.props;
    onSuccess ? onSuccess(this.hideModal) : this.hideModal();
  };
}

const Container = styled.div<{ zIndex: number; visible: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.zIndex};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.72);
  opacity: ${props => (props.visible ? '1' : '0')};
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  transition: ${props => !props.visible && `visibility 0s linear 225ms,`} opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  overscroll-behavior: contain;
  flex-direction: column;
  ${media.sm`
    justify-content: flex-end;
  `}
`;

const Dialog = styled.div<{ visible: boolean; viewPortHeight: number }>`
  display: flex;
  flex-direction: column;
  padding: 32px;
  width: 480px;
  min-height: 360px;
  max-height: 800px;
  border-radius: 8px;
  background: ${white};
  box-sizing: border-box;
  ${elevation5}

  ${media.sm`
    flex: none;
    padding: 24px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 24px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
    width: 100%;
    min-height: 240px;
    max-height: ${props => (props.viewPortHeight > 48 ? `${props.viewPortHeight - 48}px` : `calc(100vh - 48px)`)}
    height: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    ${props => !props.visible && `transform: translateY(100%);`}
    transition: all 225ms ease-out;
  `}
`;

const DialogHead = styled.div`
  flex: none;
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

const DialogTitle = styled(Headline3)`
  flex: auto;
  white-space: pre-line;
  word-break: break-all;
`;

const DialogSubTitle = styled(Body2)`
  flex: none;
  margin-bottom: 16px;
  word-break: break-all;
  color: ${gray600};
`;

const DialogBody = styled.div<{ hideScroll: boolean; removeContentPadding: boolean }>`
  flex: auto;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-all;
  ${props =>
    props.hideScroll &&
    `
    &::-webkit-scrollbar {
      display: none;
    }
  `}

  ${props =>
    props.removeContentPadding &&
    `
    margin-left: -32px;
    margin-right: -32px;

    ${media.sm`
      margin-left: -24px;
      margin-right: -24px;
    `}
  `}

  overscroll-behavior: contain;
`;

const DialogFooter = styled.div`
  flex: none;
  display: flex;
  flex-direction: row;
  margin: 0 -8px;
`;

const DialogFooterButton = styled(Button)`
  flex: 1 0 auto;
  margin: 16px 8px 0;
`;
