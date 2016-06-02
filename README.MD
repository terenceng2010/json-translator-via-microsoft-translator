1. clone this package
2. setup the microsoft client_id and client_secret by modifying index.js
3. `sudo npm install -g` inside this package directory
4. now try run `translate -d fr`
5. for help, run `translate --help`


  Usage: translate [options] <file>

  Options:

    -h, --help                     output usage information
    -s, --sourcelang <sourcelang>  source language (by default en if not specified)
    -d, --destlang <destlang>      destination language (required)


 for example:
 `translate -s fr en.i18n.json`
