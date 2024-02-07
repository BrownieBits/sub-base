'use client';

import React from 'react';
import { hasCookie, setCookie } from 'cookies-next';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = React.useState(true);

  React.useEffect(() => {
    setShowConsent(hasCookie('localConsent'));
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie('localConsent', 'true', {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/75 z-10">
      <div className="fixed bg-background bottom-0 left-0 right-0 flex flex-col md:flex-row gap-[30px] items-center justify-between p-[15px]">
        <span>
          This website uses cookies to improve user experience. By using our
          website you consent to all cookies in accordance with our Cookie
          Policy.
        </span>
        <div className="flex gap-[30px]">
          <Button onClick={() => acceptCookie()}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
