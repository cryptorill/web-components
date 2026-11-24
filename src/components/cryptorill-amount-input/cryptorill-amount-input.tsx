import { Component, Host, h, Prop, State, Event, EventEmitter, Watch } from '@stencil/core';

/**
 * Cryptorill Amount Input Component
 * Cryptocurrency amount input with formatting, validation, and max button
 */

@Component({
  tag: 'cryptorill-amount-input',
  styleUrl: 'cryptorill-amount-input.css',
  shadow: true,
})
export class CryptorillAmountInput {
  /**
   * Input value
   */
  @Prop({ mutable: true }) value: number = 0;

  /**
   * Currency symbol (e.g., 'BTC', 'ETH')
   */
  @Prop() symbol: string = '';

  /**
   * Maximum decimal places allowed
   */
  @Prop() decimals: number = 8;

  /**
   * Maximum allowed value
   */
  @Prop() max: number = Infinity;

  /**
   * Minimum allowed value
   */
  @Prop() min: number = 0;

  /**
   * Input placeholder text
   */
  @Prop() placeholder: string = '0.00';

  /**
   * Disable input
   */
  @Prop() disabled: boolean = false;

  /**
   * Show max amount button
   */
  @Prop() showMaxButton: boolean = true;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Input label
   */
  @Prop() label: string = 'Amount';

  /**
   * Available balance (shown when max button is enabled)
   */
  @Prop() availableBalance: number = 0;

  @State() inputValue: string = '';
  @State() isFocused: boolean = false;
  @State() error: string | null = null;

  /**
   * Emitted when value changes
   */
  @Event({ bubbles: true, composed: true }) valueChange!: EventEmitter<number>;

  /**
   * Emitted when input is validated
   */
  @Event({ bubbles: true, composed: true }) validation!: EventEmitter<{ valid: boolean; error: string | null }>;

  componentWillLoad() {
    this.inputValue = this.value > 0 ? this.formatValue(this.value) : '';
  }

  @Watch('value')
  handleValueChange(newValue: number) {
    if (newValue !== this.parseValue(this.inputValue)) {
      this.inputValue = newValue > 0 ? this.formatValue(newValue) : '';
    }
  }

  private formatValue(value: number): string {
    return value.toFixed(this.decimals).replace(/\.?0+$/, '');
  }

  private parseValue(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private validate(value: number): string | null {
    if (value < this.min) {
      return `Minimum amount is ${this.min}`;
    }
    if (value > this.max) {
      return `Maximum amount is ${this.formatValue(this.max)}`;
    }
    if (this.availableBalance > 0 && value > this.availableBalance) {
      return `Insufficient balance`;
    }
    return null;
  }

  private handleInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value;

    // Allow only numbers and one decimal point
    rawValue = rawValue.replace(/[^0-9.]/g, '');
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit decimal places
    if (parts[1] && parts[1].length > this.decimals) {
      rawValue = parts[0] + '.' + parts[1].slice(0, this.decimals);
    }

    this.inputValue = rawValue;
    const numericValue = this.parseValue(rawValue);
    this.value = numericValue;

    const error = this.validate(numericValue);
    this.error = error;

    this.valueChange.emit(numericValue);
    this.validation.emit({ valid: !error, error });
  };

  private handleFocus = (): void => {
    this.isFocused = true;
  };

  private handleBlur = (): void => {
    this.isFocused = false;
    // Format on blur
    if (this.inputValue) {
      const numericValue = this.parseValue(this.inputValue);
      this.inputValue = numericValue > 0 ? this.formatValue(numericValue) : '';
    }
  };

  private handleMaxClick = (): void => {
    const maxValue = this.availableBalance > 0 ? this.availableBalance : this.max;
    this.value = maxValue;
    this.inputValue = this.formatValue(maxValue);
    this.error = null;
    this.valueChange.emit(maxValue);
    this.validation.emit({ valid: true, error: null });
  };

  render() {
    const themeClass = `cr-amount-input--theme-${this.theme}`;
    const focusedClass = this.isFocused ? 'cr-amount-input--focused' : '';
    const errorClass = this.error ? 'cr-amount-input--error' : '';
    const disabledClass = this.disabled ? 'cr-amount-input--disabled' : '';

    return (
      <Host>
        <div class={`cryptorill-amount-input ${themeClass} ${focusedClass} ${errorClass} ${disabledClass}`}>
          <label class="cr-amount-input__label">
            {this.label}
            {this.availableBalance > 0 && (
              <span class="cr-amount-input__balance">
                Available: {this.formatValue(this.availableBalance)} {this.symbol}
              </span>
            )}
          </label>

          <div class="cr-amount-input__wrapper">
            <input
              class="cr-amount-input__field"
              type="text"
              inputmode="decimal"
              value={this.inputValue}
              placeholder={this.placeholder}
              disabled={this.disabled}
              onInput={this.handleInput}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />

            <div class="cr-amount-input__suffix">
              <span class="cr-amount-input__symbol">{this.symbol}</span>

              {this.showMaxButton && this.availableBalance > 0 && (
                <button class="cr-amount-input__max-btn" onClick={this.handleMaxClick} disabled={this.disabled} type="button">
                  MAX
                </button>
              )}
            </div>
          </div>

          {this.error && <span class="cr-amount-input__error">{this.error}</span>}
        </div>
      </Host>
    );
  }
}
