var cityList = [];
var cityShortList = [];
var cityCurrentQuestion;
var countryList;
/************************************/
function get_country_code(country_name) {
  var country_code = "NOT_FOUND";

  for (i = 0; i <countryList.length; i++) {
    if (country_name == countryList[i].country_name)
    {
      country_code = countryList[i].country_code;
      break;
    }
  }

  return(country_code);
}

function city_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
}

function load_city_list() {
  var data = JSON.parse(cityRawList);
  
  countryList = JSON.parse(countryRawList);

  cityList = [];
  cityList.length = 0;

  var country = "_all";;  
  var country_code;

  switch (cityCurrentQuestion) {
    case "B1b":
      country = api.fn.answers().B1a_1_text;
      console.log("B1b country: ", country);
      break;     
    case "B2_3":
      country = api.fn.answers().B2_2_1_text;
      console.log("B2_3 country: ", country);      
      break;     
                 
    default:
      country = "_all";
      break;         
  }

  if (country != "_all")
  {
    var country_code = get_country_code(country); //parse from name to code
    if (country_code == "NOT_FOUND") { //in case can't find country, use the full list
      country = "_all";
    } 
  }
    
  console.log("cityCurrentQuestion: ", cityCurrentQuestion);
  console.log("country: ", country);

  for (i = 0; i <data.length; i++) {
    var city = data[i];
    if ((country == "_all") || (country == city.co))
    //&& city.city != "Removed"
    {
      var country_json = '"Country"' + ":" + '"' +  city.co + '", ';
      var city_json = '"City_ascii"' + ":" + '"' +  city.city + '", ';
 
      var show_json = '"Show"' + ":" + '"' +  city.city  + ", " + city.co;

      var str = '{' + country_json + city_json + show_json + '"}';

      cityList.push(JSON.parse(str));
    }
  }
  //console.log("cityList: ", cityList);
}

function update_drop_box_city_list() {
  var input = document.getElementById('inputcityCodeID').value;
  var searchList = document.getElementById('cityDropBoxList');
  
  searchList.innerHTML = '';
  cityShortList = [];
  cityShortList.length = 0;

  input = input.toLowerCase();

  var count = 0;
  
  //console.log("cityList.length: ", cityList.length);
  for (i = 0; i < cityList.length; i++) {
    let item = cityList[i];
    // console.log("i: ", i);
    // console.log("item: ", item.Show);
    // console.log("input: ", input);
    
    if (item.Show.toLowerCase().includes(input)) {
      const elem = document.createElement("option");
      elem.value = item.Show;
      searchList.appendChild(elem);
      cityShortList.push(item);
      count++;
    }
    
    if (count > 30) {
      break;
    }
  }

  if (city_in_list_found(cityList, document.getElementById('inputcityCodeID').value)) {
    console.log("Found ", document.getElementById('inputcityCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputcityCodeID').value);
  }   

}

function select_city() {
  var selectedCity = document.getElementById('inputcityCodeID').value;
  var savedData;
  var found = false;

 console.log("cityCurrentQuestion:", cityCurrentQuestion );
 
  for (i = 0; i < cityShortList.length; i++) 
  {
    var currentCity = cityShortList[i];
    if (currentCity.Show == selectedCity) 
    {
      found = true;
      break;
    } 
  }    
  
  if (found) {
    savedData = currentCity.City_ascii + ", " + currentCity.Country;
  }
  else {
    savedData = selectedCity;
  }
  api.fn.answers({selectedCity:  selectedCity});
  console.log("Saving data...", savedData);
  //store detail data here
  switch (cityCurrentQuestion) {
    case "B1b":
      api.fn.answers({B1b:  savedData});
      break;
    case "B2_1":
      api.fn.answers({B2_1:  savedData});
      break;          
    case "B2_3":
      api.fn.answers({B2_3:  savedData});
      break;     
    case "B2_5":
      api.fn.answers({B2_5:  savedData});
      break;  
    case "B2_9":
      api.fn.answers({B2_9:  savedData});
      break;  

    default:
      break;         
  }

  //log search 
  var temp = cityCurrentQuestion +": " + savedData;
  if (api.fn.answers().cityCurrentQuestion_log) {
    temp = api.fn.answers().cityCurrentQuestion_log +"; " + temp;
  } 
  api.fn.answers({cityCurrentQuestion_log:  temp});

  if (!found) {
    alert("Please search for a larger city.");
  }
  else
  {
    $('.rt-btn.rt-btn-next').show(); 
  }
  console.log("Select city done!");
}

function show_city_search_box(cityQuestion) {

  cityCurrentQuestion = cityQuestion;
  load_city_list();

  $('.rt-element.rt-text-container').append(`<input list="cityDropBoxList" onchange="select_city()"  onkeyup="update_drop_box_city_list()" name="inputcityCodeID" id="inputcityCodeID" >
  <datalist id="cityDropBoxList"> </datalist>`);

  document.getElementById('inputcityCodeID').value = "";

  if (city_in_list_found(cityList, document.getElementById('inputcityCodeID').value)) {
    console.log("Found ", document.getElementById('inputcityCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputcityCodeID').value);
  }
  $('#inputcityCodeID').show(); 

  $('.rt-btn.rt-btn-next').hide(); 
}


function hide_city_search_box() {
  $('#inputcityCodeID').hide();
  //var x = document.getElementById('inputcityCodeID');
  //x.style.display = "none";
}