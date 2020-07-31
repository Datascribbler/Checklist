$(document).ready(function(){

  var listdata;

  var calendar = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  var calendar_location = "list.json";

  function convertMonths(month,year){
    let months = [31,28,31,30,31,30,31,31,30,31,30,31];
    if(year%4 == 0){
        months[1]=29;
    }else{}
    // leap year case
    var accumulation = months.slice(0,month);
    var sum = accumulation.reduce(function(a,b){ return a+b; },0);



    return sum;
  }

  function convertToMonths(days,year){
    let months = [31,28,31,30,31,30,31,31,30,31,30,31];
    var month = 0;

    if(year%4 == 0){
        months[1] = 29;
    }else{}
    // leap year case

    for(let i = 0; i < months.length; i++){
      if(days > months[i]){
        month++;
        days -= months[i];
      }
      else{
        return {month:month + 1, date:days };
      }
    }
  }

  function convertToDate(days){
    var dateobj = {};

      dateobj.year = Math.floor(days / 365.25);
      var remainingdays = (days) - Math.floor(dateobj.year * 365.25);

      if(dateobj.year % 4 === 0){
        remainingdays+=1;
      }

      console.log("remainingdays: " + remainingdays);
      dateobj.month = Math.floor(convertToMonths(remainingdays,dateobj.year).month);
      dateobj.date = Math.floor(convertToMonths(remainingdays,dateobj.year).date);

      return dateobj

  }

  function getDate(d,m,y){

    return convertMonths(m,y) + d
    + Math.floor(y*365.25);
  }

  function renderDate(num){
    var output = convertToDate(num);

    calendar_location = output.date+"-"+(output.month+1)+"-"+output.year+".json";
    console.log(output);
    document.getElementById("year").innerHTML = output.year;
    document.getElementById("month").innerHTML = calendar[output.month-1];
    document.getElementById("day").innerHTML = convertToDoubleDigit(output.date);
  }

  function convertToDoubleDigit(num){
    if(num<10){
      return "0"+num;
    }
    else{
      return num;
    }
  }

  var d = new Date();
  var dateindex = getDate(d.getDate(),d.getMonth(),d.getFullYear());
  // var dateindex = getDate(1,0,2019);


  renderDate(dateindex);


  function render(arr, targ){
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
        render(listdata, document.getElementsByClassName("container-scrollbox")[0]);
      }
    };

    upreq.open("POST","Saver.php","true");
    upreq.setRequestHeader("URL",calendar_location);
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
        render(listdata, document.getElementsByClassName("container-scrollbox")[0]);
      }
    };
    listreq.open("POST", "Getter.php", "true");
    listreq.setRequestHeader("URL",calendar_location,true);
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
    dateindex--;
    renderDate(dateindex);
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });

  $("#arrowr").click(function(){
    dateindex++;
    renderDate(dateindex);
    loadData(document.getElementsByClassName("container-scrollbox")[0]);
  });
});
