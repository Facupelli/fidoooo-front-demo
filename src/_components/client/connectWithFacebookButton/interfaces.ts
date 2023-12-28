interface IFB {
  init: (config: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
  login: (
    // eslint-disable-next-line
    callback: (response: any) => void,
    options: {
      config_id: string;
      response_type: string;
      override_default_response_type: boolean;
      extras: {
        setup: {
          // Prefilled data can go here
        };
      };
    },
  ) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line
    fbAsyncInit: any;
    FB: IFB;
  }
}
