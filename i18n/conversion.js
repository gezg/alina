var readline = require('readline');  
var fs = require('fs');  
  

var path = './';
var wreslut = {};
var statusFile = {};

fs.readdir(path, function(err, files){
	//err 为错误 , files 文件名列表包含文件夹与文件
	if(err){
		console.log('error:\n' + err);
		return;
	}

	files.forEach(function(file){

		fs.stat(path + '/' + file, function(err, stat){
			if(!stat.isDirectory()){
				if(file.indexOf('html') >= 0){
					var sdd = file.substring(0 ,file.indexOf('.'));
					if(!wreslut[sdd]){
						wreslut[sdd] = [];
					}
					readLineFn(path + file ,file);
				}
			}
			
		});
	});
});

function readLineFn(fReadName ,fileName){
	var fRead = fs.createReadStream(fReadName);  

	var objReadline = readline.createInterface({  
	    input: fRead
	});  
	  
	objReadline.on('line', (line)=>{  
	   	zhuanhuan(line ,fileName); 
	});  
	  
	// objReadline.on('close', ()=>{  
		
	// });
}

function zhuanhuan(str ,fileName){
	var sdd = fileName.substring(0 ,fileName.indexOf('.'));

	if(str.indexOf('<div class="clearfix">') >= 0){
		statusFile[sdd] = true;
	}

	if(statusFile[sdd] && str.indexOf('<div id="clearfix">') >= 0){
		statusFile[sdd] = false;
	}
	if(!statusFile[sdd]) return false;
	//去掉html标签
	var result = str.replace(/<[^>]+>/g , '');
	var rd = result.replace(/\s+/g, '');
	if(rd.length){
		wreslut[sdd].push(result.trim());
	}
}

setTimeout(function(){
	var results = {};
	for(var key in wreslut){
		if(wreslut.hasOwnProperty(key)){
			results[key] = wreslut[key].join('|')
		}
	}

	fs.writeFile('./js/global-data.js', 'var globalData = ' + JSON.stringify(results), function(err) {
	    if (err) {
	        throw err;
	    }
	    console.log('Saved.');
	});
},1000 * 5);