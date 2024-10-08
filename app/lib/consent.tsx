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
    const today = new Date();
    const expires = new Date(today.setMonth(today.getMonth() + 3));
    setShowConsent(true);
    setCookie('localConsent', 'true', {
      secure: true,
      expires: expires,
    });
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 bg-background/75">
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-between gap-8 bg-background p-4 md:flex-row">
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
