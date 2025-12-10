import React from 'react';
import { getVersion, getVersionInfo } from '@/lib/version';

interface VersionBadgeProps {
  showDetails?: boolean;
  className?: string;
}

export default function VersionBadge({ showDetails = false, className = '' }: VersionBadgeProps) {
  const version = getVersion();
  const versionInfo = getVersionInfo();

  if (showDetails) {
    return (
      <div className={`text-sm ${className}`}>
        <div className="font-semibold">Version {version}</div>
        <div className="text-xs text-gray-500 mt-1">
          {versionInfo.releaseName}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          Released: {new Date(versionInfo.releaseDate).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md bg-violet-100 text-violet-700 text-xs font-medium ${className}`}>
      v{version}
    </span>
  );
}
