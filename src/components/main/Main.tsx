import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Main.module.scss';
import { ReactComponent as LoaderSvg } from 'teenyicons/outline/loader.svg';
import { ReactComponent as ErrorSvg } from 'teenyicons/solid/x-circle.svg';

import { Filter, getSearchId, getTickets, Ticket, TicketTypeOptions } from 'services/search';

import Logo from 'components/logo/Logo';
import Stops from 'components/filters/stops/Stops';
import TicketType from 'components/filters/ticketType/TicketType';
import TicketList from 'components/tickets/ticketList/TicketList';
import BlockOverlay from 'components/elements/blockOverlay/BlockOverlay';

const Main = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false),
    [isError, setIsError] = useState(false);

  const [searchId, setSearchId] = useState<string | null>(null),
    [tickets, setTickets] = useState<Ticket[]>([]);

  const [stops, setStops] = useState<Filter['stops']>(null),
    [type, setType] = useState<Filter['type']>(TicketTypeOptions.cheap);

  const startSearch = useCallback(() => {
    setIsLoading(true);
    setTickets([]);
    setStops(null);
    getSearchId()
      .then((res) => {
        const { searchId } = res.json;
        setSearchId(searchId);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  // Initializing search
  useEffect(startSearch, [startSearch]);
  // Getting the tickets
  useEffect(() => {
    if (!searchId) return;
    let searchIdChanged = false;

    const run = async () => {
      let showMustGoOn = true;

      while (showMustGoOn) {
        const { json } = await getTickets(searchId);

        if (searchIdChanged) return;

        showMustGoOn = !json.stop;
        setTickets((oldTickets) => [...oldTickets, ...json.tickets]);
      }
      setIsLoading(false);
    };
    run();

    return () => {
      searchIdChanged = true;
    };
  }, [searchId]);

  const overlayData = useMemo<{
    text: string;
    icon: React.ReactNode;
  } | null>(() => {
    if (isError)
      return {
        text: t('zeroData.error'),
        icon: <ErrorSvg className={styles.errorIcon} />,
      };
    if (isLoading && !tickets.length)
      return {
        text: t('zeroData.loading'),
        icon: <LoaderSvg className={styles.loadingIcon} />,
      };
    return null;
  }, [isError, isLoading, tickets.length, t]);

  return (
    <div className={styles.container}>
      <div className={styles.logo} onClick={startSearch}>
        <Logo loading={isLoading} />
      </div>
      <main className={styles.main}>
        <aside className={styles.aside}>
          <Stops tickets={tickets} stops={stops} setStops={setStops} />
        </aside>

        <div className={styles.ticketColumn}>
          <TicketType type={type} setType={setType} />
          <div className={styles.ticketList}>
            <BlockOverlay
              show={overlayData !== null}
              text={overlayData?.text}
              icon={overlayData?.icon}
            />
            <TicketList isLoading={isLoading} tickets={tickets} stops={stops} type={type} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
