import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core';
import { container } from '../../core/di/container';
import { PRICE_DATA_SOURCE_TOKEN, LOGGER_TOKEN } from '../../core/di/tokens';
import { IPriceDataSource, HistoricalPriceData, HistoricalPriceQuery } from '../../core/interfaces/data-source.interface';
import { ILogger } from '../../core/interfaces/logger.interface';

/**
 * Parses data prop which can be either an array or a JSON string
 * @param value - The data value to parse
 * @returns Parsed number array or null if invalid
 */
function parseDataProp(value: unknown): number[] | null {
  if (Array.isArray(value)) {
    return value.map(v => Number(v)).filter(v => !isNaN(v));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(v => Number(v)).filter(v => !isNaN(v));
      }
    } catch {
      // Invalid JSON string
      return null;
    }
  }
  return null;
}

/**
 * Cryptorill Sparkline Component
 * Renders a canvas-based sparkline chart with historical price data from /v1/price/historical endpoint
 */

@Component({
  tag: 'cryptorill-sparkline',
  styleUrl: 'cryptorill-sparkline.css',
  shadow: true,
})
export class CryptorillSparkline {
  private canvas!: HTMLCanvasElement;
  @Element() el!: HTMLElement;

  /**
   * The cryptocurrency pair to query (e.g., "btcusdt")
   */
  @Prop() pair: string = 'btcusdt';

  /**
   * Number of data points to retrieve from historical endpoint (default: 25 for last 24h)
   */
  @Prop() limit: number = 25;

  /**
   * Chart direction: 'up' | 'down'
   */
  @State() direction: 'up' | 'down' = 'up';

  /**
   * Width of the canvas in pixels
   */
  @Prop() width: number = 300;

  /**
   * Height of the canvas in pixels
   */
  @Prop() height: number = 60;

  /**
   * Number of points to generate if data is not provided (fallback)
   */
  @Prop() points: number = 20;

  /**
   * Historical price data points as array of numbers (e.g., [100, 105, 102, 110])
   * If provided, datasource will not be queried
   */
  @Prop() data?: number[] | string;

  /**
   * Enable smooth curves (quadratic bezier)
   */
  @Prop() smooth: boolean = true;

  /**
   * Theme variant: 'dark' | 'light' | 'gradient'
   */
  @Prop() theme: 'dark' | 'light' | 'gradient' = 'dark';

  /**
   * Historical price data points (normalized for chart)
   */
  @State() chartData: number[] = [];

  @Watch('chartData')
  @Watch('direction')
  handleDataChange() {
    this.draw();
  }

  @Watch('data')
  handleDataPropChange(newData: unknown): void {
    const parsedData = parseDataProp(newData);
    if (parsedData && parsedData.length > 0) {
      this.processProvidedData(parsedData);
    } else {
      this.loadHistoricalData();
    }
  }

  private dataSource: IPriceDataSource | null = null;
  private logger: ILogger | null = null;
  private isLoading: boolean = true;

  private getDataSource(): IPriceDataSource {
    if (!this.dataSource) {
      this.dataSource = container.resolve<IPriceDataSource>(PRICE_DATA_SOURCE_TOKEN);
    }
    return this.dataSource;
  }

  private getLogger(): ILogger {
    if (!this.logger) {
      this.logger = container.resolve<ILogger>(LOGGER_TOKEN);
    }
    return this.logger;
  }

  componentWillLoad(): void {
    // If data prop is provided, use it instead of fetching from datasource
    const parsedData = parseDataProp(this.data);
    if (parsedData && parsedData.length > 0) {
      this.processProvidedData(parsedData);
    } else {
      this.loadHistoricalData();
    }
  }

  @Watch('pair')
  @Watch('limit')
  async handlePropsChange(): Promise<void> {
    // Only fetch from datasource if data prop is not provided
    const parsedData = parseDataProp(this.data);
    if (!parsedData || parsedData.length === 0) {
      this.isLoading = true;
      await this.loadHistoricalData();
    }
  }

  private async loadHistoricalData(): Promise<void> {
    try {
      const query: HistoricalPriceQuery = {
        pair: this.pair.toLowerCase(),
        limit: this.limit,
      };

      this.getLogger().debug('CryptorillSparkline: Loading historical data', { query });

      const historicalData: HistoricalPriceData = await this.getDataSource().fetchHistoricalPrices(query);

      if (historicalData.data.length === 0) {
        // Fallback to random data if no historical data available
        this.generateRandomData();
        return;
      }

      // Extract prices and determine direction
      const prices: string[] = historicalData.data.map(point => point.price);

      // Calculate direction based on price change (first vs last)
      try {
        const currentVal = parseFloat(prices[prices.length - 1]);
        const previousVal = parseFloat(prices[0]);
        this.direction = currentVal >= previousVal ? 'up' : 'down';
      } catch {
        this.direction = 'up';
      }

      // Normalize prices for chart display (0-100 scale)
      const priceValues: number[] = historicalData.data.map(point => parseFloat(point.price));
      const normalized = this.normalizeData(priceValues);

      this.chartData = normalized;
    } catch (error) {
      this.getLogger().error('CryptorillSparkline: Error loading historical data', error instanceof Error ? error : undefined);
      // Fallback to random data on error
      this.generateRandomData();
    } finally {
      this.isLoading = false;
    }
  }

  private generateRandomData(): void {
    const data: number[] = [];
    let value = 50;

    for (let i = 0; i < this.points; i++) {
      const change = (Math.random() - 0.5) * 20;
      value = Math.max(10, Math.min(90, value + change));
      data.push(value);
    }

    this.chartData = data;
    this.direction = 'up'; // Default direction for random data
  }

  private normalizeData(values: number[]): number[] {
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Normalize to 0-100 scale with padding for visual clarity
    const paddedMin = min - range * 0.1;
    const paddedMax = max + range * 0.1;
    const paddedRange = paddedMax - paddedMin || 1;

    return values.map(value => ((value - paddedMin) / paddedRange) * 80 + 10); // Keep within 10-90% of chart height
  }

  private processProvidedData(data: number[]): void {
    if (data.length === 0) {
      this.generateRandomData();
      return;
    }

    // Calculate direction based on price change (first vs last)
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    this.direction = lastValue >= firstValue ? 'up' : 'down';

    // Normalize data for chart display
    this.chartData = this.normalizeData(data);
    this.isLoading = false;
  }

  private get themeClass(): string {
    return `cr-sparkline--theme-${this.theme}`;
  }

  private get lineColor(): string {
    return this.direction === 'up' ? '34, 197, 94' : '239, 68, 68';
  }

  private draw(): void {
    if (!this.canvas) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    // Check if canvas context has required methods (for test environment compatibility)
    if (typeof ctx.createLinearGradient !== 'function' || typeof ctx.beginPath !== 'function' || typeof ctx.stroke !== 'function') {
      return;
    }

    const width = this.canvas.width;
    const height = this.canvas.height;
    const data = this.chartData;
    const dataPoints = data.length;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (dataPoints < 2) return;

    const color = this.lineColor;

    // Draw gradient area
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgba(${color}, 0.3)`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    ctx.beginPath();
    ctx.moveTo(0, height);

    data.forEach((point, i) => {
      const x = (i / (dataPoints - 1)) * width;
      const y = height - (point / 100) * height;

      if (i === 0) {
        ctx.lineTo(x, y);
      } else if (this.smooth) {
        // Smooth curve
        const prevX = ((i - 1) / (dataPoints - 1)) * width;
        const prevY = height - (data[i - 1] / 100) * height;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = (i / (dataPoints - 1)) * width;
      const y = height - (point / 100) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else if (this.smooth) {
        const prevX = ((i - 1) / (dataPoints - 1)) * width;
        const prevY = height - (data[i - 1] / 100) * height;
        const cpX = (prevX + x) / 2;
        ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
        ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = `rgb(${color})`;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  componentDidLoad(): void {
    this.draw();
  }

  render() {
    const themeClass = `cr-sparkline--theme-${this.theme}`;

    return (
      <Host>
        <div class={`cryptorill-sparkline ${themeClass} ${this.themeClass}`}>
          {this.isLoading ? (
            <div class="cr-sparkline__skeleton">
              <div class="cr-sparkline__skeleton-line"></div>
              <div class="cr-sparkline__skeleton-line-short"></div>
            </div>
          ) : null}
          <canvas
            ref={el => {
              if (el) {
                this.canvas = el;
                this.draw();
              }
            }}
            width={this.width}
            height={this.height}
            class="cr-sparkline__canvas"
          ></canvas>
        </div>
      </Host>
    );
  }
}
