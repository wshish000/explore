var mongoose = require("mongoose"); //引入mongoose

var db = mongoose.connection;
db.on('error', function callback() { //监听是否有异常
    console.log("Connection error");
});
db.once('open', function callback() { //监听一次打开
    //在这里创建你的模式和模型
    console.log('connected!');
});
db.on('connected', () => {
    console.log('MongoDB connected success');
});
db.on('disconnected', () => {
    console.log('MongoDB connected disconnected');
});

mongoose.connect('mongodb://localhost/todo'); //连接到mongoDB的todo数据库
//该地址格式：mongodb://[username:password@]host:port/database[?options]
//默认port为27017

//Schema (属性)：在Mongoose里一切都是从Schema开始的，每一个Schema都会映射到MongoDB的一个collection上。Schema定义了collection里documents的模板（或者说是框架）。【一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力】

var InspectSchema = new mongoose.Schema({
    u_id: String,
    name: String,
    type: String,
    inspect_time: Date,
    site: String,
    zhongdui:String,
    dadui:String
});
var PunishSchema = new mongoose.Schema({
    unit_id: String,
    unit: String,
    type: String, //'+'or'-'
    matter: String,
    punish_time: Date, //定义一个属性check_time，类型为Date
    dadui: String,
});

var StuffSchema = new mongoose.Schema({
    u_id: String,
    name: String,
    position: String,
    zhongdui: String,
    dadui: String
});

//model (模型)：为了使用定义好的Schema，我们需要把blogSchema转换成我们可以使用的model(其实是把Schema编译成model，所以对于Schema的一切定义都要在compile之前完成)。也就是说model才是我们可以进行操作的handle。
mongoose.model('Stuff', StuffSchema);//将该Schema发布为Model
mongoose.model('Punish', PunishSchema);
mongoose.model('Inspect', InspectSchema);

module.exports = mongoose;
