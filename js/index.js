const tabs = (function controls(){
	const tabs = Array.from(document.querySelectorAll('.tab'));
	function loadView(tab){
		const tabBtns = Array.from(tab.querySelectorAll('.tab-btn'));
		tabBtns.forEach(function(tabBtn,index){
			const content = document.querySelector(tabBtn.dataset.target);
			if(tabBtn.classList.contains('active')){
				content.classList.add('active');
			}else{
				content.classList.remove('active');
			}
		});
	};
	function loadEvent(tab){
		const tabBtns = Array.from(tab.querySelectorAll('.tab-btn'));
		tabBtns.forEach(function(tabBtn,index){
			tabBtn.onclick = function(event){
				if(!tabBtn.classList.contains('active')){
					tab.querySelector('.active').classList.remove('active');
					tabBtn.classList.add('active');
					loadView(tab);
				}
			}
		});
	};
	(function(){
		tabs.forEach(function(tab,index){
			loadView(tab);
			loadEvent(tab);
		});
	})()
})();
const checkTime = (function(){
	function splitTime(time){
		const [h,p] = time.split(":");
		return [Number(h),Number(p)];
	};
	return function checkTime(a,b){
		const[ha,pa] = splitTime(a);
		const[hb,pb] = splitTime(b);
		if(ha > hb) {
			return 1
		}else if(ha === hb){
			return pa - pb;
		}else{
			return -1;
		}

	};
})()
const eventContent = (function testContent(){
	const content = document.querySelector("#event-content");
	const body = content .querySelector(".event-content-body");
	const row = content.querySelector(".event-row");
	let listEventTime = [];
	function defalt(){
		listEventTime = [{
			start: '00:00', end: '05:00', value: 'Không hoạt động'
		},{
			start: '05:00', end: '09:30', value: 'Vé thường'
		},{
			start: '09:30', end: '16:00', value: 'Vé tiết kiệm'
		},{
			start: '16:00', end: '19:30', value: 'Vé thường'
		},{
			start: '19:30', end: '22:00', value: 'Vé tiết kiệm'
		},{
			start: '22:00', end: '24:00', value: 'Không hoạt động'
		}];
	};
	function clear(){
		listEventTime = [];
	};
	function loadView(){
		body.innerHTML = "";
		listEventTime.forEach(function(eventTime,index){
			const newRow = row.cloneNode(true);
			body.appendChild(newRow);
			// newRow.querySelector('.id').innerText = "TC"+index;
			newRow.querySelector('.start').innerText = eventTime.start;
			newRow.querySelector('.end').innerText = eventTime.end;
			newRow.querySelector('.value').innerText = eventTime.value;
		})
	};
	function addListEventTime(eventTime){
		listEventTime.push(eventTime);
		listEventTime=listEventTime.sort(function(a,b){
			return checkTime(a.start,b.start);
		})
		loadView();
	};
	function checkEventTime(testTime){
		return listEventTime.reduce(function(result,eventTime){
			const checkStart = checkTime(testTime,eventTime.start);
			const chechEnd = checkTime(testTime,eventTime.end);
			if(checkStart >=0 && chechEnd <0){
				result.push(eventTime.value);
			}
			return result;
		},[])
	}
	defalt();
	loadView();
	return {
		add:addListEventTime,
		check:checkEventTime
	}
})();
const eventForm = (function eventForm(){
	const form           = document.querySelector('#event-form');
	const inputTimeStart = form.querySelector('#time-start');
	const inputTimeEnd   = form.querySelector('#time-end');
	const inputTimeValue = form.querySelector('#time-value');
	let eventTime;
	function initEventTime(){
		eventTime = {
			result:{},
			validate:true
		};
	};
	function addEventTime(key,input){
		if(input.value === ""){
			eventTime.validate = false;
		}else{
			eventTime.result[key] = input.value;
		}
	};
	function loadInputValue(){
		addEventTime('start',inputTimeStart);
		addEventTime('end',inputTimeEnd);
		addEventTime('value',inputTimeValue);
	};
	function resetInputValue(){
		inputTimeStart.value = "";
		inputTimeEnd.value   = "";
		inputTimeValue.value = "";
	};
	function loadEvent(){
		form.onsubmit=function(event){
			event.preventDefault();
			initEventTime();
			loadInputValue();
			if(eventTime.validate){
				resetInputValue();
				eventContent.add(eventTime.result)
			}else{
				console.log(eventTime.result,"Không bỏ trống dữ liệu");
			}
		}
	}
	(function run(){
		loadEvent();
	})()
})();
const testContent = (function testContent(){
	const content = document.querySelector("#test-content");
	const body = content .querySelector(".test-content-body");
	const row = content.querySelector(".test-row");
	const listTestTime = [];
	function loadView(){
		body.innerHTML = "";
		listTestTime.forEach(function(testTime,index){
			const newRow = row.cloneNode(true);
			body.appendChild(newRow);
			body.lastChild.scrollIntoView();
			newRow.querySelector('.id').innerText = "TC"+index;
			newRow.querySelector('.time').innerText = testTime.time;	
			newRow.querySelector('.result').innerText = eventContent.check(testTime.time)[0] ?? "";
		})
	};
	function addListTestTime(testTime){
		listTestTime.push(testTime);
		loadView()
	};
	loadView();
	return {
		add:addListTestTime
	}
})();
const testForm = (function eventForm(){
	const form           = document.querySelector('#test-form');
	const inputTimeTest = form.querySelector('#time-test');
	let testTime;
	function initEventTime(){
		testTime = {
			result:{},
			validate:true
		};
	};
	function addEventTime(key,input){
		if(input.value === ""){
			testTime.validate = false;
		}else{
			testTime.result[key] = input.value;
		}
	};
	function loadInputValue(){
		addEventTime('time',inputTimeTest);
	};
	function resetInputValue(){
		inputTimeTest.value = "";
	};
	function loadEvent(){
		form.onsubmit=function(event){
			event.preventDefault();
			initEventTime();
			loadInputValue();
			if(testTime.validate){
				resetInputValue();
				testContent.add(testTime.result);
			}else{
				console.log(testTime.result,"Không bỏ trống dữ liệu");
			}
		}
	}
	(function run(){
		loadEvent();
	})()
})();
