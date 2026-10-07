import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Top-level module mocks
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    setProperties: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    setFillColor: vi.fn(),
    roundedRect: vi.fn(),
    line: vi.fn(),
    save: vi.fn(),
    lastAutoTable: { finalY: 50 }
  }))
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn()
}));

// Mock browser globals for JSDOM
if (typeof window !== 'undefined') {
  window.alert = vi.fn();
  window.confirm = vi.fn(() => true);
  window.open = vi.fn();

  (window as any).Notification = {
    permission: 'default',
    requestPermission: vi.fn().mockResolvedValue('granted')
  };
}
