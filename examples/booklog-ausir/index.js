/**
 * Module dependencies.
 */

var express = require('../../lib/express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/api');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB: connected.');	
});


// Path to our public directory

var pub = __dirname + '/public';

// setup middleware

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.use(express.static(pub));

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');



/**
 * CORS support.
 */
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


var member = [{m_id:1,m_name:'ausir'}];
var organization = [{g_id:1,g_name:"finpo"}];
var project = [{p_id:1,p_name:"bueautyAPI"}];
var category = [{c_id:1,c_name:'member 會員'},{c_id:2,c_name:'organization 組織'},{c_id:3,c_name:'project 專案'}];
var api = {"1":[{path:"/member",method:"POST",desc:"建立會員"},{path:"/member",method:"GET",desc:"取得會員"}]};

var apiSchema = new mongoose.Schema({
    api : Array
});

app.db = {
	api : mongoose.model('api', apiSchema)
};



app.all('/',function(req,res){
	res.render('index');
});

var errorTimes = 3 ;
app.get('/download',function(req,res){
	var events = require('events');
	var workflow = new events.EventEmitter();
	workflow.outcome = {success : false };

	workflow.on('vaidate', function(){
		if(errorTimes <= 0){
			workflow.outcome.msg = '密碼錯誤超過三次' ;
			return workflow.emit('error');
		}
		var password = req.query.password ;
		if( password === '123456'){
			return workflow.emit('success');
		}
		return workflow.emit('error');
	});
	workflow.on('success', function(){
		workflow.outcome.success = true ;
		return workflow.emit('response');
	});
	workflow.on('error', function(){
		workflow.outcome.success = false ;
		errorTimes-- ;
		
		return workflow.emit('response');
	});
	workflow.on('response', function(){
		if(workflow.outcome.success){
			res.download('examples/booklog-ausir/views/script.js');
		}else{
			res.send(workflow.outcome);
		}
	});

	return workflow.emit('vaidate');
});


app.post('/api',function(req,res){
	var api = req.app.db.api;
	var db = new api({api:req.body});
	db.save(function(err ,api){
		res.send({ success : true , api : api });
	});

	
});

app.get('/api/:id',function(req,res){
	var id = req.params.id;
	var api = req.app.db.api;

	api.findOne({_id:id}, function(err, api) {
		if(api){
			res.send(api);
		}
			
	});
});

app.put('/api/:id',function(req,res){
	var id = req.params.id;
	var api = req.app.db.api;
	api.update({_id:id} , { api: req.body } , function(err){
		res.send({ success : true });
	});

});
app.delete('/api/:id',function(req,res){});




// change this to a better error handler in your code
// sending stacktrace to users in production is not good
app.use(function(err, req, res, next) {
  res.send(err.stack);
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
