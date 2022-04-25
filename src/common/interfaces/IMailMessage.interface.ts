export interface IEmailAddress {
  email: string;
  name: string;
}

export interface IEmailMessage {
  to: IEmailAddress;
  subject: string;
}

export interface BodyEmailMessage extends IEmailMessage {
  body: string;
}

export interface TemplateEmailMessage extends IEmailMessage {
  template: string;
  context: any;
}
