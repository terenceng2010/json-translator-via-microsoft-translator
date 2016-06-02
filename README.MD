About
========
This package makes use of microsoft translation api and related npm package. It loops recursively through nested json object and translated all the values.

Let's say:

`{
    "glossary": {
        "title": "example glossary",
		"GlossDiv": {
            "title": "S",
			"GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
					"SortAs": "SGML",
					"GlossTerm": "Standard Generalized Markup Language",
					"Acronym": "SGML",
					"Abbrev": "ISO 8879:1986",
					"GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook."
                    },
					"GlossSee": "markup"
                }
            }
        }
    }
}`

after running `translate -d fr` . Would become:

`{
  "glossary": {
    "GlossDiv": {
      "GlossList": {
        "GlossEntry": {
          "Abbrev": "ISO 8879: 1986",
          "Acronym": "SGML",
          "GlossDef": {
            "para": "Un langage de méta-balisage, utilisé pour créer des langages de balisage tels que DocBook."
          },
          "GlossSee": "balisage",
          "GlossTerm": "Langage normalisé de balisage généralisé",
          "ID": "SGML",
          "SortAs": "SGML"
        }
      },
      "title": "S"
    },
    "title": "Glossaire de l’exemple"
  }
}`

It is helpful if your system (e.g i18next and i18n-node ) use json to store language translation.


Get started
===========

1. clone this package
2. setup the microsoft client_id and client_secret by modifying index.js
3. `sudo npm install -g` inside this package directory
4. now try run `translate -d fr`
5. for help, run `translate --help`


  Usage: translate [options] <file> , of which <file> is the soruce json file

  Options:

    -h, --help                     output usage information
    -s, --sourcelang <sourcelang>  source language (by default en if not specified)
    -d, --destlang <destlang>      destination language (required)
    -w, --writefile <writefile>    write to file   (if not provide, display to screen only)

  If source <file> is not provided, sample json would be used to demo the translation.

 for example:
 
 `translate -s fr en.i18n.json` <-- read from en.18n.json and translate it to french
 
 `translate -s fr -w fr.i18n.json en.i18n.json` <-- read from en.18n.json and translate it to french and write the result to fr.i18n.json
 
