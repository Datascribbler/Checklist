$(document).ready(function(){

  var listdata;

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
    upreq.setRequestHeader("CONTENT",JSON.stringify(listdata));
    upreq.send();
  }

  var listreq = new XMLHttpRequest();
  listreq.onreadystatechange = function(){
    if(this.status == 200 && this.readyState == 4){
      listdata = JSON.parse(this.responseText);
      console.log(listdata);
      render(listdata, document.getElementsByClassName("container-scrollbox")[0]);
    }
  };
  listreq.open("POST", "list.json", "true");
  listreq.send();

  $(".button").click(function(){
    var newobj = {
      name : document.getElementsByClassName("input-agenda-item")[0].value,
      checked : false
    };
    listdata.push(newobj);

    updateData(listdata);

  });
});
