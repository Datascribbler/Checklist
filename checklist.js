$(document).ready(function(){


  var angle = {current:0, lock:70};

  let sketch = function(p) {
    angle.placeholder = p;

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
      else{
        p.noLoop();
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

  class calendar {

    constructor (){
      this.datedict = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      this.current = new Date();
      this.selected = new Date();

      self = this;

      this.increment = {
        day: function(int){
          self.selected.setDate( self.selected.getDate() + int );
        },
        month: function(int){
          self.selected.setMonth( self.selected.getMonth() + int );
        }

      },

      this.getMonthLength = function(){
        var shadowmonth = new Date();
        shadowmonth.setMonth(this.selected.getMonth() + 1, 0);
        return shadowmonth.getDate();
      }

      this.render = function(){
        document.getElementById("year").innerHTML = this.selected.getFullYear();
        document.getElementById("month").innerHTML = this.datedict[this.selected.getMonth()];
        document.getElementById("day").innerHTML = convertToDoubleDigit(this.selected.getDate());

        if(cal.selected.getTime()>=cal.current.getTime()){
          document.getElementsByClassName("button")[0].className = document.getElementsByClassName("button")[0].className = document.getElementsByClassName("button")[0].className.replace(" disabled","");
        }
        else{
          document.getElementsByClassName("button")[0].className += " disabled";
        }

        this.location = this.selected.getDate()+"-"+this.selected.getMonth()+"-"+this.selected.getFullYear()+".json";
      };

      this.generateMonthGrid = function(targ){
        var objport = this;

        clear($(".container-calendar-bounder")[0]);
        for(let i = 0; i < this.getMonthLength(); i++){
          var dayblock = document.createElement("DIV");
          dayblock.className = "dayblock";
          dayblock.innerHTML = i+1;


          dayblock.onclick = function(){
            $(".date-grid-selected")[0].className = $(".date-grid-selected")[0].className.replace("date-grid-selected","");
            $(".dayblock")[i].className += " date-grid-selected";
            objport.selected.setDate(i+1);
            objport.render();
            loadData(document.getElementsByClassName("container-scrollbox")[0]);
          };

          $(".container-calendar-bounder")[0].appendChild(dayblock);
        }
        document.getElementsByClassName("dayblock")[this.selected.getDate() - 1].className += " date-grid-selected";
      };

      this.location = this.selected.getDate()+"-"+(this.selected.getMonth()+1)+"-"+this.selected.getFullYear()+".json";
    }
  };

  var cal = new calendar();
  cal.render();

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



      if(arr[i].checked === true){
        listcheck.className += " checked";
        label.className = "text-checked";
        checkedcount++;
      }
      else{}


      if(cal.selected.getTime()>=cal.current.getTime()){

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

        var x = document.createElement("DIV");
        x.className = "widget-x";

        x.onclick = function(){
          arr.splice(i,1);
          updateData(listdata);
        };
        listobj.appendChild(x);

        // document.getElementsByClassName("button")[0].className = document.getElementsByClassName("button")[0].className.replace(" disabled","");
    }
    else{
      listcheck.className += " disabled";
      // document.getElementsByClassName("button")[0].className += " disabled";
    }

    listobj.appendChild(listcheck);
    listobj.appendChild(label);

    targ.appendChild(listobj);

    }

    var spacer = document.createElement("DIV");
    spacer.className = "spacer";
    targ.appendChild(spacer);

    if(arr.length === 0){return 0;}
    else{
      return Math.floor(100*(checkedcount/arr.length));
    }

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
        angle.placeholder.loop();
      }
    };

    upreq.open("POST","Saver.php","true");
    upreq.setRequestHeader("URL",cal.location);
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
        angle.placeholder.loop();
        console.log(cal.location);
      }
    };
    listreq.open("POST", "Getter.php", "true");
    listreq.setRequestHeader("URL",cal.location,true);
    listreq.send();
  }

  loadData();

  $(".button").click(function(){
    if(cal.selected.getTime() >= cal.current.getTime()){
      var newobj = {
        name : document.getElementsByClassName("input-agenda-item")[0].value,
        checked : false
      };
      listdata.push(newobj);

      updateData(listdata);
    }else{}

  });

  $("#arrowl").click(function(){
    cal.increment.day(-1);
    cal.render();
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });

  $("#arrowr").click(function(){
    cal.increment.day(1);
    cal.render();
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });

  $(".container-calendar-disp").hide();

  $("#button-calendar").click(function(){
    cal.generateMonthGrid(document.getElementById("calendar-disp"));
    $(".container-calendar-disp").fadeIn(500);
  });

  $(".close-pane").click(function(){
    $(this).parent().fadeOut(500);
  });
});
