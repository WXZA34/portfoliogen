'use client';

import RecruiterLayout from '@/components/RecruiterLayout';
import RecruiterMessagingContent from './RecruiterMessagingContent';

export default function RecruiterMessagesPage() {
  return (
    <RecruiterLayout pageTitle="Messagerie" pageSubtitle="Conversations avec les talents">
      <RecruiterMessagingContent />
    </RecruiterLayout>
  );
}
