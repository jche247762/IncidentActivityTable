function addActivityChange()
{
      var record = new SCFile("cm3r");
      var qry = record.doSelect("orig.date.entered>=tod()-'17 00:00:00' and open=true");
      while ( qry == RC_SUCCESS )
  	{
            var fAct = new SCFile("activitycm3r");
        	fAct.number = record.number;
        	fAct.datestamp = system.functions.tod();
        	fAct.operator = system.functions.operator();
        	fAct.type = "Update";
            //when working with array fields in JavaScript, I always prefer to use
            //a temporary JavaScript array and then move all contents to the field...
            var arrDesc = new Array();
        	arrDesc[0] = "Change Placed on Hold due to Emergency Embargo and Requester Interrupt";
        	fAct.description = arrDesc;
        	fAct.cust_visible = false;
            //negdatestamp is a negative date between 31/12/2199 17:00:00 and today datetime.
            //Please note that negdatestamp field is responsible for sorting activities!
            //Read note(*) at the end of the article to understand why I selected these values
  	  	fAct.negdatestamp=system.functions.parse_evaluate("'31/12/2199 17:00:00' - tod()", 1);
            var rcAct = fAct.doInsert();
        	qry = record.getNext();
  	}
}
 
function updateActivityIncTasks()
{
      var record = new SCFile ("activityincidenttasks");
      var qry = record.doSelect("true");
      while (qry == RC_SUCCESS)
  	{
            var fTask = new SCFile ("imTask");
            var qry = fTask.doSelect("id=\""+record.number+"\"");
            if (qry == RC_SUCCESS)
        	{
              	record.opt_parentIncident=fTask.parent_incident;
                  var rcTask = record.doUpdate();
              	print(record.opt_parentIncident);
        	}
  	qry = record.getNext();
  	}
}
//updateActivityIncTasks()
 
function updateActivityCm3t()
{
      var record = new SCFile("activitycm3t");
      var qry = record.doSelect('true');
      while (qry == RC_SUCCESS)
  	{
            var fTask = new SCFile ("cm3t");
            var qry = fTask.doSelect("number=\""+record.number+"\"");
            if (qry == RC_SUCCESS)
        	{
              	record.opt_parentChange=fTask.parent_change;
                  var rcTask = record.doUpdate();
              	print(record.opt_parentChange);
        	}
  	qry = record.getNext();
  	}
}
//updateActivityCm3t()
           
/**
* This function is to populate the Helix virtual table , this function is called from display screen : change.view
* @param   {String}   fRecord
*/
function createHelixViewTable(name, order, status, category) {
                 
      //setIfOffshoreUser();
      //abbreviation for system.functions
      var _sf = system.functions;
      var sCR = "\n";
      //vars.$recCount = getTopCount();
  	vars.$opteofmessage = "";
     
      var coloumns = new Array();
  	coloumns = ["Name","Order id","Status","RFS Date","Order Category"];
     
      var sHtmlReturn = lib.timeperiodCSS.getCSS();
  	sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
 
  	sHtmlReturn += createColoumnHeader(coloumns);
     
      var rowdata = new Array();
     
  	rowdata.push(name);
  	rowdata.push(order);
  	rowdata.push(status);
  	rowdata.push("test");
  	rowdata.push(category);
 
      //var optCustEofs = new SCFile("optcustomereofs",SCFILE_READONLY);
      //var rc = optCustEofs.doSelect("opt.changeId=\"" + fRecord.number + "\"");
     
      //var sql = 'SELECT TOP ' + vars.$recCount + ' * FROM optcustomereofs cust WHERE cust.opt.changeId="' + fRecord.number + '"';
      //var rc = optCustEofs.doSelect(sql);
      //vars.$optchmeofcount = returnEOFCount(fRecord);
     
      //if(vars.$optchmeofcount > vars.$recCount)
            //vars.$opteofmessage = "For smooth performance only the first " + vars.$recCount + " records are displayed. Please use 'Export to CSV' button to export all EOF records for this Change."
     
      //while(rc == RC_SUCCESS)
      //{
            /*var rowdata = new Array();
        	if(vars["$G.offshoreUser"]){
              	//print("Offshore user");
              	var secureCustomer = IsCustomerSecure(optCustEofs["opt.customerName"]);
              	if(secureCustomer){
                    	// mask data if the customer is secure and operator is Offshore
                    	rowdata = ["X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X","X-XX-X"];
              	}
              	else{
                    	rowdata.push(optCustEofs["opt.trailName"]);
              	  	rowdata.push(system.functions.nullsub(optCustEofs["opt.customerName"]," "));
                    	rowdata.push(optCustEofs["opt.signalId"]);
                    	rowdata.push(optCustEofs["opt.trailType"]);
                    	rowdata.push(optCustEofs["opt.aEndAddress"]);
                    	rowdata.push(optCustEofs["opt.zEndAddress"]);
                    	rowdata.push(optCustEofs["opt.nc"]);
                    	rowdata.push(optCustEofs["opt.trailDataType"]);
                    	rowdata.push(optCustEofs["opt.status"]);
                    	rowdata.push(optCustEofs["opt.startDate"]);
                    	rowdata.push(optCustEofs["opt.EndDate"]);
                    	rowdata.push(optCustEofs["opt.orderItem"]);
                    	rowdata.push(optCustEofs["opt.level"]);
              	}
                 
        	}else{
              	//print("not Offshore user");
              	rowdata.push(optCustEofs["opt.trailName"]);
        	  	rowdata.push(system.functions.nullsub(optCustEofs["opt.customerName"]," "));
              	rowdata.push(optCustEofs["opt.signalId"]);
              	rowdata.push(optCustEofs["opt.trailType"]);
              	rowdata.push(optCustEofs["opt.aEndAddress"]);
              	rowdata.push(optCustEofs["opt.zEndAddress"]);
              	rowdata.push(optCustEofs["opt.nc"]);
              	rowdata.push(optCustEofs["opt.trailDataType"]);
              	rowdata.push(optCustEofs["opt.status"]);
              	rowdata.push(optCustEofs["opt.startDate"]);
              	rowdata.push(optCustEofs["opt.EndDate"]);
              	rowdata.push(optCustEofs["opt.orderItem"]);
              	rowdata.push(optCustEofs["opt.level"]);
        	}
           
        	sHtmlReturn += createRowData(rowdata);
        	rc = optCustEofs.getNext();
  	}
  	*/
  	sHtmlReturn += createRowData(rowdata);
  	sHtmlReturn += "</table>" + sCR;	 
 
    return sHtmlReturn;
      
}          
           
/**
* Create the coloumn header for the virtual table.
* @param   {String}   coloumnNames
*/
function createColoumnHeader(coloumnNames){
      var sHtmlHeader = "<tr><th style=\"text-align:left;\" class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" ;
 
      for(var i=0;i<coloumnNames.length-1;i++){
        	sHtmlHeader +=coloumnNames[i] + "</span></div></div></th><th style=\"text-align:left;\" class=\"TableHeading\"><div style=\"border-left: solid 1px #888;border-bottom: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">";
  	}
  	sHtmlHeader += coloumnNames[i] + "</span></div></div></th></tr>";
      return sHtmlHeader;
}
 
/**
* Create the row data for the virtual table.
* @param   {String}   rowData
*/
function createRowData(rowData){
     
      var sRowClass = "TableCellResults";
      var sHtmlRowdata = "<tr class=\"TableNormalRow\">";
                       
      for(var i=0;i<rowData.length;i++){
        	sHtmlRowdata += "<td class=\""+sRowClass+"\" ><div tabindex=\"0\" class=\"shadowFocus\"><div class=\"Text FormatTableElementReadonly\"><span class=\"file_Approval field_approval_status xTableCell FormatTableElementReadonly value_pending\"> <font size=\"2\"> " + rowData[i] + "</span></div></div></td>";
  	}
  	sHtmlRowdata += "</tr>" + "\n";
      return sHtmlRowdata;
}          
 
function createHelixViewTableEmpty() {
                 
      var _sf = system.functions;
      var sCR = "\n";
  	vars.$opteofmessage = "";
     
      var coloumns = new Array();
  	coloumns = ["Name","Order id","Status","RFS Date","Order Category"];
     
      var sHtmlReturn = lib.timeperiodCSS.getCSS();
  	sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
 
  	sHtmlReturn += createColoumnHeader(coloumns);
     
  	sHtmlReturn += "</table>" + sCR;	 
 
    return sHtmlReturn;
      
}          
 
function createHelixViewTableCircuitsEmpty() {
                 
      var _sf = system.functions;
      var sCR = "\n";
  	vars.$opteofmessage = "";
     
      var coloumns = new Array();
  	coloumns = ["Circuits"];
     
      var sHtmlReturn = lib.timeperiodCSS.getCSS();
  	sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
 
  	sHtmlReturn += createColoumnHeader(coloumns);
     
  	sHtmlReturn += "</table>" + sCR;	 
 
    return sHtmlReturn;
      
}
 
function createHelixViewCircuitsTable(circuit) {
                 
      var _sf = system.functions;
      var sCR = "\n";
     
      var coloumns = new Array();
  	coloumns = ["Circuits"];
     
      var sHtmlReturn = lib.timeperiodCSS.getCSS();
  	sHtmlReturn += "<table class=\"TableResults\" width=\"100%\">" + sCR;
 
  	sHtmlReturn += createColoumnHeader(coloumns);
     
      var rowdata = new Array();
     
  	rowdata.push(circuit);
 
 
  	sHtmlReturn += createRowData(rowdata);
  	sHtmlReturn += "</table>" + sCR;	 
 
    return sHtmlReturn;
      
}
 
function gettest(number) {
            var siteName = "";
            var chm = new SCFile ("cm3r")
            var qry2 = chm.doSelect("number=\""+number+"\"");
           
            for (var i=0;i<chm.SiteDetails.length();i++){
            var location = new SCFile ("location")
            var qry = location.doSelect("location.code=\""+chm.SiteDetails[i].opt_siteCode+"\"");
            if (qry == RC_SUCCESS){
            var address = lib.ArrayUtil.toJsArray(location.address)
            //print(chm.SiteDetails[i].opt_siteCode)
        	siteName = siteName + address + "," + location.city + "," + location.state + "," + location.zip + ";"
            //siteName = siteName + chm.SiteDetails[i].opt_siteCode + ";"
            //print(siteName);
        	}
  	}
  	siteName = siteName
      //siteName = siteName + chm.SiteDetails[i].opt_siteCode;
  	print(siteName);
}
//gettest("C10062")
 
 
 
function mygroups(operator) {
var groups = new Array()
var mygroups = new SCFile("myGroups")
var qry = mygroups.doSelect("name=\""+operator+"\"");
if (qry == RC_SUCCESS){
for (var i=0;i<mygroups.member_of.length();i++){
groups.push(mygroups.member_of[i])
print(groups);
  	}
}
}
//mygroups("CP699063")
 
function getTaskCountInc(){
var incident = new SCFile("probsummary");
var sql = incident.doSelect("problem.status~=\"Closed\"");
      while (sql == RC_SUCCESS)
  	{
            var count = 0
            var tasks = new SCFile("imTask")
            //var qry = tasks.doSelect("parent.incident=\""+incident.number+"\" and status~=\"Closed\"");
            var qry = tasks.doSelect("parent.incident=\""+incident.number+"\" and not current.phase isin {\"Closure\",\"Cancelled\"}");
 
            while (qry == RC_SUCCESS)
        	{
              	count++    
              	qry = tasks.getNext()  
        	}
        	qry = tasks.getNext()
        	incident.opt_taskCount=count;
        	incident.doUpdate();
        	print("Incident: " +incident.number+ " Count: "+count);
        	sql = incident.getNext()
  	}
}
//getTaskCountInc()
 
function getTaskCountChm(number){
var chm = new SCFile("cm3r");
var sql = chm.doSelect("current.phase~=\"Closure\" and current.phase~=\"Abandoned\"");
//var sql = chm.doSelect("number=\""+number+"\"");
      while (sql == RC_SUCCESS)
  	{
            var count = 0
            var tasks = new SCFile("cm3t")
            var qry = tasks.doSelect("parent.change=\""+chm.number+"\" and current.phase~=\"Closed\" and current.phase~=\"Cancelled\"");
            while (qry == RC_SUCCESS)
        	{
              	count++    
              	qry = tasks.getNext()
        	}
        	qry = tasks.getNext()
        	chm.opt_taskCount=count;
        	chm.doUpdate();
        	print("Change: " +chm.number+ " Count: "+count);
        	sql = chm.getNext()
  	}
}
//getTaskCountChm()
 
function setDeviceLocation(){
var count = 0
var ci = new SCFile("device");
//var sql = ci.doSelect("logical.name=\""+name+"\" and istatus=\"In Use\" and type isin {\"networkcomponents\",\"optsite\"} and location.code~=NULL")
var sql = ci.doSelect("istatus=\"In Use\" and type isin {\"networkcomponents\",\"optsite\"} and location.code~=NULL")
      while (sql == RC_SUCCESS)
  	{
        	count++
        	print(count);
            var location = new SCFile("location")
            var qry = location.doSelect("location.code=\""+ci.location_code+"\"");
            if (qry == RC_SUCCESS)
        	{
                  if(ci.location != location.location)
              	{
                    	print("CI - "+ci.sm_device_display_name+ " - Changed Location from: "+ci.location+ " To: "+location.location);
                    	ci.location=location.location;
                    	ci.doUpdate();
              	}
        	}
  	sql = ci.getNext()
  	}
}
//setDeviceLocation()
 
 
function setIncidentLocation(){
var count = 0
var inc = new SCFile("probsummary");
//var sql = inc.doSelect("number=\""+number+"\" and problem.status~=\"Closed\"")
var sql = inc.doSelect("problem.status~=\"Closed\" and logical.name~=\"CI1663757\"")
      while (sql == RC_SUCCESS)
  	{
        	count++
        	print(count);
            var device = new SCFile("device")
            var qry = device.doSelect("logical.name=\""+inc.logical_name+"\"");
            if (qry == RC_SUCCESS)
        	{
                  var location = new SCfile("location")
                  var query = location.doSelect("location=\""+device.location+"\"");
                  if (query == RC_SUCCESS)
              	{
                        if(inc.location_full_name != location.location_structure)
                    	{
                          	print("Inc - "+inc.number+ " - Changed Location from: "+inc.location_full_name+ " To: "+location.location_structure);
                          	inc.location_full_name=location.location_structure;
                          	inc.doUpdate();
                    	}
              	}
        	}
  	sql = inc.getNext()
  	}
}
//setIncidentLocation()
 
 
function cleanIncidentLocation(){
var count = 0
var inc = new SCFile("probsummary");
var sql = inc.doSelect("location.full.name=\"Generic CI/null\"")
      while (sql == RC_SUCCESS)
  	{
        	count++
        	print(count);
        	print("Inc - "+inc.number+ " - Changed Location From: "+inc.location_full_name+ " To = NULL");
        	inc.location_full_name=null;
        	inc.doUpdate();
        	sql = inc.getNext()
  	}
}
//cleanIncidentLocation()
 
function setGroupDefaultActivities(operator, assignment){
 
      var mygroups = new SCFile("myGroups");
      var qry = mygroups.doSelect("name=\""+operator+"\"");
      if (qry == RC_SUCCESS)
  	{
            for (var i=0;i<mygroups.member_of.length();i++){
                  if (assignment != null && assignment == mygroups.member_of[i])
              	{
                    	print(mygroups.member_of[i]);
                        return mygroups.member_of[i]
              	}
        	}
  	}
     
      var ope = new SCFile("operator");
      var query = ope.doSelect("name=\""+operator+"\"");
            if (query == RC_SUCCESS && ope.opt_defaultIncidentGroup!=null)
        	{
              	print("test "+ope.opt_defaultIncidentGroup);
                  return ope.opt_defaultIncidentGroup;
        	}else{
              	print(mygroups.member_of[0]);
                  return mygroups.member_of[0];
              	}
}
           
 
function checkOperatorGroup(group, operator){
      //print(group)
      var ope = new SCFile("operator");
      var query = ope.doSelect("name=\""+operator+"\"");
            if (query == RC_SUCCESS && ope.opt_defaultIncidentGroup!=group)
        	{
                  //print("Group Changed");
                  return true;
        	}else{
                  //print("Group Not Changed");
                  return false;
              	}
}
 
function setDefaultOperatorGroup(group, operator){
  	print(operator);
  	print(group);
      var ope = new SCFile("operator");
      var query = ope.doSelect("name=\""+operator+"\"");
            if (query == RC_SUCCESS)
        	{
              	ope.opt_defaultIncidentGroup=group;
              	ope.doUpdate();
        	}
}
