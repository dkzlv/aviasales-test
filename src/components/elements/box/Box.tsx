import React from 'react';
import styles from './Box.module.scss';

const name = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={`${styles.box} ${className}`}>{children}</div>;
};

export default name;
