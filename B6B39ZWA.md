# fsEdit
https://fsedit.cf

Platforma pro sdílení a úpravu textových (a jiných) souborů s jednoduchým moderním rozhraním

## Serverová část (php)

[zdrojový kód](https://github.com/holubv/fsedit_backend)
[phpdoc](https://api.fsedit.cf/docs/index.html)

## Vlastnosti
- [x] přihlašování a registrace uživatelů
- [x] výběr barevného schématu
- [x] nahrávání souborů přes drag and drop
- [x] úprava textových souborů (se zvýrazněním syntaxe jazyků)
- [x] náhled obrázků v editoru
- [x] možnost stažení nepodporovaných souborů
- [x] vytváření složek a úprava struktury složek
- [x] přidávání, mazání a přejmenování souborů

## Limitace
- aktuální limit pro nahrávání souborů je zhruba 1 MB

## Implementace

### Web
- ECMAScript 6
- SPA (MVVM) framework: [Vue.js](https://vuejs.org)
- Webpack, babel, npm
- Editor: lehce upravená knihovna [brace]([https://github.com/holubv/brace/tree/fsedit) (Ace.js)
- Drag and drop file upload: [vue-dropzone](https://github.com/rowanwins/vue-dropzone) (Dropzone.js)
- Styly: Less
- Komunikace se serverem pomocí ajax [axios](https://github.com/axios/axios)

### Server backend
- php 5.6+
- framework: [Slim](http://www.slimframework.com/)
- composer
- database framework: [Medoo](https://medoo.in/)

#### Databáze
- SQL MariaDB [schema.sql](https://github.com/holubv/fsedit_backend/blob/master/schema.sql)

![](https://i.imgur.com/yDlT9nh.png)

- ts