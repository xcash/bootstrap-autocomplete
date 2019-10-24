export class BaseResolver {
  protected results: Array < Object > ;

  protected _settings: any;

  constructor(options: any) {
    this._settings = $.extend(true, {}, this.getDefaults(), options);
  }

  protected getDefaults(): {} {
    return {};
  }

  protected getResults(limit ? : number, start ? : number, end ? : number): Array < Object > {

    return this.results;
  }

  public search(q: string, cbk: Function): void {
    cbk(this.getResults());
  }

}

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

  public search(q: string, cbk: Function): void {
    if (this.jqXHR != null) {
      this.jqXHR.abort();
    }

    let data: {
      [key: string]: any
    } = {};
    data[this._settings.queryKey] = q;
    $.extend(data, this._settings.extraData);

    // request throttling
    if (this.requestTID) {
      clearTimeout(this.requestTID);
    }
    this.requestTID = setTimeout( () => {
      this.jqXHR = $.ajax(
        this._settings.url, {
          method: this._settings.method,
          data: data,
          timeout: this._settings.timeout
        }
      );
  
      this.jqXHR.done((result) => {
        cbk(result);
      });
  
      this.jqXHR.fail((err) => {
        // console.log(err);
      });
  
      this.jqXHR.always(() => {
        this.jqXHR = null;
      });
  
    }, this._settings.requestThrottling);
  }

}