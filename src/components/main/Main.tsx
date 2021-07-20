import { useState, useEffect, useCallback, useRef } from 'react';
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
    currSearchIdRef = useRef(''),
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
        currSearchIdRef.current = searchId;
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  // Initializing search
  useEffect(startSearch, [startSearch]);
  // Getting the tickets
  useEffect(
    () => {
      if (!searchId) return;

      const run = async () => {
        let showMustGoOn = true,
          innerTickets = tickets;

        while (showMustGoOn) {
          const { json } = await getTickets(searchId);

          // Escaping the function when searchId has changed.
          // It's ok to send a request above, but not ok to save the result to the state.
          if (searchId !== currSearchIdRef.current) {
            return;
          }

          showMustGoOn = !json.stop;
          innerTickets = [...innerTickets, ...json.tickets];
          setTickets(innerTickets);
        }
        setIsLoading(false);
      };
      run();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchId]
  );

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
              show={isError || !tickets.length}
              text={isError ? t('zeroData.error') : t('zeroData.loading')}
              icon={
                isError ? (
                  <ErrorSvg className={styles.errorIcon} />
                ) : (
                  <LoaderSvg className={styles.loadingIcon} color='hotpink' />
                )
              }
            />
            <TicketList tickets={tickets} stops={stops} type={type} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;