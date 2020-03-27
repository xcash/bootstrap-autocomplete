export class BaseResolver {
  protected results: any[];

  protected _settings: any;

  constructor(options: any) {
    this._settings = $.extend(true, {}, this.getDefaults(), options);
  }

  protected getDefaults(): {} {
    return {};
  }

  protected getResults(limit?: number, start?: number, end?: number): any[] {

    return this.results;
  }

  public search(q: string, cbk: (results: any[]) => void): void {
    cbk(this.getResults());
  }

}

// tslint:disable-next-line: max-classes-per-file
export class AjaxResolver extends BaseResolver {
  protected jqXHR: JQueryXHR;
  protected requestTID: number;

  constructor(options: any) {
    super(options);

    // console.log('resolver settings', this._settings);
  }

  protected getDefaults(): {} {
    return {
      url: '',
      method: 'get',
      queryKey: 'q',
      extraData: {},
      timeout: undefined,
      requestThrottling: 500
    };
  }

  public search(q: string, cbk: (results: any[]) => void): void {
    if (this.jqXHR != null) {
      this.jqXHR.abort();
    }

    const data: {
      [key: string]: any
    } = {};
    data[this._settings.queryKey] = q;
    $.extend(data, this._settings.extraData);

    // request throttling
    if (this.requestTID) {
      window.clearTimeout(this.requestTID);
    }
    this.requestTID = window.setTimeout(() => {
      this.jqXHR = $.ajax(
        this._settings.url,
        {
          method: this._settings.method,
          data,
          timeout: this._settings.timeout
        }
      );

      this.jqXHR.done((result) => {
        cbk(result);
      });

      this.jqXHR.fail((err) => {
        // console.log(err);
        // this._settings.fail && this._settings.fail(err);
        this._settings?.fail(err);
      });

      this.jqXHR.always(() => {
        this.jqXHR = null;
      });

    }, this._settings.requestThrottling);
  }

}