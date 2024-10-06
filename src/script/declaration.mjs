import fs from 'fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import * as acorn from 'acorn';
import jsx from 'acorn-jsx';


const {values:options,positionals:files} = parseArgs({allowPositionals:true,options:{
	sourceType:{
		type:'string',
		short:'t',
		default:'module'
	},
	ecmaVersion:{
		type:'string',
		short:'v',
		default:'2020'
	}
}});
if(files.length===0){
	files.push('modules/src/index.js');
}

const results={};
for(const file of files){
	extractFunctions(file,options,results);
}
fs.writeSync(1,JSON.stringify(results));

function extractFunctions(file,options,results){
	if(results[file]!=null){return;}
	results[file]={};
	if(options.sourceType==='script'){
		const code=fs.readFileSync(file);
		const ast=acorn.parse(code, options);
		ast.body.forEach((token)=>{
			if(token.type==='FunctionDeclaration'){
				results[file][token.id.name]=getFunctionInfo(token);
			}
		});
	}
	else{
		extractExportedFunctionsRecursive(file,options,results[file]);
	}
}
function extractExportedFunctionsRecursive(file,options,functions,importMap){
	const code=fs.readFileSync(file);
	const ast=acorn.Parser.extend(jsx()).parse(code, options);
	const exportedFunctions={};
	//if(functions.ast==null){functions.ast=[];}functions.ast.push(ast);
	ast.body.forEach((token)=>{
		switch(token.type){
			case 'ExportAllDeclaration':{
				extractExportedFunctionsRecursive(resolve(file,'../',token.source.value),options,exportedFunctions);
				break;
			}
			case 'ExportNamedDeclaration':{
				if(token.declaration!=null && token.declaration.declarations!=null){
					for(const declaration of token.declaration.declarations){
						if(declaration.init.type==='ArrowFunctionExpression' || declaration.init.type==='FunctionExpression' || declaration.init.type==='FunctionDeclaration'){
							exportedFunctions[declaration.id.name]=getFunctionInfo(declaration.init);
						}
					}
				}
				else if(token.specifiers){
					extractExportedFunctionsRecursive(resolve(file,'../',token.source.value),options,exportedFunctions,token.specifiers.reduce((p,c)=>p[c.local.name]=c.exported.name,{}));
				}
				break;
			}
			case 'ExportDefaultDeclaration':{
				if(token.declaration.type==='ArrowFunctionExpression' || token.declaration.type==='FunctionDeclaration'){
					exportedFunctions['[default]']=getFunctionInfo(declaration);
				}
				break;
			}
		}
	});
	Object.keys(exportedFunctions).forEach(key=>{
		if(exportedFunctions[key].file==null){
			exportedFunctions[key].file=file;
		}
	});
	if(importMap!=null){
		for(const key in importMap){
			if(exportedFunctions[key]!=null){
				functions[importMap[key]]=exportedFunctions[key];
			}
		}
	}
	else{
		Object.assign(functions,exportedFunctions);
	}
}
function getFunctionInfo(token){
	return {
		start:token.start,
		end:token.end,
		params:token.params.map((param)=>{
			if(param.type==='AssignmentPattern'){
				return {name:param.left.name,default:param.right.value};
			}
			else if(param.type==='RestElement'){
				return {name:param.argument.name};
			}
			return {name:param.name};
		})
	};
}