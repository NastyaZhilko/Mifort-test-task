import React from "react";
import { Button, ButtonProps } from "@material-ui/core";
import cn from "classnames";

import styles from "./TextButton.module.scss";

const classes: ButtonProps["classes"] = {
  root: styles.root,
  focusVisible: cn(styles.root, styles.focused)
};

function TextButton({ children, ...rest }: ButtonProps) {
  return (
    <Button disableRipple classes={classes} {...rest}>
      {children}
    </Button>
  );
}

export { TextButton };
