var myApp = angular.module("myApp", []);

var INPUT_HEADER_TEMPLATE = function(id) {
return `
	<h3>כותרת</h3> 
	<input type="text" placeholder="הכנס כותרת..." ng-model="contents[` + id + `].header_text">
`};

var CONTENT_HEADER_TEMPLATE = function(id) {
	return `
		<h1 ng-bind='contents[` + id + `].header_text'></h1>
`};


var INPUT_PARAGRAPH_TEMPLATE = function(id) {
	return `
		<h3>פסקה</h3>
		<input type="text" placeholder="הכנס כותרת..." ng-model="contents[` + id + `].header_text">
		<br> 
		<textarea type="text" placeholder="הכנס טקסט..." ng-model="contents[` + id + `].para_text">
`};

var CONTENT_PARAGRAPH_TEMPLATE = function(id) {
	return `
		<h3 dir="rtl" ng-bind='contents[` + id + `].header_text'></h3>
		<p dir="rtl" ng-bind='contents[` + id + `].para_text'></p>
`};

var INPUT_DATE_TEMPLATE = function(id) {
return `
	<h3>תאריך</h3> 
	<input type="text" placeholder="הכנס יום..." ng-model="contents[` + id + `].right_text">
	<input type="text" placeholder="הכנס תאריך..." ng-model="contents[` + id + `].left_text">
`};

var CONTENT_DATE_TEMPLATE = function(id) {
	return `
		<span style="float:right;" ng-bind='contents[` + id + `].right_text'></span>
		<span style="float:left;" ng-bind='contents[` + id + `].left_text'></span>
`};

var INPUT_LIST_TEMPLATE = function(id) {
return `
	<h3>רשימה</h3> 
	<input style="width: 100%" type="text" placeholder="הכנס טקסט..." ng-model="contents[` + id + `].bullets[0]">
	<input style="width: 100%" type="text" placeholder="הכנס טקסט..." ng-model="contents[` + id + `].bullets[1]">
	<input style="width: 100%" type="text" placeholder="הכנס טקסט..." ng-model="contents[` + id + `].bullets[2]">
	<button tabindex="-1" class="plus" ng-click=addBullet(` + id + `)>+</button>
	<button tabindex="-1" class="minus" ng-click=removeBullet(` + id + `)>-</button>
`};

var CONTENT_LIST_TEMPLATE = function(id) {
	return `
		<ul>
		    <li ng-repeat="bullet in contents[` + id + `].bullets">
		      {{ bullet }}
		    </li>
	  	</ul>		
`};



myApp.controller('myCtrl',['$scope','$compile', function($scope, $compile) {
	console.log('ctrl working');

	var myDocument = document.getElementById("document");
	var myAngDocument = angular.element(myDocument);
	var myBody = document.getElementById("body");
	var myAngBody = angular.element(myBody);

	var id = 0;
	var temporary = false;
	$scope.contents = [];

    $scope.addTemplate = function (template) {
    	if (temporary && id != 0) {
    		//removeHTML(--id);
    	}
    	temporary = true;

		if (template != "") {
			addHTMLContent(template, id);
			addHTMLInput(template, id);
			id++;	
		}
    };

    var addHTMLContent = function(template, id) {
		var html;
		switch(template) {
			case "header":
				var html = CONTENT_HEADER_TEMPLATE(id);
				break;

			case "paragraph":
				var html = CONTENT_PARAGRAPH_TEMPLATE(id);
				break;

			case "date":
				var html = CONTENT_DATE_TEMPLATE(id);
				break;

			case "list":
				var html = CONTENT_LIST_TEMPLATE(id);
				break;

			default:
				return;
		}

		html = `
		<div id=d` + id + ` style="clear:right;">
		` + html + `
		</div> 
		`;

		html = $compile(html)($scope);
		myAngDocument.append(html);

	};

	var addHTMLInput = function(template, id) {
		var html;
		switch(template) {
			case "header":
				html = INPUT_HEADER_TEMPLATE(id);
				break;

			case "paragraph":
				html = INPUT_PARAGRAPH_TEMPLATE(id);
				break;

			case "date":
				var html = INPUT_DATE_TEMPLATE(id);
				break;

			case "list":
				var html = INPUT_LIST_TEMPLATE(id);
				break;

			default:
				return;
		}
		html = `
		<div class="template-selection" id=b` + id + `>
			<button tabindex="-1" class="input-options delete" ng-click="removeId(` + id + `)">מחק</button>
			<button tabindex="-1" class="input-options up" ng-click="moveUp(` + id + `)">&#x25B2;</button>
			<button tabindex="-1" class="input-options down" ng-click="moveDown(` + id + `)">&#x25BC;</button>
		` + html + `
		</div> 
		`;

		html = $compile(html)($scope);
		myAngBody.append(html);

	};

	var removeHTML = function(id) {
		console.log(id);
		var child = document.getElementById("d" + id);
		child.parentNode.removeChild(child);
		var child = document.getElementById("b" + id);
		child.parentNode.removeChild(child);
	};

	$scope.moveUp = function(id) {
		var elem = document.getElementById("b" + id);
		var elem2 = document.getElementById("d" + id);
		var sibling = elem.previousSibling;
		var sibling2 = elem2.previousSibling;
		if (sibling != null) {
			myBody.insertBefore(elem, sibling);
			myDocument.insertBefore(elem2, sibling2);
		}
	}

	$scope.moveDown = function(id) {
		var elem = document.getElementById("b" + id);
		var elem2 = document.getElementById("d" + id);
		var sibling = elem.nextSibling;
		var sibling2 = elem2.nextSibling;
		if (sibling != null ) {
			myBody.insertBefore(sibling, elem);
			myDocument.insertBefore(sibling2, elem2);
		}
	}


	$scope.removeId = removeHTML;


	$scope.addBullet = function(id) {
		var elem = document.getElementById("b" + id);
		var children = elem.children;
		var num_bullets = 0;
		var plus;
		var i;
		for (i = 0; i < children.length; i++) {
			if (children[i].tagName == "INPUT") {
				num_bullets++;
			}
			if (children[i].className == "plus") {
				plus = children[i];
			}
		}

		var html = 	`<input style="width: 100%" type="text" placeholder="הכנס טקסט..." 
		ng-model="contents[` + id + `].bullets[` + num_bullets + `]">`;
		html = $compile(html)($scope);
		angular.element(elem).append(html);
		elem.insertBefore(html[0], plus)
	};

	$scope.removeBullet = function(id) {
		var elem = document.getElementById("b" + id);
		var children = elem.children;
		var last;
		var amount_in = 0;
		for (i = 0; i < children.length; i++) {
			if (children[i].tagName == "INPUT") {
				last = children[i];
				amount_in++;
			}
		}
		elem.removeChild(last);

		var elem2 = document.getElementById("d" + id).children[0];
		var children2 = elem2.children;
		var last2;
		var amount_li = 0;
		for (i = 0; i < children2.length; i++) {
			console.log(children2[i].tagName);
			if (children2[i].tagName == "LI") {
				last2 = children2[i];
				amount_li++;
			}
		}
		if (amount_li == amount_in) {
			delete $scope.contents[id].bullets[amount_li - 1];
			elem2.removeChild(last2);
		}


	}
}]);