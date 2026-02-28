import { Message } from '@/types/message';

export const resolveParticipantIdentities = (messages: Message[], participants: string[], originalFileName: string) => {
  let finalParticipants = [...participants];
  let cleanTitle = originalFileName.replace(/^WhatsApp Chat (with|-) /, '').replace(/\.(txt|zip)$/, '');

  const otherPartyName = cleanTitle;
  const hasHidden = participants.includes('Hidden');
  const hasYou = participants.includes('You');

  if (participants.length === 2 && hasHidden && hasYou) {
    messages.forEach(msg => {
      if (msg.sender === 'Hidden') {
        msg.sender = otherPartyName;
        msg.isCurrentUser = false;
      } else if (msg.sender === 'You') {
        msg.isCurrentUser = true;
      }
    });
    finalParticipants = finalParticipants.map(p => p === 'Hidden' ? otherPartyName : p);
  } 
  else if (participants.length === 1 && hasHidden) {
    messages.forEach(msg => {
      if (msg.sender === 'Hidden') {
        msg.sender = otherPartyName;
        msg.isCurrentUser = false;
      }
    });
    finalParticipants = [otherPartyName];
  }
  else if (participants.length === 2) {
    const namedParticipantMatchingZip = participants.find(p => p.toLowerCase() === otherPartyName.toLowerCase());
    const otherParticipant = participants.find(p => p.toLowerCase() !== otherPartyName.toLowerCase());
    
    if (namedParticipantMatchingZip && otherParticipant) {
       messages.forEach(msg => {
         if (msg.sender === namedParticipantMatchingZip) {
           msg.isCurrentUser = false;
         } else {
           msg.sender = 'You';
           msg.isCurrentUser = true;
         }
       });
       finalParticipants = [namedParticipantMatchingZip, 'You'];
    } else {
      const namedParticipant = participants.find(p => p !== 'You' && p !== 'Hidden');
      if (namedParticipant) {
         messages.forEach(msg => {
           if (msg.sender === namedParticipant) {
             msg.isCurrentUser = false;
           } else if (msg.sender === 'You' || msg.sender === 'Hidden') {
             msg.isCurrentUser = true;
           }
         });
      }
    }
  }

  messages.forEach(msg => {
    if (msg.sender === 'Hidden') {
      msg.sender = 'You';
      msg.isCurrentUser = true;
    }
  });
  finalParticipants = Array.from(new Set(finalParticipants.map(p => p === 'Hidden' ? 'You' : p)));

  return { finalParticipants, cleanTitle };
};
