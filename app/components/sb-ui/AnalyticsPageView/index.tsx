'use client';

import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';
import React from 'react';

type Props = {
  options: {
    [key: string]: number;
  };
};
export default function PageViewAnalytics(props: Props) {
  React.useEffect(() => {
    if (analytics !== null) {
      logEvent(analytics, 'page_view', props.options);
    }
  }, []);

  return <></>;
}
