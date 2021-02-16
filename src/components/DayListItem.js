import React from "react";
import classnames from "classnames";

import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const itemClass = classnames(
    'day-list__item',
    {
      'day-list__item--selected': props.selected,
      'day-list__item--full': props.spots === 0,
    }
  );

  const formatSpots = function(spots) {
    const remain = 'remaining';

    if (spots === 0) {
      return `no spots ${remain}`;
    } else if (spots === 1) {
      return `1 spot ${remain}`;
    } else {
      return `${spots} spots ${remain}`;
    }
  };

  return (
    <li className={itemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
};