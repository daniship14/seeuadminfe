'use client';

import { useEffect, useState } from 'react';

export default function useLanguage() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en';
    setLanguage(saved);
  }, []);

  return { language, setLanguage };
}