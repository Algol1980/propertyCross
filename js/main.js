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
  var templateFavorite = '<div class="resultElement" data-guid="{{element.guid}}"><img src="{{element.img_url}}" class="col-sm-4" alt ={{element.title}}/><h4 class="col-sm-8">{{element.title}}</h4><strong class="col-sm-8">{{element.price_formatted}}</strong><span class="col-sm-8">{{element.summary}}</span><i class="glyphicon glyphicon-star btn-lg" aria-hidden="true"></i></div>';
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
  localStorage.setItem("success locations", JSON.stringify(fromLocal));
  localStorage.getItem("success locations");
}

function saveInFavorites(data, index) {
  var fromLocal = JSON.parse(localStorage.getItem("favorite places"));
  if (!fromLocal) {
    fromLocal = {}
  }
  fromLocal[index] = data;
  
  localStorage.setItem("favorite places", JSON.stringify(fromLocal));
  localStorage.getItem("favorite places");
}

function showErrorList(data) {
  switch (data.application_response_code) {
            case "100":
            case "101":
            case "110":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[searchLocation].response.listings);
              break;
            case "200":
            case "202":
              searchHub[searchLocation] = data;
              makeLokationsList(searchHub[searchLocation].response.locations);
              console.log(url);
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
      recieveData();
      event.preventDefault();
    }
    if (target.classList.contains('glyphicon-star-empty')) {
      target.classList.remove("glyphicon-star-empty");
      target.classList.add("glyphicon-star");
      var favoriteId = target.parentNode.getAttribute("data-guid");
      searchFavoriteData(favoriteId, searchHub[searchLocation].response.listings);
    }

    if (target.classList.contains('glyphicon-star ')) {
      target.classList.remove("glyphicon-star");
      target.classList.add("glyphicon-star-empty");
      var favoriteId = target.parentNode.getAttribute("data-guid");
      removeFavorite(index)
      searchFavoriteData(favoriteId, searchHub[searchLocation].response.listings);
    }
    event.preventDefault();
    };


function searchFavoriteData(index, searchObj) {
  for (item in searchObj) {
    if (searchObj[item].guid == index)  {
     var favObj = { 
        "guid" : searchObj[item].guid,
        "title" : searchObj[item].title,
        "img_url" : searchObj[item].img_url,
        "price_formatted" : searchObj[item].price_formatted,
        "summary" : searchObj[item].summary
    };
    break;
    }
  } 
  saveInFavorites(favObj, index);
}


});
app();
