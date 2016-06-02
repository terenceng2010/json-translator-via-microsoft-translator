#!/usr/bin/env node

var CLIENT_ID = 'YOUR_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_CLIENT_SECRET';



var program = require('commander');

var filePath ;
program
  .arguments('<file>')
  .option('-s, --sourcelang <sourcelang>', 'source language')
  .option('-d, --destlang <destlang>', 'destination language')
  .option('-w, --writefile <writefile>', 'write to file')  
  .action(function(file) {
    console.log('sourceLang: %s destLang: %s file: %s writefile: %s',
        program.sourcelang, program.destlang, file, program.writefile);
    filePath = file;
  })
  .parse(process.argv);

program.sourcelang = program.sourcelang || 'en';
if(!program.destlang){
    console.log('please define destination lang');
    process.exit();
}

if(CLIENT_ID === 'YOUR_CLIENT_ID' || CLIENT_SECRET === 'YOUR_CLIENT_SECRET'){
    console.log('please setup client id and client serect first in index.js first. then reinstall this program by running "sudo npm install -g" ');
    process.exit();
}

fs = require('fs');


var sampleTranslationObj = {
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
}

var inputJsonFile;
try{   
 inputJsonFile = fs.readFileSync(filePath).toString();

}catch(e){
    console.log(e);
    console.log('sample file would be used');
}



var translationObj;
if(inputJsonFile){
    translationObj = JSON.parse(inputJsonFile)
}else{
    translationObj = sampleTranslationObj;
}


var lodash = require('lodash');
var MsTranslator = require('mstranslator');
// Second parameter to constructor (true) indicates that
// the token should be auto-generated.
var client = new MsTranslator({
  client_id: CLIENT_ID
  , client_secret: CLIENT_SECRET
}, true);


//loop through property
//check is plain object
var totalWords = 0;
function deepIterateObject(obj,parentKey){
    lodash.forIn(obj,function(subObjectOrValue,key){
      
      if(lodash.isString(subObjectOrValue)){
          totalWords++;
          if(parentKey){
             console.log(parentKey+'.'+key,' ',subObjectOrValue,' ',totalWords,' ');
          }else{
            console.log(key,' ',subObjectOrValue,' ',totalWords,' '); 
          }

      }else{
         if(parentKey){
           deepIterateObject(subObjectOrValue, parentKey+'.'+key);   
         }else{
           deepIterateObject(subObjectOrValue, key);        
         }
     
      }
    });
}

deepIterateObject(translationObj);


console.log('===========start translation=======',totalWords);

var currentWords = 0;
var finished = lodash.after (totalWords, doRender);
var newObj = {};
function deepIterateObjectDoTranslation(obj,parentKey){
    lodash.forIn(obj,function(subObjectOrValue,key){
      
      if(lodash.isString(subObjectOrValue)){
          if(parentKey){
                client.translate({
                    text: subObjectOrValue
                    , from: program.sourcelang
                    , to: program.destlang            
                }, function(err, translatedValue) {
                    
                    if(err){
                        currentWords++;

                        console.log('finished with error',currentWords);
                        finished();
                    }else{
                        console.log('set  ', parentKey+'.'+key, ' ',translatedValue);
                        lodash.set(newObj , lodash.toPath(parentKey+'.'+key) ,  translatedValue);
                        currentWords++;
                        console.log('finished',currentWords);
                        finished();                
                    }

                });             
             //console.log(parentKey+'.'+key,' ',subObjectOrValue,' ',totalWords,' ');
          }else{
                client.translate({
                    text: subObjectOrValue
                    , from: program.sourcelang
                    , to: program.destlang            
                }, function(err, translatedValue) {
                    
                    if(err){
                        currentWords++;
                        console.log('finished with error',currentWords);
                        finished();
                    }else{
                        //console.log('          ',subKey,' ',translatedValue);
                        console.log('set  ', key, ' ',translatedValue);
                        lodash.set(newObj , key ,  translatedValue);
                        currentWords++;
                        console.log('finished',currentWords);
                        finished();                
                    }

                });               
            //console.log(key,' ',subObjectOrValue,' ',totalWords,' '); 
          }

      }else{
         if(parentKey){
           deepIterateObjectDoTranslation(subObjectOrValue, parentKey+'.'+key);   
         }else{
           deepIterateObjectDoTranslation(subObjectOrValue, key);        
         }
     
      }
    });
}

deepIterateObjectDoTranslation(translationObj);


function doRender(){
    var jsonStringify = require('json-pretty');
    console.log(jsonStringify(newObj) ); //JSON.stringify(sortObject())
    
    if(program.writefile){
        var outputFilename = program.writefile;

        fs.writeFile(outputFilename, jsonStringify(newObj), function(err) {
            if(err) {
            console.log(err);
            } else {
            console.log("JSON saved to " + outputFilename);
            }
            process.exit();
        });      
    }else{
       process.exit(); 
    }


} 

