import { useCallback, useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils'
import { ScrollArea } from "@/components/ui/scroll-area"
import SvgIcon from '@/components/svg-icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type WheelType = 'hour' | 'minute' | 'second' | 'period';

export interface TimePickerProps {
    timeType?: '12h' | '24h';
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

interface TimeValue {
    hour: number;
    minute: number;
    second: number;
    period?: 'AM' | 'PM';
}

export default function TimePicker({
    timeType = '24h',
    value,
    onChange,
    disabled = false,
    className
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const scrollRefs = useRef<{ [key in WheelType]?: HTMLDivElement }>({});

    // 解析时间字符串
    const parseTime = useCallback((timeStr: string): TimeValue => {
        if (!timeStr) {
            const now = new Date();
            return {
                hour: timeType === '12h' ? (now.getHours() % 12 || 12) : now.getHours(),
                minute: now.getMinutes(),
                second: now.getSeconds(),
                period: timeType === '12h' ? (now.getHours() >= 12 ? 'PM' : 'AM') : undefined
            };
        }

        const timeRegex = timeType === '12h'
            ? /^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i
            : /^(\d{1,2}):(\d{2}):(\d{2})$/;

        const match = timeStr.match(timeRegex);
        if (match) {
            return {
                hour: parseInt(match[1], 10),
                minute: parseInt(match[2], 10),
                second: parseInt(match[3], 10),
                period: timeType === '12h' ? (match[4]?.toUpperCase() as 'AM' | 'PM') : undefined
            };
        }

        return {
            hour: timeType === '12h' ? 12 : 0,
            minute: 0,
            second: 0,
            period: timeType === '12h' ? 'AM' : undefined
        };
    }, [timeType]);

    // 格式化时间为字符串
    const formatTime = useCallback((time: TimeValue): string => {
        const hour = time.hour.toString().padStart(2, '0');
        const minute = time.minute.toString().padStart(2, '0');
        const second = time.second.toString().padStart(2, '0');

        if (timeType === '12h') {
            return `${hour}:${minute}:${second} ${time.period}`;
        }
        return `${hour}:${minute}:${second}`;
    }, [timeType]);

    const [currentTime, setCurrentTime] = useState<TimeValue>(() => parseTime(value));

    // 更新时间值
    const updateTime = useCallback((newTime: TimeValue) => {
        setCurrentTime(newTime);
        onChange(formatTime(newTime));
    }, [onChange, formatTime]);

    // 滚动到指定项目
    const scrollToItem = useCallback((type: WheelType, index: number) => {
        const container = scrollRefs.current[type];
        if (container) {
            const itemHeight = 32;
            const containerHeight = container.clientHeight;
            const scrollTop = index * itemHeight - (containerHeight / 2) + (itemHeight / 2);
            container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
    }, []);

    // 处理滚轮项目点击
    const handleItemClick = useCallback((type: WheelType, newValue: number | string) => {
        const newTime = { ...currentTime };

        switch (type) {
            case 'hour':
                newTime.hour = newValue as number;
                break;
            case 'minute':
                newTime.minute = newValue as number;
                break;
            case 'second':
                newTime.second = newValue as number;
                break;
            case 'period':
                newTime.period = newValue as 'AM' | 'PM';
                break;
            default:
        }

        updateTime(newTime);
    }, [currentTime, updateTime]);

    // 设置当前时间
    const setNowTime = useCallback(() => {
        const now = new Date();
        const newTime: TimeValue = {
            hour: timeType === '12h' ? (now.getHours() % 12 || 12) : now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds(),
            period: timeType === '12h' ? (now.getHours() >= 12 ? 'PM' : 'AM') : undefined
        };
        updateTime(newTime);
    }, [timeType, updateTime]);

    // 生成滚轮项目
    const wheelItems = useCallback((type: WheelType) => {
        let items: (number | string)[] = [];
        let currentValue: number | string = 0;

        switch (type) {
            case 'hour': {
                const hourScale = timeType === '24h' ? 24 : 12;
                items = Array.from({ length: hourScale }, (_, i) => (timeType === '24h' ? i : (i === 0 ? 12 : i)));
                currentValue = currentTime.hour;
                break;
            }
            case 'minute':
                items = Array.from({ length: 60 }, (_, i) => i);
                currentValue = currentTime.minute;
                break;
            case 'second':
                items = Array.from({ length: 60 }, (_, i) => i);
                currentValue = currentTime.second;
                break;
            case 'period':
                items = ['AM', 'PM'];
                currentValue = currentTime.period || 'AM';
                break;
            default:
                break;
        }

        return (
            <ScrollArea
              className="h-full w-full py-2"
              ref={(el: HTMLDivElement | null) => {
                    if (el) scrollRefs.current[type] = el.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
                }}
            >
                <div className="flex flex-col">
                    {items.map((item, index) => {
                        const displayValue = typeof item === 'number'
                            ? item.toString().padStart(2, '0') : item;
                        const isSelected = item === currentValue;

                        return (
                            <Button
                              variant="ghost"
                              key={index}
                              className={cn(
                                    "h-8 w-[70%] mx-auto flex items-center justify-center text-sm cursor-pointer transition-colors",
                                    "hover:opacity-100 hover:bg-gray-100",
                                    isSelected && "!bg-primary !text-primary-foreground font-medium"
                                )}
                              onClick={() => handleItemClick(type, item)}
                            >
                                {displayValue}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        );
    }, [timeType, currentTime, handleItemClick]);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        onChange(formatTime(currentTime));
    }, [currentTime, onChange, formatTime]);

    // 当弹窗打开时滚动到当前值
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                scrollToItem('hour', timeType === '24h' ? currentTime.hour
                    : (currentTime.hour === 12 ? 0 : currentTime.hour - 1));
                scrollToItem('minute', currentTime.minute);
                scrollToItem('second', currentTime.second);
                if (timeType === '12h' && currentTime.period) {
                    scrollToItem('period', currentTime.period === 'AM' ? 0 : 1);
                }
            }, 100);
        }
    }, [isOpen, currentTime, scrollToItem, timeType]);

    // 监听外部值变化
    useEffect(() => {
        const newTime = parseTime(value);
        setCurrentTime(newTime);
    }, [value, parseTime]);

    const displayValue = value || '';

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className={cn("relative", className)}>
                    <Input
                      type="text"
                      value={displayValue}
                      placeholder="Select Time"
                      readOnly
                      disabled={disabled}
                      className="pr-10 cursor-pointer"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      disabled={disabled}
                    >
                        <SvgIcon icon="clock" className="h-4 w-4" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className={`p-0 ${timeType === '12h' ? 'w-74' : 'w-60'}`}>
             
                <div className="flex h-48">
                    <div className="flex-1">
                        {wheelItems('hour')}
                    </div>
                    <Separator orientation="vertical" />
                    <div className="flex-1">
                        {wheelItems('minute')}
                    </div>
                    <Separator orientation="vertical" />
                    <div className="flex-1">
                        {wheelItems('second')}
                    </div>
                    {timeType === '12h' && (
                        <>
                            <Separator orientation="vertical" />
                            <div className="w-16">
                                {wheelItems('period')}
                            </div>
                        </>
                    )}
                </div>
                <div className="p-3 border-t">
                    <div className="flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={setNowTime}
                        >
                           Now
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}