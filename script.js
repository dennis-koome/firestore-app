
var db = firebase.firestore();
db.enablePersistence();


function shwquotes(){
	var wrapper1 = document.getElementById("wrapper1");
	var wrapper2 = document.getElementById("wrapper2");
	var catwrapper = document.getElementById("catwrapper");
	var catwrapper2 = document.getElementById("catwrapper2");

	wrapper1.style.display = "block";
	wrapper2.style.display = "none";
	catwrapper.style.display = "block";
	catwrapper2.style.display = "none";
}

function shwtimetable(){
	var wrapper1 = document.getElementById("wrapper1");
	var wrapper2 = document.getElementById("wrapper2");
	var catwrapper = document.getElementById("catwrapper");
	var catwrapper2 = document.getElementById("catwrapper2");

	wrapper1.style.display = "none";
	wrapper2.style.display = "block";
	catwrapper.style.display = "none";
	catwrapper2.style.display = "block";
}


//=======================Start timetable edit========================

function addConfigValues(colomn,intervalVal,refId){
	var configrespons = document.getElementById("configrespons");
	configrespons.innerHTML = "";
	var ref = db.collection("TimetableConfig").doc();
		ref.set({
			colomnNo:colomn,
		  	timetableInt : intervalVal,
			refidentity : ref.id,
		})
		.then(function() {
		    configrespons.innerHTML = "Successfully Adde A Colomn";
		})
		.catch(function(error) {
			console.log(error);
		   configrespons.innerHTML = "<p style='color:#fd2e0c'><span style='font-weight:bold;'>Error:</span> A Problem Occured While Sending Configuration Information</p>";
		});
}


function addTimetableItems(item,itemIndx){
	var ref = db.collection("TimetableItems").doc();
	var reference = ref.id;
	ref.set({
		tItem:item,
		itemIndex:itemIndx=reference
	});
}


function addToDoList(tdoCat,tdoitem,tdoIndx,todoDate,timeStamp){
	var ref = db.collection("ToDoList").doc();
	var reference = ref.id;
	ref.set({
		todoCat:tdoCat,
		todoItem:tdoitem,
		tdoIndex:tdoIndx=reference,
		todoDate:todoDate,
		timeStamp:timeStamp
	});
}



//toggle the form to add items in my timetable
function toggadditm(){
	var tfrm = document.getElementById("tform");
	var toggtmtablefrm = document.getElementById("toggtmtablefrm");
	if(window.getComputedStyle(tfrm).display=="none"){
		tfrm.style.display = "block";
		toggtmtablefrm.innerHTML="	HIDE TO ADD ITEMS FORM";
		
	}else{
		tfrm.style.display = "none";
		toggtmtablefrm.innerHTML="OPEN TO ADD ITEMS TO YOUR TIMETABLE";
	}

}

function toggleaddcateg(){
	var addtodowrapper = document.getElementById("addtodowrapper");
	var addc = document.getElementById("addc");
	var wrapper2 = document.getElementById("wrapper2");
	var wrapper1 = document.getElementById("wrapper1");
	var catwrapper = document.getElementById("catwrapper");
	var catwrapper2 = document.getElementById("catwrapper2");
	//addtodowrapper.style.display="block";
	

	if(window.getComputedStyle(addtodowrapper).display=="none"){
		addc.innerHTML = "<span style='color:#ff3c3c'>Exit Add ToDo</span>";
		addc.style.border = "solid #ff3c3c 2px";
		addtodowrapper.style.display="block";
		wrapper2.style.display = "block";
		wrapper1.style.display = "none";
		catwrapper.style.display = "none";
		catwrapper2.style.display = "block";
	}else{	
		addtodowrapper.style.display="none";
		addc.innerHTML = "<span style='color:#fff'>Open Add ToDo</span>";
		addc.style.border = "solid #fff 1px";
	}

}


//checking the time not to go neyond 60
function checkTmLmt(inputval){
	var strtMin = document.getElementById("strtMin");
	if(inputval > 60){
		strtMin.value=0;
	}
}




function getconfigs(){
	var table = document.getElementById("table");
	var tfrm = document.getElementById("tfrm");
	var tfrmul = document.getElementById("tfrmul");	
	var colNo = document.getElementById("colNo");
	var Stime = document.getElementById("Stime");
	var disconfigs = document.getElementById("disconfigs");
	var frminedtul = document.getElementById("frminedtul");

	var tableheadrw = document.createElement("tr");
	tableheadrw.id="tableheadrow";



	var dayss = document.createElement("th");
	dayss.id="days";
	dayss.innerHTML="Days";
	tableheadrw.appendChild(dayss);


	var edt = document.createElement("th");
	edt.id="edit";
	edt.innerHTML="EDIT";
	tableheadrw.appendChild(edt);

	table.appendChild(tableheadrw);

	tfrmul.innerHTML =`
		<li id="dayz">
				<label>DAY:</label><select id="dayzindex" name="id">
				<option value=1>Monday</option>
				<option value=2>Teusday</option>
				<option value=3>Wednesday</option>
				<option value=4>Thursday</option>
				<option value=5>Friday</option>
				<option value=6>Saturday</option>
				<option value=7>Sunday</option>	
				</select>
			
		</li>

		<li id="sendbtn">
				<input onclick="SendTmData(); return false" id="sendTym" type="submit" value="send" class="submit">
		</li>
	`;

	var sendbtn = document.getElementById("sendbtn");
	var thead;
	//var edit = document.getElementById("edit");


	var colomnColl = db.collection("TimetableConfig");
	colomnColl.orderBy("colomnNo","asc").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){
	    	if (change.type === "added") {
	    		var colomnnext = parseInt(change.doc.data().colomnNo) + 1;
	    		var Tint = change.doc.data().timetableInt;
	    		var frm = Tint.split("-")[1];
	    		colNo.value = colomnnext;
	    		Stime.innerHTML=`
	    		<label style="color:#fff;">From:</label><br>
	    		<input type="text" id="newLwInt" value="${frm}">
	    		`;

	    		//INSERTING VALUES TO THE TABLE=================
				thead = document.createElement("th");
				thead.className = "thead";
				tableheadrw.insertBefore(thead, edt);
				thead.innerHTML=change.doc.data().timetableInt;
				disconfigs.innerHTML +=`
				<li>${change.doc.data().timetableInt}<span style="float:right; padding-right:5px; color:#f00">X</span></li>
				`;

				//INSERTING VALUES TO THE FORM=================
				var frmlist = document.createElement("li");
						frmlist.className = "frmlist";
						frmlist.setAttribute('data-form',`${change.doc.data().timetableInt}`);
						frmlist.innerHTML=`
							<label class="inslabels">${change.doc.data().timetableInt}</label>
							<select id="items${change.doc.data().colomnNo}" data-select="${change.doc.data().timetableInt}">		
							</select>
						`;
						tfrmul.insertBefore(frmlist, sendbtn);

			


				//INSERTING TIMETABLE ITEMS IN SELECT OPTIONS
			var frmsel = document.getElementById("items" + change.doc.data().colomnNo);
			var colomnTitle = change.doc.data().timetableInt;
	
			
			

			//inserting items used in my timetable
			db.collection("TimetableItems").onSnapshot(function(querySnapshot) {
	    		querySnapshot.docChanges().forEach(function(change){
				    	if (change.type === "added") {
				    		if(change.doc.data().tItem != ""){
				    			frmsel.innerHTML+=`<option id="${change.doc.data().itemIndex}" value="${change.doc.data().tItem}">${change.doc.data().tItem}</option>`;
				    			var dayzindex = document.getElementById("dayzindex");
				    		}
				    	}

				   	 });
					});
	    		}


			});//end of inserted items in select options

		});	



	}

getconfigs();



	//showing the edit window and populating it with edit values
	function openEdtTime(edtid){
			var edittmdata = document.getElementById("edittmdata");
			var frminedt = document.getElementById("frminedt");
			var editTimeTitle = document.getElementById("editTimeTitle");
			var frminedtul = document.getElementById("frminedtul");
			var closeedt = document.getElementById("closeedt");
			var submittimetablechanges = document.getElementById("submittimetablechanges");
			submittimetablechanges = document.getElementById("submittimetablechanges");
			frminedtchilds = frminedt.children;
			let docrow = edtid.parentNode.parentNode.id;
			numberofrw = docrow.split("w")[1];
			frminedtul.innerHTML = "";

			var docRef = db.collection("TimetableData");
			var timeconfigs = db.collection("TimetableConfig");
			var count = 0;

			
			timeconfigs.orderBy("colomnNo", "asc").get().then(function(querySnapshot) {

					querySnapshot.forEach(function(docconfig){

						docRef.where("day","==",numberofrw).get().then(function(querySnapshot) {

							querySnapshot.forEach(function(doc){
								count++;
								var itmzzdata = doc.data();
								//console.log(itmzzdata["colmn"+count]);
								frminedtul.innerHTML += `
				    			<li>
									<label>${docconfig.data().timetableInt}</label><br>
									<input class="inputtoedit" value="${itmzzdata["colmn"+count]}" type="text" id="${docconfig.data().timetableInt}"><br><br>
								</li>

			    				`;

							});


			    		}).catch(function(err){
			    			console.log("An error occured: ", err);
			    		});

					    	configdata = docconfig.data();		    		

					});
			    	
			 }).catch(function(error){
			 	console.log("There was a problem while getting the document", error);
			 });

			 submittimetablechanges.addEventListener("click",function(){
				 	var docRef = db.collection("TimetableData").doc(docrow);
				 	let editinputs = document.querySelectorAll(".inputtoedit");
				 	let count = 0;
				 	let obj = {};
				 	//console.log(editinputs);

				 	editinputs.forEach(function(inpts){
				 		count++;
				 		obj["colmn"+count] = inpts.value;
					 	return docRef.update(
							 	obj
					 		).then(function(){
			 			console.log("Timetable updated Successfully");
			 		}).catch(function(err){
			 			console.log("An error occured during timetable update: ", err);
			 			});		 		
			 		});
			 });


			edittmdata.style.display="block";
			timetoeditid = edtid.parentNode.parentNode.id;
			return(edtid);
			

		}



closeedt.addEventListener("click",function(){
				edittmdata.style.display = "none";

			});



function GetTmData(){
	var table = document.getElementById("table");
	var tableheadrow = document.getElementById("tableheadrow");

				db.collection("TimetableData").onSnapshot(function(querySnapshot) {
	    		querySnapshot.docChanges().forEach(function(change){
				    	if (change.type === "added") {
				    		var wkno = change.doc.data().day;
					    	var weekday = change.doc.data().day;
					    	if(weekday == "1"){
					    		weekday = "Mon";
					    	}
					    	if(weekday == "2"){
					    		weekday = "Teu";
					    	}
					    	if(weekday == "3"){
					    		weekday = "Wed";
					    	}
					    	if(weekday == "4"){
					    		weekday = "Thur";
					    	}
					    	if(weekday == "5"){
					    		weekday = "Fri";
					    	}
					    	if(weekday == "6"){
					    		weekday = "Sat";
					    	}
					    	if(weekday == "7"){
					    		weekday = "Sun";
					    	}	

				    		var tablrow = document.createElement("tr");
				    		tablrow.id="row"+change.doc.data().day;
				    		var daytd = document.createElement("td");
				    		daytd.innerHTML = weekday;
				    		tablrow.appendChild(daytd);

				    			var colomnColl = db.collection("TimetableConfig");
								colomnColl.orderBy("colomnNo","asc").onSnapshot(function(querySnapshot) {
								    querySnapshot.docChanges().forEach(function(changed){
								    	if (change.type === "added") {
								    		var i = parseInt(changed.doc.data().colomnNo) - 1;
								    		var timetbIntrval = changed.doc.data().timetableInt;
								    		
								    			itmtdvar = document.createElement("td");
								    			itmtdvar.id = "itmtd" + wkno + i;								    			
								    			tablrow.appendChild(itmtdvar);
								    			var gtindxdata = "colmn"+changed.doc.data().colomnNo;
								    			itmtdvar.innerHTML=change.doc.data()[gtindxdata];
				    					}

				    					if (change.type === "modified") {
				    						alert("This timetable is now modified");

				    					}

				    					if(change.type === "removed"){
				    						console.log("successfully deleted a row in timetable");
				    					}
								    });
								    addedit();
								});

								


							var addedit = function(){
					    		var edttd = document.createElement("td");
					    		edttd.innerHTML = "<span onclick='deleteTimetableItem(this)'>X </span>|<span onclick='openEdtTime(this)'> Edit </span>";
					    		edttd.className="editTmtable";
					    		tablrow.appendChild(edttd);
				    		}

				    		table.appendChild(tablrow);
				    	}
				    });
	    		});

}




function SendTmData(){
	var colomnColl = db.collection("TimetableConfig");
	var elem={};
	var table = document.getElementById("table");
	var tableheadrow = document.getElementById("tableheadrow");
	var dayzindex = document.getElementById("dayzindex");
	var frmsel="";


			function receivecolmns(){
				colomnColl.orderBy("colomnNo","asc").get().then(function(querySnapshot) {
					querySnapshot.forEach(function(doc){
						 if (doc.exists) {

						 	frmsel = document.getElementById("items" + doc.data().colomnNo);
				    		var indexdata = "colmn"+doc.data().colomnNo;				    		

				    		elem["day"] = dayzindex.value;
				    		elem[indexdata] = frmsel.value;
						
						    } else {
						        console.log("Set your timetable first before adding items");
						   }
						
					});
					});
				}



			function sedntymT(){

						receivecolmns();

						setTimeout(function(){
							
							var refTimetData = db.collection("TimetableData").doc("row"+dayzindex.value);
				    		refTimetData.set(elem).then(function() {
							    console.log("Document successfully written!");
							})
							.catch(function(error) {
							    console.error("Error writing document: ", error);
							});
							
						},5);						

					}

			sedntymT();
	}



window.onload= function(){
	GetTmData();
}



function deleteTimetableItem(btn){
	//deleting data from firestore
	var doctodel = btn.parentNode.parentNode.id;
	db.collection("TimetableData").doc(doctodel).delete().then(function() {
    	console.log("Document successfully deleted!");
	}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});

	//removing the row after deleting data	
	var tableel = btn.parentNode.parentNode.parentNode;
	var deletedrw = btn.parentNode.parentNode;
	tableel.removeChild(deletedrw);
	

}





function sendtableconfig(){
	var tfrm = document.getElementById("tfrm");
	var frmlstz = document.getElementById("tfrmul");
	var tableheadrow = document.getElementById("tableheadrow");
	var configrespons = document.getElementById("configrespons");
	var newLwInt = document.getElementById("newLwInt");
	var newintvStart;
	configrespons.innerHTML = "";


	var colNo = document.getElementById("colNo");
	var startHrs = document.getElementById("startHrs");
	var strtMin = document.getElementById("strtMin");
	var sessHrs = document.getElementById("sessHrs");
	var sessMin = document.getElementById("sessMin");
	var startHrstoMins;
	var startTimeinMins;
	var lowerInterval;
	var mintsvalue;


	if(sessMin.value == ""){
		sessMin.value = 0;
	}


if(startHrs == null || startHrs == undefined || startHrs == ""){
	newintvStart = newLwInt.value.split(":");
	mintsvalue = newintvStart[1];
	startHrstoMins = parseInt(newintvStart[0]) * 60;
	startTimeinMins =startHrstoMins + parseInt(mintsvalue);
	lowerInterval = newLwInt.value;
}else{
	mintsvalue = strtMin.value;
	startHrstoMins = parseInt(startHrs.value) * 60;
	startTimeinMins = startHrstoMins + parseInt(mintsvalue);
	lowerInterval = startHrs.value + ":" + mintsvalue;

}
	
	var addSession = (parseInt(sessHrs.value)*60)+(parseInt(sessMin.value));
	var sessionend = startTimeinMins + addSession;

	sessionendHrs = Math.floor(sessionend/60);
	sessionendMin = sessionend%60;

	if(sessionendMin <10){
		sessionendMin = 0 + "" + sessionendMin;
	}
	var upperInterval = sessionendHrs + ":" + sessionendMin;

	
	if(mintsvalue == "" || mintsvalue=="0"){
			mintsvalue="00";
		}
	
	
	var upperInterval;
 	var timeInterval = lowerInterval + "-" + upperInterval;


	var colomnColl = db.collection("TimetableConfig");
	colomnColl.orderBy("colomnNo","asc").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){
	    	if (change.type === "added") {
	    		var nextCol = parseInt(change.doc.data().colomnNo) + 1;
	    	}
		});
	});


 	addConfigValues(colNo.value,timeInterval,"1");

}


function delItem(ItemtoDelete){
	var tmtbitemsbookul = document.getElementById("tmtbitemsbookul");
	var itemresponsediv = document.getElementById("itemresponsediv");
	var todocatz = document.getElementById("todocatz");
	itemresponsediv.innerHTML="";
	var removeItemDiv = document.getElementById(ItemtoDelete);
	var remtodocatDiv = document.getElementById(ItemtoDelete+"tdo");

	db.collection("TimetableItems").doc(ItemtoDelete).delete().then(function() {
    	itemresponsediv.innerHTML="Timetable Item successfully deleted!";
	}).catch(function(error) {
	    itemresponsediv.innerHTML="<span style='color:red'>ERROR: Delete Unsuccessfull! </span>" + error;
	});

	tmtbitemsbookul.removeChild(removeItemDiv);
	todocatz.removeChild(remtodocatDiv);
}



function getTimetblItems(){
	var tmtbitemsbook = document.getElementById("tmtbitemsbook");
	var tmtbitemsbookul = document.getElementById("tmtbitemsbookul");
	var todocatz = document.getElementById("todocatz");
	todocatz.innerHTML.innerHTML=`<option value="" selected="true" disabled="disabled">Select Day</option>`;
	todocatz.innerHTML +=`
	<option id="Monday">Monday</option>
	<option id="Teusday">Teusday</option>
	<option id="Wednesday">Wednesday</option>
	<option id="Thursday">Thursday</option>
	<option id="Friday">Friday</option>
	<option id="Saturday">Saturday</option>
	<option id="Sunday">Sunday</option>

	`;

	db.collection("TimetableItems").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){
	    	if (change.type === "added") {
	    		tmtbitemsbookul.innerHTML += `<li id="${change.doc.data().itemIndex}">${change.doc.data().tItem}
	    		<span onclick="delItem('${change.doc.data().itemIndex}')" style="float:right; color:red; font-size:13px; padding:1px;"> X</span></li>`;
	    		//todocatz.innerHTML +=`<option id="${change.doc.data().itemIndex}tdo">${change.doc.data().tItem}</option>`;
	    	}
	    });

	});

}


getTimetblItems();

function insertitem(){
	var itemname = document.getElementById("itemname");
	var itemresponsediv = document.getElementById("itemresponsediv");
	itemresponsediv.innerHTML="";
	itemvalue = itemname.value;

	if(itemvalue == ""){
		itemresponsediv.innerHTML = "<span style='color:red'>Item value cannot be Empty</span>";
	}else{
		addTimetableItems(itemname.value,"1");
		itemresponsediv.innerHTML = "Timetable Item successfully added.";
	}

}


function remvTdoEdt(){
	var todowrapperedit = document.getElementById("todowrapperedit");
	todowrapperedit.style.display = "none";
}


function closecmfmrdeltodo(){
	var cmfrmDelTodo = document.getElementById("cmfrmDelTodo");
	cmfrmDelTodo.style.display="none";
}


function delTodoItem(indx){
	var cmfrmDelTodo = document.getElementById("cmfrmDelTodo");
	var deleteTodo = document.getElementById("deleteTodo");
	var dontdeleteTodo = document.getElementById("dontdeleteTodo");
	cmfrmDelTodo.style.display = "block";

	deleteTodo.addEventListener("click",function(){
		db.collection("ToDoList").doc(indx).delete().then(function() {
    	console.log("Document successfully deleted!");
		}).catch(function(error) {
		    console.error("Error removing document: ", error);
		});
		closecmfmrdeltodo();
	});

	dontdeleteTodo.addEventListener("click",function(){
		closecmfmrdeltodo()
	});

}


var editTdo = document.getElementById("editTdo");
var todoindex="";
function editTodo(doindex,tododate,timestam){
	todoindex=doindex;
	var todowrapperedit = document.getElementById("todowrapperedit");
	todowrapperedit.style.display = "block";
	var tDoCatin = document.getElementById("tDoCatin");
	var tDoItmin = document.getElementById("tDoItmin");
	var ref = db.collection("ToDoList").doc(todoindex);
	console.log(todoindex);
	ref.get().then(function(doc){
		tDoCatin.value = doc.data().todoCat;
		tDoItmin.value = doc.data().todoItem;
	});

	editTdo.addEventListener("click",function(){
		var today = new Date();
	 	var times = Date.now();
	 	var datev = today.getDate()+ "/"+ today.getMonth()+"/"+today.getFullYear() + ", " +today.getHours()+ ":" +today.getMinutes();

		return ref.update({
			tdoIndex:todoindex,
			todoCat:tDoCatin.value,
			todoItem:tDoItmin.value,
			todoDate:tododate,
			timeStamp:timestam,
			editedOn:datev
		}).then(function(){
			console.log(tDoItmin.value);
				tDoCatin.value="";
				tDoItmin.value="";
				console.log("successfull!!");

		});
	});

}


function getTodo(){
	var tmtbitemsbook = document.getElementById("todoitemsbook");
	var respedttodo = document.getElementById("respedttodo");
	var todolistmainprev = document.getElementById("todolistmainprev");
	var tmtbitemsbookul = document.getElementById("todoitemsbookul");
	var todoColl = db.collection("ToDoList");
	todoColl.orderBy("timeStamp","asc").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){
	    	var todoLitem = change.doc.data().todoItem;
	    	var ftodo = todoLitem.replace(/\r?\n/g, '</li><li>');
	    	if (change.type === "added") {
	    		tmtbitemsbook.innerHTML += `<div id="${change.doc.data().tdoIndex}tdo"><h4 style="margin-top:20px">${change.doc.data().todoCat}</h4>${todoLitem}
	    		<p style='font-size:11px; color:#006d7d; float:right'><span onclick="editTodo('${change.doc.data().tdoIndex}','${change.doc.data().todoDate}','${change.doc.data().timeStamp}')">Edit </span>|<span onclick="delTodoItem('${change.doc.data().tdoIndex}')"> Delete</span></p><div id='clear'></div></div>`;


	    		todolistmainprev.innerHTML += `<div id="${change.doc.data().tdoIndex}tdomain" class="todomainpre"><h4 style="margin-top:20px">${change.doc.data().todoCat}</h4>${todoLitem}
	    		<div id='clear'></div></div>`;

	    		console.log("added");
	    	}

	    	if (change.type === "modified") {
	    		
	    		var todoModify = document.getElementById(change.doc.data().tdoIndex+"tdo");
	    		var todoModifym = document.getElementById(change.doc.data().tdoIndex+"tdomain");
	    		todoModify.innerHTML = `<h4 style="margin-top:20px">${change.doc.data().todoCat}</h4><ul style='border-bottom:dotted 1px #999999; padding-bottom:7px;'><li>${ftodo}</li>
	    		<p style='font-size:11px; color:#006d7d; float:right'><span onclick="editTodo('${change.doc.data().tdoIndex}','${change.doc.data().todoDate}','${change.doc.data().timeStamp}')">Edit </span>|<span onclick="delTodoItem('${change.doc.data().tdoIndex}')"> Delete</span></p><div id='clear'></div></ul>`;
	    		
	    		todoModifym.innerHTML = `<h4 style="margin-top:20px">${change.doc.data().todoCat}</h4><ul style='border-bottom:dotted 1px #999999; padding-bottom:7px;'><li>${ftodo}</li>
	    		<div id='clear'></div></ul>`;

	    		respedttodo.innerHTML="<p>Successfully Edited!</p>";
	    		
	    		console.log("modified");
	    	}

	    	if (change.type === "removed") {
	    		var todoDelete = document.getElementById(change.doc.data().tdoIndex+"tdo");
	    		var todoDeletem = document.getElementById(change.doc.data().tdoIndex+"tdomain");
	    		tmtbitemsbook.removeChild(todoDelete);
	    		todolistmainprev.removeChild(todoDeletem);
	    	}
	    });

	});

}

getTodo();

function inserttodo(){
	var todocatz = document.getElementById("todocatz");
	var itemresponsediv = document.getElementById("itemresponsedivtdo");
	var todocatzval = todocatz.value;
	var itemvalue = CKEDITOR.instances.todoname.getData();

	var today = new Date();
 	var times = Date.now();
 	var datev = today.getDate()+ "/"+ today.getMonth()+"/"+today.getFullYear() + ", " +today.getHours()+ ":" +today.getMinutes();


	if(todocatzval == ""){
		itemresponsediv.innerHTML="<span style='color:red'>Select a Todolist Category First</span>";
	}else if(itemvalue == ""){
		itemresponsediv.innerHTML="<span style='color:red'>The Todolist Items cannot be empty</span>";
	}else{
		addToDoList(todocatz.value,itemvalue,"1",datev,times);
		itemresponsediv.innerHTML="The Todolist Items Successfully added!";
		itemname.value = "";
	}
}


function sendTimetv(){
	var table = document.getElementById("table");
	var tfrmul = document.getElementById("tfrmul");
	//console.log(tfrmul);
	var dayzindex = document.getElementById("dayzindex");
	dayzindexval = dayzindex.value;

		if(dayzindexval == 1){
			dayzindexval = "Mon";
		}else if(dayzindexval == 2){
			dayzindexval = "Teu";
		}else if(dayzindexval == 3){
			dayzindexval = "Wed";
		}else if(dayzindexval == 4){
			dayzindexval = "Thur";
		}else if(dayzindexval == 5){
			dayzindexval = "Fri";
		}else if(dayzindexval == 6){
			dayzindexval = "Sat";
		}else if(dayzindexval == 7){
			dayzindexval = "Sun";
		}
	
		var ctr = document.createElement("tr");
		ctr.id = dayzindexval;
		ctr.innerHTML=`
				<td>${dayzindexval}</td>
				<td id="edt${dayzindexval}">X | Edit</td>
		`;

		table.appendChild(ctr);

		var timerow = document.getElementById(dayzindexval);
		var edtdata = document.getElementById("edt"+dayzindexval);


//===============INSERTING DATA TO THE TABLE=================
var colomnColl = db.collection("TimetableConfig");
	colomnColl.orderBy("colomnNo","asc").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){
	    	if (change.type === "added") {
	    		var colomnlength = querySnapshot.size;
	    		var ids = change.doc.data().colomnNo;
				var i2 = document.getElementById("items"+ids);
				var i2val = i2.value;
				var tabldata = document.createElement("td");
				tabldata.innerHTML = i2val;
				timerow.insertBefore(tabldata, edtdata);
				
			}
		});
	});


	
}

//====================end of timetable area==========================================

var resp = document.getElementById("resp");
resp.innerHTML ="";


function toggleaddquote(){
	var addquotewrapper = document.getElementById("addquotewrapper");
	 var addq = document.getElementById("addq");
	 var resp = document.getElementById("resp");
	 var catwindow = document.getElementById("catwindow");
	 resp.innerHTML = "";

	 	if(window.getComputedStyle(addquotewrapper).display=="none"){
				addquotewrapper.style.display="block";
				addq.innerHTML="Exit Add Quotes";
			}else{
				addquotewrapper.style.display="none";
				addq.innerHTML="Add Quotes";		
			}
	
	


	 catwindow.addEventListener('click',function(){
			addquotewrapper.style.display="none";
			addq.innerHTML="Open Add Quotes";
		});

}

function exiteditquote(){
		var addquotewrapperedit = document.getElementById("addquotewrapperedit");
		addquotewrapperedit.style.display = "none";

	}


function toggleaddcat(){
	var addbox = document.getElementById("addbox");
	var addsign =document.getElementById("addsign");

	if(window.getComputedStyle(addbox).opacity == "0"){		
		addbox.style.opacity="1";
		addbox.style.visibility="visible";
		addsign.innerHTML = "-";
	}else{
		addbox.style.opacity="0";
		addbox.style.visibility="hidden";
		addsign.innerHTML = "+";
	}
	
}



function toggleconfigtime(){
	var addbox = document.getElementById("tmtconfig");
	var addbox2 = document.getElementById("additemsboxes");
	var addbox3 = document.getElementById("todoboxes");
	var addsign =document.getElementById("shwconfigtime");
	var addsign2 =document.getElementById("shwitems");
	var addsign3 =document.getElementById("shwtodo");

	if(window.getComputedStyle(addbox).display == "none"){		
		addbox.style.display="block";
		addbox2.style.display="none";
		addbox3.style.display="none";
		addsign.innerHTML = "-";
		addsign2.innerHTML = "+";
		addsign3.innerHTML = "+";
	}else{
		addbox.style.display="none";
		addsign.innerHTML = "+";
	}

}

function toggleshwitems(){
	var addbox = document.getElementById("additemsboxes");
	var addbox2 = document.getElementById("tmtconfig");
	var addbox3 = document.getElementById("todoboxes");
	var addsign =document.getElementById("shwitems");
	var addsign2 =document.getElementById("shwconfigtime");
	var addsign3 =document.getElementById("shwtodo");
	if(window.getComputedStyle(addbox).display == "none"){		
		addbox.style.display="block";
		addbox2.style.display="none";
		addbox3.style.display="none";
		addsign.innerHTML = "-";
		addsign2.innerHTML = "+";
		addsign3.innerHTML = "+";
	}else{
		addbox.style.display="none";
		addsign.innerHTML = "+";
	}
}


function toggletodolist(){
	var addbox = document.getElementById("todoboxes");
	var addbox2 = document.getElementById("tmtconfig");
	var addbox3 = document.getElementById("additemsboxes");
	var addsign =document.getElementById("shwtodo");
	var addsign2 =document.getElementById("shwconfigtime");
	var addsign3 =document.getElementById("shwitems");

	if(window.getComputedStyle(addbox).display == "none"){		
		addbox.style.display="block";
		addbox2.style.display="none";
		addbox3.style.display="none";
		addsign.innerHTML = "-";
		addsign2.innerHTML = "+";
		addsign3.innerHTML = "+";
	}else{
		addbox.style.display="none";
		addsign.innerHTML = "+";
	}
}


function togglecat(){
	var catwindow = document.getElementById("catwindow");
	var catforeground = document.getElementById("catforeground");
	 var cat=document.getElementById("catz");
	 
    	     cat.addEventListener('click',function(){
                if(window.getComputedStyle(catwindow).opacity == "0"){
            		catwindow.style.left="0px";
            		catwindow.style.opacity="0.99";
            		catforeground.style.opacity="1";
            		catforeground.style.left="60%";
            		catforeground.style.right="0px";
            	    }else{
            		catwindow.style.left="-61%";
            		catwindow.style.opacity="0";
            		catforeground.style.left="-40%";
            		catforeground.style.right="101%";    
        	    }
             });
}


function clickoutmenu(){
			var catwindow = document.getElementById("catwindow");
			var catforeground = document.getElementById("catforeground");
			
				document.addEventListener('click', function (event) {
					if(window.getComputedStyle(catwindow).opacity == "0.99"){
					    if (!event.target.closest('#catwindow')){
					    	catwindow.style.left="-61%";
							catwindow.style.opacity="0";
							catforeground.style.opacity="0";
							catforeground.style.left="-40%";
            				catforeground.style.right="101%"; 
					    }
				    }
					}, false);

}



function togglecomment(divno){
	var info = divno.parentNode;
	var quotecon = info.parentNode;
	var num = Array.from(quotecon.parentNode.children).indexOf(quotecon);
	var wrapper1child = document.getElementById("wrapper1").children;
	var innerchildren = wrapper1child[num].children;
	var commentdiv = innerchildren[2];
	if(window.getComputedStyle(commentdiv).visibility == "hidden"){
		commentdiv.style.visibility="visible";
		commentdiv.style.height = "auto";
		commentdiv.style.display="block";
	}else{
		commentdiv.style.visibility="hidden";
		commentdiv.style.height = "0px";
		commentdiv.style.display="none";
	}
}




function togglecomments(divno){
	var info = divno.parentNode;
	var quotecon = info.parentNode;
	var num = Array.from(quotecon.parentNode.children).indexOf(quotecon);
	var wrapper1child = document.getElementById("wrapper1sort").children;
	var innerchildren = wrapper1child[num].children;
	var commentdiv = innerchildren[2];
	if(window.getComputedStyle(commentdiv).visibility == "hidden"){
		commentdiv.style.visibility="visible";
		commentdiv.style.height = "auto";
		commentdiv.style.display="block";
	}else{
		commentdiv.style.visibility="hidden";
		commentdiv.style.height = "0px";
		commentdiv.style.display="none";
	}
	

}



function addQoutes(qtype,quoteid,title,message,author,date,cat,index){
	var ref = db.collection("myQuotes").doc();
	referenceid = ref.id;
		ref.set({
			qtype:qtype,
		  	quotetitle : title,
			quote : message,
			author : author,
			date : date,
			cat:cat,
			identity:quoteid=referenceid,
			indexid:index
		})
		.then(function() {
		    resp.innerHTML = "The Quote Successfully posted!";
		})
		.catch(function(error) {
		    resp.innerHTML = "<p style='color:#f00'>Error posting the quote: </p>" + error;
		});
}


function addcat(name){
	var catresponsediv = document.getElementById("catresponsediv");
	var ref = db.collection("categories").doc();
	ref.set(
			{
				name:name,
				catid:ref.id
			}
		).then(function() {
		    catresponsediv.innerHTML = "Category Successfully Added.";
		})
		.catch(function(error) {
		   catresponsediv.innerHTML = "<p style='color:#f00'>Error adding Category: </p>" + error;
		});
}


function addtocomment(name,comment,date,quoteid){
	var ref = db.collection("comments").doc();
	ref.set(
			{
				name:name,
				comment:comment,
				date:date,
				commentid:ref.id,
				quoteid:quoteid
			}
		).then(function() {
		   console.log("Successfully posted the note!");
		})
		.catch(function(error) {
		    console.log("Error posting the comment: ", error);
		});

}

function insertQuote(){
 	resp.innerHTML = "";

	var frmadd = document.getElementById("frmadd");
	var frmchild = frmadd.children;
	var type	= frmchild[3];
	var title	= frmchild[9];
	var message = CKEDITOR.instances.message.getData()
	var author = frmchild[22];
	var cat = frmchild[28];

		typev = type.value;
		titlev = title.value;
		authorv = author.value;
		catv = cat.value;		

 	var today = new Date();
 	var times = Date.now();
 	var datev = today.getDate()+ "/"+ today.getMonth()+"/"+today.getFullYear() + ", " +today.getHours()+ ":" +today.getMinutes();


 	if (message === "") {
 		resp.innerHTML = "<p style=color:red;>ERROR: The quote cannot be empty please!!</p>";		
 	}else{
 	addQoutes(typev,1,titlev,message,authorv,datev,catv,times);
	title.value = "";
	message.value = "";
	author.value = "";
	cat.value = "";	

 	}
 }



function deleteQuote(d,ident){

 	var dialog = document.getElementById("dialog");
	var dmessage = document.getElementById("dmessage");
	var idnum =ident;

 	dmessage.innerHTML = `<p>
 							Are you sure you want to delete quote <span style='font-style:italic; font-weight:bold; color:#0b507c'>"` + d +`"</span>
 						</p>
							
							<div class="row">
								<button onclick="deleteq('`+idnum+`')">YES</button>
								<button onclick="exitdialogue()">NO</button>
							</div>

 						`;




 	dialog.style.display = "block";

 	dialogw = dialog.offsetWidth;
	dmessagew = dmessage.offsetWidth;
	var mleft = (dialogw/2) - (dmessagew/2);
	dmessage.style.marginLeft = mleft + "px";

	var dialogh = dialog.offsetHeight;
	var dmessageh = dmessage.offsetHeight;
	var mtop = (dialogh/2) - (dmessageh/2);
	dmessage.style.marginTop = mtop + "px";

 	}



 	function exitdialogue(){
 		var dialog = document.getElementById("dialog");
 		dialog.style.display = "none";
 	}


 	function deleteq(idtodelete){
 		var quoteid = idtodelete;
 		db.collection("myQuotes").doc(idtodelete).delete().then(function() {
			    console.log("Document successfully deleted!");
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
		});

 		exitdialogue();	

 	}


 	function deletecateg(cattodelete){
 		db.collection("categories").doc(cattodelete).delete().then(function() {
			    console.log("Category successfully deleted!");
			}).catch(function(error) {
			    console.error("Error removing the category: ", error);
		});

 	}



function getvaluestoedit(geturlid){
	urlid = geturlid;
	var addquotewrapperedit = document.getElementById("addquotewrapperedit");
	addquotewrapperedit.style.display="block";
	var wrapper1 = document.getElementById("wrapper1");
	var frmedit = document.getElementById("frmedit");
	var frmchild = frmedit.children;
	var resp = document.getElementById("respd");


	var toedit = db.collection("myQuotes").doc(urlid);
	toedit.get().then(function(docs){	
			var type	= frmchild[3];
			var titleel = frmchild[9];
			var authorel = frmchild[22];
			var cat = frmchild[28];
		CKEDITOR.instances.messageedt.setData(docs.data().quote);
		type.value = docs.data().qtype;
		titleel.value = docs.data().quotetitle;
		authorel.value = docs.data().author;
		cat.value = docs.data().cat;
		
	});

	console.log(frmchild);


		frmchild[29].addEventListener("click",function(){
			var type	= frmchild[3];
			var titleel = frmchild[9];
			var messageel = CKEDITOR.instances.messageedt.getData();
			var authorel = frmchild[22];
			var cat = frmchild[28];

		 	if (messageel === "") {
		 		resp.innerHTML = "<p style='color:red; width:100%'>ERROR: The quote cannot be empty please!!</p>";		
		 	}else{		
		 		var tedit = db.collection("myQuotes").doc(urlid);
		 		return tedit.update({
		 			qtype: type.value,
					quotetitle : titleel.value,
					quote : messageel,
					author : authorel.value,
					cat : cat.value
				}).then(function() {
				    resp.innerHTML = "<p style='color:#71ff66; font-style: italic; font-family: tahoma; font-weight: bold;'>Quote successfully updated</p>";
				})
				.catch(function(error) {
				    resp.innerHTML = "<p style='color:#f00'>An Error Occured during update </p>" + error;
				});
		 	}
		});
}



function exitaddq(){
	var addquotewrapperedit = document.getElementById("addquotewrapperedit");
	var respd =  document.getElementById("respd");
	respd.innerHTML = "";
	addquotewrapperedit.style.display="none";
}


function insertcat(){
	var catname = document.getElementById("catname");
	var catresponsediv = document.getElementById("catresponsediv");

	if(catname.value !=""){
		addcat(catname.value);
	}else{
		catresponsediv.innerHTML = "<span style='color:red'>Category name cannot be empty</span>";
	}

	catname.value="";
}


function getcategs(){
	var catlist = document.getElementById("catlist");
	var frmadd = document.getElementById("frmadd");
	var catresponsediv = document.getElementById("catresponsediv");
	var frmchild = frmadd.children;
	var cat = frmchild[27];

	db.collection("categories").onSnapshot(function(querySnapshot) {
    querySnapshot.docChanges().forEach(function(change){
    	if (change.type === "added") {
    		catlist.innerHTML+=
				`
				<p class="catr" id="c`+change.doc.data().catid+`" onclick="sortQuotes('`+change.doc.data().name+`');">`+change.doc.data().name+`<span class="decat" onclick="event.stopPropagation(); deletecateg('`+change.doc.data().catid+`')">x</span></p>

				`

			cat.innerHTML+=`
			<option>`+change.doc.data().name+`</option>
			`;
    	}

    	
	      if (change.type === "removed") {
	 				var select = document.querySelector("#c"+change.doc.data().catid);
	 				catlist.removeChild(select);
	 				catresponsediv.innerHTML = "<p style='color:#f0b5fb'>Category Successfully Removed</p>";
	       }


    	});
    });

}


//compressing to see less
function readless(ident){
	var docRef = db.collection("myQuotes").doc(ident);

	var readalldiv = document.querySelector("#notes"+ident);

	//scrolling to where the quote was previously
	var prevposition = localStorage.getItem("scrollPosition");
	setTimeout(function(){
				window.scrollTo(0, prevposition);
	},10);


	docRef.get().then(function(doc) {
		var notes = doc.data().quote
		notes = notes.substring(0,250)+`...<span class="readmore" onclick="readall('`+ident+`')"> Read more</span>`;
		readalldiv.innerHTML = 	notes;
	});
}


function readlessq(ident){
	var docRef = db.collection("myQuotes").doc(ident);
	var readalldiv = document.querySelector("#notes"+ident);
	//scrolling to where the quote was previously
	var prevposition = localStorage.getItem("scrollPosition");
	setTimeout(function(){
				window.scrollTo(0, prevposition);
	},10);

	docRef.get().then(function(doc) {
		var notes = doc.data().quote
		notes = notes.substring(0,250)+`...<span class="readmore" onclick="readallq('`+ident+`')"> Read more</span>`;
		readalldiv.innerHTML = notes;		
	});
}

//expanding the quote to see more
function readall(ident){
	var docRef = db.collection("myQuotes").doc(ident);
	var readalldiv = document.querySelector("#notes"+ident);
	var scrllposition = window.pageYOffset;
	localStorage.setItem("scrollPosition",scrllposition);

	docRef.get().then(function(doc) {
		var notes = doc.data().quote+`<br><span class="readmore" onclick="readless('`+ident+`')"> See less</span>`;
		readalldiv.innerHTML = notes;		
	});

}


function readallq(ident){
	var docRef = db.collection("myQuotes").doc(ident);
	var readalldiv = document.querySelector("#notes"+ident);
	var scrllposition = window.pageYOffset;
	localStorage.setItem("scrollPosition",scrllposition);

	docRef.get().then(function(doc) {
		var notes = doc.data().quote+`<br><span class="readmore" onclick="readlessq('`+ident+`')"> See less</span>`;
		readalldiv.innerHTML = notes;
	});

	
}



function getQuotes(){
		var wrapper1 = document.getElementById("wrapper1");
		var testing = document.getElementById("testing");
		wrapper1.innerHTML="";
		var wrapper1sort = document.getElementById("wrapper1sort");
		wrapper1sort.style.display="none";
		wrapper1.style.display="block";
	 	db.collection("myQuotes").orderBy("indexid","desc").onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){

	    		if (change.type === "added") {

	    				//creating a substring where there is a long string
		    			if(change.doc.data().qtype == "quote"){
			    			var notes = change.doc.data().quote;

							if(notes.length > 250){
								notes = notes.substring(0,250)+`...<span class="readmore" onclick="readallq('`+change.doc.data().identity+`')"> Read more</span>`;
							}

		    					wrapper1.innerHTML +=`
										<div id="quotecon" class="q`+change.doc.data().identity+`">
											<div id="title">
												<h1> `+ change.doc.data().quotetitle + `</h1>
											</div>
											<div id="quote">
												<div class="qts" id="notes${change.doc.data().identity}">${notes}</div>
											</div>

											<div id="commentdiv">
												<div id="vcomments">
													<div id="macomments`+change.doc.data().identity+`">									
													</div>
												</div>
												<div id="cerror`+change.doc.data().identity+`">
												</div>

														<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
														<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
														<button class="sendbtn" onclick="commenttable('`+change.doc.data().identity+`')">Send Comment</button>
											
												<div id="clear"></div>
											</div>

											<div id="editing">
												<ul>
												<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
												<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
												</ul>

												<div id="clear"></div>
											</div>
												
											<div id="info">
												<p id="comment" onclick="togglecomment(this); return false">comment</p>
												<p id="author">author:`+change.doc.data().author+`</p>
												<p id="date">date:`+change.doc.data().date+`</p>
												
											</div>
											<div id="clear">
											</div>
										</div>
									`;
								
		            }else if(change.doc.data().qtype == "note"){
		            	var notes = change.doc.data().quote;
						//notes = notes.replace(/\r?\n/g, '</li><li>');

						if(notes.length > 250){
							notes = notes.substring(0,250)+`...<span class="readmore" onclick="readall('`+change.doc.data().identity+`')"> Read more</span>`;
						}


		            	wrapper1.innerHTML +=`
										<div id="quotecon" class="q`+change.doc.data().identity+`">
											<div id="title">
												<h1> `+ change.doc.data().quotetitle + `</h1>
											</div>
											<div id="quote">
												<div class="nts" id="notes`+change.doc.data().identity+`">`+notes+`</div>
											</div>

											<div id="commentdiv">
												<div id="vcomments">
													<div id="macomments`+change.doc.data().identity+`">									
													</div>
												</div>
												<div id="cerror`+change.doc.data().identity+`">
												</div>

														<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
														<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
														<button class="sendbtn" onclick="commenttable('`+change.doc.data().identity+`')">Send Comment</button>
											
												<div id="clear"></div>
											</div>

											<div id="editing">
												<ul>
												<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
												<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
												</ul>

												<div id="clear"></div>
											</div>
												
											<div id="info">
												<p id="comment" onclick="togglecomment(this); return false">comment</p>
												<p id="author">author:`+change.doc.data().author+`</p>
												<p id="date">date:`+change.doc.data().date+`</p>
												
											</div>
											<div id="clear">
											</div>
										</div>
									`;			

		            }else{
		            	wrapper1.innerHTML +=`
										<div id="quotecon" class="q`+change.doc.data().identity+`">
											<div id="title">
												<h1> `+ change.doc.data().quotetitle + `</h1>
											</div>
											<div id="quote">
												<p>`+change.doc.data().quote+`</p>
											</div>

											<div id="commentdiv">
												<div id="vcomments">
													<div id="macomments`+change.doc.data().identity+`">									
													</div>
												</div>
												<div id="cerror`+change.doc.data().identity+`">
												</div>

														<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
														<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
														<button class="sendbtn" onclick="commenttable('`+change.doc.data().identity+`')">Send Comment</button>
											
												<div id="clear"></div>
											</div>

											<div id="editing">
												<ul>
												<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
												<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
												</ul>

												<div id="clear"></div>
											</div>
												
											<div id="info">
												<p id="comment" onclick="togglecomment(this); return false">comment</p>
												<p id="author">author:`+change.doc.data().author+`</p>
												<p id="date">date:`+change.doc.data().date+`</p>
												
											</div>
											<div id="clear">
											</div>
										</div>
									`;

		            }




	            }


	            if (change.type === "modified") {
	            	var tomodify = document.getElementsByClassName("q"+change.doc.data().identity);
	 				var select = document.querySelector(".q"+change.doc.data().identity);
	 				select.innerHTML=`<div id="title">
											<h1> `+ change.doc.data().quotetitle + `</h1>
										</div>
										<div id="quote">
											<p>`+change.doc.data().quote+`</p>
										</div>

										<div id="commentdiv">
											<div id="vcomments">
												<div id="macomments`+change.doc.data().identity+`">									
												</div>
											</div>
											<div id="cerror`+change.doc.data().identity+`">
											</div>

													<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
													<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
													<button class="sendbtn" onclick="commenttable(`+change.doc.data().identity+`)">Send Comment</button>
										
											<div id="clear"></div>
										</div>

										<div id="editing">
											<ul>
											<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
											<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
											</ul>

											<div id="clear"></div>
										</div>
											
										<div id="info">
											<p id="comment" onclick="togglecomment(this); return false">comment</p>
											<p id="author">author:`+change.doc.data().author+`</p>
											<p id="date">date:`+change.doc.data().date+`</p>
											
										</div>
										<div id="clear">
										</div>`;
					console.log("modified");

	            }


	            if (change.type === "removed") {
	 				var todelete = document.getElementsByClassName(change.doc.data().identity);
	 				var select = document.querySelector(".q"+change.doc.data().identity);
	 				wrapper1.removeChild(select);
	            }  

		displaycomments(change.doc.data().identity);

	    });	    						
	  
	});

}




function sortQuotes(name){

	var wrapper1sort = document.getElementById("wrapper1sort");
	wrapper1sort.innerHTML="";
	var wrapper1 = document.getElementById("wrapper1");
	wrapper1.style.display="none";
	wrapper1sort.style.display="block";
	 	db.collection("myQuotes").where("cat", "==", name).onSnapshot(function(querySnapshot) {
	    querySnapshot.docChanges().forEach(function(change){

	    		if (change.type === "added") {
	    			wrapper1sort.innerHTML +=`
									<div id="quotecon" class="q`+change.doc.data().identity+`">
										<div id="title">
											<h1> `+ change.doc.data().quotetitle + `</h1>
										</div>
										<div id="quote">
											<p>`+change.doc.data().quote+`</p>
										</div>

										<div id="commentdiv">
											<div id="vcomments">
												<div id="macomments`+change.doc.data().identity+`">									
												</div>
											</div>
											<div id="cerror`+change.doc.data().identity+`">
											</div>

													<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
													<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
													<button class="sendbtn" onclick="commenttable(`+change.doc.data().identity+`)">Send Comment</button>
										
											<div id="clear"></div>
										</div>

										<div id="editing">
											<ul>
											<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
											<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
											</ul>

											<div id="clear"></div>
										</div>
											
										<div id="info">
											<p id="comment" onclick="togglecomments(this); return false">comment</p>
											<p id="author">author:`+change.doc.data().author+`</p>
											<p id="date">date:`+change.doc.data().date+`</p>
											
										</div>
										<div id="clear">
										</div>
									</div>
								`;
								console.log("added");
	            }


	            if (change.type === "modified") {
	            	var tomodify = document.getElementsByClassName("q"+change.doc.data().identity);
	 				var select = document.querySelector(".q"+change.doc.data().identity);
	 				select.innerHTML=`<div id="title">
											<h1> `+ change.doc.data().quotetitle + `</h1>
										</div>
										<div id="quote">
											<p>`+change.doc.data().quote+`</p>
										</div>

										<div id="commentdiv">
											<div id="vcomments">
												<div id="macomments`+change.doc.data().identity+`">									
												</div>
											</div>
											<div id="cerror`+change.doc.data().identity+`">
											</div>

													<input type="text" id="names`+change.doc.data().identity+`" placeholder="Type your name">
													<input type="text" id="comments`+change.doc.data().identity+`" placeholder="Write a Comment">
													<button class="sendbtn" onclick="commenttable(`+change.doc.data().identity+`)">Send Comment</button>
										
											<div id="clear"></div>
										</div>

										<div id="editing">
											<ul>
											<li onclick="getvaluestoedit('`+change.doc.data().identity+`')">Edit</li>
											<li onclick="deleteQuote('`+change.doc.data().quotetitle+`','`+change.doc.data().identity+`')">Delete</li>
											</ul>

											<div id="clear"></div>
										</div>
											
										<div id="info">
											<p id="comment" onclick="togglecomment(this); return false">comment</p>
											<p id="author">author:`+change.doc.data().author+`</p>
											<p id="date">date:`+change.doc.data().date+`</p>
											
										</div>
										<div id="clear">
										</div>`;
					console.log("modified");

	            }


	            if (change.type === "removed") {
	 				var todelete = document.getElementsByClassName(change.doc.data().identity);
	 				var select = document.querySelector(".q"+change.doc.data().identity);
	 				wrapper1.removeChild(select);
	            }  

	            displaycomments(change.doc.data().identity);       

	    });
	    						
	  
	});

}


function displaycomments(quoteid){
		    var refcomm = db.collection("comments").where("quoteid", "==", quoteid).onSnapshot(function(querySnapshot){
	     	var macomments = document.getElementById("macomments"+quoteid);
	     	querySnapshot.docChanges().forEach(function(changed){	     		
	     					macomments.innerHTML +=`
								<div class="row">
									<p id="name"><strong>`+changed.doc.data().name+`:</strong></p>
									<p id="tcomment">`+changed.doc.data().comment+`</p>
								</div>

								`;								
	     		});
	     });
}


function commenttable(s){
	quoteids = s;
	var names =  document.getElementById("names"+quoteids);
	var comments = document.getElementById("comments"+quoteids);
	var today = new Date();
 	var datev = today.getDate()+ "/"+ today.getMonth()+"/"+today.getFullYear() + ", " +today.getHours()+ ":" +today.getMinutes();
 	var cerror = document.getElementById("cerror" + quoteids);
 	cerror.innerHTML = "";

	if(comments.value ==""){
		cerror.innerHTML = "<p style='color:#f00; font-style:italic; font-size:12px'>The comment field cannot be empty!</p>";
	}else{
		addtocomment(names.value,comments.value,datev,quoteids);				
	}

}


