import { useEffect, useRef, useCallback } from 'react';
import { ReactComponent as PlaneSvg } from './plane.svg';
import styles from './Logo.module.scss';

const Logo = ({ loading }: { loading: boolean }) => {
  const svg = useRef<SVGSVGElement>(null);

  const setClasses = useCallback((currentValue: boolean) => {
    const { current } = svg;
    if (!current || !currentValue) return;

    current.classList.remove(styles.pulse!);
    setTimeout(() => current.classList.add(styles.pulse!));
  }, []);

  const handleAnimationEnd = useCallback(() => setClasses(loading), [loading, setClasses]);
  useEffect(() => setClasses(loading), [setClasses, loading]);

  return <PlaneSvg ref={svg} onAnimationEnd={handleAnimationEnd} />;
};

export default Logo;
