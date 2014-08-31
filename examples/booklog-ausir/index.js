/**
 * Module dependencies.
 */

var express = require('../../lib/express');

// Path to our public directory

var pub = __dirname + '/public';

// setup middleware

var app = express();


app.use(express.static(pub));

// Optional since express defaults to CWD/views

app.set('views', __dirname + '/views');

// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');


var posts = [];


app.all('/welecome',function(req,res){
	res.render('index');
});

app.post('/member',function(req,res){});
app.get('/member',function(req,res){});
app.put('/member/:m_id',function(req,res){});
app.delete('/member/:m_id',function(req,res){});

app.post('/organization',function(req,res){});
app.get('/organization/:g_id',function(req,res){});
app.put('/organization/:g_id',function(req,res){});
app.delete('/organization/:g_id',function(req,res){});

app.post('/organization/:g_id/:m_id',function(req,res){});
app.get('/organization/:g_id/:m_id',function(req,res){});
app.put('/organization/:g_id/:m_id',function(req,res){});
app.delete('/organization/:g_id/:m_id',function(req,res){});

app.post('/project',function(req,res){});
app.get('/project/:p_id',function(req,res){});
app.put('/project/:p_id',function(req,res){});
app.delete('/project/:p_id',function(req,res){});

app.post('/category',function(req,res){});
app.get('/category',function(req,res){});
app.put('/category/:c_id',function(req,res){});
app.delete('/category/:c_id',function(req,res){});

app.post('/api/:c_id',function(req,res){});
app.get('/api/:c_id',function(req,res){});
app.get('/api/:c_id/:a_id',function(req,res){});
app.put('/api/:a_id',function(req,res){});
app.delete('/api/:a_id',function(req,res){});




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
