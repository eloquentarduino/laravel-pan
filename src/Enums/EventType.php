<?php

declare(strict_types=1);

namespace Pan\Enums;

/**
 * @internal
 */
enum EventType: string
{
    case CLICK = 'click';
    case HOVER = 'hover';
    case IMPRESSION = 'impression';
    case VISIBLE = 'visible';

    /**
     * Returns the column name for the event type.
     */
    public function column(): string
    {
        return match ($this) {
            self::CLICK => 'clicks',
            self::HOVER => 'hovers',
            self::IMPRESSION => 'impressions',
            self::VISIBLE => 'visibles',
        };
    }
}
