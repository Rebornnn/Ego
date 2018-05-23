module.exports = function (json, req) {
	let result=json.result;
	let query=req.query;

	if(query.total==='1'){
		result.total=result.data.length;
	}else{
		delete result.total;
	}

	result.data=result.data.splice(query.offset,query.limit||10);
	return json;
}