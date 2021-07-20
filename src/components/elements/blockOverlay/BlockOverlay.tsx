import SmallCaps from 'components/elements/smallCaps/SmallCaps';
import { useCallback, useState, useEffect } from 'react';
import styles from './BlockOverlay.module.scss';

const BlockOverlay = ({
  show,
  icon,
  text,
}: {
  show: boolean;
  icon: React.ReactNode;
  text: React.ReactNode;
}) => {
  const [inDom, setInDom] = useState(show);
  // Resetting animation when show is toggled
  useEffect(() => {
    if (show) setInDom(true);
  }, [show]);
  const animationEndHandler = useCallback(() => setInDom(false), []);

  return inDom ? (
    <div
      className={`${styles.wrapper} ${!show && styles.hidden}`}
      onAnimationEnd={animationEndHandler}>
      <div className={styles.content}>
        {icon}
        <SmallCaps>{text}</SmallCaps>
      </div>
    </div>
  ) : null;
};

export default BlockOverlay;
