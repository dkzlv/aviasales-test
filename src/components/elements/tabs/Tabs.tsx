import { useMemo } from 'react';
import SmallCaps from 'components/elements/smallCaps/SmallCaps';
import styles from './Tabs.module.scss';

function Tabs<T extends React.Key>({
  activeValue,
  setActiveValue,
  options,
}: {
  activeValue: T;
  setActiveValue: (newVal: T) => void;
  options: { label: string; value: T }[];
}) {
  const name = useMemo(() => Math.random().toString(), []);

  return (
    <ol className={styles.tabs}>
      {options.map(({ value, label }) => {
        const id = name + label;

        return (
          <li className={styles.item} key={value}>
            <label id={id} className={styles.label}>
              <input
                type='radio'
                name={name}
                checked={value === activeValue}
                id={id}
                onChange={() => setActiveValue(value)}
              />
              <SmallCaps className={styles.text}>{label}</SmallCaps>
            </label>
          </li>
        );
      })}
    </ol>
  );
}

export default Tabs;
