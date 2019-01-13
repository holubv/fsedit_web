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
- Editor: lehce upravená knihovna [brace](https://github.com/holubv/brace/tree/fsedit) (Ace.js)
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

##### users

Tato tabulka obsahuje registrované uživatele, jejich email a hashované heslo

##### sessions

Obsahuje tokeny přihlášených uživatelů, kterými se identifikují

##### workspaces

- user_id: reference na uživatele (vlastníka) - pokud existuje
- hash: kód workspace - náhodně generovaný
- edit_token - nepřihlášení uživatelé používají edit_token k uložení změn

##### file_tree

- workspace_id: reference na workspace
- lft, rgt, parent_id, level: [Nested set](https://en.wikipedia.org/wiki/Nested_set_model),
uložení stromové struktury souborů a složek
- name: název souboru
- file: náhodný hash, určuje cestu k souboru na serveru ve složce uploads

## Ukázky

Po načtení stránky můžeme do okna editoru psát, přetažením nahrát soubory,
v nabídce vytvořit složky,... Napsaný (nebo vložený text ze schránky) se uloží
po krátké nečinnosti editoru. Stav uložení značí ikona dole ve stavovém panelu.

![](https://i.imgur.com/2psGlcF.png)

![](https://i.imgur.com/PAsJaMT.png)

Pokud ještě nebyl vytvořený workspace, vytvoří se automaticky po uložení. Url stránky se
upraví tak, aby obsahovala kód workspace a odkaz byl připraven ke sdílení.

![](https://i.imgur.com/Ef2o9sn.png)

Pokud uživatel nebyl přihlášen, po znovunačtení stránky ztrácí přistup k editaci.
Přihlášeným uživatelům jsou soubory přiřazeny k účtu a mohou je kdykoliv zpětně
editovat nebo přidávat další.

### Podpora složek

Lze vytvářet složky a strukturu upravovat přetažením

![](https://i.imgur.com/Ux2BIb4.png)

### Tmavý a světlý vzhled

![](https://i.imgur.com/uJUTUAf.png)

![](https://i.imgur.com/all0N0C.png)

### Mobilní rozhraní

![](https://i.imgur.com/AtJltuj.png)

### Přihlašování a registrace

![](https://i.imgur.com/3iw9qVt.png)

![](https://i.imgur.com/KSRGpQt.png)

#### Validace

![](https://i.imgur.com/M6KBO6W.png)

![](https://i.imgur.com/bDKvHmw.png)

### Seznam workspaces

Po kliknutí na svůj profil v navigačním panelu se dostaneme na přehled
vytvořených workspaces. Seznam zobrazuje max. 3 workspaces najednou, seznam
je stránkovaný - dole na stránce jsou k dispozici tlačitka pro pohyb.
V seznamu jsou také náhledy 2 souborů. Po kliknutí na kód workspace se dostaneme
do okna editoru, kde můžeme workspace editovat (přidat soubory, upravovat soubory, ...)

![](https://i.imgur.com/qWD7x5r.png)

![](https://i.imgur.com/Pj71R5Y.png)