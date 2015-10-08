var app = (function() {
    var searchHub = {};
    var myForm = document.querySelector("#propCross");
    var placeInput = document.querySelector("#propLocation");
    var resultBlock = document.querySelector(".propResult");
    var searchLocation;
    var perPage;
    var searhUrl;
    var currentPage = 1;
    var selectItem = document.querySelector("#placesPerPage");
    var currentListPos = 0;
    var resultContent = "";
    var template = '<div class="resultElement"><img src="{{element.img_url}}" class="col-sm-4" alt ={{element.lister_name}}/><h4 class="col-sm-8">{{element.lister_name}}</h4><strong class="col-sm-8">{{element.price_formatted}}</strong><span class="col-sm-8">{{element.summary}}</span></div>';

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
        url: "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page="+ currentPage +"&number_of_results=" + perPage + "&place_name=" + searchLocation,
        method: 'GET',
        timeout: 5000,
        dataType: "jsonp",
        success: function(data) {
          switch(data.response.application_response_code) {
            case "100":
            case "101":
            case "110":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[searchLocation].response.listings);
              console.log(searchHub);
            break;
            case "200":
            case "202":
              searchHub[searchLocation] = data;
              makeResultList(searchHub[searchLocation].response.listings);
              showLoactionList(data.response);
              console.log(searchHub);
            break;
            default:
              showErrorList(data.response);
          }
        
        }
        // error: function() {}
    });

    }
    function makeResultList(list) {
 
      list.forEach(renderResult);
      resultBlock.innerHTML = resultContent;

    }

    function renderResult(element) {
      var newStr = template;
      newStr = newStr.replace("{{element.img_url}}", element.img_url);
      newStr = newStr.replace("{{element.lister_name}}", element.lister_name);
      newStr = newStr.replace("{{element.lister_name}}", element.lister_name);
      newStr = newStr.replace("{{element.price_formatted}}", element.price_formatted);
      newStr = newStr.replace("{{element.summary}}", element.summary);
      resultContent += newStr;
    }

    myForm.addEventListener("submit", eventHandler);
    selectItem.addEventListener("change", eventHandler);
  
 });
 app();

