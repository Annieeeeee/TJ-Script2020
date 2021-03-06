function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}

var LVL_LOW = 'low';
var LVL_MEDIUM = 'medium';
var LVL_HIGH = 'high';
var filterList=["All","Active","Completed"];

window.onload = function(){
    model.init(function(){
        update();
        var data = model.data;
        var lvl = LVL_LOW; //default set
        var todo=$(".todo-new");
        //add new todo item
        function newItem(){
            var s1=$(".todo-level");
            var index=s1.selectedIndex;
            lvl=s1.options[index].value;
            data.items.push({msg: data.msg, completed: false, level:lvl});
            console.log("msg:",data.msg," lvl:",lvl);

            //refresh input area
            data.msg = "";
            $(".todo-new").value="";
            s1.options[0].selected = true;
            s1.style.backgroundColor='rgba(165, 241, 172,0.5)';

            //save data
            model.flush();
            update();
        }
        
        //press add button
        $(".todo-add-btn").addEventListener("touchstart",function(event){
            event.preventDefault();
            if(data.msg===""){
                console.warn("input msg is empty");
                return;
            }
            newItem();
        },false);

        //type input area
        $(".todo-new").addEventListener("keyup",function(event){
            //bind data
            data.msg=todo.value;

            //if not Enter
            if(event.keyCode!==13){
                return;
            }

            if (data.msg === "") {
                console.warn('input msg is empty');
                return;
            }

            newItem();
        },false);

        //say goodbye to done
        $(".clear-completed").addEventListener("touchstart",function(event){
            event.preventDefault();
            for(var i=0;i<data.items.length&&data.items.length!==0;){
                (
                    function(i){
                if(data.items[i].completed===true){
                    data.items.splice(i, 1);
                }
            })(i);
            }
            update();
        },false);

        //toggle all
        $(".toggle-all").addEventListener("touchstart",function(event){
            event.preventDefault();
            console.log("toggle 咋回事？");
            this.checked = (!this.checked);
           
            var completed =  this.checked;
            console.log("checked:",completed);
            for(var i=0;i<data.items.length;i++){
                (
                    function(i){
                console.log("toggle combom:",i);
                data.items[i].completed=completed;
            })(i);
            }
            update();
        },false);

        //filter
        function filters(){
            filters=$all(".filters li a");
            for(var i=0;i<filters.length;i++){
                (
                    function(i){
                        filters[i].addEventListener("touchstart", function() {
                            event.preventDefault();
                            data.filter = filterList[i];
                            console.log("filter: ", data.filter);
                            $all(".filters li a").forEach(function(filter) {
                                filter.classList.remove("selected");
                            });
                            this.classList.add("selected");
                            update();
                        }, false);
                    }
                )(i);
            }
        }
        filters();
        
    })
    $(".todo-level").onchange=changeSelect;
    //$(".todo-add-btn").onclick=addTodo;

}


//change the color of todo level selector
function changeSelect(){
    var myselect=$(".todo-level");
    var index=myselect.selectedIndex;
    var lvl=myselect.options[index].value;
    console.log("lvl:",lvl);
    /*yellow rgb(255,249,185)*/
    /*red rgba(227,122,128,0.5)*/
    /*green rgba(165, 241, 172,0.5)*/
    switch(true){
        case lvl===LVL_LOW:
            //console.log("switch lvl:",lvl);
            $(".todo-level").style.backgroundColor='rgba(165, 241, 172,0.5)';
            break;
        case lvl===LVL_MEDIUM:
            //console.log("switch lvl:",lvl);
            $(".todo-level").style.backgroundColor='rgb(255,249,185)';
            break;
        case lvl===LVL_HIGH:
            //console.log("switch lvl:",lvl);
            $(".todo-level").style.backgroundColor='rgba(227,122,128,0.5)';
            break;
        default:
            break;
                    
    }
    
    
}

//update the page
function update(){
    model.flush();
    var data = model.data;
    var activeCounter = 0;

    var todoList = $(".todo-list");
    todoList.innerHTML = "";
    
    //create todo items
    for(var i=0;i<data.items.length;i++){
        (
        function(i){
            console.log("iiiiibuwan:",i);
            tdItem=data.items[i];
            if(tdItem.completed===false){
                activeCounter+=1;
            }
            if(data.filter===filterList[0]|| 
                (tdItem.completed === true) === (data.filter === "Completed")){
                    //li
                    var item = document.createElement("li");
                    item.classList.add("todo-item");

                    //card
                    var card = document.createElement("div");
                    card.classList.add("todo-card");

                    //btn
                    var btn = document.createElement("button");
                    btn.classList.add("todo-item-btn");
                    if(tdItem.completed){
                        var btntxt=document.createElement("div");
                        btntxt.classList.add("todo-item-btn-content");
                        btntxt.innerHTML="O";
                        btn.appendChild(btntxt);
                    }

                    //txt span todo-item-txt-done
                    var txt = document.createElement("span");
                    if(tdItem.completed){
                        txt.classList.add("todo-item-txt-done");
                    }else{
                        txt.classList.add("todo-item-txt");
                    }
                    txt.innerHTML=tdItem.msg;

                    //lv span todo-item-lv
                    var lv=document.createElement("span");
                    lv.classList.add("todo-item-lv");
                    switch(true){
                        case tdItem.level===LVL_LOW:
                            //console.log("switch lvl:",lvl);
                            lv.innerHTML="慢肝";
                            lv.style.backgroundColor='rgba(165, 241, 172,0.5)';
                            break;
                        case tdItem.level===LVL_MEDIUM:
                            //console.log("switch lvl:",lvl);
                            lv.innerHTML="快肝";
                            lv.style.backgroundColor='rgb(255,249,185)';
                            break;
                        case tdItem.level===LVL_HIGH:
                            //console.log("switch lvl:",lvl);
                            lv.innerHTML="爆肝";
                            lv.style.backgroundColor='rgba(227,122,128,0.5)';
                            break;
                        default:
                            break;
                    }
                    // delete button
                    var delbtn = document.createElement("button");
                    delbtn.classList.add("destory");
                    delbtn.innerHTML = "×";
                    //delbtn.style.visibility="hidden";

                    //append
                    todoList.appendChild(item);
                    item.appendChild(card);
                    card.appendChild(btn);
                    card.appendChild(txt);
                    card.appendChild(lv);
                    card.appendChild(delbtn);

                    //done or undo
                    btn.addEventListener("touchstart",function(event){
                        event.preventDefault();
                        console.log("btn事件：",i);
                        data.items[i].completed=!data.items[i].completed;
                        update();
                    },false);

                    //delete
                    delbtn.addEventListener("touchstart",function(event){
                        event.preventDefault();
                        data.items.splice(i, 1);
                        update();
                    },false);

                    //edit item msg
                    txt.addEventListener("touchstart",function(event){
                        event.preventDefault();
                        tempMsg=data.items[i].msg;
                        tempTag=data.items[i].level;
                        data.items.splice(i, 1);
                        $(".todo-new").value = tempMsg;
                        setLevel(tempTag);
                        update();
                    },false);

                    


        
                }
        })(i);
    }

    //$(".todo-new").value = data.msg;

    $(".toggle-all").style.visibility = 
        data.items.length > 0 ? "visible" : "hidden";
    $(".toggle-all").checked = activeCounter === 0;
    
    $(".todo-counter").innerHTML = "还需"+activeCounter+"个肝";
    
    
    $(".clear-completed").style.visibility = 
        activeCounter === data.items.length ? "hidden" : "visible";
    
    // dynamically change the height of scoll-view
    $("#scroll-view").style.height = ""
    console.log("scroll-view height:", $("#scroll-view").clientHeight);
    if ($("#scroll-view").clientHeight > window.screen.height * 0.75) {
        $("#scroll-view").style.height = window.screen.height * 0.75 + "px";
    } else {
        $("#scroll-view").style.height = "";
    }
}

function setLevel(lvl){
    var s1=$(".todo-level");
    s1.options[0].selected = true;
    s1.style.backgroundColor='rgba(165, 241, 172,0.5)';
    switch(true){
        case lvl===LVL_LOW:
            //console.log("switch lvl:",lvl);
            
            s1.options[0].selected = true;
            s1.style.backgroundColor='rgba(165, 241, 172,0.5)';
            break;
        case lvl===LVL_MEDIUM:
            //console.log("switch lvl:",lvl);

            s1.options[1].selected = true;
            s1.style.backgroundColor='rgb(255,249,185)';
            break;
        case lvl===LVL_HIGH:
            //console.log("switch lvl:",lvl);
            s1.options[2].selected = true;
            s1.style.backgroundColor='rgba(227,122,128,0.5)';
            break;
        default:
            break;
    }
}