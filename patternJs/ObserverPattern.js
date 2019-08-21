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