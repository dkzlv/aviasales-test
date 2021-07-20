import styles from './SmallCaps.module.scss';

const SmallCaps = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <span className={`${styles.title} ${className}`}>{children}</span>;
};

export default SmallCaps;
