import { BaseStaticPage } from "./BaseStaticPage";

export class LegalPage extends BaseStaticPage {
  protected headline = "Legal Notice";
  protected content = /*html*/ `
    <strong class="text-lg font-semibold text-gray-900">Angaben gemäß § 5 DDG</strong>
    <p class="text-gray-700 leading-relaxed">
      Jonas Stiefer<br>
      Fissgässen 16<br>
      L-9940 Asselborn
    </p>
    <p class="text-gray-700 leading-relaxed">
      <strong class="font-semibold text-gray-900">Vertreten durch:</strong><br>
      Jonas Stiefer
    </p>
    <p class="text-gray-700 leading-relaxed">
      <strong class="font-semibold text-gray-900">Kontakt:</strong><br>
      E-Mail: <a class="text-blue-600 hover:underline" href="mailto:connect@jonas-stiefer.com">connect@jonas-stiefer.com</a>
    </p>
    <p class="text-gray-700 leading-relaxed">
      <strong class="font-semibold text-gray-900">Verbraucherstreitbeilegung / Universalschlichtungsstelle</strong><br>
      Wir nehmen nicht an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teil und sind dazu auch nicht verpflichtet.
    </p>
    <p class="text-sm text-gray-500 leading-relaxed">
      Erstellt mit dem <a class="hover:underline" href="https://impressum-generator.de" rel="dofollow">Impressum-Generator</a> von WebsiteWissen.com, dem Ratgeber für <a class="hover:underline" href="https://websitewissen.com/website-erstellen" rel="dofollow">Website-Erstellung</a>, <a class="hover:underline" href="https://websitewissen.com/homepage-baukasten-vergleich" rel="dofollow">Homepage-Baukästen</a> und <a class="hover:underline" href="https://websitewissen.com/shopsysteme-vergleich" rel="dofollow">Shopsysteme</a>. Rechtstext von der <a class="hover:underline" href="https://www.kanzlei-hasselbach.de/" rel="dofollow">Kanzlei Hasselbach</a>.
    </p>
  `;
}
