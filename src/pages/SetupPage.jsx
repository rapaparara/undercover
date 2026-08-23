import React, { useState } from 'react';
import { PlayerCountForm } from '../components/game/PlayerCountForm.jsx';
import { GameSettingsForm } from '../components/game/GameSettingsForm.jsx';

export function SetupPage() {
  const [step, setStep] = useState('count'); // 'count' | 'settings'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {step === 'count' ? (
        <PlayerCountForm onNext={() => setStep('settings')} />
      ) : (
        <GameSettingsForm onBack={() => setStep('count')} />
      )}
    </div>
  );
}
