'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Types
interface MenuItemOption {
  label?: string;
  action?: string;
  shortcut?: string;
  type?: 'item' | 'separator';
  hasSubmenu?: boolean;
}

interface MenuConfig {
  label: string;
  items: MenuItemOption[];
}

interface MacOSMenuBarProps {
  appName?: string;
  menus?: MenuConfig[];
  onMenuAction?: (action: string) => void;
  className?: string;
}

// Default menus
const DEFAULT_MENUS: MenuConfig[] = [
  {
    label: 'File',
    items: [
      { label: 'New Project', action: 'new-project', shortcut: '⌘N' },
      { label: 'Open...', action: 'open', shortcut: '⌘O' },
      { type: 'separator' },
      { label: 'Save', action: 'save', shortcut: '⌘S' },
      { label: 'Export...', action: 'export', shortcut: '⇧⌘E' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', action: 'undo', shortcut: '⌘Z' },
      { label: 'Redo', action: 'redo', shortcut: '⇧⌘Z' },
      { type: 'separator' },
      { label: 'Cut', action: 'cut', shortcut: '⌘X' },
      { label: 'Copy', action: 'copy', shortcut: '⌘C' },
      { label: 'Paste', action: 'paste', shortcut: '⌘V' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Show Sidebar', action: 'show-sidebar', shortcut: '⌘S' },
      { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation', action: 'docs' },
      { label: 'Contact Support', action: 'contact' },
    ],
  },
];

// Apple menu items
const APPLE_MENU_ITEMS: MenuItemOption[] = [
  { label: 'About Designfolio', action: 'about' },
  { type: 'separator' },
  { label: 'System Settings...', action: 'settings' },
  { label: 'App Store...', action: 'app-store' },
  { type: 'separator' },
  { label: 'Restart...', action: 'restart' },
  { label: 'Shut Down...', action: 'shutdown' },
  { type: 'separator' },
  { label: 'Lock Screen', action: 'lock', shortcut: '⌃⌘Q' },
];

// MenuDropdown Component
interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItemOption[];
  position: { x: number; y: number };
  onAction?: (action: string) => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  isOpen,
  onClose,
  items,
  position,
  onAction
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed backdrop-blur-md z-[110]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: 'rgba(25, 25, 25, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        minWidth: '200px',
      }}
    >
      <div className="py-1">
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <div
                key={index}
                className="h-px bg-white/10 mx-1 my-1"
              />
            );
          }

          return (
            <div
              key={index}
              className="px-3 py-1 text-white text-[13px] cursor-default hover:bg-primary transition-colors flex justify-between items-center"
              onClick={() => {
                if (item.action) {
                  onAction?.(item.action);
                }
                onClose();
              }}
            >
              <span>{item.label ?? ''}</span>
              {item.shortcut && (
                <span className="text-[11px] text-white/40 ml-4">
                  {item.shortcut}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MacOSMenuBar: React.FC<MacOSMenuBarProps> = ({
  appName = 'Designfolio',
  menus = DEFAULT_MENUS,
  onMenuAction,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const appleLogoRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAppleMenuClick = () => {
    if (activeMenu === 'apple') {
      setActiveMenu(null);
    } else {
      if (appleLogoRef.current) {
        const rect = appleLogoRef.current.getBoundingClientRect();
        setDropdownPosition({ x: rect.left, y: rect.bottom + 4 });
      }
      setActiveMenu('apple');
    }
  };

  const handleMenuItemClick = (menuLabel: string) => {
    if (activeMenu === menuLabel) {
      setActiveMenu(null);
    } else {
      const menuRef = menuRefs.current[menuLabel];
      if (menuRef) {
        const rect = menuRef.getBoundingClientRect();
        setDropdownPosition({ x: rect.left, y: rect.bottom + 4 });
        setActiveMenu(menuLabel);
      }
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-7 backdrop-blur-md z-[100] flex justify-between items-center px-4 select-none ${className}`}
      style={{
        background: 'rgba(25, 25, 25, 0.4)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center space-x-4">
        <div
          ref={appleLogoRef}
          onClick={handleAppleMenuClick}
          className="cursor-default hover:opacity-80 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 110 140" fill="white">
            <path d="M88.4,96.3c-5.2,8.8-12.7,19.2-22.3,19.2c-9,0-12.2-5.4-22.6-5.4c-10.4,0-14.1,5.3-22.6,5.3c-8.6,0-17.6-11.8-23.3-22.5 C6.7,70.9-2.3,44.7,6.8,28.8C11.3,21,19.5,16.1,28.4,16.1c9,0,17.4,6.2,23,6.2c5.5,0,15.2-7.5,25.8-7.5c11,0,21.1,5.9,27.5,15.2 c-22.6,13.2-18.9,43.2,3.3,52.3C103.6,90,95.5,100,88.4,96.3z M76,0c0.6,7.7-1,14.1-5.8,20.3c-5.1,5.4-9.5,8.8-17.1,9.2 c-1-0.1-2-0.1-3-0.2C49.5,20.8,51.7,14.8,56.7,8.3C61.6,2.9,68.7-1,76,0z" />
          </svg>
        </div>

        <span className="text-white text-[13px] font-bold cursor-default px-2">
          {appName}
        </span>

        {menus.map((menu) => (
          <span
            key={menu.label}
            ref={(el) => { menuRefs.current[menu.label] = el; }}
            onClick={() => handleMenuItemClick(menu.label)}
            className="text-white text-[13px] cursor-default px-2 py-0.5 rounded hover:bg-white/10 transition-colors"
          >
            {menu.label}
          </span>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-white text-[13px] font-medium cursor-default">
          {currentTime}
        </span>
      </div>

      <MenuDropdown
        isOpen={activeMenu === 'apple'}
        onClose={() => setActiveMenu(null)}
        items={APPLE_MENU_ITEMS}
        position={dropdownPosition}
        onAction={onMenuAction}
      />

      {menus.map((menu) => (
        <MenuDropdown
          key={menu.label}
          isOpen={activeMenu === menu.label}
          onClose={() => setActiveMenu(null)}
          items={menu.items}
          position={dropdownPosition}
          onAction={onMenuAction}
        />
      ))}
    </div>
  );
};

export default MacOSMenuBar;