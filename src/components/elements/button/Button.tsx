import styles from './Button.module.scss';
import SmallCaps from 'components/elements/smallCaps/SmallCaps';

const Button = ({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & JSX.IntrinsicElements['button']) => {
  return (
    <button className={styles.button + ' ' + className} {...rest}>
      <SmallCaps>{children}</SmallCaps>
    </button>
  );
};

export default Button;
