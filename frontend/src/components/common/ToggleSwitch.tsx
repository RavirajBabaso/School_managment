import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
  return (
    <div
      className="relative inline-flex h-4 w-7 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      style={{ backgroundColor: enabled ? '#1D9E75' : '#d1d5db' }}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-3' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;