import React from 'react';

export default function Footer () {
  return (
    <footer className="p-4 bottom-0 w-full z-10 flex items-center justify-center">
      <p className="text-gray-400 mr-2 ">
        &copy; 2023{' '}
        <span className="text-blue-300">
          <a href="https://github.com/drensokoli/spoti-engine" target="_blank">Spoti-Engine</a>
        </span>
      </p>
    </footer>
  );
};
