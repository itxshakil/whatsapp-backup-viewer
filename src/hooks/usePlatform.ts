import { useState, useEffect } from 'react';

interface PlatformInfo {
  isIOS: boolean;
  isMac: boolean;
  isStandalone: boolean;
}

export const usePlatform = (): PlatformInfo => {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isIOS: false,
    isMac: false,
    isStandalone: false,
  });

  useEffect(() => {
    const checkPlatform = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      const ios = /iphone|ipad|ipod/.test(ua);
      const mac = /macintosh/.test(ua) && 'ontouchend' in document;
      const isMacDevice = /macintosh/.test(ua) && !ios;

      const standalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;

      setPlatform({
        isIOS: ios,
        isMac: isMacDevice || mac,
        isStandalone: standalone,
      });
    };

    checkPlatform();
  }, []);

  return platform;
};
