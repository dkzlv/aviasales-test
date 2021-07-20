import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from 'components/elements/box/Box';
import styles from './Stops.module.scss';
import { deriveStopOptions, Filter, Ticket } from 'services/search';
import Checkbox from 'components/elements/checkbox/Checkbox';
import SmallCaps from 'components/elements/smallCaps/SmallCaps';

const Stop = ({
  tickets,
  stops,
  setStops,
}: {
  tickets: Ticket[];
  stops: Filter['stops'];
  setStops: (val: Filter['stops']) => void;
}) => {
  const { t } = useTranslation();

  const possibleStops = useMemo(() => deriveStopOptions(tickets), [tickets]);

  const toggleStops = useCallback(
    (val: number) => {
      if (stops) {
        if (stops.includes(val)) {
          // Everything was toggled off — setting back to all
          if (stops.length === 1) setStops(null);
          // Toggling off this exact value
          else setStops(stops.filter((currVal) => currVal !== val));
        } else {
          // Just adding a new value to the array
          setStops([...stops, val]);
        }
      } else {
        // Previous value was null — just setting this val
        setStops([val]);
      }
    },
    [setStops, stops]
  );

  return (
    <Box>
      <div className={styles.rowWrapper}>
        <SmallCaps className={styles.row}>{t('stops.title')}</SmallCaps>
        <Checkbox
          className={`${styles.row} ${styles.hoverable}`}
          checked={!stops}
          onChange={() => setStops(null)}>
          {t('stops.all')}
        </Checkbox>
        {possibleStops.map((val) => (
          <Checkbox
            key={val}
            className={`${styles.row} ${styles.hoverable}`}
            checked={!!stops?.includes(val)}
            onChange={() => toggleStops(val)}>
            {val === 0 ? t('stops.noCount') : t('stops.count', { count: val })}
          </Checkbox>
        ))}
      </div>
    </Box>
  );
};

export default Stop;
