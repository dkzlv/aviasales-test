import { useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addMinutes } from 'date-fns';

import styles from './TicketList.module.scss';
import { Filter, filterTickets, Ticket } from 'services/search';

import { ReactComponent as SadSvg } from 'teenyicons/solid/mood-sad.svg';
import TicketItem from 'components/tickets/ticketItem/TicketItem';
import Button from 'components/elements/button/Button';
import BlockOverlay from 'components/elements/blockOverlay/BlockOverlay';

const countStep = 5;
// Preventing from showing 3:5 and showing 03:05 instead.
const padLeft = (val: number) => (val >= 10 ? val : '0' + val);
const getClock = (dt: Date) => `${padLeft(dt.getHours())}:${padLeft(dt.getMinutes())}`;

const TicketList = ({
  isLoading,
  tickets,
  type,
  stops,
}: {
  isLoading: boolean;
  tickets: Ticket[];
} & Filter) => {
  const { t, i18n } = useTranslation();
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'RUB',
      // I have huge doubts about that. 99% sure it is a bad idea in real life
      maximumFractionDigits: 0,
    }).format;
  }, [i18n.language]);
  const intervalFormatter = useCallback((startDate: string, durationInMinutes: number) => {
    // ISO-formatted
    const start = new Date(startDate),
      end = addMinutes(start, durationInMinutes);
    return `${getClock(start)} – ${getClock(end)}`;
  }, []);
  const durationFormatter = useCallback(
    (duration: number) => {
      const hours = Math.floor(duration / 60),
        minutes = duration % 60;

      return t('list.inAirTime', { minutes, hours });
    },
    [t]
  );

  const [showCount, setShowCount] = useState(countStep);
  useEffect(() => {
    setShowCount(countStep);
  }, [stops, type, tickets]);

  const filteredSortedTickets = useMemo(() => {
    return filterTickets(tickets, { type, stops });
  }, [tickets, type, stops]);
  const ticketsToShow = useMemo(
    () => filteredSortedTickets.slice(0, showCount),
    [filteredSortedTickets, showCount]
  );
  const remainingShowCount = useMemo(() => {
    const diff = tickets.length - showCount;
    return diff >= countStep ? countStep : diff;
  }, [tickets.length, showCount]);

  // I am most sure this state is purely theoretical in this test. Still better have it.
  const showOverlay = useMemo(() => {
    return !isLoading && !filteredSortedTickets.length;
  }, [isLoading, filteredSortedTickets.length]);

  return (
    <>
      <BlockOverlay
        show={showOverlay}
        text={t('zeroData.zero')}
        icon={<SadSvg className={styles.loadingIcon} />}
      />
      <ol className={styles.list}>
        {ticketsToShow.map((ticket, i) => (
          <li key={i}>
            <TicketItem
              ticket={ticket}
              currencyFormatter={currencyFormatter}
              intervalFormatter={intervalFormatter}
              durationFormatter={durationFormatter}
            />
          </li>
        ))}
      </ol>
      {remainingShowCount > 0 && (
        <Button
          className={styles.button}
          onClick={() => setShowCount(showCount + remainingShowCount)}>
          {t('list.showMore', { count: remainingShowCount })}
        </Button>
      )}
    </>
  );
};

export default TicketList;
