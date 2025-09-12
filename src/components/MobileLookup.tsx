import React, { useState } from 'react';
import { useSheets } from '../hooks/useSheets';

interface MobileLookupProps {
  onUserFound?: (userData: any) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  className?: string;
}

const MobileLookup: React.FC<MobileLookupProps> = ({
  onUserFound,
  onError,
  placeholder = "Enter mobile number",
  className = ""
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const { searchByMobile, loading, error, data } = useSheets();

  const handleSearch = async () => {
    if (!mobileNumber.trim()) return;
    
    const result = await searchByMobile(mobileNumber);
    
    if (result.success && result.data) {
      onUserFound?.(result.data);
    } else {
      onError?.(result.error || 'User not found');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <input
          type="tel"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !mobileNumber.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold text-green-800 mb-2">User Found!</h3>
          <div className="space-y-1 text-sm text-green-700">
            {Object.entries(data).map(([key, value]) => {
              if (key === '_originalHeaders') return null;
              return (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span>{String(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLookup;


