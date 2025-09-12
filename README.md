# TimePicker Component Documentation

A modern, customizable time picker component built with React, TypeScript, and shadcn/ui components. This component provides an intuitive interface for selecting time with support for both 12-hour and 24-hour formats.

## Features

- ✅ **Multiple Time Formats**: Support for both 12-hour (AM/PM) and 24-hour formats
- ✅ **Interactive Scrollable Wheels**: Smooth scrolling interface for hours, minutes, seconds, and period selection
- ✅ **Real-time Updates**: Live preview of selected time
- ✅ **Current Time Button**: Quick "Now" button to set current time
- ✅ **Accessible Design**: Built with Radix UI primitives for accessibility
- ✅ **Customizable Styling**: Fully customizable with Tailwind CSS classes
- ✅ **TypeScript Support**: Full TypeScript support with proper type definitions
- ✅ **Responsive Design**: Works well on different screen sizes

## Installation

This component requires the following dependencies:

```bash
npm install @radix-ui/react-popover @radix-ui/react-scroll-area @radix-ui/react-separator @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge
npm install react react-dom
```

Make sure you have the following shadcn/ui components installed:

- `Button`
- `Input`
- `Popover`
- `ScrollArea`
- `Separator`

## Basic Usage

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function App() {
  const [time, setTime] = useState('12:00:00');

  return (
    <div>
      <TimePicker 
        value={time} 
        onChange={setTime} 
      />
    </div>
  );
}
```

## API Reference

### Props

| Prop          | Type                        | Default   | Description                                           |
| ------------- | --------------------------- | --------- | ----------------------------------------------------- |
| `timeType`  | `'12h' \| '24h'`           | `'24h'` | Time format (12-hour or 24-hour)                      |
| `value`     | `string`                  | -         | Current time value (required)                         |
| `onChange`  | `(value: string) => void` | -         | Callback function called when time changes (required) |
| `disabled`  | `boolean`                 | `false` | Whether the time picker is disabled                   |
| `className` | `string`                  | -         | Additional CSS classes for styling                    |

### Time Format

The component accepts and returns time strings in the following formats:

- **24-hour format**: `"HH:MM:SS"` (e.g., `"14:30:45"`)
- **12-hour format**: `"HH:MM:SS AM/PM"` (e.g., `"02:30:45 PM"`)

## Examples

### Basic 24-Hour Format

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function Basic24Hour() {
  const [time, setTime] = useState('14:30:00');

  return (
    <TimePicker 
      timeType="24h"
      value={time} 
      onChange={setTime}
      className="w-48"
    />
  );
}
```

### 12-Hour Format with AM/PM

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function Basic12Hour() {
  const [time, setTime] = useState('02:30:00 PM');

  return (
    <TimePicker 
      timeType="12h"
      value={time} 
      onChange={setTime}
      className="w-56"
    />
  );
}
```

### Disabled State

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function DisabledTimePicker() {
  const [time, setTime] = useState('12:00:00');

  return (
    <TimePicker 
      value={time} 
      onChange={setTime}
      disabled={true}
    />
  );
}
```

### With Form Integration

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function FormExample() {
  const [formData, setFormData] = useState({
    startTime: '09:00:00',
    endTime: '17:00:00'
  });

  const handleTimeChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Start Time
          </label>
          <TimePicker 
            timeType="24h"
            value={formData.startTime} 
            onChange={handleTimeChange('startTime')}
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium mb-2">
            End Time
          </label>
          <TimePicker 
            timeType="24h"
            value={formData.endTime} 
            onChange={handleTimeChange('endTime')}
          />
        </div>
      </div>
    </form>
  );
}
```

### Custom Styling

```tsx
import { useState } from 'react';
import TimePicker from '@/components/time-picker';

function CustomStyled() {
  const [time, setTime] = useState('12:00:00');

  return (
    <TimePicker 
      value={time} 
      onChange={setTime}
      className="w-64 border-2 border-blue-300 rounded-lg shadow-lg"
    />
  );
}
```

## Component Behavior

### Time Selection

- Click on the input field or clock icon to open the time picker popover
- Use the scrollable wheels to select hours, minutes, and seconds
- For 12-hour format, an additional AM/PM selector is available
- Click "Now" to quickly set the current time
- Click "Confirm" to apply the selected time and close the popover

### Validation

- The component automatically validates and formats time strings
- Invalid time strings default to `00:00:00` (24h) or `12:00:00 AM` (12h)
- Hours are validated based on the selected format (0-23 for 24h, 1-12 for 12h)

### Accessibility

- Full keyboard navigation support
- Screen reader compatible
- Focus management for popover interactions
- Proper ARIA labels and roles

## Styling

The component uses Tailwind CSS for styling and can be customized through:

1. **className prop**: Add custom classes to the root container
2. **CSS variables**: Modify shadcn/ui theme variables
3. **Component modification**: Directly modify the component file for advanced customization

## Browser Support

This component supports all modern browsers that support:

- React 18+
- ES2020+ features
- CSS Grid and Flexbox
- Radix UI primitives

## Troubleshooting

### Common Issues

**Time not updating**: Ensure you're passing both `value` and `onChange` props correctly.

**Styling issues**: Make sure all required shadcn/ui components are properly installed and configured.

**TypeScript errors**: Verify that all type definitions are properly imported and the component props match the interface.

**Popover not positioning correctly**: Ensure the parent container has proper positioning context.
