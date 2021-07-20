import { useMemo } from 'react';

import Tabs from 'components/elements/tabs/Tabs';
import { TicketTypeOptions } from 'services/search';
import { useTranslation } from 'react-i18next';

const TicketType = ({
  type,
  setType,
}: {
  type: TicketTypeOptions;
  setType: (type: TicketTypeOptions) => void;
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { value: TicketTypeOptions.cheap, label: t('ticketType.cheap') },
      { value: TicketTypeOptions.fast, label: t('ticketType.fast') },
      { value: TicketTypeOptions.optimal, label: t('ticketType.optimal') },
    ],
    [t]
  );

  return <Tabs options={options} activeValue={type} setActiveValue={setType} />;
};

export default TicketType;
