<?php

declare(strict_types=1);

namespace Pan;

/**
 * @internal
 *
 * @method self maxAnalytics(int $number)
 * @method self unlimitedAnalytics()
 * @method self allowedAnalytics(array $names)
 */
final class PanConfiguration
{
    /**
     * The Pan configuration's instance.
     */
    private static ?self $instance = null;

    /**
     * Creates a new Pan configuration instance.
     */
    private function __construct(
        private int $maxAnalytics = 50,
        private array $allowedAnalytics = [],
    ) {
        //
    }

    /**
     * Returns the Pan configuration's instance.
     *
     * @internal
     */
    public static function instance(): self
    {
        return self::$instance ??= new self;
    }

    /**
     * Sets the maximum number of analytics to store.
     */
    public static function maxAnalytics(int $number): void
    {
        self::instance()->setMaxAnalytics($number);
    }

    /**
     * Sets the maximum number of analytics to store.
     *
     * @internal
     */
    public function setMaxAnalytics(int $number): void
    {
        $this->maxAnalytics = $number;
    }

    /**
     * Sets the maximum number of analytics to store to unlimited.
     */
    public static function unlimitedAnalytics(): void
    {
        self::instance()->setMaxAnalytics(PHP_INT_MAX);
    }

    /**
     * Sets the allowed analytics names to store.
     *
     * @param  array<int, string>  $names
     */
    public static function allowedAnalytics(array $names): void
    {
        self::instance()->setAllowedAnalytics($names);
    }

    /**
     * Sets the allowed analytics names to store.
     *
     * @param  array<int, string>  $names
     *
     * @internal
     */
    public function setAllowedAnalytics(array $names): void
    {
        $this->allowedAnalytics = $names;
    }

    /**
     * Resets the configuration to its default values.
     *
     * @internal
     */
    public static function reset(): self
    {
        self::instance()->setMaxAnalytics(50);
        self::instance()->setAllowedAnalytics([]);

        return self::instance();
    }

    /**
     * Proxies static calls to the instance.
     */
    public function __call(string $name, array $arguments): self
    {
        return self::instance()::$name(...$arguments);
    }

    /**
     * Converts the Pan configuration to an array.
     *
     * @return array{max: int, allowed_names: array<int, string>}
     */
    public function toArray(): array
    {
        return [
            'max_analytics' => $this->maxAnalytics,
            'allowed_analytics' => $this->allowedAnalytics,
        ];
    }
}
