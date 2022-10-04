import React from "react";
import { Tooltip as MUITooltip, TooltipProps } from "@material-ui/core";
import cn from "classnames";

import styles from "./Tooltip.module.scss";

type Props = {
  message: React.ReactNode;
  children: TooltipProps["children"];
  open?: boolean;
  isError?: boolean;
  placement?: TooltipProps["placement"];
  small?: boolean;
  interactive?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  onClose?(): void;
};

function Tooltip({
  children,
  message,
  isError,
  placement = "bottom",
  small,
  open,
  interactive,
  disableHoverListener,
  disableTouchListener,
  onClose
}: Props) {
  return (
    <MUITooltip
      title={<>{message}</>}
      classes={{
        tooltip: cn(styles.root, {
          [styles.error]: isError,
          [styles.small]: small
        }),
        arrow: cn(styles.arrow, { [styles.error]: isError }),
        popper: styles.popper
      }}
      placement={placement}
      open={open}
      arrow
      disableFocusListener // onFocus and onBlur do not work if using a Tooltip with TextField https://github.com/mui-org/material-ui/issues/19883#issuecomment-592980194
      interactive={interactive}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
      onClose={onClose}
    >
      {children}
    </MUITooltip>
  );
}

export { Tooltip };
