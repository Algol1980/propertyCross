var app = (function() {
  var searchHub = {};
  var myForm = document.querySelector("#propCross");
  var placeInput = document.querySelector("#propLocation").value;
  var resultBlock = document.querySelector(".propResult");
  var searchLocation;
  var perPage;
  var searhUrl;
  var currentPage = 1;
  var selectItem = document.querySelector("#placesPerPage");
  var currentListPos = 0;
  var resultContent = "";
  var template = '<div class="resultElement" data-guid="{{element.guid}}"><img src="{{element.img_url}}" class="col-sm-4" alt ={{element.title}}/><h4 class="col-sm-8">{{element.title}}</h4><strong class="col-sm-8">{{element.price_formatted}}</strong><span class="col-sm-8">{{element.summary}}</span><i class="glyphicon glyphicon-star-empty btn-lg" aria-hidden="true"></i></div>';
  var templateLocation = '<div class="resultElement"><h4><a class="location" href="#" data-place-name="{{element.place_name}}">{{element.title}}<a></h4></div>';
  var templateStorage = '<div class="resultElement"><h4><a class="storage" href="#" data-search-location="{{element}}">{{element}} ({{element.results}})<a></h4></div>';

  var placeName = (function() {
    var _value = "";
    return {
      get: function() {
        return _value;
      },
      set: function(val) {
        _value = val;
      }
    }
  })();
   window.onload = function () {
    var fromLocal = JSON.parse(localStorage.getItem("success locations"));
  if (fromLocal) {
    makeStorageList(fromLocal);
    // console.log(fromLocal);
  }

   }
  function getitemPerPage() {
    return selectItem.options[selectItem.selectedIndex].text;
  }

  function eventHandler(event) {
    resultContent = "";
    event.preventDefault();
    placeName.set(document.querySelector("#propLocation").value);
    perPage = getitemPerPage();
    searchLocation = placeName.get();
    recieveData();
  }

  function recieveData() {
    $.ajax({
      url: "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=" + currentPage + "&number_of_results=" + perPage + "&place_name=" + searchLocation,
      method: 'GET',
      timeout: 5000,
      dataType: "jsonp",
      success: function(data) {
          switch (data.response.application_response_code) {
            case "100":
            case "101":
            case "110":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[searchLocation].response.listings);
              saveInStorage(searchLocation, data.response.total_results);
              break;
            case "200":
            case "202":
              searchHub[searchLocation] = data;
              makeLokationsList(searchHub[searchLocation].response.locations);
              break;
            default:
              showErrorList(data.response);
          }
        }
        // error: function() {}
    });
  }

function saveInStorage(data, results) {
  var fromLocal = JSON.parse(localStorage.getItem("success locations"));
  if (!fromLocal) {
    fromLocal = {}
  }
  fromLocal[data] = {"results" : results};
  
  // fromLocal.push(data);
  localStorage.setItem("success locations", JSON.stringify(fromLocal));
  localStorage.getItem("success locations");
}

function showErrorList(data) {
  switch (data.application_response_code) {
            case "100":
            case "101":
            case "110":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[searchLocation].response.listings);
              // console.log(url);
              break;
            case "200":
            case "202":
              searchHub[searchLocation] = data;
              makeLokationsList(searchHub[searchLocation].response.locations);
              // showLoactionList(data.response);
              // console.log(url);
              break;
            default:
              showErrorList(data.response);
          }
}

  function makeResultErrorList(message) {
    resultBlock.innerHTML = resultContent;
  }



  function makeResultList(list) {
    list.forEach(renderResult);
    resultBlock.innerHTML = resultContent;
  }

  function makeLokationsList(list) {
    list.forEach(renderLocationResult);
    resultBlock.innerHTML = resultContent;
  }    


  function makeStorageList(list) {
    for (item in list) {
    newStr = templateStorage;
    newStr = newStr.replace("{{element}}", item);
    newStr = newStr.replace("{{element}}", item);
    newStr = newStr.replace("{{element.results}}", list[item].results);
    resultContent += newStr;
    }
    resultBlock.innerHTML = resultContent;
  }

  function renderResult(element) {
    var newStr = template;
    newStr = newStr.replace("{{element.guid}}", element.guid);
    newStr = newStr.replace("{{element.img_url}}", element.img_url);
    newStr = newStr.replace("{{element.title}}", element.title);
    newStr = newStr.replace("{{element.title}}", element.title);
    newStr = newStr.replace("{{element.price_formatted}}", element.price_formatted);
    newStr = newStr.replace("{{element.summary}}", element.summary);
    resultContent += newStr;
  }

  function renderLocationResult(element) {
    var newStr = templateLocation;
    newStr = newStr.replace("{{element.place_name}}", element.place_name);
    newStr = newStr.replace("{{element.title}}", element.place_name);
    resultContent += newStr;
  }


  function renderLocalStorage(element) {
    var newStr = templateStorage;
    newStr = newStr.replace("{{element}}", element);
    newStr = newStr.replace("{{element.results}}", element.results);
    resultContent += newStr;
  }

  myForm.addEventListener("submit", eventHandler);
  selectItem.addEventListener("change", eventHandler);

  resultBlock.onclick = function(event) {
    var target = event.target;
    if (target.className == 'location') {
      placeName.set(target.getAttribute('data-place-name'));
      searchLocation = placeName.get();
      resultContent = "";
      resultBlock.innerHTML = "";
      document.querySelector("#propLocation").value = searchLocation;
      console.log(document.querySelector("#propLocation").value);
      recieveData();
      event.preventDefault();
    }
    if (target.classList.contains('glyphicon-star-empty')) {
      console.log(target.classList);
      target.classList.remove("glyphicon-star-empty");
      target.classList.add("glyphicon-star");
      
    }
    event.preventDefault();
    };



});
app();
