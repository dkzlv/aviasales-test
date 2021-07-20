import React from 'react';
import styles from './Checkbox.module.scss';
import { ReactComponent as CheckSvg } from './check.svg';

const Checkbox = ({
  checked,
  onChange,
  className,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <label className={`${styles.label} ${className}`}>
      <input type='checkbox' checked={checked} onChange={onChange} />
      <span className={styles.check}>{checked && <CheckSvg />}</span>
      <span className={styles.text}>{children}</span>
    </label>
  );
};

export default Checkbox;
