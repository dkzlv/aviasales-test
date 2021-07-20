import { Ticket } from 'services/search';
import Box from 'components/elements/box/Box';
import styles from './TicketItem.module.scss';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type Formatter = (val: number) => string;
type IntervalFormatter = (start: string, duration: number) => string;

const TicketItem = ({
  ticket,
  currencyFormatter,
  intervalFormatter,
  durationFormatter,
}: {
  ticket: Ticket;
  currencyFormatter: Formatter;
  intervalFormatter: IntervalFormatter;
  durationFormatter: Formatter;
}) => {
  const { t } = useTranslation();

  return (
    <Box className={styles.box}>
      <div className={styles.firstLine}>
        <p className={styles.price}>{currencyFormatter(ticket.price)}</p>
        <img
          src={`${process.env.REACT_APP_BASE_AIRLINE_LOGO_PATH}/${ticket.carrier}.png`}
          alt={t('list.airlineAlt', { code: ticket.carrier })}
        />
      </div>
      {ticket.segments.map((seg, i) => (
        <Segment
          key={i}
          segment={seg}
          intervalFormatter={intervalFormatter}
          durationFormatter={durationFormatter}
        />
      ))}
    </Box>
  );
};

function Segment({
  segment,
  intervalFormatter,
  durationFormatter,
}: {
  segment: ArrayItem<Ticket['segments']>;
  intervalFormatter: IntervalFormatter;
  durationFormatter: Formatter;
}) {
  const { t } = useTranslation();
  const stops = useMemo(() => segment.stops.join(', '), [segment]);

  return (
    <div className={styles.segment}>
      <LabelAndValue
        label={`${segment.origin} – ${segment.destination}`}
        value={intervalFormatter(segment.date, segment.duration)}
      />
      <LabelAndValue label={t('list.inAir')} value={durationFormatter(segment.duration)} />
      <LabelAndValue label={t('stops.count', { count: segment.stops.length })} value={stops} />
    </div>
  );
}

function LabelAndValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={styles.label}>{label}</p>
      {value && <p className={styles.value}>{value}</p>}
    </div>
  );
}

export default TicketItem;
