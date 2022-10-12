import { createI18n } from 'vue-i18n';

const languageFiles = require.context('@/language', true, /(?<!index)\.js/);
const sitefiles = require.context('.', true, /(?<!index)\.js/);
const defaultSite = 'www';

const prefixReg = /[\.]\w+/g;
const hostPrefix = window.location.host.replace(prefixReg, ''); 
const siteName = window.location.protocol === 'https:' ? hostPrefix : defaultSite;

const languages = languageFiles.keys()
  .reduce((obj, modulePath) => {
    const fileName = /[a-zA-Z]+/.exec(modulePath)?.[0] || '';
    return Object.assign({}, obj, {[fileName]: languageFiles(modulePath)?.default });
  }, {});

const sites = sitefiles.keys()
  .reduce((obj, modulePath) => {
    const moduleName = /[a-zA-Z]+/.exec(modulePath)?.[0] || '';
    return Object.assign({}, obj, { [moduleName]: sitefiles(modulePath)?.default });
  }, {});


export const initI18n = () => {
  return createI18n({
    legacy: false,
    locale: sites[siteName].lang,
    messages: languages
  });
};

export const site = sites[siteName];
