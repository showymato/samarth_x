'use client';
import { useEffect } from 'react';
import { initSite } from '@/lib/behaviors';

export default function Behaviors() {
  useEffect(() => {
    const destroy = initSite();
    return destroy;
  }, []);
  return null;
}
