import { useState } from 'react';
import TimePicker from '@/components/time-picker';

export default function Playground() {
    const [value, setValue] = useState('12:00:00');
return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <TimePicker className='w-40 h-10' value={value} onChange={setValue} />
    </div>
)

}