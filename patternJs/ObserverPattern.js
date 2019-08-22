  // 一个主题可能具有的依赖观察者列表
  function ObserverList(){
    this.observerList = [];
  }
  ObserverList.prototype.add = function( obj ){
    return this.observerList.push( obj );
  };      
  ObserverList.prototype.count = function(){
    return this.observerList.length;
  };  
  ObserverList.prototype.get = function( index ){
    if( index > -1 && index < this.observerList.length ){
      return this.observerList[ index ];
    }
  };
  ObserverList.prototype.indexOf = function( obj, startIndex ){
    var i = startIndex;
    while( i < this.observerList.length ){
      if( this.observerList[i] === obj ){
        return i;
      }
      i++;
    }
    return -1;
  };   
  ObserverList.prototype.removeAt = function( index ){
    this.observerList.splice( index, 1 );
  };
  // 对Subject进行建模，以及在观察者列表中添加，删除或通知观察者的能力
  function Subject(){
    this.observers = new ObserverList();
  }
  Subject.prototype.addObserver = function( observer ){
    this.observers.add( observer );
  };
  Subject.prototype.removeObserver = function( observer ){
    this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
  };
  Subject.prototype.notify = function( context ){
    var observerCount = this.observers.count();
    for(var i=0; i < observerCount; i++){
      this.observers.get(i).update( context );
    }
  };
  // 定义一个用于创建新观察者的骨架。update稍后将使用自定义行为覆盖此处的功能
  // 在我们使用上述Observer组件的示例应用程序中，我们现在定义：
  // 用于向页面添加新的可观察复选框的按钮
  // 一个控件复选框，它将作为主题，通知其他复选框，应该检查它们
  // 添加新复选框的容器
  // 然后，我们定义ConcreteSubject和ConcreteObserver处理程序，以便为页面添加新的观察者并实现更新接口。有关这些组件在我们的示例上下文中执行的操作的内联注释，
  // The Observer
  function Observer(){
    this.update = function(){
      // ...
    };
  }

  // Extend an object with an extension
  function extend( obj, extension ){
    for ( var key in extension ){
      obj[key] = extension[key];
    }
  }
  
  // References to our DOM elements
  
  var controlCheckbox = document.getElementById( "mainCheckbox" ),
    addBtn = document.getElementById( "addNewObserver" ),
    container = document.getElementById( "observersContainer" );
  
  
  // Concrete Subject
  // Extend the controlling checkbox with the Subject class
  //添加观察者
  extend( controlCheckbox, new Subject() );
  
  // Clicking the checkbox will trigger notifications to its observers
  controlCheckbox.onclick = function(){
    controlCheckbox.notify( controlCheckbox.checked );
  };
  
  addBtn.onclick = addNewObserver;
  
  // Concrete Observer
  
  function addNewObserver(){
  
    // Create a new checkbox to be added
    var check = document.createElement( "input" );
    check.type = "checkbox";
  
    // Extend the checkbox with the Observer class
    extend( check, new Observer() );
  
    // Override with custom update behaviour
    check.update = function( value ){
      this.checked = value;
    };
  
    // Add the new observer to our list of observers
    // for our main subject
    controlCheckbox.addObserver( check );
  
    // Append the item to the container
    container.appendChild( check );
  }


// 一个如何使用发布/订阅的示例，如果提供了功能实现的强大功能publish()，subscribe()以及unsubscribe()后台
// 这里的一般想法是促进松散耦合。它们不是单个对象直接调用其他对象的方法，而是订阅另一个对象的特定任务或活动，并在发生时通知。
// A very simple new mail handler
// A count of the number of messages received
var mailCounter = 0;
 
// Initialize subscribers that will listen out for a topic
// with the name "inbox/newMessage".
 
// Render a preview of new messages
var subscriber1 = subscribe( "inbox/newMessage", function( topic, data ) {
 
  // Log the topic for debugging purposes
  console.log( "A new message was received: ", topic );
 
  // Use the data that was passed from our subject
  // to display a message preview to the user
  $( ".messageSender" ).html( data.sender );
  $( ".messagePreview" ).html( data.body );
 
});
 
// Here's another subscriber using the same data to perform
// a different task.
 
// Update the counter displaying the number of new
// messages received via the publisher
 
var subscriber2 = subscribe( "inbox/newMessage", function( topic, data ) {
 
  $('.newMessageCounter').html( ++mailCounter );
 
});
 
publish( "inbox/newMessage", [{
  sender: "hello@google.com",
  body: "Hey there! How are you doing today?"
}]);
 
// We could then at a later point unsubscribe our subscribers
// from receiving any new topic notifications as follows:
// unsubscribe( subscriber1 );
// unsubscribe( subscriber2 );


// 发布/订阅实现
// Publish
 
// jQuery: $(obj).trigger("channel", [arg1, arg2, arg3]);
$( el ).trigger( "/login", [{username:"test", userData:"test"}] );
 
// Dojo: dojo.publish("channel", [arg1, arg2, arg3] );
dojo.publish( "/login", [{username:"test", userData:"test"}] );
 
// YUI: el.publish("channel", [arg1, arg2, arg3]);
el.publish( "/login", {username:"test", userData:"test"} );
 
 
// Subscribe
 
// jQuery: $(obj).on( "channel", [data], fn );
$( el ).on( "/login", function( event ){ } );
 
// Dojo: dojo.subscribe( "channel", fn);
var handle = dojo.subscribe( "/login", function(data){ } );
 
// YUI: el.on("channel", handler);
el.on( "/login", function( data ){ } );
 
 
// Unsubscribe
 
// jQuery: $(obj).off( "channel" );
$( el ).off( "/login" );
 
// Dojo: dojo.unsubscribe( handle );
dojo.unsubscribe( handle );
 
// YUI: el.detach("channel");
el.detach( "/login" );



var pubsub = {};
 
(function(myObject) {
 
    // Storage for topics that can be broadcast
    // or listened to
    var topics = {};
 
    // A topic identifier
    var subUid = -1;
 
    // Publish or broadcast events of interest
    // with a specific topic name and arguments
    // such as the data to pass along
    myObject.publish = function( topic, args ) {
 
        if ( !topics[topic] ) {
            return false;
        }
 
        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;
 
        while (len--) {
            subscribers[len].func( topic, args );
        }
 
        return this;
    };
 
    // Subscribe to events of interest
    // with a specific topic name and a
    // callback function, to be executed
    // when the topic/event is observed
    myObject.subscribe = function( topic, func ) {
 
        if (!topics[topic]) {
            topics[topic] = [];
        }
 
        var token = ( ++subUid ).toString();
        topics[topic].push({
            token: token,
            func: func
        });
        return token;
    };
 
    // Unsubscribe from a specific
    // topic, based on a tokenized reference
    // to the subscription
    myObject.unsubscribe = function( token ) {
        for ( var m in topics ) {
            if ( topics[m] ) {
                for ( var i = 0, j = topics[m].length; i < j; i++ ) {
                    if ( topics[m][i].token === token ) {
                        topics[m].splice( i, 1 );
                        return token;
                    }
                }
            }
        }
        return this;
    };
}( pubsub ));
// 使用我们的实施
// Another simple message handler
 
// A simple message logger that logs any topics and data received through our
// subscriber
var messageLogger = function ( topics, data ) {
  console.log( "Logging: " + topics + ": " + data );
};

// Subscribers listen for topics they have subscribed to and
// invoke a callback function (e.g messageLogger) once a new
// notification is broadcast on that topic
var subscription = pubsub.subscribe( "inbox/newMessage", messageLogger );

// Publishers are in charge of publishing topics or notifications of
// interest to the application. e.g:

pubsub.publish( "inbox/newMessage", "hello world!" );

// or
pubsub.publish( "inbox/newMessage", ["test", "a", "b", "c"] );

// or
pubsub.publish( "inbox/newMessage", {
sender: "hello@google.com",
body: "Hey again!"
});

// We can also unsubscribe if we no longer wish for our subscribers
// to be notified
pubsub.unsubscribe( subscription );

// Once unsubscribed, this for example won't result in our
// messageLogger being executed as the subscriber is
// no longer listening
pubsub.publish( "inbox/newMessage", "Hello! are you still there?" );


//用户界面通知
//当数据模型更改时，应用程序将需要更新网格和计数器。在这种情况下，我们的主题（将发布主题/通知）是数据模型，我们的订阅者是网格和计数器。
// Return the current local time to be used in our UI later
getCurrentTime = function (){
 
  var date = new Date(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        y = date.getFullYear(),
        t = date.toLocaleTimeString().toLowerCase();

       return (m + "/" + d + "/" + y + " " + t);
};

// Add a new row of data to our fictional grid component
function addGridRow( data ) {
  // ui.grid.addRow( data );
  console.log( "updated grid component with:" + data );
}

// Update our fictional grid to show the time it was last
// updated
function updateCounter( data ) {
  // ui.grid.updateLastChanged( getCurrentTime() );
  console.log( "data last updated at: " + getCurrentTime() + " with " + data);
}

// Update the grid using the data passed to our subscribers
gridUpdate = function( topic, data ){
 if ( data !== undefined ) {
    addGridRow( data );
    updateCounter( data );
  }
};

// Create a subscription to the newDataAvailable topic
var subscriber = pubsub.subscribe( "newDataAvailable", gridUpdate );

// The following represents updates to our data layer. This could be
// powered by ajax requests which broadcast that new data is available
// to the rest of the application.

// Publish changes to the gridUpdated topic representing new entries
pubsub.publish( "newDataAvailable", {
 summary: "Apple made $5 billion",
 identifier: "APPL",
 stockPrice: 570.91
});

pubsub.publish( "newDataAvailable", {
 summary: "Microsoft made $20 million",
 identifier: "MSFT",
 stockPrice: 30.85
});


// 使用Ben Alman的Pub / Sub实现解耦应用程序