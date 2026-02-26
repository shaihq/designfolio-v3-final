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

// Default Finder menus
const DEFAULT_MENUS: MenuConfig[] = [
  {
    label: 'File',
    items: [
      { label: 'New Tab', action: 'new-tab', shortcut: '⌘T' },
      { label: 'New Window', action: 'new-window', shortcut: '⌘N' },
      { label: 'New Private Window', action: 'new-private', shortcut: '⇧⌘N' },
      { type: 'separator' },
      { label: 'Open File...', action: 'open-file', shortcut: '⌘O' },
      { label: 'Open Location...', action: 'open-location', shortcut: '⌘L' },
      { type: 'separator' },
      { label: 'Close Window', action: 'close-window', shortcut: '⇧⌘W' },
      { label: 'Close Tab', action: 'close-tab', shortcut: '⌘W' },
      { label: 'Save Page As...', action: 'save-page', shortcut: '⌘S' },
      { type: 'separator' },
      { label: 'Share', action: 'share', hasSubmenu: true },
      { type: 'separator' },
      { label: 'Print...', action: 'print', shortcut: '⌘P' },
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
      { label: 'Select All', action: 'select-all', shortcut: '⌘A' },
      { type: 'separator' },
      { label: 'Find', action: 'find', shortcut: '⌘F' },
      { label: 'Find Next', action: 'find-next', shortcut: '⌘G' },
      { label: 'Find Previous', action: 'find-prev', shortcut: '⇧⌘G' },
      { type: 'separator' },
      { label: 'Emoji & Symbols', action: 'emoji', shortcut: '⌃⌘␣' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'as Icons', action: 'view-icons', shortcut: '⌘1' },
      { label: 'as List', action: 'view-list', shortcut: '⌘2' },
      { label: 'as Columns', action: 'view-columns', shortcut: '⌘3' },
      { label: 'as Gallery', action: 'view-gallery', shortcut: '⌘4' },
      { type: 'separator' },
      { label: 'Use Stacks', action: 'use-stacks', shortcut: '⌃⌘0' },
      { label: 'Sort By', action: 'sort-by', hasSubmenu: true },
      { type: 'separator' },
      { label: 'Hide Sidebar', action: 'hide-sidebar', shortcut: '⌥⌘S' },
      { label: 'Show Preview', action: 'show-preview', shortcut: '⇧⌘P' },
      { type: 'separator' },
      { label: 'Enter Full Screen', action: 'fullscreen', shortcut: '⌃⌘F' },
    ],
  },
  {
    label: 'Window',
    items: [
      { label: 'Minimize', action: 'minimize', shortcut: '⌘M' },
      { label: 'Zoom', action: 'zoom' },
      { type: 'separator' },
      { label: 'Cycle Through Windows', action: 'cycle-windows', shortcut: '⌘`' },
      { type: 'separator' },
      { label: 'Bring All to Front', action: 'bring-to-front' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Search', action: 'search-help' },
      { type: 'separator' },
      { label: 'App Help', action: 'app-help' },
      { label: 'Keyboard Shortcuts', action: 'shortcuts' },
      { type: 'separator' },
      { label: 'Contact Support', action: 'contact-support' },
    ],
  },
];

// Apple menu items
const APPLE_MENU_ITEMS: MenuItemOption[] = [
  { label: 'About This Mac', action: 'about' },
  { type: 'separator' },
  { label: 'System Preferences...', action: 'preferences' },
  { label: 'App Store...', action: 'app-store' },
  { type: 'separator' },
  { label: 'Recent Items', action: 'recent', hasSubmenu: true },
  { type: 'separator' },
  { label: 'Force Quit Applications...', action: 'force-quit', shortcut: '⌥⌘⎋' },
  { type: 'separator' },
  { label: 'Sleep', action: 'sleep' },
  { label: 'Restart...', action: 'restart' },
  { label: 'Shut Down...', action: 'shutdown' },
  { type: 'separator' },
  { label: 'Lock Screen', action: 'lock', shortcut: '⌃⌘Q' },
  { label: 'Log Out...', action: 'logout', shortcut: '⇧⌘Q' },
];

// MenuDropdown Component (bundled inside)
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
        background: 'rgba(40, 40, 40, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '8px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `,
        minWidth: '220px',
      }}
    >
      <div className="py-1">
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <div
                key={index}
                className="h-px bg-white/15 mx-2 my-1"
              />
            );
          }

          return (
            <div
              key={index}
              className="px-4 py-1 text-white text-sm cursor-pointer hover:bg-white/10 transition-colors duration-100 flex justify-between items-center"
              onClick={() => {
                if (item.action) {
                  onAction?.(item.action);
                }
                onClose();
              }}
            >
              <span className="flex items-center">
                {item.label}
                {item.hasSubmenu && (
                  <span className="ml-2 text-xs opacity-70">▶</span>
                )}
              </span>
              {item.shortcut && (
                <span className="text-xs text-white/60 ml-4">
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
  appName = 'Finder',
  menus = DEFAULT_MENUS,
  onMenuAction,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const appleLogoRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  // Update clock every minute
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

  const handleAppleMenuClick = useCallback(() => {
    if (activeMenu === 'apple') {
      setActiveMenu(null);
    } else {
      if (appleLogoRef.current) {
        const rect = appleLogoRef.current.getBoundingClientRect();
        setDropdownPosition({
          x: rect.left,
          y: rect.bottom + 4
        });
      }
      setActiveMenu('apple');
    }
  }, [activeMenu]);

  const handleMenuItemClick = useCallback((menuLabel: string) => {
    if (activeMenu === menuLabel) {
      setActiveMenu(null);
    } else {
      const menuRef = menuRefs.current[menuLabel];
      if (menuRef) {
        const rect = menuRef.getBoundingClientRect();
        setDropdownPosition({
          x: rect.left,
          y: rect.bottom + 4
        });
        setActiveMenu(menuLabel);
      }
    }
  }, [activeMenu]);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-7 backdrop-blur-md z-[100] flex justify-between items-center px-4 select-none ${className}`}
      style={{
        background: 'rgba(40, 40, 40, 0.65)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="flex items-center space-x-4">
        {/* Apple Logo */}
        <div
          ref={appleLogoRef}
          onClick={handleAppleMenuClick}
          className="cursor-pointer hover:opacity-80 transition-opacity duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <path d="M35.8607 14.3457H34.0718V21.5131H35.8607V14.3457Z" fill="white"/>
            <path d="M10.757 14.3476H12.5459V12.5469H14.3466V10.758H21.514V12.5469H23.3147V10.758H28.6932V12.5469H30.4821V26.8935H32.2828V23.3157H34.0717V21.515H32.2828V14.3476H34.0717V12.5469H32.2828V5.37954H30.4821V7.16845H28.6932V5.37954H25.1036V3.57886H12.5459V5.37954H10.757V7.16845H8.9681V10.758H7.16742V5.37954H5.37851V10.758H3.5896V12.5469H10.757V14.3476Z" fill="white"/>
            <path d="M30.482 26.8928H28.6931V28.6935H30.482V26.8928Z" fill="white"/>
            <path d="M30.482 3.57886H28.6931V5.37954H30.482V3.57886Z" fill="white"/>
            <path d="M28.6931 23.3154H26.8924V25.1043H28.6931V23.3154Z" fill="white"/>
            <path d="M28.6931 17.9246H26.8924V21.5142H28.6931V17.9246Z" fill="white"/>
            <path d="M28.6931 1.78955H26.8924V3.57846H28.6931V1.78955Z" fill="white"/>
            <path d="M12.5459 28.6943V32.2898H8.96807V34.0787H5.37848V35.8676H34.0717V34.0787H30.4821V32.2898H26.8925V30.4891H28.6932V28.7002L12.5459 28.6943ZM25.1036 34.0728H17.9362V32.2898H14.3466V30.4891H25.1094L25.1036 34.0728Z" fill="white"/>
            <path d="M26.8926 25.1047H21.5141V26.8936H26.8926V25.1047Z" fill="white"/>
            <path d="M21.5139 23.3154H19.725V25.1043H21.5139V23.3154Z" fill="white"/>
            <path d="M19.7251 17.9246H17.9362V21.5142H19.7251V17.9246Z" fill="white"/>
            <path d="M21.514 12.5457H17.9362V14.3463H21.514V12.5457Z" fill="white"/>
            <path d="M14.3465 14.3457H12.5458V21.5131H14.3465V14.3457Z" fill="white"/>
            <path d="M26.8925 0H10.757V1.78891H26.8925V0Z" fill="white"/>
            <path d="M12.5459 26.8928H10.757V28.6935H12.5459V26.8928Z" fill="white"/>
            <path d="M12.5459 21.5139H10.757V23.3146H12.5459V21.5139Z" fill="white"/>
            <path d="M3.5896 23.3154V25.1043H8.9681V26.8932H10.757V23.3154H3.5896Z" fill="white"/>
            <path d="M10.757 1.78955H8.96808V3.57846H10.757V1.78955Z" fill="white"/>
            <path d="M8.96804 3.57886H7.16736V5.37954H8.96804V3.57886Z" fill="white"/>
            <path d="M7.16739 14.3457H5.37848V16.1346H7.16739V14.3457Z" fill="white"/>
            <path d="M5.37851 16.135H3.5896V19.7246H5.37851V16.135Z" fill="white"/>
            <path d="M3.58938 21.5139H1.7887V23.3146H3.58938V21.5139Z" fill="white"/>
            <path d="M3.58938 12.5457H1.7887V14.3463H3.58938V12.5457Z" fill="white"/>
            <path d="M1.78891 14.3457H0V21.5131H1.78891V14.3457Z" fill="white"/>
          </svg>
        </div>

        {/* Current App Name */}
        <span className="text-white text-[13px] font-bold cursor-default px-2">
          {appName}
        </span>

        {/* Menu Items */}
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
        {/* System Icons */}
        <div className="flex items-center space-x-3 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line><line x1="6" y1="11" x2="14" y2="11"></line></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
        </div>
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