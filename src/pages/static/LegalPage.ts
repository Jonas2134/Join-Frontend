import { BaseStaticPage } from './BaseStaticPage';

export class LegalPage extends BaseStaticPage {
  protected headline = 'Legal Notice';
  protected content = /*html*/ `
    <p><!-- Impressum hier einfügen --></p>
  `;
}
