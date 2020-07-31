$(document).ready(function(){

  var angle = {current:0, lock:70}

  let sketch = function(p) {
    p.setup = function(){
      p.createCanvas(170, 170);
      p.background(255);
    }
    p.draw = function(){
      if(angle.current<angle.lock){
        angle.current++;
        document.getElementById("display-number").innerHTML = angle.current + "%";
      }
      else if(angle.current>angle.lock){
        angle.current--;
        document.getElementById("display-number").innerHTML = angle.current + "%";
      }
      p.smooth();
      p.background(255);
      p.circle(p.width/2,p.height/2,160);
      p.fill(0);
      p.arc(p.width/2,p.height/2,160,160,-6.28319/4,6.28319*(angle.current/100)-6.28319/4);
      p.fill(255);
      p.circle(p.width/2,p.height/2, 120);


    }
  };
  new p5(sketch, 'display');

  var listdata;

  var calendar = {
    structure:[{month:"JAN",days:31},{month:"FEB",days:28},{month:"MAR",days:31},{month:"APR",days:30},{month:"MAY",days:31},{month:"JUN",days:30},{month:"JUL",days:31},{month:"AUG",days:31},{month:"SEP",days:30},{month:"OCT",days:31},{month:"NOV",days:30},{month:"DEC",days:31}],
    index:{month:0,day:1,year:2020},
    leap:function(){
      if(this.index.year%4 === 0){
        this.structure[1].days = 29;
      }
      else{
        this.structure[1].days = 28;
      }
    },
    load:function(d,m,y){
      this.index.day = d;
      this.index.month = m;
      this.index.year = y;
      this.update_location();
    },
    increment:function(int){
      this.index.day += int;

      if(this.index.day>this.structure[this.index.month].days){

        if(this.index.month >= 11){
          this.index.year++;
          this.leap();
        }
        this.index.month = (this.index.month + 1) % 12;
        this.index.day = 1;

      }

      else if(this.index.day <= 0){

        if(this.index.month === 0){
          this.index.year--;
          this.leap();
        }
        this.index.month = (12 + (this.index.month - 1)) % 12;
        this.index.day = this.structure[this.index.month].days;

      }
      else{}

      this.render();
      this.update_location();
    },
    render:function(){
      document.getElementById("year").innerHTML = this.index.year;
      document.getElementById("month").innerHTML = this.structure[this.index.month].month;
      document.getElementById("day").innerHTML = convertToDoubleDigit(this.index.day);
    },
    location:"0-1-2020",
    update_location:function(){
      this.location = this.index.day+"-"+(this.index.month+1)+"-"+this.index.year+".json";
      console.log(this.location);
    }
  };

  var d = new Date();
  calendar.load(d.getDate(),d.getMonth()+1,d.getFullYear());
  calendar.render();

  function convertToDoubleDigit(num){
    if(num<10){
      return "0"+num;
    }
    else{
      return num;
    }
  }



  function render(arr, targ){
    var checkedcount = 0;

    for(let i = 0; i < arr.length; i++){
      var listobj = document.createElement("DIV");
      listobj.className = "container-list-item";

      var listcheck = document.createElement("DIV");
      listcheck.className = "button-check";

      var label = document.createElement("P");
      label.innerHTML = arr[i].name;

      var x = document.createElement("DIV");
      x.className = "widget-x";

      if(arr[i].checked === true){
        listcheck.className += " checked";
        label.className = "text-checked";
        checkedcount++;
      }
      else{}


      listcheck.onclick = function(){

        if(this.className === "button-check"){
          this.className += " checked";
          arr[i].checked = true;
        }
        else{
          this.className = "button-check";
          arr[i].checked = false;
        }
        updateData(listdata);

      };

      x.onclick = function(){
        arr.splice(i,1);
        updateData(listdata);
      };

      listobj.appendChild(listcheck);
      listobj.appendChild(label);
      listobj.appendChild(x);
      targ.appendChild(listobj);
    }
    var spacer = document.createElement("DIV");
    spacer.className = "spacer";
    targ.appendChild(spacer);

    return Math.floor(100*(checkedcount/arr.length));
  }
  function clear(targ){
    targ.innerHTML = "";
  }

  function updateData(obj){
    var upreq = new XMLHttpRequest();
    upreq.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        clear(document.getElementsByClassName("container-scrollbox")[0]);
        console.log(this.responseText);
        listdata = JSON.parse(this.responseText);
        angle.lock = render(listdata, document.getElementsByClassName("container-scrollbox")[0]);
      }
    };

    upreq.open("POST","Saver.php","true");
    upreq.setRequestHeader("URL",calendar.location);
    upreq.setRequestHeader("CONTENT",JSON.stringify(listdata));
    upreq.send();
  }
  function loadData(targ){
    clear(document.getElementsByClassName("container-scrollbox")[0]);

    var listreq = new XMLHttpRequest();
    listreq.onreadystatechange = function(){
      if(this.status == 200 && this.readyState == 4){
        listdata = JSON.parse(this.responseText);
        console.log(listdata);
        angle.lock = render(listdata, document.getElementsByClassName("container-scrollbox")[0]);
      }
    };
    listreq.open("POST", "Getter.php", "true");
    listreq.setRequestHeader("URL",calendar.location,true);
    listreq.send();
  }

  loadData();

  $(".button").click(function(){
    var newobj = {
      name : document.getElementsByClassName("input-agenda-item")[0].value,
      checked : false
    };
    listdata.push(newobj);

    updateData(listdata);

  });

  $("#arrowl").click(function(){
    calendar.increment(-1);
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });

  $("#arrowr").click(function(){
    calendar.increment(1);
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });
});
