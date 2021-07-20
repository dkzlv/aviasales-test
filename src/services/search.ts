import { addMinutes } from 'date-fns';
import { HttpError, Methods, request } from './request';

export const getSearchId = () => request<{ searchId: string }>(Methods.get, 'search');

/**
 * It's not really clear from the documentation, what should happen in case of an error.
 * My immediate reaction would be to have a way of saying if we should continue DDoSing
 * the server.
 *
 * If it was up to me, I would:
 * 1. return 429 or 503 if we need to slow down with the requests
 * 2. 404/500 would cause an error state `setError(true)` and `showMustGoOn = false`
 *
 * But from the task I understood that the implementation should be very simple.
 * Based on my "empirical tests"© 500 is an ok error here, it will dissapear after a few tries,
 * but 404 will keep going indefinitely. So… based on the implemetation we act like this:
 * 1. ignore 500
 * 2. stop the cycle for all other errors.
 */
export const getTickets = async (searchId: string) => {
  try {
    const { res, json } = await request<{ stop: boolean; tickets: TicketApi[] }>(
      Methods.get,
      'tickets',
      {
        query: { searchId },
      }
    );
    const tickets: Ticket[] = json.tickets.map((ticket) => ({
      ...ticket,
      totalDuration: getTotalDuration(ticket),
    }));

    return {
      res,
      json: {
        stop: json.stop,
        tickets,
      },
    };
  } catch (error) {
    if (error instanceof HttpError && error.res.status === 500)
      return { json: { stop: false, tickets: [] }, res: error.res };
    return { res: error.res, json: { stop: true, tickets: [] } };
  }
};

export const deriveStopOptions = (tickets: Ticket[]) => {
  const res: number[] = [];
  for (const ticket of tickets) {
    for (const segment of ticket.segments) {
      if (!res.includes(segment.stops.length)) res.push(segment.stops.length);
    }
  }
  return res.sort((a, b) => a - b);
};

export const filterTickets = (tickets: Ticket[], filter: Filter) => {
  // Getting rid of the same link
  let filteredTickets = [...tickets];

  // Filtering based on the checked stop counts.
  // Don't need to do this if filter has nothing checked.
  if (filter.stops) {
    filteredTickets = filteredTickets.filter((ticket) => {
      return ticket.segments.every((segment) => filter.stops?.includes(segment.stops.length));
    });
  }

  let comparator: (ticket1: Ticket, ticket2: Ticket) => number;
  switch (filter.type) {
    case TicketTypeOptions.cheap:
      comparator = (t1, t2) => t1.price - t2.price;
      break;

    case TicketTypeOptions.fast:
      comparator = (t1, t2) => t1.totalDuration - t2.totalDuration;
      break;

    case TicketTypeOptions.optimal:
    default:
      const getTicketScore = getOptimalComparator(tickets);
      comparator = (t1, t2) => getTicketScore(t1) - getTicketScore(t2);
      break;
  }
  return filteredTickets.sort(comparator);
};

function getTotalDuration(ticket: TicketApi) {
  const firstSegment = ticket.segments[0],
    lastSegment = ticket.segments[ticket.segments.length - 1];
  if (!lastSegment || !firstSegment) throw new Error('Segments are not present in the ticket');

  const startDate = new Date(firstSegment.date),
    endDate = addMinutes(new Date(lastSegment.date), lastSegment.duration);

  return endDate.getTime() - startDate.getTime();
}

/**
 * I imagine there may be tons of different implementations for "optimal" algorithm.
 *
 * I decided to go for this:
 * 1. calculate the scale for prices and durations for all the tickets
 * 2. find those that have the lowest values on both of the scales
 */
function getOptimalComparator(tickets: Ticket[]) {
  let minDuration = Infinity,
    maxDuration = -Infinity;
  let minPrice = Infinity,
    maxPrice = -Infinity;

  // Determining the scales in one iteration
  for (const ticket of tickets) {
    const { price, totalDuration } = ticket;
    if (totalDuration < minDuration) minDuration = totalDuration;
    if (totalDuration > maxDuration) maxDuration = totalDuration;
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
  }

  return (ticket: Ticket) => {
    const priceScore = (ticket.price - minPrice) / (maxPrice - minPrice),
      durationScore = (ticket.totalDuration - minDuration) / (maxDuration - minDuration);
    return priceScore + durationScore;
  };
}

type TicketApi = {
  // Цена в рублях
  price: number;
  // Код авиакомпании (iata)
  carrier: string;
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: Segment[];
};
export type Ticket = TicketApi & {
  // Calculated field based on the start date of the first segment and start date + duration
  // of the last one
  totalDuration: number;
};
export type Segment = {
  // Код города (iata)
  origin: string;
  // Код города (iata)
  destination: string;
  // Дата и время вылета туда
  date: string;
  // Массив кодов (iata) городов с пересадками
  stops: string[];
  // Общее время перелёта в минутах
  duration: number;
};

export enum TicketTypeOptions {
  cheap,
  fast,
  optimal,
}
export type Filter = {
  type: TicketTypeOptions;
  stops: number[] | null;
};
