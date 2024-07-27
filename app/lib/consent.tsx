'use client';

import { Button } from '@/components/ui/button';
import { hasCookie, setCookie } from 'cookies-next';
import React from 'react';

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
      <div className="fixed bg-background bottom-0 left-0 right-0 flex flex-col md:flex-row gap-8 items-center justify-between p-4">
        <span>
          This website uses cookies to improve user experience. By using our
          website you consent to all cookies in accordance with our Cookie
          Policy.
        </span>
        <div className="flex gap-8">
          <Button onClick={() => acceptCookie()}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
