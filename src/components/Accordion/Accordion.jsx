import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { Icon } from '@iconify/react';
import './Accordion.scss';


export function Accordion({
  title,
  children,
  defaultExpanded = false,
  expanded,
  onChange,
  ...rest
}) {
  const isControlled = expanded !== undefined;

  return (
    <MuiAccordion
      className="accordion-reusable"
      defaultExpanded={!isControlled && defaultExpanded}
      expanded={isControlled ? expanded : undefined}
      onChange={isControlled ? onChange : undefined}
      disableGutters
      square
      {...rest}
    >
      <MuiAccordionSummary
        expandIcon={<Icon icon="mdi:chevron-down" className="accordion-chevron" />}
        className="accordion-summary"
      >
        <span className="accordion-title">{title}</span>
      </MuiAccordionSummary>
      <MuiAccordionDetails className="accordion-details">{children}</MuiAccordionDetails>
    </MuiAccordion>
  );
}

export default Accordion;
